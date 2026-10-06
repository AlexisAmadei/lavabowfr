import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';
import { requireAdmin } from './_lib/requireAdmin.js';
import { resolvePreparerEmails } from './_lib/preparers.js';

// Marks an order as prepared (goods packed) or not. Only paid orders can change
// preparation state; refunded orders keep whatever state they had.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireAdmin(req, res);
  if (!user) return;

  const { orderId, prepared } = req.body ?? {};
  if (!orderId || typeof orderId !== 'string' || typeof prepared !== 'boolean') {
    return res.status(400).json({ error: 'Expected { orderId: string, prepared: boolean }' });
  }

  const supabase = getSupabaseAdmin();

  const { data: order, error: lookupError } = await supabase
    .from('orders')
    .select('id, status, prepared_at, prepared_by')
    .eq('id', orderId)
    .maybeSingle();

  if (lookupError) {
    console.error('set-order-prepared: lookup failed', lookupError);
    return res.status(500).json({ error: 'Failed to load order' });
  }
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.status !== 'paid') {
    return res.status(409).json({ error: 'Only paid orders can be marked as prepared' });
  }

  // Already in the requested state (e.g. a double click): keep the original
  // preparer and timestamp instead of overwriting them.
  if ((order.prepared_at !== null) === prepared) {
    const emails = await resolvePreparerEmails(supabase, [order.prepared_by]);
    return res.status(200).json({
      order: {
        id: order.id,
        prepared_at: order.prepared_at,
        prepared_by: order.prepared_by,
        prepared_by_email: emails.get(order.prepared_by) ?? null,
      },
    });
  }

  const { data: updated, error: updateError } = await supabase
    .from('orders')
    .update(prepared
      ? { prepared_at: new Date().toISOString(), prepared_by: user.id }
      : { prepared_at: null, prepared_by: null })
    .eq('id', orderId)
    .eq('status', 'paid') // guards against a refund landing between lookup and update
    .select('id, prepared_at, prepared_by')
    .maybeSingle();

  if (updateError) {
    console.error('set-order-prepared: update failed', updateError);
    return res.status(500).json({ error: 'Failed to update order' });
  }
  if (!updated) {
    return res.status(409).json({ error: 'Only paid orders can be marked as prepared' });
  }

  return res.status(200).json({
    order: { ...updated, prepared_by_email: prepared ? user.email ?? null : null },
  });
}
