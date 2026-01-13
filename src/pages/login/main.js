// 웹 컴포넌트는 vite-plugin-auto-components에서 자동으로 import됩니다

import { login, showValidation } from '@/js/auth/login'

// DOM 요소 선택 - ID 값만 변경하면 전체 동작 변경 가능
const loginForm = document.getElementById('loginForm')
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const loginTypeRadios = document.querySelectorAll('input[name="loginType"]')

// 현재 선택된 로그인 타입 가져오기
const getSelectedLoginType = () => {
  const checkedRadio = Array.from(loginTypeRadios).find(
    (radio) => radio.checked
  )
  return checkedRadio ? checkedRadio.value : 'BUYER'
}

// 로그인 타입 변경 시 로그 출력
loginTypeRadios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    console.log('로그인 타입 변경:', e.target.value)
  })
})

// 로그인 폼 제출 처리
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const username = usernameInput.value
    const password = passwordInput.value
    const loginType = getSelectedLoginType()

    if (!username || !password) {
      showValidation('아이디와 비밀번호를 입력해주세요.', true)
      return
    }

    try {
      await login(username, password, loginType)
      showValidation('로그인 성공!', false)
      console.log('로그인 성공')
      // 메인 페이지로 이동
      // setTimeout(() => {
      //   window.location.href = '/'
      // }, 500)
    } catch (error) {
      const errorMessage =
        error.message || '로그인에 실패했습니다. 다시 시도해주세요.'
      showValidation(errorMessage, true)
    }
  })
} else {
  console.warn('Login form not found')
}
