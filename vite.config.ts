import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/Portfolio-Website/', // 👈 This must match your exact repository name capitalization
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
