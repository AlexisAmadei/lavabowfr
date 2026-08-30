# Pending migrations

Migrations parked here are **not** applied by `npx supabase db push`. The CLI
only reads `supabase/migrations/`. They live here because they must land at a
specific point in a deploy sequence, and `db push` applies everything pending
in one go.

Move the file into `supabase/migrations/` when its stated ordering condition is
met, then push.

## `20260830150100_shop_sizes_add_xxxl.sql`

Apply **after** the app deploy that adds `shared/commerce.js` and switches
`upsertMerchItemSizes` to the `replace_merch_item_sizes` RPC.

Full sequence:

1. `supabase/migrations/20260830150000_replace_merch_item_sizes.sql` → `db push`
2. App deploy (shared module + RPC call + failure surfacing)
3. Move this file into `supabase/migrations/` → `db push`

Applying step 3 before step 2 opens a window where the database accepts `XXXL`
but the deployed `create-checkout-session.js` still rejects it, so a shopper who
picks XXXL fails at payment.
