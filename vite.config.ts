import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // No sourcemaps in production builds: .js.map files previously shipped
    // 9 MB of original source to anyone who opened DevTools.
    sourcemap: false,
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          convex: ['convex'],
          motion: ['framer-motion'],
        }
      }
    }
  }
})
