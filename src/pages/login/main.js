// ✅ 상대 경로로 수정 (폴더 구조에 맞게)
import { login, showValidation } from '@/js/auth/login'

// DOM 요소 선택
const loginForm = document.getElementById('loginForm')

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    // ✅ 커스텀 컴포넌트(<input-id>) 안에 들어있는 "진짜 input"을 직접 찾기
    const usernameInput = loginForm.querySelector('input[name="username"]')
    const passwordInput = loginForm.querySelector('input[name="password"]')

    // 혹시 input을 못 찾는 경우(구조가 바뀌었거나 name이 없을 때)
    if (!usernameInput || !passwordInput) {
      showValidation('입력칸을 찾지 못했습니다. name 속성을 확인해주세요.', true)
      console.warn('usernameInput or passwordInput not found')
      return
    }

    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()

    // ✅ 아이디 누락: 아이디칸 초기화 + 포커스 이동
    if (!username) {
      showValidation('아이디를 입력해주세요.', true)
      usernameInput.value = ''
      usernameInput.focus()
      return
    }

    // ✅ 비밀번호 누락: 비번칸 초기화 + 포커스 이동
    if (!password) {
      showValidation('비밀번호를 입력해주세요.', true)
      passwordInput.value = ''
      passwordInput.focus()
      return
    }

    try {
      // 탭 구분 없이 로그인 (판매자 여부는 API로 자동 확인)
      await login(username, password)
      showValidation('로그인 성공!', false)
      console.log('로그인 성공')

      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } catch (error) {
      const errorMessage =
        error?.message || '로그인에 실패했습니다. 다시 시도해주세요.'
      showValidation(errorMessage, true)

      // ✅ 로그인 실패(불일치) 시: 보통 비밀번호만 초기화 + 포커스 이동
      passwordInput.value = ''
      passwordInput.focus()
    }
  })
} else {
  console.warn('Login form not found')
}