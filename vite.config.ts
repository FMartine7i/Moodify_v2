import { defineConfig } from 'vite'
export default defineConfig({
  base: '/',
  root: 'public',
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
    rollupOptions: {
      input: {
        main: 'public/index.html',
        songs: 'public/songs.html',
      }
    }
  },
  server: {
    proxy: {
        '/api': 'http://localhost:3000'
    }
  }
})