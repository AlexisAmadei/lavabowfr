# Shop v2 — Product Requirements Document

## 1. Overview

Rebuild of the merch shop with a self-hosted cart and Stripe-hosted checkout, running on the existing React Vite + Vercel + Supabase stack. Catalog is small (~10 SKUs), low transaction volume, guest checkout only.

## 2. Goals & Non-Goals

**Goals**
- Multi-item cart with live totals and discount codes
- Two delivery modes: in-hand (free) and shipping (4.99€)
- Stripe-hosted checkout with custom line-item pricing
- Order persistence in Supabase with internal order ID + Stripe invoice
- No customer accounts, no login
- Minimal fixed cost (pay-per-transaction only)

**Non-goals (v2)**
- User accounts, order history pages
- Multi-currency
- Reviews, recommendations, search
- Multi-warehouse inventory

## 3. Stack & Architecture

| Layer | Choice |
|---|---|
| Frontend | React (Vite) |
| Hosting | Vercel |
| Database | Supabase (Postgres) |
| Payments | Stripe Checkout (hosted page) |

Three backend endpoints are needed:

1. `POST /api/create-checkout-session` — builds the Stripe session
2. `POST /api/stripe-webhook` — receives payment confirmations from Stripe
3. `POST /api/validate-discount` *(optional, only if discount codes are managed in Supabase rather than Stripe)*

Vite has no built-in API layer. Two viable options:

- **Vercel Serverless Functions** (an `/api` directory at the project root) — recommended; one deploy for everything, Node 20 runtime, env vars share the same project.
- **Supabase Edge Functions** (Deno) — works, but splits your deploy and adds friction for shared types.

Recommendation: Vercel Serverless Functions.

## 4. Data Model (Supabase)

```sql
products
  id            uuid pk
  name          text
  description   text
  price_cents   int
  currency      text default 'eur'
  image_url     text
  stock         int nullable
  is_active     bool

orders
  id                       uuid pk           -- internal order ID
  stripe_session_id        text unique
  stripe_payment_intent_id text
  email                    text
  delivery_method          text              -- 'in_hand' | 'shipping'
  shipping_cost_cents      int
  discount_code            text nullable
  discount_amount_cents    int
  subtotal_cents           int
  total_cents              int
  status                   text              -- 'pending' | 'paid' | 'failed' | 'expired' | 'refunded'
  shipping_address         jsonb nullable
  created_at               timestamptz
  paid_at                  timestamptz nullable

order_items
  id                   uuid pk
  order_id             uuid fk -> orders.id
  product_id           uuid fk -> products.id
  name_snapshot        text    -- product name at order time
  price_cents_snapshot int     -- price at order time
  quantity             int

discount_codes  -- only if managed locally rather than in Stripe
  code        text pk
  type        text         -- 'percent' | 'fixed'
  value       int
  max_uses    int nullable
  uses        int default 0
  expires_at  timestamptz nullable
  is_active   bool
```

Snapshots on `order_items` matter: if a product price changes later, past orders still reflect what the customer actually paid.

## 5. Functional Requirements

### 5.1 Products

- Render 10 cards from `products` where `is_active = true`
- Each card: image, name, price, "Add to cart" button
- Click adds the item to cart with quantity 1, or increments if already present
- A persistent notice on the shop page: *"Livraison en France uniquement. Pour une livraison hors France, contactez shop@lavabow.fr"*

### 5.2 Cart

Cart state lives in `localStorage` under a single key, shape:

```ts
{
  items: { productId, quantity }[],
  deliveryMethod: 'in_hand' | 'shipping',
  discountCode: string | null,  // deferred to v2.1 — keep in shape for forward compatibility
  createdAt: number  // unix ms
}
```

Required behaviors:

- View full cart: thumbnail, name, unit price, quantity stepper, line subtotal, delete button
- Edit quantity: +/− stepper, min 1, max = product stock if set
- Delete item: trash icon per row
- Clear all: CTA with confirm modal
- Live totals: subtotal, shipping cost, grand total — recomputed on every mutation. Discount line deferred to v2.1.
- *(Deferred to v2.1)* Discount code: optional input + Apply button; field is not mandatory to proceed to checkout; show success/error inline when a code is entered
- Delivery method: radio toggle (in-hand / shipping); shipping cost updates total live
- 30-min expiry: on every cart load, if `Date.now() - createdAt > 30*60*1000`, clear cart and toast "Your cart expired". Reset `createdAt` only on first item add to a fresh cart.
- Proceed to checkout: CTA, disabled when cart is empty

**Important**: prices and totals shown to the user are display-only. The server recomputes everything from the database before creating the Stripe session. Never trust client-sent prices. Discount logic is deferred to v2.1 — the server must still ignore any `discountCode` sent by the client until that feature is built.

### 5.3 Pre-checkout page

