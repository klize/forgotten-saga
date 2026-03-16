import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import patchNotes from './vite-plugin-patch-notes.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), patchNotes()],
  base: './',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
})
