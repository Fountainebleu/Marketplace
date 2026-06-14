import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const productsProxy = process.env.VITE_PROXY_PRODUCTS ?? 'http://localhost:5222';
const ordersProxy = process.env.VITE_PROXY_ORDERS ?? 'http://localhost:5180';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
    },
  },
  server: {
    host: true,
    proxy: {
      '/api/products': {
        target: productsProxy,
        changeOrigin: true,
      },
      '/api/orders': {
        target: ordersProxy,
        changeOrigin: true,
      },
    },
  },
});
