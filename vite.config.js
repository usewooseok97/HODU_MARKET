import { defineConfig } from 'vite'
import { resolve } from 'path'
import { autoComponentsPlugin } from './vite-plugin-auto-components.js'

export default defineConfig({
  plugins: [
    autoComponentsPlugin({
      tagPrefix: 'hodu-',
      componentDir: 'src/component',
      debug: true, // 개발 시 로깅 활성화
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'src/pages/login/index.html'),
        // 페이지 추가할 때마다 여기에 등록
      },
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@js': resolve(__dirname, 'src/js'),
      '@component': resolve(__dirname, 'src/component'),
      '@pages': resolve(__dirname, 'src/pages'),
      // 폴더 추가할 때마다 여기에 등록
    },
  },
})
