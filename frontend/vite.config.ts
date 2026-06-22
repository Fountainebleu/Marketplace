import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const productsProxy = env.VITE_PROXY_PRODUCTS || 'http://localhost:5222';
  const ordersProxy = env.VITE_PROXY_ORDERS || 'http://localhost:5180';

  return {
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
  };
});
