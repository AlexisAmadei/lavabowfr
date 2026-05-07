-- Atomic stock decrement for paid orders.
-- Called from the checkout.session.completed webhook handler. Runs as a single
-- UPDATE so all line items in an order succeed or fail together. Rows where
-- merch_items.stock IS NULL are treated as unlimited and skipped.

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
   where oi.order_id  = p_order_id
     and oi.product_id = m.id
     and m.stock is not null;
end;
$$;

revoke all on function "public"."decrement_stock"(uuid) from public, anon, authenticated;
grant execute on function "public"."decrement_stock"(uuid) to "service_role";

comment on function "public"."decrement_stock"(uuid) is
  'Atomically decrements merch_items.stock for every order_items row of the given order. NULL stocks are unlimited and skipped. Service-role only.';
