import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'; // Essa linha precisa ser adicionada para usar resolve

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@connect': resolve(__dirname, 'server/connect'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages')
    }
  },
})

