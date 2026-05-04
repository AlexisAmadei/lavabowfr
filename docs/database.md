# Database

The project uses **Supabase** (hosted PostgreSQL) for all persistent data. Local development runs a Dockerized Supabase instance.

## Tables

### `section_events`

Upcoming or past live events.

| Column | Type | Notes |
|---|---|---|
| `id` | int | Primary key |
| `title` | text | Event name |
| `description` | text | Short description |
| `price` | numeric | Ticket price |
| `date` | text | Event date (display string) |
| `place` | text | Venue name |
| `link` | text | Ticket purchase URL |
| `img` | text | Public URL to image in storage bucket |
| `status` | text | `ACTIVE` \| `INACTIVE` \| `DELETED` \| `PAST` \| `CANCELED` |

### `section_spotlight`

Music releases (albums, singles, EPs) shown in the Music section.

| Column | Type | Notes |
|---|---|---|
| `id` | int | Primary key |
| `title` | text | Release title |
| `subtitle` | text | Release type or artist subtitle |
| `listen_link` | text | Streaming URL (Spotify, etc.) |
| `buy_link` | text | Purchase URL |
| `status` | text | `ACTIVE` \| `INACTIVE` \| `DELETED` |

### `section_pictures`

Photo gallery items.

| Column | Type | Notes |
|---|---|---|
| `id` | int | Primary key |
| `title` | text | Photo caption |
| `storage_ref` | text | Path within Supabase storage bucket |
| `date` | text | Photo date |
| `link` | text | Optional external link |
| `place` | text | Location |
| `status` | text | `ACTIVE` \| `INACTIVE` \| `DELETED` |

### `section_videos`

YouTube video embeds for the Videos section.

| Column | Type | Notes |
|---|---|---|
| `id` | int | Primary key |
| `description` | text | Video description |
| `url` | text | YouTube embed URL |
| `order` | int | Display order (drag-and-drop sortable in admin) |
| `status` | text | `ACTIVE` \| `INACTIVE` \| `DELETED` |
| `created_at` | timestamptz | — |
| `updated_at` | timestamptz | — |

### `merch_items`

Shop merchandise.

| Column | Type | Notes |
|---|---|---|
| `id` | int | Primary key |
| `name` | text | Product name |
| `price` | numeric | Price |
| `category_id` | int | FK → `merch_categories.id` |
| `stripe_paylink` | text | Stripe payment link URL |
| `img` | text | Product image URL |
| `status` | text | `ACTIVE` \| `INACTIVE` \| `DELETED` |

### `merch_categories`

Shop categories for grouping merchandise.

| Column | Type | Notes |
|---|---|---|
| `id` | int | Primary key |
| `name` | text | Category label |

### `clicks_paliers`

Gamification tiers for the click counter section.

| Column | Type | Notes |
|---|---|---|
| `id` | int | Primary key |
| `name` | text | Tier name |
| `target` | int | Number of clicks required |

### `newsletter`

Email subscribers.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid / int | Primary key |
| `email` | text | Subscriber email |
| `firstName` | text | First name |
| `lastName` | text | Last name |
| `created_at` | timestamptz | — |
| `verify_status` | text | Email verification result |
| `mailchimp_synced` | bool | Whether synced to Mailchimp |
| `status` | text | `ACTIVE` \| `INACTIVE` \| `DELETED` |

### `global_variables`

Key-value store for site-wide configuration managed from the admin panel.

| Column | Type | Notes |
|---|---|---|
| `id` | int | Primary key |
| `name` | text | Variable key (e.g. `HERO_VIDEO_URL`) |
| `value` | text | Variable value |

### `online_users`

Real-time visitor tracking (ephemeral — rows are deleted on page unload).

| Column | Type | Notes |
|---|---|---|
| `client_id` | uuid | Visitor UUID (from localStorage) |
| `last_seen` | timestamptz | Updated every 30 seconds |

### `audit_log`

Admin action history.

| Column | Type | Notes |
|---|---|---|
| `id` | int | Primary key |
| `action` | text | Description of the action |
| `created_at` | timestamptz | — |

## Supabase Auth

Users are managed by Supabase Auth (`auth.users` / `auth.identities`). Only email + password login is used. There is no public self-registration — accounts are created manually in Supabase Studio or via the seed script.

## Storage Buckets

All uploaded files live in the `lavabowfr` Supabase Storage bucket.

| Path pattern | Content |
|---|---|
| `events/{timestamp}_{filename}.webp` | Event cover images |
| `pictures/{id}_{filename}.webp` | Gallery photos |

Public URLs are generated automatically by the Supabase Storage API.

## Database Operations by Domain

All DB calls are in `src/utils/supabase/` and organized by table:

| File | Table(s) |
|---|---|
| `supabase.ts` | Generic client init + helper |
| `events.ts` | `section_events` + storage uploads |
| `pictures.ts` | `section_pictures` + storage |
| `spotlight.ts` | `section_spotlight` |
| `shop.ts` | `merch_items`, `merch_categories` |
| `click_palier.ts` | `clicks_paliers` |
| `newsletter.ts` | `newsletter` + email verification |
| `global_variables.ts` | `global_variables` |
| `users.ts` | Supabase Auth (sign in) |
| `audit_log.ts` | `audit_log` |
| `updateItemStatus.ts` | Generic status update (any table) |

## Status Pattern

Most content tables use a `status` column instead of hard deletes:

| Value | Meaning |
|---|---|
| `ACTIVE` | Visible in public frontend |
| `INACTIVE` | Hidden from frontend, retained in DB |
| `DELETED` | Soft-deleted; filtered from all queries |
| `PAST` | Events only — event has passed |
| `CANCELED` | Events only — event was canceled |

The generic helper `updateItemStatus.ts` handles status changes across all tables.

## Migrations

Migrations live in `supabase/migrations/`. To create a new migration:

```bash
npx supabase migration new <descriptive_name>
# Edit the generated SQL file in supabase/migrations/
npx supabase db push
```

To apply all migrations to a fresh local DB:

```bash
npx supabase db reset   # resets + applies migrations + runs seed.sql
```
