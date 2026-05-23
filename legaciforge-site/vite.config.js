import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // For GitHub Pages project sites the app is served from /<repo>/.
  base: process.env.PAGES_BASE || '/',
  plugins: [react(), tailwindcss()],
})
