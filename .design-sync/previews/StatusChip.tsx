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

import { StatusChip, LavaTypo } from 'lavabowfr'

// StatusChip is absolutely positioned (top:-10px, right:12), so it is designed
// to pin onto a positioned card rather than stand on its own.
const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    position: 'relative', width: 200, height: 100, background: '#1c1c1c',
    borderRadius: 12, padding: 16, boxSizing: 'border-box',
  }}>
    {children}
  </div>
)

/** The two states the chip renders: `active` and `inactive`. Any other value renders an empty chip. */
export function States() {
  return (
    <Surface style={{ paddingTop: 32 }}>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <Card>
          <StatusChip status="active" />
          <LavaTypo variant="h4">Concert Paris</LavaTypo>
        </Card>
        <Card>
          <StatusChip status="inactive" />
          <LavaTypo variant="h4">Concert Lyon</LavaTypo>
        </Card>
      </div>
    </Surface>
  )
}
