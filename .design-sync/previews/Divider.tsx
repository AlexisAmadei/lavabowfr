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

import { Divider, LavaTypo } from 'lavabowfr'

/** Solid rules, the default separator inside a ticket or a menu. */
export function Solid() {
  return (
    <Surface>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <LavaTypo variant="p" size="14px">Prix</LavaTypo>
        <Divider orientation="horizontal" color="white" />
        <LavaTypo variant="p" size="14px">Date</LavaTypo>
      </div>
    </Surface>
  )
}

/** Dashed rules draw an SVG pattern, so `dashArray` sets dash and gap in px. */
export function Dashed() {
  return (
    <Surface>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Divider orientation="horizontal" color="#ffffffd8" dashed thickness="0.6px" dashArray="2 2" />
        <Divider orientation="horizontal" color="#ffffffd8" dashed thickness="2px" dashArray="8 8" />
        <Divider orientation="horizontal" color="#ffffffd8" dashed thickness="2px" dashArray="8 8" rounded />
      </div>
    </Surface>
  )
}

/** Vertical orientation fills its container's height. EventTicket uses this to split the stub. */
export function Vertical() {
  return (
    <Surface style={{ height: 180 }}>
      <div style={{ display: 'flex', gap: 24, height: 130, alignItems: 'stretch' }}>
        <LavaTypo variant="p" size="14px">Billet</LavaTypo>
        <Divider orientation="vertical" color="white" />
        <LavaTypo variant="p" size="14px">Souche</LavaTypo>
        <Divider orientation="vertical" color="#ffffffd8" dashed thickness="2px" dashArray="8 8" rounded />
        <LavaTypo variant="p" size="14px">Talon</LavaTypo>
      </div>
    </Surface>
  )
}
