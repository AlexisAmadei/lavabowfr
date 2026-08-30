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

import { ArrowIcon, LavaButton } from 'lavabowfr'

/** The arrow mark on its own: a fixed 30x15 SVG that paints white. */
export function Default() {
  return <Surface><ArrowIcon /></Surface>
}

/** Where it is actually used: as a button start icon and as LavaInput's submit affordance. */
export function InContext() {
  return (
    <Surface>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <LavaButton variant="outlined" startIcon={<ArrowIcon />}>Découvrir</LavaButton>
        <ArrowIcon />
      </div>
    </Surface>
  )
}
