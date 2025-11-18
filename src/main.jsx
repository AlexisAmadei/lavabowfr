import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import Landing from './views/Landing.jsx'
import './index.css'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import Loading from './components/Design/Loading.jsx'
import { ADMIN_MENU_ITEMS } from './constants/menuItems.js'

// Dynamically import admin components
const Login = lazy(() => import('./views/Admin/Login.jsx'))
const Dashboard = lazy(() => import('./views/Admin/Dashboard.jsx'))
const AdminLayout = lazy(() => import('./Layouts/AdminLayout.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider value={defaultSystem}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={
            <Suspense fallback={<Loading />}>
              <AdminLayout />
            </Suspense>
          }>
            <Route path='login' element={
              <Suspense fallback={<Loading />}>
                <Login />
              </Suspense>
            } />
            <Route path='dashboard' element={
              <Suspense fallback={<Loading />}>
                <Dashboard />
              </Suspense>
            }>
              {/* Dynamically generate routes from menu items */}
              {ADMIN_MENU_ITEMS.map((item) => (
                <Route
                  key={item.path}
                  path={item.path.replace('/admin/dashboard/', '')}
                  element={<item.component />}
                />
              ))}
              {/* Redirect to first menu item by default */}
              <Route index element={<Navigate to={ADMIN_MENU_ITEMS[0].path.replace('/admin/dashboard/', '')} replace />} />
            </Route>
          </Route>
        </Routes>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
