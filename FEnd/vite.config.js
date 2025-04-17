import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [
    react(),
    svgr()
  ],
  base: '/',
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    historyApiFallback: true
  },
  optimizeDeps: {
    exclude: ['@mui/x-date-pickers/AdapterDateFns']
  }
})
