// 웹 컴포넌트는 vite-plugin-auto-components에서 자동으로 import됩니다

import {
  validateUsername,
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
let isPasswordValid = false
let isPasswordMatch = false
let isTermsAgreed = false
let isBusinessValid = false
let isSeller = false

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
    // 입력 중에는 메시지 숨김
    usernameInput.setMessage('', '')
    isUsernameValid = false
  } else {
    usernameInput.setMessage('', '')
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

// 비밀번호 유효성 검사 (8자 이상, 영문+숫자 포함)
function validatePassword(password) {
  const hasMinLength = password.length >= 8
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  return hasMinLength && hasLetter && hasNumber
}

// 비밀번호 입력 이벤트
passwordInput?.addEventListener('input-change', (e) => {
  const value = e.detail.value

  if (value.length === 0) {
    passwordInput.setStatus('', '')
    isPasswordValid = false
  } else if (validatePassword(value)) {
    passwordInput.setStatus('success', '')
    isPasswordValid = true
  } else {
    passwordInput.setStatus('error', '8자 이상, 영문과 숫자를 포함해주세요.')
    isPasswordValid = false
  }

  // 비밀번호 재확인도 다시 검증
  checkPasswordMatch()
  updateSubmitButton()
})

// 비밀번호 재확인 입력 이벤트
passwordConfirmInput?.addEventListener('input-change', () => {
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
  updateSubmitButton()
})

// 휴대폰번호 입력 이벤트
document.getElementById('phoneMiddle')?.addEventListener('input-change', () => {
  updateSubmitButton()
})
document.getElementById('phoneLast')?.addEventListener('input-change', () => {
  updateSubmitButton()
})

// 스토어 이름 입력 이벤트
document.getElementById('storeName')?.addEventListener('input-change', () => {
  updateSubmitButton()
})

// 회원가입 폼 제출
if (form) {
  handleSignupSubmit(form)
}
