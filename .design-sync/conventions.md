## How to build with Lavabow

Lavabow is the design system of a French rock band's site. It is **dark-first, display-typographic, and hot-pink accented**. It is not a utility-class system and not a themed prop system: components carry their own semantic classes, and everything you add around them is styled with the CSS custom properties below.

### 1. Two things every design needs

**Wrap the tree in `DsProvider`.** It supplies the Chakra context that `Tooltip`, `Toaster`, `Loading`, `Player`, `StatusChip`, `Section`, `Logo`, `ContextMenu` and `LavaInput` read. Without it those components throw or render unstyled.

**Ground the page on the dark background.** This is the single most common way to get Lavabow wrong. Component text, `ArrowIcon`, and the `outlined` button border are all **white**, so on a light page they are invisible. Always paint the root:

```jsx
const { DsProvider, LavaTypo, LavaButton } = window.Lavabow;

<DsProvider>
  <div style={{ background: 'var(--dark-background)', color: '#fff', minHeight: '100vh' }}>
    {/* everything goes here */}
  </div>
</DsProvider>
```

### 2. The styling vocabulary

There are **no utility classes**. Style your own layout glue with these custom properties (all defined in `_ds_bundle.css`, reachable from `styles.css`):

| Group | Properties |
|---|---|
| Ground | `--dark-background` (`#0c0c0c`, the page ground) |
| Accents | `--main-accent` (hot pink `#ED00E1`), `--secondary-accent` (blue `#1217FC`), `--tertiary-accent` |
| Semantic | `--Background-bg-brand`, `--Text-text-brand`, `--Text-text-primary` |
| Type | `--font-cossette-titre` (display), `--font-stack-sans` (body/UI), `--font-archivo-black`, `--hero-line-height` |
| Breakpoints | `--default-breakpoint` (1024px), `--mobile-breakpoint` (768px) |

Never invent token names, and never hand-write the components' own classes (`lava-button`, `lava-typo`, `lava-section`, `lava-input`, `hero-typo`) — the components emit those themselves. Reach for a component's props first; `style` and `className` pass through to the underlying element when you genuinely need an override, which is how the repo itself applies an accent (`<LavaButton style={{ backgroundColor: 'var(--main-accent)' }}>`).

### 3. Type is a component, not a class

**All text goes through `LavaTypo`.** Do not write bare `<h1>`/`<p>`. Variants: `h1` (Cossette Titre, display scale, always centred), `h2`, `h3` (Cossette Titre), `h4` (Stack Sans Text), `p` (default body), plus inline `accent` (renders pink) and `bold`. `size`, `textAlign` and `color` override per instance.

### 4. Page structure

`Section` is the layout primitive: it takes `title` (rendered as an `h1` through `LavaTypo`), `bgColor`, `bgImage`, `contained` (caps width at 1700px) and `id` for anchor navigation. Stack `Section`s to build a page. `HeroTypo` and `Marquee` are the full-bleed brand lockups — give them the full container width.

### 5. Things that will surprise you

- `Player` renders `null` until its Supabase fetch resolves, so it shows nothing in a design canvas. Lay out around a fixed-size placeholder.
- `StatusChip` is `position: absolute` — its parent must be positioned. `Loading` centres via `AbsoluteCenter` and needs a positioned, sized ancestor.
- `Toaster` is a singleton: mount it once near the root, then call `window.Lavabow.toaster.create({ title, type })`.
- `Tooltip` needs `open` to show statically, and `portalled={false}` to stay inside a bounded box.
- `LavaInput` requires both `error` and `setError`; it owns its own email state.

### 6. Where the truth is

Read `_ds/<folder>/styles.css` and the `_ds_bundle.css` it imports for the real rules, and `components/<group>/<Name>/<Name>.prompt.md` plus `<Name>.d.ts` for a component's actual API before composing with it.

### A representative build

```jsx
const { DsProvider, Section, LavaTypo, LavaButton, Divider } = window.Lavabow;

<DsProvider>
  <div style={{ background: 'var(--dark-background)', color: '#fff', minHeight: '100vh' }}>
    <Section id="dates" title="Prochaines dates" contained>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '0 24px' }}>
        <LavaTypo variant="p" textAlign="center">
          Retrouvez-nous sur scène cet automne.
        </LavaTypo>
        <Divider orientation="horizontal" color="#ffffffd8" dashed thickness="2px" dashArray="8 8" rounded />
        <LavaButton style={{ backgroundColor: 'var(--main-accent)' }} fullWidth>
          Acheter un billet
        </LavaButton>
      </div>
    </Section>
  </div>
</DsProvider>
```
