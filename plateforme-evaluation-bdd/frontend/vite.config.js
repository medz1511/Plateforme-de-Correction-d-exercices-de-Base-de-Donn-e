import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Ajout de l'import path

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias pour les imports absolus
      'context': path.resolve(__dirname, './src/context') // Alias spécifique pour le contexte
    }
  }
});