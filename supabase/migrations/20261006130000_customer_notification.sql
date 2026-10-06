-- Customer notification tracking for prepared orders.
-- Set when an admin successfully triggers the "prepared" email (sent by n8n).
-- Deliberately NOT cleared when the order is unprepared: the email really was sent.

alter table "public"."orders"
  add column if not exists "customer_notified_at" timestamptz,
  add column if not exists "customer_notified_by" uuid references "auth"."users"("id") on delete set null;

comment on column "public"."orders"."customer_notified_at" is
  'Last time a customer notification was successfully sent. NULL = never notified.';
comment on column "public"."orders"."customer_notified_by" is
  'Admin (auth.users) who triggered the last customer notification.';
