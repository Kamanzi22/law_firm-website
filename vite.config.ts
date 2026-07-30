import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // We register the service worker ourselves in main.tsx (with a
      // periodic update check), so skip the auto-injected register script.
      injectRegister: false,
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        // REPLACE: name/short_name/description/colors/icons once the real
        // brand assets are ready — see public/icons/ for placeholder icons.
        name: 'Demo & Partners Advocates',
        short_name: 'Demo & Partners',
        description: "Commercial law counsel built for Rwanda's growing economy.",
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        // A new deploy takes over immediately instead of waiting for every
        // open tab to fully close — this is what was causing "I don't see
        // the changes" after a push until a hard refresh.
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
})
