-- Shop v2 schema groundwork.
-- Additive only: adds price_cents + stock to merch_items, plus the orders and
-- order_items tables that back the self-hosted cart + Stripe Checkout flow.
-- Legacy columns (price, stripe_paylink, out_of_stock) are intentionally left in
-- place so the existing admin CRUD keeps working until it is migrated.

create extension if not exists "pgcrypto" with schema "extensions";

-- ===== merch_items: new columns =====
alter table "public"."merch_items"
  add column if not exists "price_cents" bigint not null default 0,
  add column if not exists "stock" integer;

-- Existing rows store whole-euro prices (e.g. 25 → 2500 cents). Idempotent: only
-- backfills rows that still have the column default so re-running is safe.
update "public"."merch_items"
   set "price_cents" = coalesce("price", 0) * 100
 where "price_cents" = 0
   and "price" is not null
   and "price" <> 0;

alter table "public"."merch_items"
  alter column "price_cents" drop default;

comment on column "public"."merch_items"."price_cents" is
  'Authoritative price in euro cents for v2 checkout. The server reads this when building the Stripe session.';
comment on column "public"."merch_items"."stock" is
  'Available stock; NULL means unlimited. Decremented atomically on checkout.session.completed.';

-- ===== orders =====
create table if not exists "public"."orders" (
  "id"                       uuid primary key default "extensions"."gen_random_uuid"(),
  "stripe_session_id"        text unique,
  "stripe_payment_intent_id" text,
  "email"                    text,
  "delivery_method"          text not null,
  "shipping_cost_cents"      integer not null default 0,
  "discount_code"            text,
  "discount_amount_cents"    integer not null default 0,
  "subtotal_cents"           integer not null,
  "total_cents"              integer not null,
  "status"                   text not null default 'pending',
  "shipping_address"         jsonb,
  "created_at"               timestamptz not null default now(),
  "paid_at"                  timestamptz,
  constraint "orders_delivery_method_check"
    check ("delivery_method" in ('in_hand', 'shipping')),
  constraint "orders_status_check"
    check ("status" in ('pending', 'paid', 'failed', 'expired', 'refunded'))
);

alter table "public"."orders" owner to "postgres";

create index if not exists "orders_email_idx"      on "public"."orders" ("email");
create index if not exists "orders_status_idx"     on "public"."orders" ("status");
create index if not exists "orders_created_at_idx" on "public"."orders" ("created_at" desc);

-- ===== order_items =====
create table if not exists "public"."order_items" (
  "id"                   uuid primary key default "extensions"."gen_random_uuid"(),
  "order_id"             uuid not null references "public"."orders"("id") on delete cascade,
  "product_id"           bigint not null references "public"."merch_items"("id") on delete restrict,
  "name_snapshot"        text not null,
  "price_cents_snapshot" integer not null,
  "quantity"             integer not null check ("quantity" > 0)
);

alter table "public"."order_items" owner to "postgres";

create index if not exists "order_items_order_id_idx"   on "public"."order_items" ("order_id");
create index if not exists "order_items_product_id_idx" on "public"."order_items" ("product_id");

-- Snapshots preserve historical orders against later product edits.
comment on column "public"."order_items"."name_snapshot" is
  'Product name at order time.';
comment on column "public"."order_items"."price_cents_snapshot" is
  'Unit price in euro cents at order time. Multiply by quantity for the line subtotal.';

-- ===== RLS =====
-- Orders carry PII (email, shipping address). Public roles get nothing; only the
-- service-role key (used by api/* serverless functions) can read or write.
alter table "public"."orders"      enable row level security;
alter table "public"."order_items" enable row level security;

-- ===== grants =====
grant all on table "public"."orders"      to "service_role";
grant all on table "public"."order_items" to "service_role";
