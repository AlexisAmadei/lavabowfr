# design-sync notes — lavabowfr

Repo-specific gotchas for future syncs. Read this before re-running.

## Shape

- This is a **Next.js application**, not a published component library: no `dist/`, no
  Storybook, no library build script. `shape` is pinned to `package` and the converter
  runs in explicit-entry mode against a hand-written barrel.
- Synced surface is `app/_components/Design` + `app/_components/ui` (15 components), the
  user-chosen scope. `Sections/`, `Core/` and `react-bits/` are deliberately excluded —
  they are page bodies wired to Supabase and the global context. `react-bits/GlassSurface`
  still ships inside the bundle because `LavaButton` and `LavaInput` import it.
- Build command: no `buildCmd`. The converter is run directly with
  `--entry ./.design-sync/ds-entry.tsx`.

## Repo-owned files this sync depends on

All committed under `.design-sync/`, all required for a reproducible build:

- **`ds-entry.tsx`** — the barrel. Needed for two reasons: (1) the converter's synthesized
  entry uses `export *`, which silently drops the `export default` that nearly every
  component here uses; (2) an `--entry` inside the repo is what makes `PKG_DIR` resolve to
  the repo root (without it the converter looks for `node_modules/lavabowfr/package.json`
  and dies with ENOENT). **Add new components here** or they will not reach the bundle.
- **`ds-process-shim.ts`** — imported first by the barrel. Two shims:
  - `globalThis.process.env`: `app/_utils/supabase/supabase.ts` calls `createClient()` at
    module scope reading `process.env`. In a browser IIFE that threw at bundle init, so
    `window.Lavabow` was never assigned and **all 15 previews rendered blank**. If every
    component ever goes blank at once, look here first.
  - `String.prototype.src` (data: URLs only): Next static image imports give an object with
    `.src`; esbuild's dataurl loader gives a plain string, so `Logo` and `Marquee` rendered
    broken images. The getter is deliberately narrow — data: URLs only.
- **`tsconfig.ds.json`** — mirrors `tsconfig.json`'s `paths` (esbuild reads them from here)
  and adds `next/image` → `shims/next-image.tsx`. **Keep the aliases in sync with
  `tsconfig.json`** if they ever change there.
- **`shims/next-image.tsx`** — `next/image` outside a Next runtime resolves to an object,
  which React rejects as an element type ("Element type is invalid … got: object"), and its
  optimizer rejects the data: URLs the SVG imports become. `HeroTypo` is the only consumer.
- **`ds-styles.css`** (`cssEntry`) — deliberately *not* `app/_styles/index.css`. index.css
  `@import`s `./fonts.css` and `./var.css` by relative path, which do not exist at the
  bundle root (`[CSS_IMPORT_MISSING]`), and it carries app-shell rules (`width: 100vw`,
  `#root`, mapbox overrides) that would distort a design canvas. Tokens ship instead via
  the barrel's `import '../app/_styles/var.css'`, so **they stay live** — do not inline
  token values into ds-styles.css.
- **`preview-provider.tsx`** — `DsProvider`, the ChakraProvider layer of `app/providers.tsx`.
  `GlobalVarProvider` is not needed (no scoped component reads it) and `LanguageProvider` is
  not needed either (`LanguageContext` ships a populated default, so `useTranslation` works
  unwrapped).
- **`docs/Player.md`** — bound via `docsDir`.

## Previews

- **The card template paints a white body** (`body{background:#fff}` in an inline `<style>`
  that wins over `styles.css`). This DS is dark-first, so white text, `ArrowIcon` and the
  outlined button border are invisible on it. Every authored preview therefore wraps its
  content in a local `Surface` component on `var(--dark-background)`. Keep doing this for
  any new preview, or the card will look empty.
- `cardMode: column` on LavaTypo / Section / Marquee, `single` on HeroTypo — these are
  full-width and get stranded in a multi-column grid.
- `Toaster`: toasts only appear if `toaster.create` is deferred (~250ms) past `<Toaster />`'s
  own mount; called synchronously in the same effect they are silently dropped. The surface
  is `100vh` so the body-level portal lands inside the captured box.
- `Tooltip`: needs `open` + `portalled={false}`, and generous `paddingBottom` or the
  tooltip is clipped at the surface edge.
- `Player` has **no authored preview on purpose** — it ships the floor card. It early-returns
  `null` until its Supabase fetch resolves, so nothing can render it statically. Do not
  "fix" this by authoring a preview; author a doc instead (`docs/Player.md`).

## Known render warns (expected — not new)

- `[FONT_MISSING] "Whyte"` — the family is referenced by `Design/styles/HeroTypo.css`
  (`.marquee-track > span`) but **no Whyte font file exists anywhere in this repo**, so the
  live site does not ship it either. The rule is also dead: `.marquee-track` only ever
  contains `<img>` elements (see `Marquee.tsx`), never a `span`. Zero rendering impact on
  the synced surface. Treat as expected until the dead rule is removed upstream.

## Findings reported to the repo owner (not sync problems)

- `LavaInput`'s `error` prop produces **no visual change** — the captures for `error={false}`
  and `error={true}` were byte-identical. `Input` hardcodes `borderColor: transparent` /
  `borderBottomColor: white`, which overrides Chakra's `Field.Root invalid` styling. The
  error state reaches the user only through the toast. The misleading `Invalid` preview cell
  was removed rather than shipped.
- `StatusChip` renders its label in white on `green.100` / `red.100`, which is close to
  illegible. The preview is faithful to the component; this is a real contrast bug.
- `Design/styles/HeroTypo.css` `.marquee-track > span` is dead CSS (see Whyte above).

## Re-sync risks

- **`ds-entry.tsx` does not auto-discover.** A component added to `Design/` or `ui/` will be
  invisible to the sync until it is added to both the barrel and `componentSrcMap`. Diff
  `ls app/_components/Design app/_components/ui` against the barrel on every re-sync.
- **`tsconfig.ds.json` duplicates `tsconfig.json`'s path aliases.** They will silently drift.
  Re-check them whenever aliases change.
- **The shims track upstream behaviour, not this repo.** A Next.js major upgrade can change
  `next/image`'s prop surface, and a Chakra major can change the toaster mount timing the
  Toaster preview's 250ms defer depends on. Both are the first suspects after a dep bump.
- **`--main-accent` and friends come from `app/_styles/var.css` via the barrel import.**
  Moving or renaming that file breaks tokens silently — `[TOKENS_MISSING]` is the signal.
- Playwright is pinned to **1.62.0** in `.ds-sync/` because that is the release whose
  `browsers.json` matches the cached `chromium-1234`. A different machine may need a
  different pin; check `~/.cache/ms-playwright/` before installing.
- `_ds_bundle.js` is ~3MB, mostly `@supabase/supabase-js` pulled in by `Player`. Dropping
  `Player` from the scope would cut it substantially if bundle size ever matters.
