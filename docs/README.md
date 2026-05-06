# LAVA BOW — Developer Documentation

Official website for LAVA BOW, a French alternative rock trio from Asnières-sur-Seine.

## Contents

| Document | Description |
|---|---|
| [getting-started.md](./getting-started.md) | Local setup, environment variables, running the project |
| [architecture.md](./architecture.md) | Tech stack, project structure, key design decisions |
| [database.md](./database.md) | Supabase schema, tables, storage buckets, migrations |
| [api.md](./api.md) | Vercel serverless functions reference |
| [components.md](./components.md) | Design system and reusable component library |
| [admin.md](./admin.md) | Admin dashboard — routes, features, authentication |
| [deployment.md](./deployment.md) | Vercel deployment, environment variables, analytics |

## Quick Start

```bash
# Install dependencies
bun install          # or: npm install

# Start dev server
bun dev         # → http://localhost:5173
```

For the full local setup with a local Supabase instance, see [getting-started.md](./getting-started.md).

## Stack at a Glance

- **Frontend:** React 19 + TypeScript, Vite 7, Chakra UI 3, React Router 7
- **Backend:** Supabase (PostgreSQL + Auth + Storage), Vercel Serverless Functions
- **Animations:** GSAP 3, Framer Motion
- **Integrations:** Mailchimp, RapidAPI (email verification), OpenPanel analytics
- **Deploy:** Vercel (auto-deploy on push)
