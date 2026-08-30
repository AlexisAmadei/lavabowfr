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

import { ContextMenu, Logo, LavaTypo } from 'lavabowfr'

// ContextMenu wraps its children in a right-click trigger. The panel it opens
// (brand asset downloads) only mounts on a contextmenu event and takes no
// `open` prop, so a static card shows the trigger surface, not the open panel.
/** The brand lockup wrapped as a right-click target. */
export function Default() {
  return (
    <Surface>
      <ContextMenu>
        <div style={{
          display: 'flex', gap: 12, alignItems: 'center', padding: 16,
          border: '1px dashed #ffffff40', borderRadius: 12, cursor: 'context-menu',
        }}>
          <Logo h="40" w="40" />
          <LavaTypo variant="h4">Clic droit pour les ressources de marque</LavaTypo>
        </div>
      </ContextMenu>
    </Surface>
  )
}

/** Any subtree can be the trigger; here the whole hero block is wrapped. */
export function WrappingASection() {
  return (
    <Surface>
      <ContextMenu>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <LavaTypo variant="h2">Lava Bow</LavaTypo>
          <LavaTypo variant="p" textAlign="center">Rock français</LavaTypo>
        </div>
      </ContextMenu>
    </Surface>
  )
}
