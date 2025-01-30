import { defineConfig } from 'vite'
export default defineConfig({
  base: '/',
  root: '.',
  css: {
    preprocessorOptions: {
      scss: {
          additionalData: ''
      }
    }
  },
  build: {
    outDir: '../dist/public',
    emptyOutDir: true,
  },
  server: {
    proxy: {
        '/api': 'http://localhost:3000'
    }
  }
})