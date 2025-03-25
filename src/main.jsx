import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.jsx'
import AppRoutes from './Routes/routes.jsx'
import {AutheProvider}  from './Context/Context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AutheProvider>
      <AppRoutes />
    </AutheProvider>
  </StrictMode>,
)
