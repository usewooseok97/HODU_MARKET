import { defineConfig } from 'vite'
import { resolve } from 'path'
import { autoComponentsPlugin } from './vite-plugin-auto-components.js'

export default defineConfig({
  appType: 'mpa', // MPA 모드: SPA fallback 비활성화 (404 미들웨어가 작동하도록)

  plugins: [
    autoComponentsPlugin({
      tagPrefix: '', // 빈 문자열: 모든 태그를 폴더명-파일명 형식으로 처리
      componentDir: 'src/component',
      debug: true, // 개발 시 로깅 활성화
    }),
    // 404 페이지 자동 라우팅 플러그인
    {
      name: 'vite-plugin-404-fallback',
      configureServer(server) {
        return () => {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url

            // 1. 루트 경로('/')는 무조건 통과 (홈 화면)
            if (url === '/') {
              return next()
            }

            // 정적 파일, HMR, API 스킵 로직은 그대로 유지...
            if (
              url.match(
                /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map)$/
              )
            )
              return next()
            if (url.startsWith('/@')) return next()
            if (url.startsWith('/api')) return next()

            // 2. validPaths에서 '/' 제거 (중요!)
            const validPaths = [
              // '/',  <-- 이것을 삭제했습니다!
              '/index.html',
              '/src/pages/login/index.html',
              '/src/pages/login/',
              '/src/pages/regist/index.html',
              '/src/pages/regist/',
              '/src/pages/productDetail/index.html',
              '/src/pages/productDetail/',
              '/src/pages/shoppingCartPage/index.html',
              '/src/pages/shoppingCartPage/',
              '/src/pages/Payment/index.html',
              '/src/pages/Payment/',
              '/src/adminpages/SellerCenter/index.html',
              '/src/adminpages/SellerCenter/',
              '/src/adminpages/makeProduct/index.html',
              '/src/adminpages/makeProduct/',
              '/src/pages/page404/index.html', // 404 페이지 자체도 유효한 경로로 둡니다
              '/src/pages/page404/',
            ]

            // 경로가 유효하지 않으면 404 페이지 HTML 직접 반환
            if (
              !validPaths.some((path) => url === path || url.startsWith(path))
            ) {
              const fs = await import('fs')
              const path = await import('path')

              try {
                const notFoundPath = path.resolve(
                  process.cwd(),
                  'src/pages/page404/index.html'
                )

                // 파일이 진짜 있는지 확인 (디버깅용)
                if (!fs.existsSync(notFoundPath)) {
                  console.error('File not found at:', notFoundPath)
                  return next()
                }

                const html = fs.readFileSync(notFoundPath, 'utf-8')
                const transformed = await server.transformIndexHtml('/src/pages/page404/index.html', html)

                res.statusCode = 404
                res.setHeader('Content-Type', 'text/html; charset=utf-8')
                res.end(transformed)
                return
              } catch (error) {
                console.error('[404-fallback] Error:', error)
              }
            }

            next()
          })
        }
      },
    },
  ],

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'src/pages/login/index.html'),
        regist: resolve(__dirname, 'src/pages/regist/index.html'),
        productDetail: resolve(__dirname, 'src/pages/productDetail/index.html'),
        shoppingCart: resolve(
          __dirname,
          'src/pages/shoppingCartPage/index.html'
        ),
        payment: resolve(__dirname, 'src/pages/Payment/index.html'),
        sellerCenter: resolve(
          __dirname,
          'src/adminpages/SellerCenter/index.html'
        ),
        makeProduct: resolve(
          __dirname,
          'src/adminpages/makeProduct/index.html'
        ),
        page404: resolve(__dirname, 'src/pages/page404/index.html'),
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
