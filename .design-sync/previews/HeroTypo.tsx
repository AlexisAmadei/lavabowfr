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

import { HeroTypo } from 'lavabowfr'

// `repeated` only changes the mobile branch (it keeps the static outlined
// lockup instead of swapping in the Marquee), so it renders identically at
// desktop widths and is not worth a second cell here.
/** The landing hero: the filled wordmark stacked over the outlined one. */
export function Default() {
  return <Surface style={{ padding: '24px 0' }}><HeroTypo /></Surface>
}
