# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev            # Start Next.js dev server
npm run build      # Production build
npm run start      # Run production server
npm run lint       # Run ESLint
```

No test runner is configured — linting is the only automated check.

## Architecture

This is a Next.js 16 App Router app (React 19 + TypeScript) for a band/artist website with an admin CMS and e-commerce. Backend is Supabase (PostgreSQL + storage) and Vercel serverless functions.

**Routing layout (`app/`)** — App Router, routing-only. Two route groups for URL-preserving separation:
- `app/(public)/` — `cart`, `checkout`, `shop`, `order/success`, `privacy`, `unsubscribe`
- `app/(admin)/admin/` — `login`, `dashboard/{global-vars,merchandise,sales,supabase-status,users}`
- `app/page.tsx` — landing
- `app/layout.tsx`, `app/providers.tsx`, `app/emotion-registry.tsx` — root chrome
- `app/not-found.tsx`

**Application code (`app/_*`)** — non-routable private folders (underscore prefix opts them out of routing):
- `app/_components/` — `Core`, `Design`, `Sections`, `react-bits`, `ui`
- `app/_features/{public,admin}/views/` — page bodies the route `page.tsx` files import
- `app/_hooks/`, `app/_contexts/`, `app/_lib/`, `app/_utils/`, `app/_types/`, `app/_i18n/`, `app/_styles/`, `app/_assets/`

**Legacy `api/`** — Vercel serverless Node.js functions for server-side ops (`create-checkout-session`, `stripe-webhook`, `get-order`, `list-orders`, `updateLastSeen`, `deleteOnlineUser`, `mailchimp/*`, `log/`). Shared server libs in `api/_lib/`. Not yet migrated to `app/api/**/route.ts`.

**Key architectural patterns:**
- `app/_contexts/GlobalContext.tsx` — fetches site-wide config (colors, URLs) from Supabase; consumed via the `useGetGlobalVar` hook
- `app/_utils/supabase/` — DB operations isolated by domain (events, pictures, shop, users, etc.)
- Real-time online user counter: heartbeat every 30s via `app/_utils/clientId.ts` → `POST /api/updateLastSeen`, cleanup on exit via `DELETE /api/deleteOnlineUser`

**Path aliases** (`tsconfig.json`):
- `@/components/*` → `app/_components/*`
- `@/hooks/*`, `@/contexts/*`, `@/utils/*`, `@/lib/*`, `@/types/*`, `@/i18n/*`, `@/styles/*`, `@/assets/*` → matching `app/_*/`
- `@/features/*` → `app/_features/*`

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | Chakra UI v3, Emotion, next-themes |
| Animations | GSAP 3, Motion (Framer) |
| Icons | FontAwesome v7 (solid, regular, brands) |
| Drag & Drop | @dnd-kit |
| Backend | Supabase JS client |
| Analytics | OpenPanel, Vercel Analytics & Speed Insights |

## Data models

Core types in `app/_types/types.ts`: `EventItem`, `SpotlightItem`, `PictureItem`, `Video`, `ClicksItem`, `EmailContact`, `GlobalVariable`.

## Database

Migrations live in `supabase/migrations/`, seed in `supabase/seed.sql`. Local dev uses Supabase CLI with Docker (`supabase/config.toml`).
