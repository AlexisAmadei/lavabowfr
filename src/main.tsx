import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useRoutes } from 'react-router'
import './index.css'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { routes } from './routes/routes'
import { GlobalVarProvider } from './contexts/GlobalContext'
import { LanguageProvider } from './i18n/LanguageContext'

// Lazy load analytics to prevent blocking FCP
const Analytics = lazy(() => import('@vercel/analytics/react').then(m => ({ default: m.Analytics })));
const SpeedInsights = lazy(() => import('@vercel/speed-insights/react').then(m => ({ default: m.SpeedInsights })));

function App() {
  return useRoutes(routes);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider value={defaultSystem}>

        <GlobalVarProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </GlobalVarProvider>

        <Suspense fallback={null}>
          <Analytics />
          <SpeedInsights />
        </Suspense>

      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
