import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // const env = loadEnv(mode, process.cwd(), '');
  // return {
  //   define: {
  //     'process.env': env
  //   },
    server: {
      port: 4200,
      host: true
    },
    plugins: [react()],
  // }
})
