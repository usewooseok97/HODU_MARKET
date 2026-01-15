// 웹 컴포넌트는 vite-plugin-auto-components에서 자동으로 import됩니다

import {
  validateUsername,
  validatePhoneNumber,
  validateRegistrationNumber,
  handleSignupSubmit,
} from '@/js/auth/signup'

// DOM 요소 선택
const buyerTab = document.getElementById('buyerTab')
const sellerTab = document.getElementById('sellerTab')
const sellerFields = document.getElementById('sellerFields')
const checkUsernameBtn = document.getElementById('checkUsernameBtn')
const checkBusinessBtn = document.getElementById('checkBusinessBtn')
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const passwordConfirmInput = document.getElementById('passwordConfirm')
const nameInput = document.getElementById('name')
const agreeCheckbox = document.getElementById('agreeTerms')
const submitBtn = document.getElementById('submitBtn')
const form = document.getElementById('registerForm')

// 상태 관리
let isUsernameValid = false
let isUsernameFormatValid = false // 아이디 형식 유효성
let isPasswordValid = false
let isPasswordMatch = false
let isTermsAgreed = false
let isBusinessValid = false
let isPhoneValid = false // 전화번호 중복 검사 유효성
let isSeller = false

// 아이디 형식 검사 (20자 이내, 영문 대소문자/숫자만)
function validateUsernameFormat(username) {
  if (!username) return { valid: false, message: '' }
  if (username.length > 20) {
    return { valid: false, message: '20자 이내의 영문 소문자, 대문자, 숫자만 사용가능합니다.' }
  }
  const validPattern = /^[a-zA-Z0-9]+$/
  if (!validPattern.test(username)) {
    return { valid: false, message: '20자 이내의 영문 소문자, 대문자, 숫자만 사용가능합니다.' }
  }
  return { valid: true, message: '' }
}

// 아이디 필수 입력 체크 (다른 필드 입력 시 호출)
function checkUsernameRequired() {
  const username = usernameInput?.getValue() || ''
  if (!username) {
    usernameInput?.setMessage('필수 정보입니다.', 'error')
  }
}

// 탭 전환 처리
function handleTabClick(e) {
  const clickedTab = e.currentTarget

  // 모든 탭 비활성화
  buyerTab?.removeAttribute('active')
  sellerTab?.removeAttribute('active')

  // 클릭한 탭 활성화
  clickedTab.setAttribute('active', '')

  // 판매자 필드 표시/숨김
  if (clickedTab === sellerTab) {
    isSeller = true
    if (sellerFields) sellerFields.style.display = 'block'
  } else {
    isSeller = false
    if (sellerFields) sellerFields.style.display = 'none'
  }

  updateSubmitButton()
}

buyerTab?.addEventListener('click', handleTabClick)
sellerTab?.addEventListener('click', handleTabClick)

// 아이디 입력 이벤트
usernameInput?.addEventListener('input-change', (e) => {
  const value = e.detail.value
  if (value.length >= 1) {
    // 아이디 형식 검사
    const formatResult = validateUsernameFormat(value)
    if (!formatResult.valid && formatResult.message) {
      usernameInput.setMessage(formatResult.message, 'error')
      isUsernameFormatValid = false
    } else {
      usernameInput.setMessage('', '')
      isUsernameFormatValid = true
    }
    isUsernameValid = false // 중복확인 버튼을 눌러야 유효
  } else {
    usernameInput.setMessage('', '')
    isUsernameFormatValid = false
    isUsernameValid = false
  }
  updateSubmitButton()
})

// 아이디 중복 확인
checkUsernameBtn?.addEventListener('click', async () => {
  const username = usernameInput?.getValue()
  if (!username) {
    usernameInput?.setMessage('아이디를 입력해주세요.', 'error')
    return
  }

  // 형식 검사 먼저 수행
  const formatResult = validateUsernameFormat(username)
  if (!formatResult.valid) {
    usernameInput?.setMessage(formatResult.message, 'error')
    isUsernameValid = false
    updateSubmitButton()
    return
  }

  try {
    await validateUsername(username)
    usernameInput?.setMessage('멋진 아이디네요 :)', 'success')
    isUsernameValid = true
  } catch (error) {
    usernameInput?.setMessage('이미 사용 중인 아이디입니다.', 'error')
    isUsernameValid = false
  }
  updateSubmitButton()
})

// 비밀번호 유효성 검사 (8자 이상, 영문 대소문자+숫자+특수문자 포함)
function validatePassword(password) {
  const hasMinLength = password.length >= 8
  const hasLowerCase = /[a-z]/.test(password)
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  return hasMinLength && hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar
}

// 비밀번호 입력 이벤트
passwordInput?.addEventListener('input-change', (e) => {
  const value = e.detail.value

  // 아이디 필수 입력 체크
  checkUsernameRequired()

  if (value.length === 0) {
    passwordInput.setStatus('', '')
    isPasswordValid = false
  } else if (validatePassword(value)) {
    passwordInput.setStatus('success', '')
    isPasswordValid = true
  } else {
    passwordInput.setStatus('error', '8자 이상, 영문 대소문자, 숫자, 특수문자를 사용하세요.')
    isPasswordValid = false
  }

  // 비밀번호 재확인도 다시 검증
  checkPasswordMatch()
  updateSubmitButton()
})

