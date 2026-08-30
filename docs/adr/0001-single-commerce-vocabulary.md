# ADR 0001: A single Commerce Vocabulary shared by app and api

- **Status:** Accepted
- **Date:** 2026-08-30

## Context

Three closed sets form the contract between the browser, the checkout API and
the database: clothing sizes, delivery methods, and the flat shipping charge.
Each was declared independently on both sides of the app/api boundary, and the
database enforced its own copy in a CHECK constraint.

They drifted. On 2026-05-12, commit `71817da` ("fix: add XXXL as shop sizes")
added `XXXL` to the client's `SIZE_VALUES`. It was a one-line change to one
file, with no migration and no change to `api/create-checkout-session.js`. The
CHECK constraint on `merch_item_sizes.size` rejected the value from that day
onward, and because the write path was not atomic (see ADR 0002), the rejection
destroyed data rather than surfacing.

`SHIPPING_COST_CENTS = 499` was likewise declared in both `app/_utils/cart.ts`
and `api/create-checkout-session.js`, agreeing only by coincidence. The
`'in_hand' | 'shipping'` union existed in three places.

Nothing in the repository could have caught this statically. `api/` is excluded
from ESLint (`eslint.config.js`, `globalIgnores`), excluded from the TypeScript
program (`allowJs: false` made its presence in `include` inert), and
`next.config.ts` sets `typescript.ignoreBuildErrors: true`, so the production
build type-checks nothing.

## Decision

One module, `shared/commerce.js`, is the single source for `SIZE_VALUES`,
`DELIVERY_METHODS` and `SHIPPING_COST_CENTS`. It is plain JavaScript with JSDoc
types and no imports of its own.

- `app/` imports it via a new `@/shared/*` path alias.
- `api/` imports it by relative path with an explicit extension
  (`../shared/commerce.js`), because Vercel bundles those functions without
  reading `tsconfig.json`, so path aliases do not reach them.
- `tsconfig.json` gains `allowJs: true` and `checkJs: true`, and `"api"` is
  dropped from `include` (it was inert, and with `allowJs` on it would pull
  every unchecked serverless function into the program).

The database CHECK constraint stays. Widening a set therefore requires a
migration alongside the module edit.

## Alternatives considered

**A TypeScript module (`shared/commerce.ts`).** The better end state, and it
gives real types on both sides. Rejected for now because `api/` files would have
to be renamed to `.ts` to import it cleanly, and that means changing the build
path of a live Stripe endpoint as a side effect of a data-loss fix. Worth
revisiting on its own.

**A `.js` module plus a hand-written `.d.ts`.** Requires no config change at
all, but reintroduces exactly the shape being removed: two files that can
disagree, with nothing checking.

**Dropping the CHECK constraint** so the module is the only authority. Rejected:
the CHECK is the only mechanism that actually noticed this drift, and given
there is no type-checking over `api/`, removing it would leave nothing at all.
The cost, needing a migration to add a size, is the point. It forces all three
homes into one reviewed change.

## Consequences

- Value drift across the app/api boundary becomes structurally impossible for
  these three sets, because there is one runtime import rather than one
  convention. This is stronger than a static check, and it holds even though
  nothing type-checks `api/`.
- The module must stay dependency-free. Two different bundlers with different
  resolution rules resolve it, so anything it imports must resolve under both.
- Adding a size is now a two-artifact change (module plus migration) that must
  ship in a specific order. See ADR 0002 for the ordering constraint.
- `OrderStatus` is deliberately not in the module yet. Adding `oversold` means
  touching admin status colours, the sales filter, and customer-facing copy in
  `OrderSuccess`, which is separate work with a different blast radius.
- A test asserting the module against the SQL CHECK would close the loop. It was
  deferred: it requires parsing SQL, and the repository has no test runner.
