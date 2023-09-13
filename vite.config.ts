import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr' 
// import vitePluginImp from 'vite-plugin-imp'
import { getThemeVariables } from 'antd/dist/theme';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3000
  },
  plugins: [
    react(),
    svgr({ 
      svgrOptions: {
        // svgr options
      },
    }),
    // vitePluginImp({
    //   libList: [
    //     {
    //       libName: 'antd',
    //       style: (name) => `antd/es/${name}/style`,
    //     },
    //   ],
    // }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: getThemeVariables({
         // dark: true,
          // compact: true,
        }),
      },
    }
  },
  resolve: {
    alias: [
      { find: /^~/, replacement: '' },
    ],
  }
   
})
