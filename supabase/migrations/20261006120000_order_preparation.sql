-- Order preparation tracking for the admin Sales tab.
-- Preparation is tracked separately from the payment status: "prepared" means the
-- goods are physically packed, which is orthogonal to whether the order is paid,
-- refunded, etc. Both columns are NULL while the order is not prepared.

alter table "public"."orders"
  add column if not exists "prepared_at" timestamptz,
  add column if not exists "prepared_by" uuid references "auth"."users"("id") on delete set null;

comment on column "public"."orders"."prepared_at" is
  'When an admin marked the order as prepared (goods packed). NULL = not prepared.';
comment on column "public"."orders"."prepared_by" is
  'Admin (auth.users) who marked the order as prepared. NULL when not prepared or the admin was deleted.';
