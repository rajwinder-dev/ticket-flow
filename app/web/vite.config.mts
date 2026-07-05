/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/app/web',

  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },

  preview: {
    port: 4200,
    host: 'localhost',
  },

  plugins: [react(), tailwindcss(), tsconfigPaths()],

  resolve: {
    alias: {
      '@org/constants': path.resolve(__dirname, '../../packages/constants/src'),
      '@org/zod': path.resolve(__dirname, '../../packages/zod/src'),
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,

    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
