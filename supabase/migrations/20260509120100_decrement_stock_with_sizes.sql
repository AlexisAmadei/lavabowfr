-- Stock decrement that handles both size-less and per-size stock.
-- For each order_items row:
--   * size_snapshot IS NULL → decrement merch_items.stock (legacy path, unchanged).
--   * size_snapshot IS NOT NULL → decrement merch_item_sizes.stock for that (item, size).
-- NULL stock columns are treated as unlimited and skipped, same as before.

create or replace function "public"."decrement_stock"(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Size-less items: unchanged behaviour.
  update public.merch_items as m
     set stock = m.stock - oi.quantity
    from public.order_items as oi
   where oi.order_id     = p_order_id
     and oi.size_snapshot is null
     and oi.product_id   = m.id
     and m.stock         is not null;

  -- Sized items: decrement per-size stock.
  update public.merch_item_sizes as s
     set stock = s.stock - oi.quantity
    from public.order_items as oi
   where oi.order_id      = p_order_id
     and oi.size_snapshot is not null
     and oi.product_id    = s.merch_item_id
     and oi.size_snapshot = s.size
     and s.stock          is not null;
end;
$$;

revoke all on function "public"."decrement_stock"(uuid) from public, anon, authenticated;
grant execute on function "public"."decrement_stock"(uuid) to "service_role";

comment on function "public"."decrement_stock"(uuid) is
  'Atomically decrements stock for every order_items row of the given order. Size-less rows hit merch_items.stock; sized rows hit merch_item_sizes.stock. NULL stocks are unlimited. Service-role only.';
