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
      // 웹 컴포넌트에서 직접 값 가져오기
      const username = document.getElementById('username')?.getValue() || ''
      const password = document.getElementById('password')?.getValue() || ''
      const name = document.getElementById('name')?.getValue() || ''

      // 전화번호 조합
      const phonePrefix =
        document.getElementById('phonePrefix')?.getValue() || '010'
      const phoneMiddle =
        document.getElementById('phoneMiddle')?.getValue() || ''
      const phoneLast = document.getElementById('phoneLast')?.getValue() || ''
      const phone_number = `${phonePrefix}${phoneMiddle}${phoneLast}`

      // 판매자 여부 확인 (탭 활성화 상태로 확인)
      const sellerTab = document.getElementById('sellerTab')
      const isSeller = sellerTab?.hasAttribute('active')

      let result
      if (isSeller) {
        // 판매자 회원가입
        const storeName = document.getElementById('storeName')?.getValue() || ''
        const businessNumber =
          document.getElementById('businessNumber')?.getValue() || ''

        const sellerData = {
          username,
          password,
          name,
          phone_number,
          store_name: storeName,
          company_registration_number: businessNumber,
        }
        result = await signupSeller(sellerData)
      } else {
        // 구매자 회원가입
        const buyerData = {
          username,
          password,
          name,
          phone_number,
        }
        result = await signupBuyer(buyerData)
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

      if (error.data && typeof error.data === 'object') {
        // 필드별 에러 메시지 처리
        const fieldErrors = error.data
        const errorMessages = []

        // 필드별 에러 메시지를 입력 필드에 표시
        if (fieldErrors.username) {
          const usernameInput = document.getElementById('username')
          usernameInput?.setMessage(fieldErrors.username[0], 'error')
          errorMessages.push(fieldErrors.username[0])
        }
        if (fieldErrors.password) {
          const passwordInput = document.getElementById('password')
          passwordInput?.setStatus('error', fieldErrors.password[0])
          errorMessages.push(fieldErrors.password[0])
        }
        if (fieldErrors.name) {
          const nameInput = document.getElementById('name')
          nameInput?.setMessage(fieldErrors.name[0], 'error')
          errorMessages.push(fieldErrors.name[0])
        }
        if (fieldErrors.phone_number) {
          errorMessages.push(fieldErrors.phone_number[0])
        }

        if (errorMessages.length > 0) {
          errorMessage = errorMessages.join(', ')
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
