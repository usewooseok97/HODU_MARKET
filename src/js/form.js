import { postRequest } from './api.js'

/**
 * 사용자 이름 유효성 검증을 수행하는 함수
 * @param {string} username - 검증할 사용자 이름
 */
export const fetchConsole = async (username) => {
  try {
    const data = await postRequest('accounts/validate-username/', {
      username: username,
    })
    console.log(data)
    return data
  } catch (error) {
    console.error('fetchConsole 에러:', error)
    throw error
  }
}

/**
 * form 제출 이벤트를 처리하는 함수
 */
export const handleFormSubmit = (formElement, inputElement) => {
  formElement.addEventListener('submit', (e) => {
    e.preventDefault()
    fetchConsole(inputElement.value)
  })
}
