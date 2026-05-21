import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/webhook-test': {
        target: 'https://n8n.unth.ai',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/.test(id)) return 'react-vendor'
          if (/[\\/]node_modules[\\/]framer-motion[\\/]/.test(id)) return 'framer'
          if (/[\\/]node_modules[\\/]lucide-react[\\/]/.test(id)) return 'icons'
          if (/[\\/]node_modules[\\/]react-helmet-async[\\/]/.test(id)) return 'seo'
          if (/[\\/]node_modules[\\/]date-fns[\\/]/.test(id)) return 'date'
          return undefined
        }
      }
    }
  }
})
