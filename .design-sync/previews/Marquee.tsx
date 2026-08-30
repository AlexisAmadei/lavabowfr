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

import { Marquee } from 'lavabowfr'

/** The default band: the outlined wordmark scrolling left at 100px/s. */
export function Default() {
  return <Surface style={{ padding: '24px 0' }}><Marquee /></Surface>
}

/** `height` sets the artwork height in px and drives the band height. */
export function Heights() {
  return (
    <Surface style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Marquee height={40} />
        <Marquee height={90} />
      </div>
    </Surface>
  )
}

/** `speed` is px/s (higher is faster) and `reverse` flips the direction. */
export function SpeedAndDirection() {
  return (
    <Surface style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Marquee speed={20} gap={30} height={60} />
        <Marquee speed={200} gap={80} height={60} reverse />
      </div>
    </Surface>
  )
}
