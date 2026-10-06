-- Restore replace_merch_item_sizes.
--
-- The auto-generated migration 20260830152338_remote_schema.sql (produced by a
-- `supabase db diff`/`db pull` run while 20260830150000 existed locally but the
-- differ was reconciling against a state without it) began with:
--
--   drop function if exists "public"."replace_merch_item_sizes"(bigint, jsonb);
--
-- It was pushed, so the function is gone from the remote even though
-- 20260830150000 is still recorded as applied. Rolling forward rather than
-- marking that migration reverted: the definition below is identical to it, and
-- `create or replace` makes re-applying harmless if the function is present.
--
-- See docs/adr/0002-atomic-size-run-replacement.md for why this function exists
-- and why execute is granted to `authenticated` rather than `service_role`.

create or replace function "public"."replace_merch_item_sizes"(
  p_item_id bigint,
  p_sizes   jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_constraint text;
begin
  -- SECURITY DEFINER bypasses RLS, so restate what merch_item_sizes_authenticated_*
  -- would have enforced. This is exactly as strict as the current policies, which
  -- are `to authenticated using (true)`: no weaker, no stronger.
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = 'P0001';
  end if;

  delete from public.merch_item_sizes
   where merch_item_id = p_item_id;

  -- An empty/absent array means "this article has no sizes", which is the whole
  -- operation: the delete above already did it.
  if p_sizes is null or jsonb_array_length(p_sizes) = 0 then
    return;
  end if;

  insert into public.merch_item_sizes (merch_item_id, size, stock)
  select p_item_id, r.size, r.stock
    from jsonb_to_recordset(p_sizes) as r(size text, stock integer);

exception
  when check_violation then
    -- Distinguish the two CHECKs so the admin UI can say which one tripped.
    -- Surfaces to supabase-js as { code: 'P0001', message: '<slug>' }.
    get stacked diagnostics v_constraint = constraint_name;
    if v_constraint = 'merch_item_sizes_size_check' then
      raise exception 'invalid_size' using errcode = 'P0001';
    elsif v_constraint = 'merch_item_sizes_stock_nonneg' then
      raise exception 'invalid_stock' using errcode = 'P0001';
    else
      raise;
    end if;
end;
$$;

revoke all on function "public"."replace_merch_item_sizes"(bigint, jsonb)
  from public, anon, authenticated;
grant execute on function "public"."replace_merch_item_sizes"(bigint, jsonb)
  to "authenticated";

comment on function "public"."replace_merch_item_sizes"(bigint, jsonb) is
  'Atomically replaces every merch_item_sizes row for an article. p_sizes is a JSON array of {size, stock}; an empty array or NULL clears the size run, turning the article back into a size-less product. Raises ''invalid_size'' / ''invalid_stock'' (P0001) on CHECK violation, with the delete rolled back. Requires an authenticated session; authenticated-only (service_role has no auth.uid() and would fail the guard).';
