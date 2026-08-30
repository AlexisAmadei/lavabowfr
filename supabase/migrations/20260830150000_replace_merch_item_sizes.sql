-- Atomic replacement of an article's size run.
--
-- Replaces the two-round-trip delete-then-insert in
-- app/_utils/supabase/shop.ts (upsertMerchItemSizes), which was not a
-- transaction despite its comment saying so. If the INSERT was rejected
-- (most easily by the size CHECK, but equally by a dropped connection), the
-- DELETE had already committed and the article silently lost every size row.
-- A wiped article reads as size-less with unlimited stock (switching an
-- article to per-size stock sets merch_items.stock to NULL), so it kept
-- selling with no size selector and no stock ceiling.
--
-- Running both statements inside one function body makes them one
-- transaction: a rejected INSERT rolls the DELETE back with it.
--
-- Execute is granted to `authenticated`, not `service_role` as with
-- decrement_stock. The admin dashboard writes from the browser with the anon
-- key + a Supabase session, so it acts as `authenticated`; see the policy
-- comment in 20260509120000_shop_sizes.sql. SECURITY DEFINER is required to
-- write past RLS, so the body re-asserts the check the table policies make.
-- service_role is deliberately NOT granted: it has no auth.uid() and would
-- always fail the guard below.

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
