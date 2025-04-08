import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'context': path.resolve(__dirname, './src/context')
    }
  },
  server: {
    proxy: {
      // Proxy pour les requêtes API
      '/api': {
        target: 'http://localhost:3000', // Remplacez par l'URL de votre backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      },
      // Vous pouvez ajouter d'autres proxies si nécessaire
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    },
    port: 5173, // Port du serveur de développement
    open: true // Ouvre le navigateur automatiquement
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});