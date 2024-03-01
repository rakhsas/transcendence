import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv';
// https://vitejs.dev/config/
export default defineConfig({
    // define: {
    //   ...dotenv.config().parsed
    // },
    server: {
      port: 4200,
      host: true
    },
    plugins: [react()],
  // }
})
