import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build'

  return {
    plugins: [react(), tailwindcss(), svgr()],
    base: isProduction ? '/react-layered-dialog/' : '/',
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
