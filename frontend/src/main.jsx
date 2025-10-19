import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { loadPolyfills } from './utils/browserCompatibility.jsx'

// Load polyfills before rendering the app
loadPolyfills().then(() => {
  const rootElement = document.getElementById('root')
  
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  } else {
    console.error('Failed to find the root element')
  }
}).catch(error => {
  console.error('Failed to load polyfills:', error)
  // Fallback to rendering without polyfills
  const rootElement = document.getElementById('root')
  
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  } else {
    console.error('Failed to find the root element')
  }
})
