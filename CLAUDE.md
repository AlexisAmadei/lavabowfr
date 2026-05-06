# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev        # Start Vite dev server
npm run build      # Production build
npm run lint       # Run ESLint
npm run preview    # Preview production build
npm run network    # Dev server with network access (vite --host)
```

No test runner is configured — linting is the only automated check.

## Architecture

This is a React 19 SPA (Vite + TypeScript) for a band/artist website with an admin CMS and e-commerce. Backend is Supabase (PostgreSQL + storage) and Vercel serverless functions.

**Two main surfaces:**
- **Public landing page** (`src/views/Landing.tsx`) — hero, events, gallery, videos, shop, newsletter, click-counter gamification
- **Admin dashboard** (`src/views/Admin/`) — protected CRUD for all content types, user management, global variable config

**Key architectural patterns:**
- `src/contexts/GlobalContext.tsx` — fetches and provides site-wide config variables (colors, URLs, etc.) from Supabase; consumed via `useGetGlobalVar` hook
- `src/utils/supabase/` — all database operations are isolated here by domain (events, pictures, shop, users, etc.)
- `api/` — Vercel serverless Node.js functions for operations that require server-side execution: `updateLastSeen`, `deleteOnlineUser`, `verifyEmail`, `mailchimp/`
- Real-time online user counter: heartbeat every 30s via `src/utils/clientId.ts` → `POST /api/updateLastSeen`, cleanup on exit via `DELETE /api/deleteOnlineUser`

**Lazy loading:** Admin pages and heavy sections (Videos, Pictures) are lazy-loaded. Keep this pattern when adding new admin views.

**Path aliases** (configured in `tsconfig.json` and `vite.config.ts`):
- `@/` → `src/`
- `@/components/*`, `@/hooks/*`, `@/utils/*`, etc.

**Vendor chunk splitting** in `vite.config.ts`: react, chakra, and animation libraries are split into separate chunks — keep heavy deps in their respective groups.

## Stack

| Layer | Tech |
|---|---|
| UI | Chakra UI v3, Emotion, next-themes |
| Routing | React Router v7 |
| Animations | GSAP 3, Motion (Framer) |
| Icons | FontAwesome v7 (solid, regular, brands) |
| Drag & Drop | @dnd-kit |
| Backend | Supabase JS client |
| Analytics | OpenPanel, Vercel Analytics & Speed Insights |

## Data models

Core types in `src/types/types.ts`: `EventItem`, `SpotlightItem`, `PictureItem`, `Video`, `ClicksItem`, `EmailContact`, `GlobalVariable`.

## Database

Migrations live in `supabase/migrations/`, seed in `supabase/seed.sql`. Local dev uses Supabase CLI with Docker (`supabase/config.toml`).
