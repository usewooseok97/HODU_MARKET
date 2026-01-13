import { postRequest } from '../api.js'

/**
 * 구매자 회원가입
 * @param {object} userData - 회원가입 데이터
 * @returns {Promise<object>}
 */
export const signupBuyer = async (userData) => {
  try {
    const data = await postRequest('accounts/buyer/signup/', userData)
    return data
  } catch (error) {
    console.error('구매자 회원가입 실패:', error)
    throw error
  }
}

/**
 * 판매자 회원가입
 * @param {object} sellerData - 판매자 회원가입 데이터
 * @returns {Promise<object>}
 */
export const signupSeller = async (sellerData) => {
  try {
    const data = await postRequest('accounts/seller/signup/', sellerData)
    return data
  } catch (error) {
    console.error('판매자 회원가입 실패:', error)
    throw error
  }
}

/**
 * 아이디 중복 검사
 * @param {string} username - 검증할 아이디
 * @returns {Promise<object>}
 */
export const validateUsername = async (username) => {
  try {
    const data = await postRequest('accounts/validate-username/', {
      username,
    })
    return data
  } catch (error) {
    console.error('아이디 검증 실패:', error)
    throw error
  }
}

/**
 * 사업자등록번호 검증
 * @param {string} registrationNumber - 사업자등록번호
 * @returns {Promise<object>}
 */
export const validateRegistrationNumber = async (registrationNumber) => {
  try {
    const data = await postRequest(
      'accounts/seller/validate-registration-number/',
      {
        company_registration_number: registrationNumber,
      }
    )
    return data
  } catch (error) {
    console.error('사업자등록번호 검증 실패:', error)
    throw error
  }
}

/**
 * 회원가입 폼 submit 핸들러
 * @param {HTMLFormElement} formElement - form 엘리먼트
 */
export const handleSignupSubmit = (formElement) => {
  if (!formElement) {
    console.error('Form element not found')
    return
  }

  formElement.addEventListener('submit', async (e) => {
    e.preventDefault()

    try {
      // FormData 수집
      // eslint-disable-next-line no-undef
      const formData = new FormData(formElement)
      const userData = Object.fromEntries(formData)

      // userType 추출
      const userType = userData.userType

      let result
      if (userType === 'buyer') {
        result = await signupBuyer(userData)
      } else if (userType === 'seller') {
        result = await signupSeller(userData)
      } else {
        throw new Error('Invalid user type')
      }

      showValidation('회원가입이 완료되었습니다!', false)
      console.log('회원가입 성공:', result)

      // 로그인 페이지로 이동
      setTimeout(() => {
        window.location.href = '/src/pages/login/'
      }, 1000)
    } catch (error) {
      // API 에러 메시지 추출
      let errorMessage = '회원가입에 실패했습니다.'

      if (error.response) {
        // 서버에서 반환한 에러 메시지 사용
        const errorData = await error.response.json()
        if (errorData.error) {
          errorMessage = errorData.error
        } else if (typeof errorData === 'object') {
          // 필드별 에러 메시지 처리
          const errors = Object.values(errorData).flat()
          errorMessage = errors.join(', ')
        }
      } else if (error.message) {
        errorMessage = error.message
      }

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
