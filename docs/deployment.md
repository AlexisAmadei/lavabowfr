# Deployment

## Platform

The project deploys to **Vercel**. Both the Vite SPA and the serverless functions in `api/` are deployed together in a single Vercel project.

## SPA Routing

`vercel.json` rewrites all routes to `index.html` so that React Router handles client-side navigation:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Without this, navigating directly to `/shop` or `/admin/login` would return a 404 from Vercel.

## Deployment Flow

1. Push to `main` (or the configured production branch).
2. Vercel detects the push and runs `npm run build`.
3. The `dist/` output is served as the static frontend.
4. Functions in `api/` are deployed as serverless functions automatically.

Preview deployments are created for every pull request.

## Build Command

```bash
npm run build   # Vite builds to dist/
```

Vite splits vendor chunks for optimal caching:

| Chunk | Contents |
|---|---|
| `react-vendor` | react, react-dom, react-router-dom |
| `chakra-vendor` | @chakra-ui/*, @emotion/* |
| `animation-vendor` | gsap, motion |

## Environment Variables

### Frontend (Vite — `VITE_` prefix)

Must be set in Vercel project settings under **Environment Variables**. Vite embeds these at build time — they are public.

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL (e.g. `https://xyz.supabase.co`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase `anon` public key |

### Serverless Functions (server-only)

These are never exposed to the browser. Set them in Vercel project settings.

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Supabase `service_role` key (full DB access — keep secret) |
| `RAPIDAPI_KEY` | RapidAPI key for email verification |
| `RAPID_API_HOST` | RapidAPI host for the email verification service |
| `MAILCHIMP_API_KEY` | Mailchimp API key |
| `MAILCHIMP_USERNAME` | Mailchimp account ID / username |
| `MAILCHIMP_MAIN_AUDIENCE` | Mailchimp audience (list) ID |

## Analytics

### OpenPanel

Initialized in `index.html`:
- API URL: `https://openpanel.lavabow.fr/api`

### Vercel Analytics & Speed Insights

Lazy-loaded in `src/main.tsx` (does not block FCP). Tracks Core Web Vitals and page views.

## Local Environment File (Development)

```env
# .env (not committed — add to .gitignore)
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<local-anon-key>
```

Get the local key by running `npx supabase status` after `npx supabase start`.
