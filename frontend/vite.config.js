import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       // Dev server port
    open: true,       // Automatically opens browser
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Shortcut for src imports
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";` // Optional global SCSS
      },
    },
  },
});
