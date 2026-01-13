// 웹 컴포넌트는 vite-plugin-auto-components에서 자동으로 import됩니다

import { handleSignupSubmit, validateUsername } from '../../js/auth/signup.js'

// 아이디 중복 체크 버튼
const checkUsernameBtn = document.querySelector('#check-username')
if (checkUsernameBtn) {
  checkUsernameBtn.addEventListener('click', async () => {
    const usernameInput = document.querySelector('#username')
    if (!usernameInput || !usernameInput.value) {
      console.warn('Username input not found or empty')
      return
    }

    try {
      const result = await validateUsername(usernameInput.value)
      console.log('아이디 검증 결과:', result)
      alert(result.message || '사용 가능한 아이디입니다.')
    } catch (error) {
      console.error('아이디 검증 실패:', error)
      alert('이미 사용 중인 아이디입니다.')
    }
  })
}

// 구매자 회원가입 폼
const buyerForm = document.querySelector('#buyer-signup-form')
if (buyerForm) {
  handleSignupSubmit(buyerForm, 'buyer')
}

// 판매자 회원가입 폼
const sellerForm = document.querySelector('#seller-signup-form')
if (sellerForm) {
  handleSignupSubmit(sellerForm, 'seller')
}
