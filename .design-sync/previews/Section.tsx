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

import { Section, LavaTypo, LavaButton } from 'lavabowfr'

/** A titled section. The title renders as an h1 through LavaTypo. */
export function WithTitle() {
  return (
    <Surface style={{ padding: 0, overflow: 'hidden' }}>
      <Section id="contact" title="Contact">
        <LavaTypo variant="p" textAlign="center">
          Pour toute demande de booking, écrivez-nous.
        </LavaTypo>
      </Section>
    </Surface>
  )
}

/** `bgColor` takes any CSS colour, including the brand token the contact section uses. */
export function BrandBackground() {
  return (
    <Surface style={{ padding: 0, overflow: 'hidden' }}>
      <Section id="brand" bgColor="var(--Background-bg-brand)" position="relative">
        <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <LavaTypo variant="h2">Newsletter</LavaTypo>
          <LavaTypo variant="p" textAlign="center">Reste au courant de nos prochaines dates.</LavaTypo>
          <LavaButton variant="outlined">S&apos;inscrire</LavaButton>
        </div>
      </Section>
    </Surface>
  )
}

/** `contained` caps the section at 1700px instead of letting it run full-bleed. */
export function Contained() {
  return (
    <Surface style={{ padding: 0, overflow: 'hidden' }}>
      <Section id="music" contained bgColor="#141414">
        <div style={{ padding: '32px 24px' }}>
          <LavaTypo variant="h3">Nos singles</LavaTypo>
        </div>
      </Section>
    </Surface>
  )
}
