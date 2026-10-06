import { randomUUID } from 'node:crypto';
import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';
import { requireAdmin } from './_lib/requireAdmin.js';

const N8N_TIMEOUT_MS = 10_000;

// Asks n8n to email the customer that their prepared order is on its way / ready.
// The timestamp is only recorded once n8n confirms the email provider accepted it.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireAdmin(req, res);
  if (!user) return;

  const { orderId, resend } = req.body ?? {};
  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ error: 'Expected { orderId: string, resend?: boolean }' });
  }

  const webhookUrl = process.env.N8N_CUSTOMER_NOTIFICATION_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;
  if (!webhookUrl || !webhookSecret) return res.status(503).json({ error: 'Customer notification is not configured' });

  const supabase = getSupabaseAdmin();

  const { data: order, error: lookupError } = await supabase
    .from('orders')
    .select(`
      id, email, status, delivery_method, shipping_address,
      subtotal_cents, shipping_cost_cents, discount_code, discount_amount_cents, total_cents,
      paid_at, prepared_at, customer_notified_at,
      items:order_items(name_snapshot, size_snapshot, quantity, price_cents_snapshot)
    `)
    .eq('id', orderId)
    .maybeSingle();

  if (lookupError) {
    console.error('notify-customer: lookup failed', lookupError);
    return res.status(500).json({ error: 'Failed to load order' });
  }
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.status !== 'paid') return res.status(409).json({ error: 'Only paid orders can be notified' });
  if (!order.prepared_at) return res.status(409).json({ error: 'Order is not prepared' });
  if (!order.email) return res.status(409).json({ error: 'Order has no customer email' });
  if (order.customer_notified_at && resend !== true) {
    return res.status(409).json({
      error: 'Customer already notified',
      alreadyNotifiedAt: order.customer_notified_at,
    });
  }

  const addr = order.shipping_address;
  const payload = {
    notificationId: randomUUID(),
    isResend: Boolean(order.customer_notified_at),
    order: {
      id: order.id,
      shortId: order.id.slice(0, 8),
      email: order.email,
      deliveryMethod: order.delivery_method,
      paidAt: order.paid_at,
      preparedAt: order.prepared_at,
      items: order.items.map((i) => ({
        name: i.name_snapshot,
        size: i.size_snapshot,
        quantity: i.quantity,
        unitPriceCents: i.price_cents_snapshot,
      })),
      subtotalCents: order.subtotal_cents,
      shippingCostCents: order.shipping_cost_cents,
      discountCode: order.discount_code,
      discountAmountCents: order.discount_amount_cents,
      totalCents: order.total_cents,
      shippingAddress: order.delivery_method === 'shipping' && addr
        ? {
            line1: addr.line1 ?? null,
            line2: addr.line2 ?? null,
            postalCode: addr.postal_code ?? null,
            city: addr.city ?? null,
            country: addr.country ?? null,
          }
        : null,
    },
  };

  try {
    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Lavabow-Secret': webhookSecret,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
    });
    // n8n answers { sent: true } only after the email provider accepted the message.
    const body = n8nRes.ok ? await n8nRes.json().catch(() => null) : null;
    if (body?.sent !== true) {
      console.error('notify-customer: n8n did not confirm sending', n8nRes.status);
      return res.status(502).json({ error: 'Notification workflow failed' });
    }
  } catch (err) {
    console.error('notify-customer: n8n unreachable', err);
    return res.status(502).json({ error: 'Notification workflow unreachable' });
  }

  const { data: updated, error: updateError } = await supabase
    .from('orders')
    .update({ customer_notified_at: new Date().toISOString(), customer_notified_by: user.id })
    .eq('id', orderId)
    .eq('status', 'paid') // guards against a refund landing during the n8n call
    .select('id, customer_notified_at, customer_notified_by')
    .maybeSingle();

  if (updateError || !updated) {
    // The email went out but we couldn't record it: say so rather than pretend it failed.
    console.error('notify-customer: email sent but recording failed', updateError);
    return res.status(500).json({ error: 'Email sent but notification could not be recorded' });
  }

  return res.status(200).json({
    order: { ...updated, customer_notified_by_email: user.email ?? null },
  });
}
