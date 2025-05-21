import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()]
  ,
  define: {
    "process.env.VITE_SUPABASE_URL": JSON.stringify(process.env.VITE_SUPABASE_URL),
    "process.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
  },
})
