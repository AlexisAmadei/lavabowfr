import { getSupabaseAdmin } from './supabaseAdmin.js';

// Any authenticated Supabase user is treated as an admin: public sign-ups are
// disabled in production, so accounts only exist for backoffice users.
// Returns the user, or sends a 401 and returns null.
export async function requireAdmin(req, res) {
  const header = req.headers?.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !data?.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  return data.user;
}
