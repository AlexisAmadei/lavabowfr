import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';
import { requireAdmin } from './_lib/requireAdmin.js';
import { resolvePreparerEmails } from './_lib/preparers.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    if (!(await requireAdmin(req, res))) return;

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
      prepared_at,
      prepared_by,
      items:order_items(id, product_id, name_snapshot, size_snapshot, price_cents_snapshot, quantity)
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('list-orders: lookup failed', error);
        return res.status(500).json({ error: 'Failed to load orders' });
    }

    const preparerEmails = await resolvePreparerEmails(supabase, (orders ?? []).map((o) => o.prepared_by));

    const withPreparers = (orders ?? []).map((o) => ({
        ...o,
        prepared_by_email: o.prepared_by ? preparerEmails.get(o.prepared_by) ?? null : null,
    }));

    return res.status(200).json({ orders: withPreparers });
}
