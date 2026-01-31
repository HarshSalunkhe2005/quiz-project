import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Vite looks for 'public' by default, but you can force it if it's failing:
  publicDir: 'public', 
})