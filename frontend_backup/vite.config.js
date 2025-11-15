import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       // your preferred port
    strictPort: false // allow Vite to move to next open port automatically
  }
})