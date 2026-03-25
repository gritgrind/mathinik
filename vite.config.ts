import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Mathinik',
        short_name: 'Mathinik',
        description:
          'Offline-first math adventures for Grade 1 to Grade 3 learners.',
        theme_color: '#f39b3f',
        background_color: '#fff7ea',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,webmanifest}'],
      },
    }),
  ],
})