- Order summary (read-only): line items, quantities, prices, shipping cost, grand total. Discount line deferred to v2.1.
- Delivery method confirmation: radio (in-hand → 0€, shipping → 4.99€)
- Shipping notice: *"Livraison en France uniquement. Pour une livraison hors France, contactez shop@lavabow.fr"*
- "Pay with Stripe" CTA → POST cart to `/api/create-checkout-session` → redirect browser to returned `session.url`

**Recommendation: do NOT build a personal-info form on this page.** The original requirements include "form for the users to fill in personal informations required by Stripe hosted checkout" — Stripe Checkout already collects email, name, billing address, shipping address, and (optionally) phone on its own page. Duplicating creates a sync problem and pointless friction. Only collect customer info pre-Stripe if there's a specific reason (e.g. saving an abandoned-cart lead before payment), and in that case pre-fill Stripe via `customer_email` only.

### 5.4 Success / cancel pages

- `success_url`: `/order/success?session_id={CHECKOUT_SESSION_ID}` — page reads `session_id`, queries `/api/get-order` (which looks up by `stripe_session_id`), shows internal order ID + receipt link, clears cart from localStorage
- `cancel_url`: `/cart` — cart preserved as-is

## 6. Stripe Integration

### 6.1 What Stripe Checkout needs at session creation

| Param | Purpose |
|---|---|
| `mode: 'payment'` | One-time payment |
| `line_items` | Array of `{ price_data: { currency: 'eur', product_data: { name }, unit_amount: cents }, quantity }`. Custom prices set inline — no need to pre-create products in Stripe. |
| `shipping_options` | `[{ shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: 499, currency: 'eur' }, display_name: 'Standard delivery' } }]` when shipping is selected. For in-hand, either pass a 0-amount option named "Pickup" or omit shipping entirely. |
| `shipping_address_collection` | `{ allowed_countries: ['FR'] }` only for shipping orders. Skip for in-hand. |
| `customer_email` | Optional pre-fill. |
| `discounts` | *(Deferred to v2.1)* `[{ coupon: 'COUPON_ID' }]` — only included if the user applied a valid discount code. Omit the field entirely when no code is entered. |
| `success_url` | `https://yourdomain.com/order/success?session_id={CHECKOUT_SESSION_ID}` |
| `cancel_url` | `https://yourdomain.com/cart` |
| `metadata` | `{ internal_order_id: '<uuid>' }` — your own order ID. Critical for webhook reconciliation. |
| `invoice_creation` | `{ enabled: true }` to generate a downloadable PDF invoice. |
| `expires_at` | Optional session expiry. |
| `locale` | `'fr'` |

**Discount caveat** *(v2.1)*: Stripe doesn't allow arbitrary negative line items. When discount support is built, codes will be managed as **Stripe coupons** (created in the Stripe dashboard). At session creation, the server validates the code by retrieving the coupon from Stripe and passes it as `discounts: [{ coupon: id }]`. Not required for v2.

### 6.2 Tech requirements

1. **Stripe account** — verified, with business details and a bank account for payouts (required for live mode).
2. **API keys** — publishable + secret, stored as Vercel env vars: `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`. Use test keys (`sk_test_...`) for development.
3. **Webhook endpoint secret** — `STRIPE_WEBHOOK_SECRET`, set in the Stripe dashboard with the endpoint pointed at `https://yourdomain.com/api/stripe-webhook`.
4. **Webhook events to subscribe to**:
   - `checkout.session.completed` — primary; mark order paid
   - `checkout.session.expired` — restock / mark order expired
   - `payment_intent.payment_failed` — mark order failed
   - `charge.refunded` — handle refunds
5. **Raw request body** in the webhook handler for signature verification — `stripe.webhooks.constructEvent(rawBody, sig, secret)`. On Vercel serverless, configure the function to read the raw body (no JSON middleware).
6. **HTTPS** — automatic on Vercel.
7. **NPM packages**: `stripe` (server-side only) and `resend` (for the confirmation email). `@stripe/stripe-js` is **not** needed since the user is redirected to Stripe's hosted page — no Elements embedded in the React app.
8. **Resend** — verified sending domain (`lavabow.fr` or subdomain like `mail.lavabow.fr`), API key stored as `RESEND_API_KEY` env var.
9. **Stripe CLI** for local webhook testing: `stripe listen --forward-to localhost:5173/api/stripe-webhook`.
10. **Idempotency** — pass an `Idempotency-Key` header when creating sessions to avoid duplicate orders on retry.

### 6.3 Order creation flow

1. User clicks "Pay with Stripe" on pre-checkout page.
2. Frontend POSTs `{ items: [{productId, quantity}], deliveryMethod }` to `/api/create-checkout-session`.
3. Server:
   - Looks up each product server-side by ID; rejects if missing or inactive.
   - Recomputes prices, shipping, and totals from authoritative data. Ignores any discount field — deferred to v2.1.
   - Inserts row into `orders` with `status = 'pending'` and a fresh UUID.
   - Inserts rows into `order_items` with price snapshots.
   - Creates Stripe session with `metadata.internal_order_id = <uuid>`.
   - Returns `{ url }` from the session.
