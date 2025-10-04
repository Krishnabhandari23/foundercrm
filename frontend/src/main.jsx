import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'

// Global error handlers: these will log errors to the browser console (visible in DevTools)
window.addEventListener('error', (event) => {
  // event.error may be undefined for some script errors; still log the event
  console.error('[Global] Uncaught error:', event.error || event.message, event)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Global] Unhandled promise rejection:', event.reason, event)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)