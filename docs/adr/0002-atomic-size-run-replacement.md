# ADR 0002: Atomic Size Run replacement via an authenticated RPC

- **Status:** Accepted
- **Date:** 2026-08-30

## Context

`upsertMerchItemSizes` in `app/_utils/supabase/shop.ts` replaced an Article's
Size Run with two separate PostgREST round-trips: a `DELETE` of every row for
the Article, then an `INSERT` of the new set. Its own comment described this as
"one transaction-ish batch". It was not a transaction.

When the `INSERT` was rejected, the `DELETE` had already committed. The Article
was left with zero Size Run rows. Because switching an Article to per-size stock
sets `merch_items.stock` to NULL, a wiped Article reads as Size-less with
unlimited stock: `isItemOutOfStock` returns false, no size selector renders, and
it keeps selling with no ceiling. The failure was invisible, because the
function returned `false` to a call site that ignored it and closed the dialog.

The `XXXL` drift in ADR 0001 was the easiest way to trigger this, but not the
only one. Any rejected insert does it, including a dropped connection between
the two calls.

## Decision

Size Run replacement moves into a Postgres function,
`replace_merch_item_sizes(p_item_id bigint, p_sizes jsonb)`, so the delete and
the insert are one transaction. A rejected insert rolls the delete back with it.

It follows the conventions established by `decrement_stock`: `plpgsql`,
`SECURITY DEFINER`, `set search_path = public`, domain errors raised as `P0001`
with a slug in the message, and a `comment on function` describing the
guarantees.

**It diverges from `decrement_stock` on one point: execute is granted to
`authenticated`, not `service_role`.** The admin dashboard writes from the
browser with the anon key plus a Supabase session, so it acts as
`authenticated`. `service_role` is deliberately not granted, because it has no
`auth.uid()` and would always fail the guard in the function body.

Since `SECURITY DEFINER` bypasses RLS, the body re-asserts what the table
policies assert: `auth.uid() is null` raises `not_authenticated`. This is
exactly as strict as the existing `merch_item_sizes_authenticated_*` policies,
which are `to authenticated using (true)`.

The caller returns `{ ok: true } | { ok: false, reason }` instead of a bare
boolean, and `ShopDialog` surfaces the failure: on edit it keeps the dialog open
so the admin can correct and retry (editing is idempotent), and on create it
closes but says the Article was created without its sizes, because retrying in
place would insert a duplicate.

## Alternatives considered

**Grant to `service_role` and call from a new `api/` route,** matching
`decrement_stock` exactly. This is the more hardened posture and is the reason a
future reviewer will question the decision above. Rejected because there is no
server-side admin authentication in this codebase: admin routes are gated only
by a post-hydration client-side redirect in `app/(admin)/admin/layout.tsx`. The
new endpoint would have to verify a JWT itself, which means building an
authorisation model. That is real work with its own blast radius, and it should
not gate a data-loss fix.

**Check an admin role inside the function** rather than just authentication.
Same objection: there is no roles table and no role model to check against.
"Any authenticated user can write shop data" is a genuine weakness, but it is
pre-existing, and the RPC neither worsens nor improves it.

**Validate sizes client-side before deleting.** Cheapest, and it would have
prevented the `XXXL` case specifically. Rejected because it leaves the hole
open: a dropped connection between the two calls still wipes the Size Run.

**`INSERT ... ON CONFLICT DO UPDATE`** instead of delete-then-insert inside the
function. The `unique (merch_item_id, size)` constraint makes it possible, and
it would preserve row ids across edits. Rejected as complexity that buys
nothing: nothing references those ids, since `order_items` snapshots the size as
text with no foreign key.

## Consequences

- A failed size save now leaves the previous Size Run intact. The UI says so.
- The atomicity fix must ship **before** the CHECK constraint is widened to
  accept `XXXL`, because atomicity is what makes the intermediate window safe.
  The full sequence is: RPC migration, then the app deploy carrying
  `shared/commerce.js` and the RPC call, then the CHECK migration. Applying the
  CHECK migration early opens a window where the database accepts `XXXL` while
  the deployed checkout API still rejects it, moving the failure onto a paying
  customer. The CHECK migration is parked in `supabase/migrations-pending/`
  precisely because `supabase db push` would otherwise apply it too early.
- Existing wiped Articles are not repaired by this change. They are findable
  (not deleted, zero Size Run rows, NULL stock) but not distinguishable with
  certainty from genuinely Size-less Articles with unlimited stock.
- The `{ ok, reason }` return is local to this function. It is not the
  repository-wide `Result` type that the broader `_utils/supabase` cleanup would
  introduce, and it does not commit the codebase to one.
