import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Landing from './views/Landing.jsx'
import './index.css'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import AdminLayout from './Layouts/AdminLayout.jsx'
import Login from './views/Admin/Login.jsx'
import Dashboard from './views/Admin/Dashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider value={defaultSystem}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
)
