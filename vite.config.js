import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  server: {
    proxy: {
      "/code": {
        target: "https://asirsalewala.atlassian.net",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/code/, ""),
      },
    },
  },
  plugins: [react()],
})