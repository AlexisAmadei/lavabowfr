import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      'assets': '/src/assets',
      'components': '/src/components',
      'hooks': '/src/hooks',
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'chakra-vendor': ['@chakra-ui/react'],
          'animation-vendor': ['gsap', 'motion'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
