# Domain language

Terms used consistently in code, comments and review. If a name here appears in
a module, it means what this file says it means.

## Commerce

**Article**: a purchasable item in the shop. Table `merch_items`, type
`MerchItem`. Called "merch item" in the database and "article" in the French
admin UI; both refer to this.

**Commerce Vocabulary**: the closed sets that form the contract between the
browser, the checkout API and the database: clothing sizes, delivery methods,
and the flat shipping charge. Lives in `shared/commerce.js`, which is the single
source for all three; `app/` reaches it via `@/shared/*`, `api/` by relative
path. Widening a set in it is a migration, not just an edit. See ADR 0001.

**Size Run**: the complete set of sizes an Article is stocked in, with a stock
figure per size. Rows in `merch_item_sizes`. An Article either has a Size Run
(per-size stock, and `merch_items.stock` is NULL) or is **Size-less** (one
article-wide `stock`). Never both: the two are mutually exclusive, and the admin
picks between them explicitly. Replacing a Size Run is atomic; see ADR 0002.

**Size-less Article**: an Article with no Size Run, selling against a single
article-wide stock figure. The shop shows no size selector for it.

**Cart Line**: one row in the cart: an Article, an optional size, and a
quantity. Identity is the pair `(productId, size)`, so the same Article in two
sizes is two Cart Lines. Type `CartItem` in `app/_utils/cart.ts`.

**Unlimited stock**: a `NULL` stock value, on either an Article or a Size Run
row. Distinct from `0`, which means out of stock. Decrements skip NULL.

## Orders

**Oversold**: a terminal order state for an order that was paid but could not
be fulfilled because stock ran out between checkout and the webhook. The webhook
auto-refunds and marks it. Note: the database and `api/stripe-webhook.js` know
this state, but the admin and customer-facing UIs do not yet model it.
