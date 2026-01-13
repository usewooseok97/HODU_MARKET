// 웹 컴포넌트는 vite-plugin-auto-components에서 자동으로 import됩니다

import { handleLoginSubmit } from '../../js/auth/login.js'

// 로그인 폼 핸들러 설정
const loginForm = document.querySelector('#login-form')
if (loginForm) {
  handleLoginSubmit(loginForm, 'BUYER')
} else {
  console.warn('Login form not found')
}
