// Loaded first by ds-entry.tsx. app/_utils/supabase/supabase.ts calls
// createClient() at module scope reading process.env, which is undefined in a
// browser IIFE — that threw at bundle init and stopped window.Lavabow from
// ever being assigned, blanking every preview. Placeholder values keep
// createClient from throwing on an empty URL; the preview has no backend, so
// data fetches simply fail and components render their empty/loading state.
const g = globalThis as unknown as { process?: { env: Record<string, string> } }
if (typeof g.process === 'undefined') {
  g.process = {
    env: {
      NEXT_PUBLIC_SUPABASE_URL: 'https://ds-preview.invalid',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'ds-preview',
    },
  }
}
export {}

// Next.js static image imports (`import logo from './logo.png'`) yield an
// object with a `.src` field. esbuild's dataurl loader yields the URL as a
// plain string instead, so `logo.src` was undefined and Logo/Marquee rendered
// broken images. Expose `.src` on data: URL strings only — narrow enough that
// nothing else on the page changes behaviour, and it returns exactly what the
// Next shape would have.
const S = String.prototype as unknown as Record<string, unknown>
if (!('src' in S)) {
  Object.defineProperty(String.prototype, 'src', {
    get(this: string) {
      return this.slice(0, 5) === 'data:' ? String(this) : undefined
    },
    enumerable: false,
    configurable: true,
  })
}
