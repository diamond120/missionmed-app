import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { getThemeVariables } from 'antd/dist/theme'
import path from 'path'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3001
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {}
    }),
    eslintPlugin({
      cache: false,
      include: ['./src//*.js', './src//*.jsx'],
      exclude: []
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: getThemeVariables({
          // dark: true,
          // compact: true,
        })
      }
    }
  },
  resolve: {
    alias: [
      // { find: /^~/, replacement: '' },
      { find: '~', replacement: path.resolve(__dirname, 'src') }
    ]
  }
})
