-- Widen the clothing size run to include XXXL.
--
-- XXXL was added to the client's SIZE_VALUES on 2026-05-12 (commit 71817da,
-- a one-line change) without a matching migration or API change, so the DB
-- CHECK had been rejecting it ever since. This closes that gap from the
-- database side; shared/commerce.js is now the single source both the app and
-- api/ read, so the three no longer drift independently.
--
-- ORDERING: apply this AFTER the app deploy that introduces
-- shared/commerce.js and switches saves to replace_merch_item_sizes.
-- Applying it earlier means the database accepts XXXL while the old
-- create-checkout-session.js still rejects it, which turns an admin
-- configuration mistake into a customer-facing checkout failure.

alter table "public"."merch_item_sizes"
  drop constraint if exists "merch_item_sizes_size_check";
alter table "public"."merch_item_sizes"
  add constraint "merch_item_sizes_size_check"
  check ("size" in ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'));

comment on column "public"."order_items"."size_snapshot" is
  'Selected size at order time (XS|S|M|L|XL|XXL|XXXL) for clothing articles. NULL for size-less items.';
