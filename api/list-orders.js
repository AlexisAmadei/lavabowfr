import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const supabase = getSupabaseAdmin();

    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
      id,
      stripe_session_id,
      stripe_payment_intent_id,
      email,
      delivery_method,
      shipping_cost_cents,
      discount_code,
      discount_amount_cents,
      subtotal_cents,
      total_cents,
      status,
      shipping_address,
      created_at,
      paid_at,
      items:order_items(id, product_id, name_snapshot, price_cents_snapshot, quantity)
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('list-orders: lookup failed', error);
        return res.status(500).json({ error: 'Failed to load orders' });
    }

    return res.status(200).json({ orders: orders ?? [] });
}
