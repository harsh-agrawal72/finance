import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'chartjs';
            if (id.includes('react') || id.includes('framer-motion') || id.includes('lucide-react')) return 'vendor';
            return 'core';
          }
        }
      }
    }
  }
})
