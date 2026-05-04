# Components

The component library is split into four namespaces under `src/components/`.

## Design System (`src/components/Design/`)

Reusable branded primitives. Import and compose these instead of raw Chakra or HTML elements.

### `LavaButton`

Custom branded button with variants.

```tsx
<LavaButton variant="filled" onClick={...}>Buy Tickets</LavaButton>
<LavaButton variant="outlined">Learn More</LavaButton>
```

Props: `variant` (`"filled"` | `"outlined"`), standard button props.

---

### `LavaTypo`

Typography component with consistent heading and body styles.

```tsx
<LavaTypo as="h1" size="xl">LAVA BOW</LavaTypo>
<LavaTypo as="p">Some body text</LavaTypo>
```

Props: `as` (`"h1"`–`"h6"`, `"p"`), `size`, `variant`.

---

### `LavaInput`

Styled text input with error state, used in the newsletter form.

```tsx
<LavaInput
  placeholder="your@email.com"
  value={email}
  onChange={e => setEmail(e.target.value)}
  isInvalid={!!error}
/>
```

---

### `Section`

Page section wrapper with optional background image and consistent padding.

```tsx
<Section bgImage="/assets/textures/grain.png">
  {/* section content */}
</Section>
```

---

### `Logo`

Brand logo mark. Accepts `size` prop.

---

### `Marquee`

Horizontally scrolling marquee animation.

```tsx
<Marquee speed={50}>LAVA BOW · LAVA BOW · LAVA BOW ·</Marquee>
```

---

### `Loading`

Full-screen loading spinner. Shown during lazy-load suspense boundaries.

---

### `Icons`

Icon mapping wrapper over FontAwesome. Provides a consistent API for referencing icons by name.

---

### `Divider`

Thin visual separator between sections.

---

### `Player`

Wrapper around `react-player` for embedding YouTube videos with lazy loading.

---

### `HeroTypo`

Hero-specific oversized typography variant.

---

### `ContextMenu`

Right-click context menu component.

---

## Core Components (`src/components/Core/`)

### `AppBar`

Top navigation bar. Has desktop and mobile variants (the mobile variant renders a slide-out drawer). Reads nav links from `global_variables` or props.

### `Hero`

The landing page hero section. Includes:
- Background video (URL from `HERO_VIDEO_URL` global variable)
- Online visitor counter
- Spotlight item teaser (latest release)
- CTA buttons

### `ScrollToTop`

Floating button that appears on scroll and returns the user to the top of the page.

### `ClipboardElement`

Wraps content with a click-to-copy behavior. Shows a toast on success.

### Admin Dialogs (`src/components/Core/Admin/`)

Dialog components used within the admin dashboard for add/edit/delete operations on each content type. Each dialog handles its own form state and calls the corresponding Supabase utility on submit.

---

## Section Components (`src/components/Sections/`)

These map 1:1 with landing page sections. All are lazy-loaded except Hero.

| Component | Section |
|---|---|
| `AboutSection` | Band biography |
| `Music` | Latest releases (Spotlight) |
| `NextEvents` | Upcoming shows with ticket links |
| `Newsletter` | Email subscription form |
| `Videos` | YouTube video embeds |
| `Pictures/` | Photo gallery |
| `Shop/` | Merchandise shop |
| `ClickSection/` | Click counter gamification |
| `Contact` | Contact form |
| `Footer` | Site footer with social links |

---

## Visual Effects (`src/components/react-bits/`)

Custom animation and visual effect components.

### `ClickSpark`

Renders a spark particle burst at the cursor position on click.

### `TextFuzzy`

Applies a fuzzy/glitch text animation effect.

### `GlassSurface`

Applies a glassmorphism background effect (backdrop blur + semi-transparent overlay).

### `Counter`

Animated number counter that counts up from 0 to a target value.

---

## Hooks (`src/hooks/`)

| Hook | Returns | Usage |
|---|---|---|
| `useGetGlobalVar(name)` | `string \| undefined` | Read a value from the `global_variables` table via context |
| `useIsMobile()` | `boolean` | `true` when viewport is below the mobile breakpoint |
| `useIsInView(ref, threshold?)` | `boolean` | `true` when the element is in the viewport (IntersectionObserver) |
| `useWindowDimension()` | `{ width, height }` | Current window dimensions, updated on resize |

### `useGetGlobalVar` example

```tsx
const heroVideoUrl = useGetGlobalVar('HERO_VIDEO_URL')
// → "https://www.youtube.com/watch?v=..."
```

Global variables are fetched once at app startup and cached in `GlobalContext`. There is no loading state at the call site — components render with `undefined` until the context resolves.

---

## TypeScript Types (`src/types/types.ts`)

All shared data shapes are defined here.

```ts
EventItem       // section_events row
SpotlightItem   // section_spotlight row
PictureItem     // section_pictures row
Video           // section_videos row
ClicksItem      // clicks_paliers row
EmailContact    // newsletter row
GlobalVariable  // global_variables row
```

Import from `@/types/types`.
