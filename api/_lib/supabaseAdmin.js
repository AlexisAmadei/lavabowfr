import { createClient } from '@supabase/supabase-js';

let cached = null;

export function getSupabaseAdmin() {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error('Supabase admin client not configured (SUPABASE_URL / SUPABASE_SECRET_KEY)');
  }
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