4. Frontend redirects: `window.location = url`.
5. User pays on Stripe.
6. Stripe redirects user to `success_url`; webhook fires independently to your server.

### 6.4 Webhook flow

1. Stripe POSTs `checkout.session.completed` to `/api/stripe-webhook`.
2. Verify signature using raw body + `STRIPE_WEBHOOK_SECRET`. Reject 400 on failure.
3. Read `event.data.object.metadata.internal_order_id`, look up order in Supabase.
4. Idempotency check: if order is already `paid`, return 200 immediately (Stripe retries are normal).
5. Update order: `status = 'paid'`, `paid_at = now()`, `stripe_payment_intent_id = ...`, `shipping_address = session.shipping_details.address` (null if in-hand).
6. **Decrement stock**: for each `order_items` row, decrement `products.stock` by `quantity` (ignore products where `stock` is null — unlimited). Run as a single atomic SQL update.
7. **Send confirmation email via Resend** to the customer's email — see §6.6.
8. Return 200 within 5 seconds. If Resend or Supabase calls are slow, run them in `waitUntil()` so the 200 isn't blocked.

For `checkout.session.expired` and `payment_intent.payment_failed`: mark order `expired` / `failed`. Stock is not decremented at session creation, so no restock is needed.

### 6.5 Order ID & invoice

- **Internal order ID**: UUID created when the order row is inserted, before Stripe is called. Shown on success page, in the confirmation email, and queryable from Supabase.
- **Invoice**: enable `invoice_creation: { enabled: true }` on the session. Stripe generates a PDF invoice and emails it. Link is also on the order in the Stripe dashboard.

### 6.6 Confirmation email (Resend)

Triggered from the webhook handler on `checkout.session.completed`. Sent in French.

- **From**: `Lavabow <shop@lavabow.fr>` (or `noreply@`)
- **To**: customer email from `session.customer_details.email`
- **Subject**: `Confirmation de votre commande — #<short_order_id>`
- **Body** must include:
  - Internal order ID (full UUID or short prefix)
  - Itemized list (name, quantity, line subtotal)
  - Discount applied (if any — omit the line entirely when no code was used)
  - Delivery method (in-hand or shipping) and shipping cost
  - Grand total
  - Shipping address (if shipping)
  - Note that an official invoice is sent separately by Stripe
  - Contact email `shop@lavabow.fr` for any questions

A simple HTML template lives in the codebase (e.g. `emails/order-confirmation.tsx` if using `react-email`, otherwise a string template). Failures to send must be logged but must not fail the webhook (the order is already paid; email retry is a separate concern).

## 7. Confirmed Decisions

| Topic | Decision |
|---|---|
| Stock decrement | On `checkout.session.completed` webhook only. Not from any client-side event. |
| Discount codes | Deferred to v2.1. Will use Stripe coupons (managed in the Stripe dashboard) when built. |
| Tax / VAT | Prices are VAT-inclusive (French rate). Sales restricted to EU. Stripe `automatic_tax` not enabled. |
| Cart persistence | localStorage only. No cross-device cart. |
| Refunds / cancellations | Manual via Stripe dashboard. No self-serve flow. |
| Locale | French only (`locale: 'fr'`). |
| Confirmation email | Resend, sent from the `checkout.session.completed` webhook. Stripe receipt + PDF invoice also sent automatically. |
| Shipping | France only (`allowed_countries: ['FR']`). International customers contact `shop@lavabow.fr`. Notice displayed on shop page and pre-checkout page. |

## 8. Acceptance Criteria

- [ ] Cart survives page reload, expires after 30 minutes
- [ ] Adding, editing, removing, and clearing cart updates the live total correctly
- [ ] *(v2.1)* Discount code field is optional — checkout proceeds normally without one; when a code is entered it reduces both the displayed and Stripe-side totals correctly
- [ ] Switching delivery mode updates total and triggers correct shipping behavior in Stripe
- [ ] Shipping address collection is restricted to France
- [ ] Successful payment creates a `paid` order row with line-item snapshots and shipping address
- [ ] Stock is decremented on `checkout.session.completed` only, never from a client-side event
- [ ] Customer receives Stripe receipt, PDF invoice, AND a branded Resend confirmation email in French
- [ ] Webhook signature verification rejects forged requests
- [ ] Webhook is idempotent — Stripe retries don't double-decrement stock or double-send emails
- [ ] Server recomputes all amounts; tampering with client-side prices does not affect what's charged
- [ ] Cancelled / expired sessions do not create paid orders
- [ ] International shipping notice is visible on the shop page and pre-checkout page