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

import { Toaster, toaster, LavaButton } from 'lavabowfr'

// <Toaster /> is the singleton mount point: render it once near the app root,
// then call toaster.create(...) from anywhere. It portals to document.body,
// which is why the toasts appear outside this card's own box.
/** The three toast types LavaInput raises, pinned open. */
export function Types() {
  React.useEffect(() => {
    // Deferred: the toast store only accepts entries once <Toaster />'s own
    // machine has started, which happens after this effect's first tick.
    const t = setTimeout(() => {
      toaster.create({ title: 'Merci ! Tu es inscrit(e) à la newsletter.', type: 'success', duration: 600000 })
      toaster.create({ title: 'Tu es déjà inscrit(e) à la newsletter !', type: 'info', duration: 600000 })
      toaster.create({ title: 'Cette adresse email est invalide.', type: 'error', duration: 600000 })
    }, 250)
    return () => { clearTimeout(t); toaster.dismiss() }
  }, [])
  return (
    <Surface style={{ minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <LavaButton
          variant="outlined"
          onClick={() => toaster.create({ title: 'Merci !', type: 'success' })}
        >
          Déclencher un toast
        </LavaButton>
      </div>
      <Toaster />
    </Surface>
  )
}
