
// 웹 컴포넌트는 vite-plugin-auto-components에서 자동으로 import됩니다
import '@component/modal/check.js'
import '@component/button/small.js'
import '@component/logo/delete.js'

const sellerNameEl = document.getElementById('sellerName')
const sellerModal = document.getElementById('sellerModal')

function buildSellerInfoHtml({ name, phone_number, company_registration_number, store_name }) {
  return `
    <div class="seller-modal">
      <h3 class="seller-modal-title">판매자 정보</h3>
      <div class="seller-modal-row">
        <span class="seller-modal-label">이름</span>
        <span class="seller-modal-value">${name ?? '-'}</span>
      </div>
      <div class="seller-modal-row">
        <span class="seller-modal-label">연락처</span>
        <span class="seller-modal-value">${phone_number ?? '-'}</span>
      </div>
      <div class="seller-modal-row">
        <span class="seller-modal-label">사업자번호</span>
        <span class="seller-modal-value">${company_registration_number ?? '-'}</span>
      </div>
      <div class="seller-modal-row">
        <span class="seller-modal-label">스토어명</span>
        <span class="seller-modal-value">${store_name ?? '-'}</span>
      </div>
    </div>
  `
}

function openSellerModal() {
  if (!sellerModal) return
  // TODO: API 연동 후 실제 판매자 데이터로 교체
  const sellerData = {
    name: '백엔드글로벌',
    phone_number: '02-1234-5678',
    company_registration_number: '123-45-67890',
    store_name: '백엔드글로벌 스토어',
  }
  sellerModal.setAttribute('message', buildSellerInfoHtml(sellerData))
  sellerModal.setAttribute('open', '')
}

function handleSellerKeydown(e) {
  if (e.key !== 'Enter' && e.key !== ' ') return
  e.preventDefault()
  openSellerModal()
}

if (sellerNameEl) {
  sellerNameEl.addEventListener('click', openSellerModal)
  sellerNameEl.addEventListener('keydown', handleSellerKeydown)
}

// import {
//   validateUsername,
//   validateRegistrationNumber,
//   handleSignupSubmit,
// } from '@/js/auth/signup'

// // DOM 요소 선택 - ID 값만 변경하면 전체 동작 변경 가능
// const form = document.getElementById('signupForm')
// const userTypeRadios = document.querySelectorAll('input[name="userType"]')
// const sellerFields = document.getElementById('sellerFields')
// const checkUsernameBtn = document.getElementById('checkUsernameBtn')
// const checkRegistrationBtn = document.getElementById('checkRegistrationBtn')
// const usernameInput = document.getElementById('username')
// const registrationNumberInput = document.getElementById(
//   'company_registration_number'
// )

// // 회원 유형 변경 처리
// userTypeRadios.forEach((radio) => {
//   radio.addEventListener('change', (e) => {
//     const userType = e.target.value
//     console.log('회원 유형 변경:', userType)

//     if (userType === 'seller') {
//       sellerFields.style.display = 'block'
//     } else {
//       sellerFields.style.display = 'none'
//     }
//   })
// })

// // 아이디 중복 확인
// checkUsernameBtn.addEventListener('click', async () => {
//   const username = usernameInput.value
//   if (!username) {
//     alert('아이디를 입력해주세요.')
//     return
//   }

//   try {
//     const result = await validateUsername(username)
//     console.log('아이디 검증 결과:', result)
//     alert('사용 가능한 아이디입니다.')
//   } catch (error) {
//     console.error('아이디 검증 실패:', error)
//     alert('이미 사용 중인 아이디입니다.')
//   }
// })

// // 사업자등록번호 검증
// checkRegistrationBtn.addEventListener('click', async () => {
//   const registrationNumber = registrationNumberInput.value
//   if (!registrationNumber) {
//     alert('사업자등록번호를 입력해주세요.')
//     return
//   }

//   try {
//     const result = await validateRegistrationNumber(registrationNumber)
//     console.log('사업자등록번호 검증 결과:', result)
//     alert('유효한 사업자등록번호입니다.')
//   } catch (error) {
//     console.error('사업자등록번호 검증 실패:', error)
//     alert('유효하지 않은 사업자등록번호입니다.')
//   }
// })

// // 회원가입 폼 제출
// handleSignupSubmit(form)
