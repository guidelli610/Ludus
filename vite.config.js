import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'; // Essa linha precisa ser adicionada para usar resolve

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@connect': resolve(__dirname, 'src/controller'),
      '@components': resolve(__dirname, 'src/view/components'),
      '@pages': resolve(__dirname, 'src/view/pages'),
      '@model': resolve(__dirname, 'src/model'),
      '@controller': resolve(__dirname, 'src/controller')
    }
  },
})