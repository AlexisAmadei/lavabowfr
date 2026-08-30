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

import { Tooltip, LavaButton } from 'lavabowfr'

// `portalled={false}` keeps the tooltip inside this card instead of escaping to
// document.body, and `open` pins it so the state is visible in a static render.
/** The default tooltip, pinned open over its trigger. */
export function Default() {
  return (
    <Surface style={{ paddingTop: 64, paddingBottom: 96 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Tooltip content="Ouvre la billetterie" open portalled={false}>
          <LavaButton variant="outlined">Billetterie</LavaButton>
        </Tooltip>
      </div>
    </Surface>
  )
}

/** `showArrow` adds the pointer tip aimed at the trigger. */
export function WithArrow() {
  return (
    <Surface style={{ paddingTop: 64, paddingBottom: 96 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Tooltip content="Télécharger le press kit" showArrow open portalled={false}>
          <LavaButton color="secondary">Press kit</LavaButton>
        </Tooltip>
      </div>
    </Surface>
  )
}

/** `disabled` renders the trigger alone, with no tooltip attached. */
export function Disabled() {
  return (
    <Surface>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Tooltip content="Jamais affiché" disabled>
          <LavaButton variant="text">Sans infobulle</LavaButton>
        </Tooltip>
      </div>
    </Surface>
  )
}
