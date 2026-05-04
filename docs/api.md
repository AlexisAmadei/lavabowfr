# API — Vercel Serverless Functions

All functions live in the `api/` directory and run on Vercel's Node.js runtime. They are auto-deployed alongside the frontend. CORS headers (`Access-Control-Allow-Origin: *`) are set on every route.

## Why serverless functions?

These endpoints exist to keep secrets out of the browser. The Supabase service-role key, Mailchimp API key, and RapidAPI key are server-only and must never be exposed to the client.

## Endpoints

### `POST /api/updateLastSeen`

Updates the `last_seen` timestamp for an online visitor. Called on a 30-second interval from the frontend.

**Body:**
```json
{ "clientId": "<uuid>" }
```

**Behavior:** Upserts a row in `online_users` with the given `client_id` and `last_seen = NOW()`.

**Returns:** `200 OK` on success.

---

### `DELETE /api/deleteOnlineUser`

Removes a visitor from the `online_users` table. Called via `navigator.sendBeacon` in the `beforeunload` handler.

**Body:**
```json
{ "clientId": "<uuid>" }
```

**Behavior:** Deletes the row from `online_users` where `client_id` matches.

**Returns:** `200 OK` on success.

---

### `POST /api/verifyEmail`

Validates an email address via the RapidAPI email verification service, then updates the `verify_status` field in the `newsletter` table.

**Body:**
```json
{ "email": "user@example.com" }
```

**Behavior:**
1. Calls the RapidAPI email verification endpoint.
2. Updates `newsletter.verify_status` for the matching email row in Supabase.

**Environment variables required:**
- `RAPIDAPI_KEY`
- `RAPID_API_HOST`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

---

### `POST /api/mailchimp/syncToMailchimp`

Syncs newsletter subscribers from the Supabase `newsletter` table to the Mailchimp audience.

**Behavior:**
1. Fetches all `ACTIVE` subscribers where `mailchimp_synced = false`.
2. Calls the Mailchimp API to add/update each contact.
3. Sets `mailchimp_synced = true` for successfully synced rows.

**Environment variables required:**
- `MAILCHIMP_API_KEY`
- `MAILCHIMP_USERNAME`
- `MAILCHIMP_MAIN_AUDIENCE`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

---

### `GET /api/mailchimp/getaudience`

Returns audience stats from Mailchimp (total subscribers, open rate, etc.).

**Returns:** Mailchimp audience object.

**Environment variables required:**
- `MAILCHIMP_API_KEY`
- `MAILCHIMP_USERNAME`
- `MAILCHIMP_MAIN_AUDIENCE`

---

### `GET /api/mailchimp/getcontact`

Retrieves a single contact from Mailchimp by email.

**Query params:**
```
?email=user@example.com
```

**Returns:** Mailchimp contact object.

**Environment variables required:**
- `MAILCHIMP_API_KEY`
- `MAILCHIMP_USERNAME`
- `MAILCHIMP_MAIN_AUDIENCE`

---

## Local Development

Vercel functions don't run natively with `vite dev`. To test them locally:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Run the full project (Vite + serverless functions)
vercel dev
```

Alternatively, mock the API calls in development with a `.env` pointing to the real Supabase project and test individual functions with tools like Hoppscotch or curl.

## Adding a New Function

1. Create `api/myFunction.js` (CommonJS or ESM).
2. Export a default async handler: `export default async function handler(req, res) { ... }`.
3. Add any required secrets to Vercel's environment variables.
4. The function is available at `/api/myFunction` after deployment.
