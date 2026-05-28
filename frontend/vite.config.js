// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  // 🗺️ Path aliases - use @/components instead of ../../components
  resolve: {
    alias: {
      '@':            path.resolve(__dirname, './src'),
      '@components':  path.resolve(__dirname, './src/components'),
      '@pages':       path.resolve(__dirname, './src/pages'),
      '@context':     path.resolve(__dirname, './src/context'),
      '@services':    path.resolve(__dirname, './src/services'),
      '@utils':       path.resolve(__dirname, './src/utils'),
      '@hooks':       path.resolve(__dirname, './src/hooks'),
    },
  },

  // 🌐 Dev server config
  server: {
    port: 5173,
    open: true,
    // Proxy API calls to backend during development (avoids CORS)
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  // 📦 Build config
  build: {
    outDir:    'dist',
    sourcemap: false,
    minify:    'esbuild',
  },
})