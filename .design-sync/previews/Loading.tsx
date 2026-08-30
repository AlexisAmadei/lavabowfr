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

import { Loading } from 'lavabowfr'

// Loading uses Chakra's AbsoluteCenter, so it centres against the nearest
// positioned ancestor. Every usage needs that ancestor to be positioned and sized.
const Stage = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: 'relative', height: 150, flex: 1, background: '#191919', borderRadius: 12 }}>
    {children}
  </div>
)

/** The default: centred on both axes inside a positioned container. */
export function Default() {
  return <Surface><Stage><Loading /></Stage></Surface>
}

/** `acaxis` restricts centring to a single axis. */
export function Axis() {
  return (
    <Surface>
      <div style={{ display: 'flex', gap: 16 }}>
        <Stage><Loading acaxis="horizontal" /></Stage>
        <Stage><Loading acaxis="vertical" /></Stage>
      </div>
    </Surface>
  )
}
