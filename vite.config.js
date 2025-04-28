import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES
  ? "en-vocabulary"
  : "./",  
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
})
