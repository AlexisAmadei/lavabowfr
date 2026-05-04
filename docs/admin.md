# Admin Dashboard

The admin dashboard is a protected area for managing all site content. It is accessible at `/admin/login` and requires a valid Supabase Auth session.

## Authentication

**Type:** Supabase Email + Password Auth
**Entry point:** `/admin/login` → `src/views/Admin/Login.tsx`

Flow:
1. User submits email + password via the login form.
2. `signInUser(email, password)` (in `src/utils/supabase/users.ts`) calls `supabase.auth.signInWithPassword()`.
3. On success, the Supabase JS client stores the JWT session automatically.
4. The user is redirected to `/admin/dashboard`.
5. Unauthenticated access to any `/admin/dashboard/*` route redirects back to `/admin/login`.

Session is managed entirely by the Supabase client — no manual token handling is needed.

## Routes

| Path | Component | Description |
|---|---|---|
| `/admin/login` | `Login.tsx` | Login form |
| `/admin/dashboard` | `Dashboard.tsx` | Dashboard layout (nested routes) |
| `/admin/dashboard/` | `AdminContent.tsx` | Content management hub |
| `/admin/dashboard/users` | `AdminUsers/` | User management |
| `/admin/dashboard/merchandise` | `AdminMerchandise.tsx` | Shop items |
| `/admin/dashboard/supabase-status` | `CloudStatus/` | Supabase health monitoring |
| `/admin/dashboard/global-vars` | `AdminGlobalVars.tsx` | Site-wide config editor |

## Content Management (`/admin/dashboard/`)

`AdminContent.tsx` is the main CRUD hub. It renders tabs or sub-navigation for each content domain:

| Sub-section | Component | Manages |
|---|---|---|
| Spotlight | `AdminSpotlight.tsx` | Music releases (albums, singles) |
| Events | `AdminEvents.tsx` | Live events |
| Pictures | `AdminPictures.tsx` | Photo gallery |
| Videos | `AdminVideos.tsx` | YouTube embeds (with drag-drop reorder) |
| Clicks | `AdminClicks.tsx` | Click counter gamification tiers |

Each sub-section follows the same pattern:
1. Fetches the list from Supabase on mount.
2. Renders items in a table or card list.
3. Add / Edit / Delete actions open a dialog component from `src/components/Core/Admin/`.
4. On submit, the dialog calls the relevant Supabase utility and refetches the list.

## Global Variables (`/admin/dashboard/global-vars`)

Editable key-value pairs stored in the `global_variables` table. These control site-wide settings without requiring a code change or redeploy.

Common variables:

| Key | Purpose |
|---|---|
| `HERO_VIDEO_URL` | YouTube URL for the hero background video |

To add a new variable: insert a row in `global_variables` and consume it with `useGetGlobalVar('YOUR_KEY')` in any component.

## Merchandise (`/admin/dashboard/merchandise`)

Manages `merch_items` and `merch_categories`. Each merchandise item links to a Stripe payment page (`stripe_paylink`). Images are hosted externally (Stripe or other CDN); the `img` field stores the URL.

## User Management (`/admin/dashboard/users`)

Displays registered admin users. Currently admin accounts are created manually via Supabase Studio or the seed script — there is no self-registration flow.

## Cloud Status (`/admin/dashboard/supabase-status`)

Monitors connectivity to Supabase. Shows the status of the database connection and storage bucket. Useful for diagnosing deployment or environment issues.

## Audit Log

Admin actions (create, update, delete) are written to the `audit_log` table via `src/utils/supabase/audit_log.ts`. Call `logAuditEvent(action)` after any significant mutation.

## Adding a New Admin Section

1. Create a component in `src/views/Admin/Content/AdminYourSection.tsx`.
2. Add a route in `src/routes/routes.tsx` under the dashboard nested routes.
3. Create add/edit/delete dialog components in `src/components/Core/Admin/`.
4. Add Supabase CRUD functions in `src/utils/supabase/yourSection.ts`.
5. Add a nav link to the dashboard sidebar/menu.
