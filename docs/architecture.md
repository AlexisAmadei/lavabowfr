# Architecture

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Build tool | Vite | 7.x |
| Frontend framework | React + TypeScript | 19.x |
| Routing | React Router | 7.x |
| UI components | Chakra UI | 3.x |
| Styling | Emotion (via Chakra) | — |
| Animations | GSAP | 3.x |
| Animations (micro) | Motion (Framer) | 12.x |
| Drag & drop | @dnd-kit | — |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) | — |
| Serverless functions | Vercel (Node.js runtime) | — |
| Package manager | Bun | — |
| Linting | ESLint 9 + TypeScript ESLint | — |

## Project Structure

```
lavabowfr/
├── api/                    # Vercel serverless functions (Node.js)
├── src/
│   ├── assets/             # Static assets (fonts, images, textures)
│   ├── components/
│   │   ├── Core/           # App-wide structural components
│   │   ├── Design/         # Design system / reusable primitives
│   │   ├── Layouts/        # Layout wrappers (Admin)
│   │   ├── Sections/       # Landing page section components
│   │   ├── react-bits/     # Custom visual effect components
│   │   └── ui/             # Headless UI (Toast)
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── routes/             # React Router configuration
│   ├── styles/             # Global CSS
│   ├── types/              # Shared TypeScript interfaces
│   ├── utils/
│   │   ├── clientId.ts     # Online visitor tracking
│   │   └── supabase/       # All DB operations, by domain
│   └── views/              # Page-level components (routes)
│       └── Admin/          # Admin dashboard pages
├── supabase/
│   ├── config.toml         # Local Supabase config
│   └── seed.sql            # DB seed data
└── public/                 # Static files served by Vite
```

## Application Layers

### Public Frontend

The public-facing site is a single-page application rendered by `src/views/Landing.tsx`. It is composed of section components loaded lazily (except the Hero):

```
Landing.tsx
├── AppBar (navigation)
├── Hero (immediate — video background, online counter, spotlight)
├── lazy → AboutSection
├── lazy → Music (spotlight releases)
├── lazy → NextEvents (upcoming shows)
├── lazy → Newsletter (email subscription)
├── lazy → Videos (YouTube embeds)
├── lazy → Pictures (photo gallery)
├── lazy → Shop (merchandise)
├── lazy → ClickSection (gamification)
├── lazy → Contact
└── Footer
```

### Admin Dashboard

Protected under `/admin/*`. All admin routes require an active Supabase Auth session. The dashboard is a nested layout (`AdminLayout` → `Dashboard`) with content-specific sub-pages for each data domain.

See [admin.md](./admin.md) for details.

### Serverless Functions

Node.js functions in `api/` deployed as Vercel Edge Functions. They handle operations that must run server-side (secret keys, external API calls). See [api.md](./api.md).

## Key Design Decisions

### Global Variables via Supabase

Site-wide config (colors, video URLs, external links) is stored in the `global_variables` DB table instead of hardcoded constants. At startup, `GlobalContext.tsx` fetches all rows and provides them via context. Components read values with `useGetGlobalVar('VAR_NAME')`.

This allows non-developers to change things like the hero video URL from the admin panel without a redeploy.

### Code Splitting

Vendor chunks are split explicitly in `vite.config.ts`:

| Chunk | Contents |
|---|---|
| `react-vendor` | react, react-dom, react-router-dom |
| `chakra-vendor` | @chakra-ui, @emotion |
| `animation-vendor` | gsap, motion |

This keeps initial JS payload small and allows browsers to cache stable vendor code independently.

### Lazy Loading

Admin pages, Videos, and Pictures are loaded with `React.lazy()` + `<Suspense>`. This keeps the First Contentful Paint fast — only the Hero and navigation are eager.

## Path Aliases

Configured in both `tsconfig.json` and `vite.config.ts`:

| Alias | Resolves to |
|---|---|
| `@/` | `src/` |

Usage: `import { LavaButton } from '@/components/Design/LavaButton'`
