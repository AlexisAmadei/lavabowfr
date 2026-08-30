'use client'

// Preview-only provider for /design-sync. Mirrors the ChakraProvider layer of
// app/providers.tsx, which is the only context the Design + ui components read.
// (LanguageContext ships a populated default value, so useTranslation works
// unwrapped; GlobalVarProvider is not read by any component in this scope.)
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import type { PropsWithChildren } from 'react'

export function DsProvider({ children }: PropsWithChildren) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
}
