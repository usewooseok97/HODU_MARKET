// 웹 컴포넌트는 vite-plugin-auto-components에서 자동으로 import됩니다
import '@component/modal/check.js'
import '@component/button/small.js'
import '@component/logo/delete.js'
import { getDetailProduct } from '/src/js/product/getdetailproduct.js'

// 현재 상품 데이터 저장
let currentProduct = null

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
  if (!sellerModal || !currentProduct?.seller) return
  const sellerData = currentProduct.seller
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

// 가격 포맷팅 함수
function formatPrice(price) {
  return price.toLocaleString('ko-KR')
}

// 상품 데이터를 DOM에 바인딩
function renderProductDetail(product) {
  // 메인 이미지
  const mainImage = document.getElementById('mainImage')
  if (mainImage) {
    mainImage.src = product.image
    mainImage.alt = product.name || ''
  }

  // 판매자명
  if (sellerNameEl) {
    sellerNameEl.textContent = product.seller?.store_name || ''
  }

  // 상품명
  const productName = document.querySelector('.product-name')
  if (productName) {
    productName.textContent = product.name || ''
  }

  // 가격
  const priceEl = document.querySelector('.price-section .price')
  if (priceEl) {
    priceEl.textContent = formatPrice(product.price)
  }

  // 배송 정보
  const shippingLabel = document.querySelector('.shipping-label')
  const shippingFree = document.querySelector('.shipping-free')
  if (shippingLabel) {
    shippingLabel.textContent = product.shipping_method === 'PARCEL' ? '택배배송 / ' : '직접배송 / '
  }
  if (shippingFree) {
    shippingFree.textContent = product.shipping_fee === 0 ? '무료배송' : `배송비 ${formatPrice(product.shipping_fee)}원`
  }

  // 수량 카운터 max 값 설정
  const quantityCounter = document.getElementById('productQuantity')
  if (quantityCounter) {
    quantityCounter.setAttribute('max', product.stock)
  }

  // 총 금액 초기화
  const totalPrice = document.getElementById('totalPrice')
  if (totalPrice) {
    totalPrice.textContent = formatPrice(product.price)
  }
}

// URL에서 product_id 추출 후 상품 데이터 로드
async function loadProductDetail() {
  const params = new URLSearchParams(window.location.search)
  const productId = params.get('product_id')

  if (!productId) {
    console.error('상품 ID가 없습니다.')
    return
  }

  try {
    const product = await getDetailProduct(productId)
    currentProduct = product
    renderProductDetail(product)
  } catch (error) {
    console.error('상품 상세 로드 실패:', error)
  }
}

// 페이지 로드 시 상품 데이터 로드
loadProductDetail()

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
