# Getting Started

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 18+ | Or use Bun directly |
| Bun | latest | Preferred package manager |
| Docker | latest | Required for local Supabase |
| Supabase CLI | latest | `npm i -g supabase` |

## 1. Clone & Install

```bash
git clone https://github.com/AlexisAmadei/lavabowfr
cd lavabowfr
bun install          # or: npm install
```

## 2. Environment Variables

Create a `.env` file at the project root:

```env
# Supabase (frontend — public)
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
```

These values come from running `npx supabase status` after starting the local instance (see step 3).

For production values see [deployment.md](./deployment.md).

## 3. Local Supabase Setup

The project ships with a `supabase/` directory containing the local config and seed data.

```bash
# Link to the remote Supabase project (one-time)
npx supabase link

# Start local Supabase (Docker containers)
npx supabase start

# Print the local credentials — copy API URL and anon key into .env
npx supabase status

# Seed the database (runs supabase/seed.sql)
npx supabase db reset
```

Local services after `supabase start`:

| Service | URL |
|---|---|
| API / PostgREST | http://127.0.0.1:54321 |
| Supabase Studio | http://127.0.0.1:54323 |
| PostgreSQL | localhost:54322 |
| Inbucket (email) | http://127.0.0.1:54324 |

Stop the local instance with:

```bash
npx supabase stop
```

## 4. Run the Dev Server

```bash
npm run dev          # → http://localhost:5173
npm run network      # → exposes on local network (vite --host)
```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run network` | Dev server with LAN access |

## Supabase CLI Cheatsheet

```bash
npx supabase migration new <name>   # Create a new migration file
npx supabase db push                # Apply local migrations to running DB
npx supabase db push --dry-run      # Preview SQL before applying
npx supabase db reset               # Wipe, re-migrate, and reseed
npx supabase gen types typescript   # Regenerate TypeScript types from schema
```

## Test Admin Account

After seeding the database, a test admin user is available:

- **Email:** `alexis@lavabow.fr`
- **Password:** `azerqsdf`
- **Route:** `/admin/login`
