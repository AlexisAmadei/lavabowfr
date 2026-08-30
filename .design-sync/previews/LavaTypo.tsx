import * as React from 'react'

// The preview card paints a white body, but this design system is dark-first:
// app/_styles/index.css grounds the site on --dark-background with white text.
// Every card renders on that surface so the components look the way they do on
// the site instead of white-on-white.
const Surface = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div
    style={{
      background: 'var(--dark-background, #0c0c0c)',
      color: '#fff',
      padding: 24,
      borderRadius: 8,
      width: '100%',
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {children}
  </div>
)

import { LavaTypo } from 'lavabowfr'

const Stack = ({ children }: { children: React.ReactNode }) => (
  <Surface><div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div></Surface>
)

/** h1 is the page-title scale: Cossette Titre, 100px, always centred. */
export function DisplayHeading() {
  return <Stack><LavaTypo variant="h1">Lava Bow</LavaTypo></Stack>
}

/** h2 and h3 stay on Cossette Titre; h4 switches to Stack Sans Text. */
export function Headings() {
  return (
    <Stack>
      <LavaTypo variant="h2">Prochaines dates</LavaTypo>
      <LavaTypo variant="h3">Nouveau single</LavaTypo>
      <LavaTypo variant="h4">Disponible sur toutes les plateformes</LavaTypo>
    </Stack>
  )
}

/** `p` is the default variant: Stack Sans Text at 18px, left aligned. */
export function BodyText() {
  return (
    <Stack>
      <LavaTypo variant="p">
        Lava Bow est un groupe de rock français. Retrouvez toutes nos actualités,
        nos dates de concert et notre discographie sur ce site.
      </LavaTypo>
    </Stack>
  )
}

/** Inline variants render a span: `accent` picks up --main-accent, `bold` the heavy weight. */
export function InlineVariants() {
  return (
    <Stack>
      <LavaTypo variant="accent">LAVA IDENTITY</LavaTypo>
      <LavaTypo variant="bold">Complet</LavaTypo>
    </Stack>
  )
}

/** `textAlign` and `size` override the variant defaults. */
export function AlignmentAndSize() {
  return (
    <Stack>
      <LavaTypo variant="p" textAlign="left" size="16px">Aligné à gauche</LavaTypo>
      <LavaTypo variant="p" textAlign="center" size="16px">Centré</LavaTypo>
      <LavaTypo variant="p" textAlign="right" size="16px">Aligné à droite</LavaTypo>
    </Stack>
  )
}
