import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Landing from './views/Landing.jsx'
import './index.css'
import { ChakraProvider, defaultSystem, Spinner } from '@chakra-ui/react'

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
            <Suspense fallback={<Spinner size="xl" />}>
              <AdminLayout />
            </Suspense>
          }>
            <Route path='login' index element={
              <Suspense fallback={<Spinner size="xl" />}>
                <Login />
              </Suspense>
            } />
            <Route path='dashboard' element={
              <Suspense fallback={<Spinner size="xl" />}>
                <Dashboard />
              </Suspense>
            } />
          </Route>
        </Routes>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
