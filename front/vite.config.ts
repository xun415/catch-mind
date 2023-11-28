import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@constants': path.resolve(__dirname, './src/libs/constants'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@util': path.resolve(__dirname, './src/libs/util'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@apis': path.resolve(__dirname, './src/apis'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@errors': path.resolve(__dirname, './src/libs/errors'),
      '@store': path.resolve(__dirname, './src/store'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@contexts': path.resolve(__dirname, './src/contexts')
    }
  },
  define: {
    // Some libraries use the global object, even though it doesn't exist in the browser.
    // Alternatively, we could add `<script>window.global = window;</script>` to index.html.
    // https://github.com/vitejs/vite/discussions/5912
    global: {},
  },
})
