import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
  plugins: [tailwindcss(), tanstackStart(), react()],
})
