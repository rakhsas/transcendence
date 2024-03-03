import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4200,
    host: true,
    hmr: {
      host: "10.0.2.15",
      protocol: "ws",
    }
  },
  plugins: [react()],
})
