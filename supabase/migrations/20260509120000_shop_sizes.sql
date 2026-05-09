-- Per-article clothing sizes with per-size stock.
-- Articles without rows in merch_item_sizes behave as before (size-less; falls back
-- to merch_items.stock). Articles with rows show a required dropdown on the shop;
-- stock is decremented from the chosen size on checkout.session.completed.

create table if not exists "public"."merch_item_sizes" (
  "id"            bigint generated always as identity primary key,
  "merch_item_id" bigint not null references "public"."merch_items"("id") on delete cascade,
  "size"          text   not null,
  "stock"         integer,
  constraint "merch_item_sizes_size_check"
    check ("size" in ('XS', 'S', 'M', 'L', 'XL', 'XXL')),
  constraint "merch_item_sizes_unique"
    unique ("merch_item_id", "size")
);

alter table "public"."merch_item_sizes" owner to "postgres";

create index if not exists "merch_item_sizes_item_idx"
  on "public"."merch_item_sizes" ("merch_item_id");

comment on table "public"."merch_item_sizes" is
  'Per-size stock for clothing articles. NULL stock means unlimited for that size. Absent rows = article has no sizes (falls back to merch_items.stock).';

-- Public reads OK (the shop displays availability per size); writes restricted to service-role.
alter table "public"."merch_item_sizes" enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
     where schemaname = 'public'
       and tablename  = 'merch_item_sizes'
       and policyname = 'merch_item_sizes_public_read'
  ) then
    create policy "merch_item_sizes_public_read"
      on "public"."merch_item_sizes"
      for select
      using (true);
  end if;
  -- The admin dashboard authenticates with the anon key + Supabase auth, so the
  -- writes go through as the `authenticated` role. Mirror the policy shape used
  -- by merch_items / merch_categories so admin CRUD on sizes works the same way.
  if not exists (
    select 1 from pg_policies
     where schemaname = 'public'
       and tablename  = 'merch_item_sizes'
       and policyname = 'merch_item_sizes_authenticated_insert'
  ) then
    create policy "merch_item_sizes_authenticated_insert"
      on "public"."merch_item_sizes"
      for insert
      to authenticated
      with check (true);
  end if;
  if not exists (
    select 1 from pg_policies
     where schemaname = 'public'
       and tablename  = 'merch_item_sizes'
       and policyname = 'merch_item_sizes_authenticated_update'
  ) then
    create policy "merch_item_sizes_authenticated_update"
      on "public"."merch_item_sizes"
      for update
      to authenticated
      using (true);
  end if;
  if not exists (
    select 1 from pg_policies
     where schemaname = 'public'
       and tablename  = 'merch_item_sizes'
       and policyname = 'merch_item_sizes_authenticated_delete'
  ) then
    create policy "merch_item_sizes_authenticated_delete"
      on "public"."merch_item_sizes"
      for delete
      to authenticated
      using (true);
  end if;
end$$;

grant select                          on table "public"."merch_item_sizes" to "anon";
grant select, insert, update, delete  on table "public"."merch_item_sizes" to "authenticated";
grant all                             on table "public"."merch_item_sizes" to "service_role";

-- ===== order_items: size snapshot =====
alter table "public"."order_items"
  add column if not exists "size_snapshot" text;

comment on column "public"."order_items"."size_snapshot" is
  'Selected size at order time (XS|S|M|L|XL|XXL) for clothing articles. NULL for size-less items.';
