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

import { Logo } from 'lavabowfr'

/** The band mark, clipped to a circle by its wrapper. Omitting `h`/`w` falls
 *  back to the artwork's intrinsic size (~1575px), so pass them in practice. */
export function Default() {
  return <Surface><Logo h="160" w="160" /></Surface>
}

/** `h` and `w` go straight to the underlying img, in px. */
export function Sizes() {
  return (
    <Surface>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Logo h="18" w="18" />
        <Logo h="40" w="40" />
        <Logo h="80" w="80" />
      </div>
    </Surface>
  )
}
