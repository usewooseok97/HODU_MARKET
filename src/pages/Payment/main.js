// Payment/main.js

import { requireAuth } from '@/js/auth/routeGuard.js'

// 로그인 확인 (Route Guard)
if (!requireAuth({ message: '결제 페이지는 로그인이 필요합니다.' })) {
  throw new Error('Unauthorized')
}

// DOM 요소 선택
const orderProductListEl = document.getElementById('orderProductList')
const totalOrderAmountEl = document.getElementById('totalOrderAmount')
const agreementCheckEl = document.getElementById('agreementCheck')
const paymentBtnEl = document.getElementById('paymentBtn')

/**
 * 1. sessionStorage에서 주문 데이터를 가져와서 화면에 렌더링
 */
function loadOrderData() {
  if (!orderProductListEl) return

  // 장바구니에서 넘어온 데이터(배열) 또는 상세페이지에서 넘어온 데이터(객체) 확인
  const cartItemsData = sessionStorage.getItem('orderItems')
  const singleProductData = sessionStorage.getItem('orderProduct')

  let productsToRender = []

  try {
    if (cartItemsData) {
      productsToRender = JSON.parse(cartItemsData)
    } else if (singleProductData) {
      // 단일 상품인 경우 배열로 감싸줌
      productsToRender = [JSON.parse(singleProductData)]
    }

    if (productsToRender.length === 0) {
      console.warn('주문할 상품 데이터가 없습니다.')
      return
    }

    // 기존 하드코딩된 아이템 제거
    orderProductListEl.innerHTML = ''

    // 상품 리스트 생성
    productsToRender.forEach((product) => {
      const paymentItem = document.createElement('payment-item')

      // 데이터 필드 매핑 (데이터 소스에 따라 필드명이 다를 수 있으므로 대응)
      const productId = product.id || product.productId || product.product_id
      const image = product.image
      const seller = product.seller?.store_name || product.seller || '판매자'
      const name =
        product.product_name || product.name || product.productName || '상품명'
      const price = product.price
      const quantity = product.quantity
      const shipping = product.shipping_fee ?? product.shipping ?? 0

      paymentItem.setAttribute('product-id', productId)
      paymentItem.setAttribute('image', image)
      paymentItem.setAttribute('seller', seller)
      paymentItem.setAttribute('name', name)
      paymentItem.setAttribute('price', price)
      paymentItem.setAttribute('quantity', quantity)
      paymentItem.setAttribute('shipping', shipping)
      paymentItem.setAttribute('discount', 0)

      orderProductListEl.appendChild(paymentItem)
    })

    // 렌더링 후 금액 재계산
    calculateTotalsFromDom()
  } catch (error) {
    console.error('주문 상품 로드 실패:', error)
  }
}

/**
 * 2. 금액 계산 관련 유틸리티 함수
 */
function getNumber(value) {
  const num = Number.parseInt(value, 10)
  return Number.isNaN(num) ? 0 : num
}

function getItemData(itemEl) {
  return {
    price: getNumber(itemEl.getAttribute('price')),
    quantity: getNumber(itemEl.getAttribute('quantity')) || 1,
    shipping: getNumber(itemEl.getAttribute('shipping')),
    discount: getNumber(itemEl.getAttribute('discount')),
  }
}

/**
 * 3. 하단 최종 결제 정보 업데이트
 */
function updateFinalPaymentInfo(productAmount, totalShipping, totalDiscount) {
  // 상품금액
  const productAmountEl = document.querySelector(
    '.payment-detail-row:nth-child(1) .detail-amount'
  )
  if (productAmountEl)
    productAmountEl.textContent = productAmount.toLocaleString('ko-KR')

  // 할인금액
  const discountAmountEl = document.querySelector(
    '.payment-detail-row:nth-child(2) .detail-amount'
  )
  if (discountAmountEl)
    discountAmountEl.textContent = totalDiscount.toLocaleString('ko-KR')

  // 배송비
  const shippingAmountEl = document.querySelector(
    '.payment-detail-row:nth-child(3) .detail-amount'
  )
  if (shippingAmountEl)
    shippingAmountEl.textContent = totalShipping.toLocaleString('ko-KR')

  // 최종 결제금액
  const finalAmount = productAmount + totalShipping - totalDiscount
  const finalAmountEl = document.querySelector('.final-amount')
  if (finalAmountEl) {
    finalAmountEl.textContent = `${finalAmount.toLocaleString('ko-KR')}원`
  }
}

/**
 * 4. DOM에 렌더링된 payment-item들을 기반으로 총액 계산
 */
function calculateTotalsFromDom() {
  if (!orderProductListEl) return

  const items = Array.from(orderProductListEl.querySelectorAll('payment-item'))
  let productAmount = 0
  let totalShipping = 0
  let totalDiscount = 0

  items.forEach((itemEl) => {
    const { price, quantity, shipping, discount } = getItemData(itemEl)
    productAmount += price * quantity
    totalShipping += shipping
    totalDiscount += discount
  })

  const totalAmount = productAmount + totalShipping - totalDiscount

  // 중앙 "총 주문금액" 업데이트
  if (totalOrderAmountEl) {
    totalOrderAmountEl.textContent = `${totalAmount.toLocaleString('ko-KR')}원`
  }

  // 우측 하단 상세 결제 정보 업데이트
  updateFinalPaymentInfo(productAmount, totalShipping, totalDiscount)
}

/**
 * 5. 약관 동의 및 버튼 활성화 설정
 */
function setupAgreementCheck() {
  if (!agreementCheckEl || !paymentBtnEl) return

  // etc-checkbox 커스텀 이벤트 또는 기본 change 이벤트 대응
  agreementCheckEl.addEventListener('etc-change', (e) => {
    paymentBtnEl.disabled = !e.detail?.checked
  })
}

function isAgreementChecked() {
  const input = agreementCheckEl?.querySelector('input[type="checkbox"]')
  return Boolean(input?.checked)
}

/**
 * 초기 실행
 */
document.addEventListener('DOMContentLoaded', () => {
  loadOrderData() // 상품 먼저 불러오기
  setupAgreementCheck()
})

// 결제하기 버튼 클릭 이벤트
if (paymentBtnEl) {
  paymentBtnEl.addEventListener('click', () => {
    if (!isAgreementChecked()) {
      alert('주문 내용 확인 및 정보 제공에 동의해주세요.')
      return
    }
    alert('결제가 완료되었습니다!')
    // 실제 결제 API 호출 로직 추가 위치
  })
}
