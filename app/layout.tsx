import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import Providers from './providers';
import '@/styles/index.css';
import { OpenPanelComponent } from '@openpanel/nextjs';

const OG_IMAGE =
  'https://ygwmuznptpmxwjwwiite.supabase.co/storage/v1/object/public/lavabowfr/pictures/1764201789525_DSCF2948.webp';

export const metadata: Metadata = {
  metadataBase: new URL('https://lavabow.fr'),
  title: 'LAVA BOW Official Website',
  description:
    "LAVA BOW - Lava Bow, c'est un trio de rock alternatif né à Asnières-sur-Seine, aux frontières du chaos sonore et de l'intime viscéral.",
  keywords: [
    'Lava Bow',
    'Lava Bow France',
    'Lava Bow rock alternatif',
    'Lava Bow Asnières-sur-Seine',
    'rock alternatif',
    'musique alternative',
    'trio rock',
    'rock français',
    'rock indépendant',
    'musique indépendante',
    'scène rock française',
  ],
  authors: [{ name: 'Lava Bow' }],
  alternates: { canonical: 'https://www.lavabow.fr' },
  verification: {
    google: '3aMAW-SNc-GARFgXVWC0UY2lQ_SbDohLcHENt-OGeXk',
  },
  openGraph: {
    title: 'LAVA BOW Official Website',
    description:
      "LAVA BOW - Lava Bow, c'est un trio de rock alternatif né à Asnières-sur-Seine, aux frontières du chaos sonore et de l'intime viscéral.",
    url: 'https://lavabow.fr',
    siteName: 'LAVA BOW',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LAVA BOW Official Website',
    description:
      "LAVA BOW - Lava Bow, c'est un trio de rock alternatif né à Asnières-sur-Seine, aux frontières du chaos sonore et de l'intime viscéral.",
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  appleWebApp: { title: 'LAVA BOW' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Phase 1 scaffold: legacy views still depend on react-router primitives that
// only work in the browser. Disable static prerendering until Phase 5 ports them
// to next/navigation. Reassess per-route after migration.
export const dynamic = 'force-dynamic';

const openPanelInit = `
window.op=window.op||function(){var n=[];return new Proxy(function(){arguments.length&&n.push([].slice.call(arguments))},{get:function(t,r){return"q"===r?n:function(){n.push([r].concat([].slice.call(arguments)))}} ,has:function(t,r){return"q"===r}}) }();
window.op('init', {
  apiUrl: 'https://openpanel.lavabow.fr/api',
  clientId: 'c9ccb6fa-48d7-4508-8c9e-a0db03349702',
  trackScreenViews: true,
  trackOutgoingLinks: true,
  trackAttributes: true,
});
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://kit.fontawesome.com" />
      </head>
      <body>
        <OpenPanelComponent
          clientId={process.env.NEXT_PUBLIC_OPENPANEL_ID ?? ''}
          apiUrl={process.env.NEXT_PUBLIC_OPENPANEL_URL ?? ''}
          trackScreenViews={true}
          trackOutgoingLinks={true}
          trackAttributes={true}
        />
        <Script
          src="https://openpanel.dev/op1.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://kit.fontawesome.com/36211f5750.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
