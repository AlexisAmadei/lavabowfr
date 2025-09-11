import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Landing from './views/Landing.jsx'
import './index.css'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <ChakraProvider value={defaultSystem}>
                <Routes>
                    <Route path="/" element={<Landing />} />
                </Routes>
            </ChakraProvider>
        </BrowserRouter>
    </StrictMode>,
)
