import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Dev proxy to avoid CORS and allow httpOnly cookies.
      "/api/v1": {
        target: "http://localhost:9000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})