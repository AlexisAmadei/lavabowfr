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

import { LavaButton, ArrowIcon } from 'lavabowfr'

const Row = ({ children }: { children: React.ReactNode }) => (
  <Surface><div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div></Surface>
)

/** The three shipped variants. `filled` is the default and uses --secondary-accent. */
export function Variants() {
  return (
    <Row>
      <LavaButton variant="filled">Écouter le single</LavaButton>
      <LavaButton variant="outlined">Voir les dates</LavaButton>
      <LavaButton variant="text">En savoir plus</LavaButton>
    </Row>
  )
}

/** `color` overrides the variant background with a brand accent token. */
export function Colors() {
  return (
    <Row>
      <LavaButton color="primary">Primary</LavaButton>
      <LavaButton color="secondary">Secondary</LavaButton>
    </Row>
  )
}

/** Only `large` carries its own scale; `small` and `medium` inherit the base padding. */
export function Sizes() {
  return (
    <Row>
      <LavaButton size="small">Small</LavaButton>
      <LavaButton size="medium">Medium</LavaButton>
      <LavaButton size="large">Large</LavaButton>
    </Row>
  )
}

/** `startIcon` slots a node before the label. */
export function WithIcon() {
  return (
    <Row>
      <LavaButton variant="outlined" startIcon={<ArrowIcon />}>Réserver</LavaButton>
      <LavaButton color="secondary" startIcon={<ArrowIcon />}>Billetterie</LavaButton>
    </Row>
  )
}

/** Disabled greys the button out and blocks pointer events. */
export function Disabled() {
  return (
    <Row>
      <LavaButton disabled>Complet</LavaButton>
      <LavaButton variant="outlined" disabled>Bientôt disponible</LavaButton>
    </Row>
  )
}

/** How EventTicket renders its call to action: full width on the accent colour. */
export function FullWidth() {
  return (
    <Surface style={{ maxWidth: 340 }}>
      <LavaButton style={{ backgroundColor: 'var(--main-accent)' }} fullWidth>
        Acheter un billet
      </LavaButton>
    </Surface>
  )
}
