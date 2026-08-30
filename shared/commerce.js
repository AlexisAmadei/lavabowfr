// Commerce vocabulary shared by the Next.js app (app/) and the Vercel
// serverless functions (api/).
//
// Why this file exists: these three values are the contract between the
// browser, the checkout API and the database. Each used to be declared
// independently on both sides, and they drifted. `XXXL` was added to the
// client's size list in isolation, which the DB CHECK then rejected on write.
// A single runtime import makes that class of drift structurally impossible.
//
// Constraints this file must respect:
//   * No imports. It is resolved by two different bundlers with different
//     rules (Next.js for app/, @vercel/node for api/); anything it pulls in
//     has to resolve under both.
//   * api/ reaches it by relative path with an explicit extension
//     (`../shared/commerce.js`); tsconfig `paths` do not apply there.
//   * app/ reaches it via the `@/shared/*` alias.
//   * SIZE_VALUES must stay in sync with the CHECK constraint on
//     merch_item_sizes.size. Widening it requires a migration.

/** @typedef {'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'} SizeValue */

/**
 * Clothing sizes, in catalogue order. Order is meaningful: the shop and the
 * admin size editor both render and sort by index in this array.
 * @type {readonly SizeValue[]}
 */
export const SIZE_VALUES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

/** @typedef {'in_hand' | 'shipping'} DeliveryMethod */

/**
 * How an order reaches the buyer. `in_hand` is handover at a gig (no shipping
 * charge); `shipping` adds SHIPPING_COST_CENTS once per order.
 * @type {readonly DeliveryMethod[]}
 */
export const DELIVERY_METHODS = ['in_hand', 'shipping'];

/**
 * Flat shipping charge, applied once per order when deliveryMethod is
 * 'shipping'. The cart displays it; the checkout API is authoritative.
 * @type {number}
 */
export const SHIPPING_COST_CENTS = 499;
