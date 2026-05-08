import { getStripe } from './_lib/stripe.js';
import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';

const SHIPPING_COST_CENTS = 499;
const ALLOWED_DELIVERY = new Set(['in_hand', 'shipping']);

function getOrigin(req) {
  const headerOrigin = req.headers.origin;
  if (headerOrigin) return headerOrigin;
  const fwdHost = req.headers['x-forwarded-host'] || req.headers.host;
  const fwdProto = req.headers['x-forwarded-proto'] || 'https';
  if (fwdHost) return `${fwdProto}://${fwdHost}`;
  return process.env.PUBLIC_SITE_URL || 'http://localhost:5173';
}

function badRequest(res, message, extra) {
  return res.status(400).json({ error: message, ...(extra || {}) });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return badRequest(res, 'Invalid JSON body'); }
  }
  if (!body || typeof body !== 'object') return badRequest(res, 'Missing body');

  const { items, deliveryMethod } = body;
  if (!Array.isArray(items) || items.length === 0) return badRequest(res, 'Cart is empty');
  if (!ALLOWED_DELIVERY.has(deliveryMethod)) return badRequest(res, 'Invalid deliveryMethod');

  // Normalize line input: product ids are bigint in DB; clients send strings via the cart store.
  const lines = [];
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') return badRequest(res, 'Invalid cart item');
    const productId = Number(raw.productId);
    const quantity = Number(raw.quantity);
    if (!Number.isInteger(productId) || productId <= 0) return badRequest(res, 'Invalid productId');
    if (!Number.isInteger(quantity) || quantity <= 0) return badRequest(res, 'Invalid quantity');
    lines.push({ productId, quantity });
  }
  // Collapse duplicate product ids (cart should already be unique, but be defensive).
  const collapsed = new Map();
  for (const l of lines) collapsed.set(l.productId, (collapsed.get(l.productId) || 0) + l.quantity);
  const collapsedLines = Array.from(collapsed, ([productId, quantity]) => ({ productId, quantity }));

  const supabase = getSupabaseAdmin();

  const { data: products, error: fetchError } = await supabase
    .from('merch_items')
    .select('id, name, price_cents, stock, status, out_of_stock')
    .in('id', collapsedLines.map((l) => l.productId));

  if (fetchError) {
    console.error('create-checkout-session: product lookup failed', fetchError);
    return res.status(500).json({ error: 'Failed to load products' });
  }

  const byId = new Map(products.map((p) => [Number(p.id), p]));

  // Validate each line against authoritative DB state. Surface the offending product id so the
  // client can show "this item is no longer available" inline.
  for (const line of collapsedLines) {
    const product = byId.get(line.productId);
    if (!product) return badRequest(res, 'Product not found', { productId: line.productId, reason: 'missing' });
    if (product.status !== 'ACTIVE') return badRequest(res, 'Product is not available', { productId: line.productId, reason: 'inactive' });
    if (product.out_of_stock) return badRequest(res, 'Product is out of stock', { productId: line.productId, reason: 'out_of_stock' });
    if (typeof product.stock === 'number' && product.stock < line.quantity) {
      return badRequest(res, 'Insufficient stock', { productId: line.productId, reason: 'insufficient_stock', available: product.stock });
    }
    if (!Number.isFinite(Number(product.price_cents)) || Number(product.price_cents) <= 0) {
      return badRequest(res, 'Product price is invalid', { productId: line.productId, reason: 'invalid_price' });
    }
  }

  // Recompute totals server-side. Client-sent prices and discountCode are ignored per PRD §5.2.
  let subtotalCents = 0;
  const orderItemsRows = [];
  const stripeLineItems = [];
  for (const line of collapsedLines) {
    const product = byId.get(line.productId);
    const unitCents = Number(product.price_cents);
    subtotalCents += unitCents * line.quantity;
    orderItemsRows.push({
      product_id: product.id,
      name_snapshot: product.name,
      price_cents_snapshot: unitCents,
      quantity: line.quantity,
    });
    stripeLineItems.push({
      quantity: line.quantity,
      price_data: {
        currency: 'eur',
        product_data: { name: product.name },
        unit_amount: unitCents,
      },
    });
  }

  const shippingCostCents = deliveryMethod === 'shipping' ? SHIPPING_COST_CENTS : 0;
  const totalCents = subtotalCents + shippingCostCents;

  // Shipping address is collected by Stripe Checkout (shipping_address_collection)
  // and persisted by the webhook from session.shipping_details.address.

  // Insert pending order BEFORE calling Stripe so the UUID can be sent as metadata + idempotency key.
  const { data: orderRow, error: insertOrderError } = await supabase
    .from('orders')
    .insert({
      delivery_method: deliveryMethod,
      shipping_cost_cents: shippingCostCents,
      subtotal_cents: subtotalCents,
      total_cents: totalCents,
      status: 'pending',
    })
    .select('id')
    .single();

  if (insertOrderError || !orderRow) {
    console.error('create-checkout-session: order insert failed', insertOrderError);
    return res.status(500).json({ error: 'Failed to create order' });
  }
  const internalOrderId = orderRow.id;

  const { error: insertItemsError } = await supabase
    .from('order_items')
    .insert(orderItemsRows.map((row) => ({ ...row, order_id: internalOrderId })));

  if (insertItemsError) {
    console.error('create-checkout-session: order_items insert failed', insertItemsError);
    // Best-effort cleanup so a half-built order does not linger.
    await supabase.from('orders').delete().eq('id', internalOrderId);
    return res.status(500).json({ error: 'Failed to create order items' });
  }

  const origin = getOrigin(req);
  const sessionParams = {
    mode: 'payment',
    locale: 'fr',
    line_items: stripeLineItems,
    success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    metadata: { internal_order_id: internalOrderId },
    invoice_creation: { enabled: true },
  };

  if (deliveryMethod === 'shipping') {
    sessionParams.shipping_address_collection = { allowed_countries: ['FR'] };
    sessionParams.shipping_options = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: SHIPPING_COST_CENTS, currency: 'eur' },
          display_name: 'Livraison standard',
        },
      },
    ];
  }

  const stripe = getStripe();
  let session;
  try {
    session = await stripe.checkout.sessions.create(sessionParams, { idempotencyKey: internalOrderId });
  } catch (err) {
    console.error('create-checkout-session: Stripe session creation failed', err);
    await supabase.from('orders').delete().eq('id', internalOrderId);
    return res.status(502).json({ error: 'Payment provider error' });
  }

  const { error: linkSessionError } = await supabase
    .from('orders')
    .update({ stripe_session_id: session.id })
    .eq('id', internalOrderId);

  if (linkSessionError) {
    // Non-fatal: webhook can still reconcile via metadata.internal_order_id.
    console.error('create-checkout-session: failed to persist stripe_session_id', linkSessionError);
  }

  return res.status(200).json({ url: session.url, orderId: internalOrderId });
}
