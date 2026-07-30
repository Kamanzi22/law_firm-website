import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'
import { DataProvider } from './lib/DataProvider'

const queryClient = new QueryClient()

// Checks for a new deployed version every hour while the app stays open
// (not just on the next cold load), and — combined with skipWaiting +
// clientsClaim in vite.config.ts — applies it immediately.
registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (!registration) return
    setInterval(() => {
      registration.update()
    }, 60 * 60 * 1000)
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <App />
      </DataProvider>
    </QueryClientProvider>
  </StrictMode>,
)
