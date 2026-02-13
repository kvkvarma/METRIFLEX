import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from '../context/AuthContext.jsx'
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
       <TooltipProvider>
      <App />
    </TooltipProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
