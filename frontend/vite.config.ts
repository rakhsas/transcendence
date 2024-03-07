import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // port: 4200,
    host: '0.0.0.0',
    // hmr: {
    //   host: "10.14.58.42",
    //   protocol: "ws",
    // },
  },
  plugins: [react()],
})
