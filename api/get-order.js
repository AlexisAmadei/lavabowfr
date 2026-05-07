import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sessionId = req.query?.session_id;
  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  const supabase = getSupabaseAdmin();

  const { data: order, error } = await supabase
    .from('orders')
    .select('id, status, delivery_method, subtotal_cents, shipping_cost_cents, total_cents, created_at, paid_at')
    .eq('stripe_session_id', sessionId)
    .maybeSingle();

  if (error) {
    console.error('get-order: lookup failed', error);
    return res.status(500).json({ error: 'Failed to load order' });
  }
  if (!order) return res.status(404).json({ error: 'Order not found' });

  return res.status(200).json({ order });
}
