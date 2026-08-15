/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
const proxyUrl = 'http://localhost:3000';
const apiProxy = {
  '/api': {
    target: proxyUrl,
    changeOrigin: true,
  },
  '/socket.io': {
    target: proxyUrl,
    changeOrigin: true,
    ws: true,
  },
};

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/app/web',

  server: {
    port: 4200,
    host: 'localhost',
    proxy: apiProxy,
    allowedHosts: ['app.tiven.xyz'],
  },

  preview: {
    host: 'localhost',
    port: 4200,
    strictPort: true,
    proxy: apiProxy,
    allowedHosts: ['app.tiven.xyz'],
  },

  plugins: [react(), tailwindcss(), tsconfigPaths()],

  resolve: {
    alias: {
      '@org/constants': path.resolve(__dirname, '../../packages/constants/src'),
      '@org/zod': path.resolve(__dirname, '../../packages/zod/src'),
      '@org/core': path.resolve(__dirname, '../../packages/core/src'),
      '@org/web-utils': path.resolve(__dirname, '../../packages/web-utils/src'),
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
