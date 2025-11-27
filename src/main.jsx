import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Landing from './views/Landing.jsx'
import './index.css'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import Loading from './components/Design/Loading.jsx'
import Privacy from './views/Privacy.jsx'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/react"

// Dynamically import admin components
const Login = lazy(() => import('./views/Admin/Login.jsx'));
const Dashboard = lazy(() => import('./views/Admin/Dashboard.jsx'));
const AdminLayout = lazy(() => import('./Layouts/AdminLayout.jsx'));
const AdminContent = lazy(() => import('./views/Admin/AdminContent.jsx'));
const AdminUsers = lazy(() => import('./views/Admin/AdminUsers.jsx'));
const AdminMerchandise = lazy(() => import('./views/Admin/AdminMerchandise.jsx'));
const CloudStatus = lazy(() => import('./views/Admin/CloudStatus/CloudStatus.jsx'));
const Unsubscribe = lazy(() => import('./views/Unsubscribe.jsx'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider value={defaultSystem}>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={
            <Suspense fallback={<Loading />}>
              <AdminLayout />
            </Suspense>
          }>
            <Route path='login' index element={
              <Suspense fallback={<Loading />}>
                <Login />
              </Suspense>
            } />
            <Route path='dashboard' element={
              <Suspense fallback={<Loading />}>
                <Dashboard />
              </Suspense>
            }>
              <Route index element={
                <Suspense fallback={<Loading />}>
                  <AdminContent />
                </Suspense>
              } />
              <Route path='users' element={
                <Suspense fallback={<Loading />}>
                  <AdminUsers />
                </Suspense>
              } />
              <Route path='merchandise' element={
                <Suspense fallback={<Loading />}>
                  <AdminMerchandise />
                </Suspense>
              } />
              <Route path='supabase-status' element={
                <Suspense fallback={<Loading />}>
                  <CloudStatus />
                </Suspense>
              } />
            </Route>
          </Route>

          <Route path='/privacy' element={
            <Suspense fallback={<Loading />}>
              <Privacy />
            </Suspense>
          } />

          <Route path="/unsubscribe" element={
            <Suspense fallback={<Loading />}>
              <Unsubscribe />
            </Suspense>
          } />
        </Routes>
      </ChakraProvider>
    </BrowserRouter>
    <Analytics />
    <SpeedInsights />
  </StrictMode>,
)
