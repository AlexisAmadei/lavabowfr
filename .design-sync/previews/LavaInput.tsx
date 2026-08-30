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

import { LavaInput, LavaTypo } from 'lavabowfr'

// LavaInput is a controlled newsletter field: it owns the email state but the
// caller owns the error flag, so every usage needs a small stateful host.
// This mirrors how Newsletter.tsx wires it.
const Host = ({ children }: {
  children: (error: boolean, setError: React.Dispatch<React.SetStateAction<boolean>>) => React.ReactNode
}) => {
  const [error, setError] = React.useState(false)
  return <>{children(error, setError)}</>
}

/** The default newsletter field: underlined, with the arrow submit button in the end slot. */
export function Default() {
  return (
    <Surface>
      <Host>{(error, setError) => (
        <LavaInput placeholder="ton@email.com" error={error} setError={setError} />
      )}</Host>
    </Surface>
  )
}

// No `Invalid` cell: passing error={true} renders byte-identical to the default.
// The Input hardcodes borderColor/borderBottomColor, which overrides the
// Field.Root invalid styling, so the error state is only ever communicated by
// the toast LavaInput raises.

/** `liquidGlass` swaps the underline for the rounded GlassSurface treatment. */
export function LiquidGlass() {
  return (
    <Surface style={{ background: '#241024' }}>
      <Host>{(error, setError) => (
        <LavaInput placeholder="ton@email.com" liquidGlass error={error} setError={setError} />
      )}</Host>
    </Surface>
  )
}

/** In context: the newsletter block as Newsletter.tsx composes it. */
export function InNewsletter() {
  return (
    <Surface>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <LavaTypo variant="h2">Newsletter</LavaTypo>
        <LavaTypo variant="p" styles={{ textAlign: 'center' }}>
          Reste au courant de nos prochaines dates.
        </LavaTypo>
        <Host>{(error, setError) => (
          <LavaInput placeholder="ton@email.com" error={error} setError={setError} />
        )}</Host>
      </div>
    </Surface>
  )
}
