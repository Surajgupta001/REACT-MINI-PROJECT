import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Revert to using the Vite plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], // Add the tailwindcss plugin here
})
