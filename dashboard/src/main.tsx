/**
 * @file main.tsx
 * @description Application entry point for the CDIF Secure Data Pipeline Dashboard.
 * Initializes the React root and mounts the primary App container.
 * @version 1.1.0
 * @author Mission Control
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
