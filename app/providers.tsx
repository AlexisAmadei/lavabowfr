'use client';

import { lazy, Suspense, type PropsWithChildren } from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { GlobalVarProvider } from '@/contexts/GlobalContext';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import EmotionRegistry from './emotion-registry';

const SpeedInsights = lazy(() =>
  import('@vercel/speed-insights/next').then((m) => ({ default: m.SpeedInsights }))
);

export default function Providers({ children }: PropsWithChildren) {
  return (
    <EmotionRegistry>
      <ChakraProvider value={defaultSystem}>
        <GlobalVarProvider>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </GlobalVarProvider>
        <Suspense fallback={null}>
          <SpeedInsights />
        </Suspense>
      </ChakraProvider>
    </EmotionRegistry>
  );
}
