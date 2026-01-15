import { login, showValidation } from '@/js/auth/login'

// DOM 요소 선택
const loginForm = document.getElementById('loginForm')

// 로그인 폼 제출 처리
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    // ✅ name 속성으로 값 가져오기 (input-id 컴포넌트가 자동으로 name 추가함)
    const formData = new FormData(loginForm)
    const username = formData.get('username')
    const password = formData.get('password')

    if (!username || !password) {
      showValidation('아이디와 비밀번호를 입력해주세요.', true)
      return
    }

    try {
      await login(username, password, 'BUYER')
      showValidation('로그인 성공!', false)
      console.log('로그인 성공')

      // 메인 페이지로 이동
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } catch (error) {
      const errorMessage =
        error.message || '로그인에 실패했습니다. 다시 시도해주세요.'
      showValidation(errorMessage, true)
    }
  })
} else {
  console.warn('Login form not found')
}
