// auth.users isn't reachable through PostgREST joins, so preparer emails are
// resolved through the admin auth API. There are only a handful of admins.
export async function resolvePreparerEmails(supabase, userIds) {
  const ids = [...new Set(userIds.filter(Boolean))];
  const emails = new Map();
  await Promise.all(ids.map(async (id) => {
    const { data, error } = await supabase.auth.admin.getUserById(id);
    if (error) console.error('resolvePreparerEmails: lookup failed', { id, error });
    emails.set(id, data?.user?.email ?? null);
  }));
  return emails;
}
