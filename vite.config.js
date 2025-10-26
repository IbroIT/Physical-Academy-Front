import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  server: {
  proxy: {
    '/api': {
      target: 'https://physical-academy-backend-3dccb860f75a.herokuapp.com',
      changeOrigin: true,
    },
  },
}
})
