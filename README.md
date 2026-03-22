J
# lavabow.fr

Official website for LAVA BOW. Created by Samuel Postel and Alexis Amadei


## Tech Stack

**Client:** React Vite, Chakra UI and FontAwesome

**Server:** Vercel, Supabase


## Authors

- [@AlexisAmadei](https://www.github.com/AlexisAmadei)
- [@thecellofan](https://github.com/Samuelpostel)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`VITE_SUPABASE_URL`

`VITE_SUPABASE_PUBLISHABLE_KEY`

## Run Locally

Clone the project

```bash
  git clone https://github.com/AlexisAmadei/lavabowfr
```

Go to the project directory

```bash
  cd lavabowfr
```

Install dependencies

```bash
  npm install
```

Install Supabase CLI (if not already installed)

```bash
  npm install -g supabase
```

Start local Supabase (Docker required)

```bash
  npx supabase init
  npx supabase link
  npx supabase start
```

Get local API URL + anon key and copy them into your `.env`

```bash
  npx supabase status
```

Reset DB (runs all migrations + `supabase/seed.sql` automatically)

```bash
  npx supabase db reset
```

Stop local Supabase

```bash
  npx supabase stop
```

Start the server

```bash
  npm run dev
```

## Supabase Local (Docker)

This repo is configured for local Supabase with Docker via `supabase/config.toml`:
- Migrations are enabled (`[db.migrations].enabled = true`)
- Seed is enabled (`[db.seed].enabled = true`)
- Seed file path is `supabase/seed.sql`

Useful commands:

```bash
# Apply new local migrations to running local DB
npx supabase db push

# Dry run migrations (preview SQL without applying)
npx supabase db push --dry-run

# Create a migration from local schema changes
npx supabase migration new <migration_name>

# Reset local DB and reseed (safe to rerun while developing)
npx supabase db reset
```

Notes:
- `supabase db reset` recreates your local DB and replays migrations + seed data.
- If seed insert fails because of duplicates, make inserts idempotent (`ON CONFLICT`) or clean data before re-running.
- Local services run on default ports from `supabase/config.toml` (API `54321`, DB `54322`, Studio `54323`).

## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Main Brand | #0a192f |
| Example Accent |  #f8f8f8 |
| Dark Background | #00b48a |