// 비밀번호 재확인 입력 이벤트
passwordConfirmInput?.addEventListener('input-change', () => {
  // 아이디 필수 입력 체크
  checkUsernameRequired()
  checkPasswordMatch()
  updateSubmitButton()
})

// 비밀번호 일치 검사
function checkPasswordMatch() {
  const password = passwordInput?.getValue() || ''
  const confirm = passwordConfirmInput?.getValue() || ''

  if (confirm.length === 0) {
    passwordConfirmInput?.setStatus('', '')
    isPasswordMatch = false
  } else if (password === confirm) {
    passwordConfirmInput?.setStatus('success', '')
    isPasswordMatch = true
  } else {
    passwordConfirmInput?.setStatus('error', '비밀번호가 일치하지 않습니다.')
    isPasswordMatch = false
  }
}

// 사업자등록번호 검증
checkBusinessBtn?.addEventListener('click', async () => {
  const businessInput = document.getElementById('businessNumber')
  const businessNumber = businessInput?.getValue()

  if (!businessNumber) {
    businessInput?.setMessage('사업자등록번호를 입력해주세요.', 'error')
    return
  }

  try {
    await validateRegistrationNumber(businessNumber)
    businessInput?.setMessage('유효한 사업자등록번호입니다.', 'success')
    isBusinessValid = true
  } catch (error) {
    businessInput?.setMessage('유효하지 않은 사업자등록번호입니다.', 'error')
    isBusinessValid = false
  }
  updateSubmitButton()
})

// 약관 동의 체크박스 이벤트
agreeCheckbox?.addEventListener('etc-change', (e) => {
  isTermsAgreed = e.detail.checked
  updateSubmitButton()
})

// 제출 버튼 상태 업데이트
function updateSubmitButton() {
  const nameValue = nameInput?.getValue() || ''
  const phoneMiddle = document.getElementById('phoneMiddle')?.getValue() || ''
  const phoneLast = document.getElementById('phoneLast')?.getValue() || ''

  let isValid =
    isUsernameValid &&
    isPasswordValid &&
    isPasswordMatch &&
    nameValue.length > 0 &&
    phoneMiddle.length === 4 &&
    phoneLast.length === 4 &&
    isPhoneValid &&
    isTermsAgreed

  // 판매자인 경우 추가 검증
  if (isSeller) {
    const storeName = document.getElementById('storeName')?.getValue() || ''
    isValid = isValid && isBusinessValid && storeName.length > 0
  }

  if (isValid) {
    submitBtn?.removeAttribute('disabled')
  } else {
    submitBtn?.setAttribute('disabled', '')
  }
}

// 이름 입력 이벤트
nameInput?.addEventListener('input-change', () => {
  // 아이디 필수 입력 체크
  checkUsernameRequired()
  updateSubmitButton()
})

// 전화번호 중복 검사
async function checkPhoneDuplicate() {
  const phonePrefix = document.getElementById('phonePrefix')?.getValue() || '010'
  const phoneMiddle = document.getElementById('phoneMiddle')?.getValue() || ''
  const phoneLast = document.getElementById('phoneLast')?.getValue() || ''
  const phoneMiddleInput = document.getElementById('phoneMiddle')

  // 전화번호가 완성되지 않은 경우
  if (phoneMiddle.length !== 4 || phoneLast.length !== 4) {
    isPhoneValid = false
    return
  }

  const phoneNumber = `${phonePrefix}${phoneMiddle}${phoneLast}`

  try {
    await validatePhoneNumber(phoneNumber)
    phoneMiddleInput?.setMessage('', '')
    isPhoneValid = true
  } catch (error) {
    phoneMiddleInput?.setMessage('해당 사용자 전화번호는 이미 존재합니다.', 'error')
    isPhoneValid = false
  }
  updateSubmitButton()
}

// 휴대폰번호 입력 이벤트
document.getElementById('phoneMiddle')?.addEventListener('input-change', () => {
  // 아이디 필수 입력 체크
  checkUsernameRequired()
  // 전화번호 변경 시 중복 검사 상태 초기화 및 메시지 제거
  isPhoneValid = false
  document.getElementById('phoneMiddle')?.setMessage('', '')
  updateSubmitButton()
  // 전화번호 완성 시 자동 중복 검사
  checkPhoneDuplicate()
})
document.getElementById('phoneLast')?.addEventListener('input-change', () => {
  // 아이디 필수 입력 체크
  checkUsernameRequired()
  // 전화번호 변경 시 중복 검사 상태 초기화
  isPhoneValid = false
  document.getElementById('phoneMiddle')?.setMessage('', '')
  updateSubmitButton()
  // 전화번호 완성 시 자동 중복 검사
  checkPhoneDuplicate()
})

// 스토어 이름 입력 이벤트
document.getElementById('storeName')?.addEventListener('input-change', () => {
  updateSubmitButton()
})

// 회원가입 폼 제출
if (form) {
  handleSignupSubmit(form)
}
