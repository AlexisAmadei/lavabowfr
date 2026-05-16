import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  // Phase 1 scaffold: legacy Vite-typed code in src/ still produces type errors
  // (e.g. StaticImageData for static asset imports). These are addressed in later
  // phases as components are migrated. Re-enable strict type-checking then.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ygwmuznptpmxwjwwiite.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default config;
