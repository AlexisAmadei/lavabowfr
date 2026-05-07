import { getStripe } from './_lib/stripe.js';
import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';
import { sendOrderConfirmationEmail } from './_lib/email.js';

// Stripe signature verification needs the exact bytes Stripe sent. Disabling
// Vercel's automatic JSON parsing lets us read the raw body off the request
// stream and pass it to stripe.webhooks.constructEvent.
export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('stripe-webhook: STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) return res.status(400).json({ error: 'Missing signature' });

  const stripe = getStripe();
  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (err) {
    console.error('stripe-webhook: failed to read body', err);
    return res.status(400).json({ error: 'Invalid body' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    console.error('stripe-webhook: signature verification failed', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error('stripe-webhook: handler error', { type: event.type, id: event.id, err });
    // Returning 500 lets Stripe retry. For business-logic failures we log + continue
    // inside each handler; only thrown errors land here.
    return res.status(500).json({ error: 'Handler failed' });
  }

  return res.status(200).json({ received: true });
}

async function handleCheckoutCompleted(session) {
  const supabase = getSupabaseAdmin();
  const orderId = session.metadata?.internal_order_id;
  if (!orderId) {
    console.error('stripe-webhook: missing internal_order_id', session.id);
    return;
  }

  const { data: order, error: lookupError } = await supabase
    .from('orders')
    .select('id, status')
    .eq('id', orderId)
    .maybeSingle();
  if (lookupError) throw lookupError;
  if (!order) {
    console.error('stripe-webhook: order not found', orderId);
    return;
  }
  // Idempotency: Stripe retries are normal. If we already promoted this order to
  // paid (or beyond), skip the side effects so stock isn't double-decremented and
  // the email isn't sent twice.
  if (order.status !== 'pending') return;

  const customerEmail = session.customer_details?.email || session.customer_email || null;
  const shippingAddr = session.shipping_details?.address || null;
  const paymentIntentId = typeof session.payment_intent === 'string'
    ? session.payment_intent
    : session.payment_intent?.id || null;

  // The .eq('status', 'pending') guard makes the transition atomic against
  // concurrent webhook deliveries — only one of them will flip the row.
  const { data: updated, error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      stripe_payment_intent_id: paymentIntentId,
      email: customerEmail,
      shipping_address: shippingAddr,
    })
    .eq('id', orderId)
    .eq('status', 'pending')
    .select('id')
    .maybeSingle();
  if (updateError) throw updateError;
  if (!updated) return; // Lost the race; the other delivery owns the side effects.

  const { error: rpcError } = await supabase.rpc('decrement_stock', { p_order_id: orderId });
  if (rpcError) {
    // Order is already paid; surface for monitoring but don't fail the webhook.
    console.error('stripe-webhook: stock decrement failed', { orderId, error: rpcError });
  }

  try {
    await sendOrderConfirmationEmail({ supabase, orderId, toEmail: customerEmail });
  } catch (err) {
    console.error('stripe-webhook: confirmation email failed (non-fatal)', { orderId, err });
  }
}

async function handleCheckoutExpired(session) {
  const supabase = getSupabaseAdmin();
  const orderId = session.metadata?.internal_order_id;
  if (!orderId) return;
  const { error } = await supabase
    .from('orders')
    .update({ status: 'expired' })
    .eq('id', orderId)
    .eq('status', 'pending');
  if (error) throw error;
}

async function handlePaymentFailed(paymentIntent) {
  const supabase = getSupabaseAdmin();
  // payment_intent objects don't carry our internal_order_id metadata, so resolve
  // through the originating Checkout Session.
  const stripe = getStripe();
  let orderId = null;
  try {
    const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntent.id, limit: 1 });
    orderId = sessions.data[0]?.metadata?.internal_order_id || null;
  } catch (err) {
    console.error('stripe-webhook: session lookup for failed PI errored', { piId: paymentIntent.id, err });
  }
  if (!orderId) return;

  const { error } = await supabase
    .from('orders')
    .update({ status: 'failed', stripe_payment_intent_id: paymentIntent.id })
    .eq('id', orderId)
    .eq('status', 'pending');
  if (error) throw error;
}

async function handleChargeRefunded(charge) {
  const supabase = getSupabaseAdmin();
  const piId = typeof charge.payment_intent === 'string'
    ? charge.payment_intent
    : charge.payment_intent?.id || null;
  if (!piId) return;
  const { error } = await supabase
    .from('orders')
    .update({ status: 'refunded' })
    .eq('stripe_payment_intent_id', piId)
    .eq('status', 'paid');
  if (error) throw error;
}
