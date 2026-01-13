import { postRequest } from '../api.js'
import { saveToken, removeTokens, getAccessToken } from './token.js'

/**
 * 로그인 API 호출
 * @param {string} username - 사용자 아이디
 * @param {string} password - 비밀번호
 * @param {string} loginType - 'BUYER' 또는 'SELLER'
 * @returns {Promise<object>} 사용자 정보 및 토큰
 */
export const login = async (username, password, loginType = 'BUYER') => {
  try {
    const data = await postRequest('accounts/login/', {
      username,
      password,
      login_type: loginType,
    })

    // 토큰 저장
    if (data.access && data.refresh) {
      saveToken(data.access, data.refresh)
    }

    return data
  } catch (error) {
    console.error('로그인 실패:', error)
    throw error
  }
}

/**
 * 로그아웃 처리
 */
export const logout = () => {
  removeTokens()
  window.location.href = '/src/pages/login/'
}

/**
 * 로그인 상태 확인
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getAccessToken()
}

/**
 * 로그인 폼 submit 핸들러
 * @param {HTMLFormElement} formElement - form 엘리먼트
 * @param {string} loginType - 'BUYER' 또는 'SELLER'
 */
export const handleLoginSubmit = (formElement, loginType = 'BUYER') => {
  if (!formElement) {
    console.error('Form element not found')
    return
  }

  formElement.addEventListener('submit', async (e) => {
    e.preventDefault()

    const username = formElement.querySelector('[name="username"]')?.value
    const password = formElement.querySelector('[name="password"]')?.value

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
}

/**
 * 검증/에러 메시지 표시
 * @param {string} message - 표시할 메시지
 * @param {boolean} isError - 에러 여부 (true: 에러, false: 성공)
 */
export const showValidation = (message, isError = true) => {
  // validation-message 요소가 있으면 사용
  const validationElement = document.querySelector('.validation-message')

  if (validationElement) {
    validationElement.textContent = message
    validationElement.style.display = 'block'
    validationElement.style.color = isError ? 'red' : 'green'
  } else {
    // 없으면 콘솔에 출력
    if (isError) {
      console.error(message)
    } else {
      console.log(message)
    }
  }
}
