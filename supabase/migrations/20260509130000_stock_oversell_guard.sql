-- Closes the TOCTOU oversell window. Pre-checkout validation in
-- api/create-checkout-session.js can't lock stock for the duration of the
-- Stripe payment, so two buyers can clear a sized item that has 1 left.
-- Defenses added here:
--   1. CHECK (stock >= 0) on merch_items + merch_item_sizes so any decrement
--      that would oversell rolls back atomically (READ COMMITTED + row locks
--      already serialize concurrent UPDATEs on the same row).
--   2. decrement_stock catches the resulting check_violation and re-raises
--      with errcode P0001 + message 'oversold' so the webhook can branch.
--   3. orders.status gains 'oversold' as a terminal state for paid orders we
--      auto-refund.

alter table "public"."merch_items"
  drop constraint if exists "merch_items_stock_nonneg";
alter table "public"."merch_items"
  add constraint "merch_items_stock_nonneg"
  check ("stock" is null or "stock" >= 0);

alter table "public"."merch_item_sizes"
  drop constraint if exists "merch_item_sizes_stock_nonneg";
alter table "public"."merch_item_sizes"
  add constraint "merch_item_sizes_stock_nonneg"
  check ("stock" is null or "stock" >= 0);

alter table "public"."orders" drop constraint if exists "orders_status_check";
alter table "public"."orders" add constraint "orders_status_check"
  check ("status" in ('pending', 'paid', 'failed', 'expired', 'refunded', 'oversold'));

create or replace function "public"."decrement_stock"(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.merch_items as m
     set stock = m.stock - oi.quantity
    from public.order_items as oi
   where oi.order_id     = p_order_id
     and oi.size_snapshot is null
     and oi.product_id   = m.id
     and m.stock         is not null;

  update public.merch_item_sizes as s
     set stock = s.stock - oi.quantity
    from public.order_items as oi
   where oi.order_id      = p_order_id
     and oi.size_snapshot is not null
     and oi.product_id    = s.merch_item_id
     and oi.size_snapshot = s.size
     and s.stock          is not null;

exception
  when check_violation then
    -- Surfaces to PostgREST/supabase-js as { code: 'P0001', message: 'oversold' }.
    raise exception 'oversold' using errcode = 'P0001';
end;
$$;

revoke all on function "public"."decrement_stock"(uuid) from public, anon, authenticated;
grant execute on function "public"."decrement_stock"(uuid) to "service_role";

comment on function "public"."decrement_stock"(uuid) is
  'Atomically decrements stock for every order_items row of the given order. Size-less rows hit merch_items.stock; sized rows hit merch_item_sizes.stock. NULL stocks are unlimited. Raises ''oversold'' (P0001) if any decrement would violate the stock >= 0 check; the webhook treats that as a refund-and-mark-oversold signal. Service-role only.';
