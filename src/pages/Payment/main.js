// Payment/main.js

import { requireAuth } from '@/js/auth/routeGuard.js'
import { postAuthRequest } from '@/js/api.js'
import {
  getAccessToken,
  refreshAccessToken,
  isTokenExpired,
  removeTokens,
} from '@/js/auth/token.js'

// 로그인 확인 (Route Guard)
if (!requireAuth({ message: '결제 페이지는 로그인이 필요합니다.' })) {
  throw new Error('Unauthorized')
}

// DOM 요소 선택
const orderProductListEl = document.getElementById('orderProductList')
const totalOrderAmountEl = document.getElementById('totalOrderAmount')
const agreementCheckEl = document.getElementById('agreementCheck')
const paymentBtnEl = document.getElementById('paymentBtn')
const shippingFormEl = document.getElementById('shippingForm')
const postalSearchBtnEl = document.getElementById('postalSearchBtn')
const ordererEmailEl = document.getElementById('ordererEmail')
const receiverNameEl = document.getElementById('receiverName')
const deliveryMessageEl = document.getElementById('deliveryMessage')
const postalCodeEl = document.getElementById('postalCode')
const addressEl = document.getElementById('address')
const addressDetailEl = document.getElementById('addressDetail')

const phoneInputEls = Array.from(
  document.querySelectorAll(
    'input[name^="ordererPhone"], input[name^="receiverPhone"]'
  )
)

let hasPostalSearch = false
let isSubmittingOrder = false

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
    updatePaymentButtonState(Boolean(e.detail?.checked))
  })
}

function isAgreementChecked() {
  const input = agreementCheckEl?.querySelector('input[type="checkbox"]')
  return Boolean(input?.checked)
}

function updatePaymentButtonState(agreementChecked = isAgreementChecked()) {
  if (!paymentBtnEl) return
  paymentBtnEl.disabled = !(agreementChecked && hasPostalSearch)
}

/**
 * 초기 실행
 */
document.addEventListener('DOMContentLoaded', () => {
  loadOrderData() // 상품 먼저 불러오기
  setupAgreementCheck()
  setupValidationMessages()
  setupPostalSearchButton()
})

// 결제하기 버튼 클릭 이벤트
if (shippingFormEl) {
  shippingFormEl.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!isAgreementChecked()) {
      alert('주문 내용 확인 및 정보 제공에 동의해주세요.')
      return
    }

    if (isSubmittingOrder) return

    try {
      isSubmittingOrder = true
      setPaymentButtonLoading(true)

      const orders = await submitOrders()
      if (orders.length > 0) {
        alert('결제가 완료되었습니다!')
      }
    } catch (error) {
      console.error('주문 생성 실패:', error)
      if (error?.data) {
        console.error('주문 생성 실패 상세:', error.data)
      }
      alert(getOrderErrorMessage(error))
    } finally {
      isSubmittingOrder = false
      setPaymentButtonLoading(false)
    }
  })
}

function setupValidationMessages() {
  phoneInputEls.forEach((inputEl) => {
    inputEl.addEventListener('input', () => {
      inputEl.setCustomValidity('')
    })

    inputEl.addEventListener('invalid', () => {
      inputEl.setCustomValidity('숫자만 입력하세요.')
    })
  })

  if (ordererEmailEl) {
    ordererEmailEl.addEventListener('input', () => {
      ordererEmailEl.setCustomValidity('')
    })

    ordererEmailEl.addEventListener('invalid', () => {
      ordererEmailEl.setCustomValidity('이메일 형식으로 입력하세요.')
    })
  }
}

function setupPostalSearchButton() {
  if (!postalSearchBtnEl) return

  postalSearchBtnEl.addEventListener('button-click', () => {
    if (!window.daum?.Postcode) {
      alert('우편번호 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        if (postalCodeEl) postalCodeEl.value = data.zonecode || ''
        if (addressEl) addressEl.value = data.roadAddress || data.address || ''
        if (addressDetailEl) addressDetailEl.focus()

        hasPostalSearch = true
        updatePaymentButtonState()
      },
    }).open()
  })
}

function setPaymentButtonLoading(isLoading) {
  if (!paymentBtnEl) return
  paymentBtnEl.disabled = isLoading || paymentBtnEl.disabled
  if (isLoading) {
    paymentBtnEl.dataset.prevText = paymentBtnEl.textContent
    paymentBtnEl.textContent = '결제 처리 중...'
  } else {
    paymentBtnEl.textContent = paymentBtnEl.dataset.prevText || '결제하기'
    delete paymentBtnEl.dataset.prevText
    updatePaymentButtonState()
  }
}

function getSelectedPaymentMethod() {
  const selected = document.querySelector('input[name="paymentMethod"]:checked')
  if (!selected) return null

  if (selected.value === 'transfer') return 'deposit'
  return selected.value
}

function getReceiverPhoneNumber() {
  const parts = Array.from(
    document.querySelectorAll(
      'input[name="receiverPhone1"], input[name="receiverPhone2"], input[name="receiverPhone3"]'
    )
  )
    .map((input) => input.value.trim())
    .filter(Boolean)
  return parts.join('').replace(/\D/g, '')
}

function getShippingAddress() {
  const parts = [
    postalCodeEl?.value?.trim(),
    addressEl?.value?.trim(),
    addressDetailEl?.value?.trim(),
  ].filter(Boolean)
  return parts.join(' ')
}

function getOrderItemsFromDom() {
  if (!orderProductListEl) return []
  const items = Array.from(orderProductListEl.querySelectorAll('payment-item'))

  return items
    .map((itemEl) => ({
      product: Number(itemEl.getAttribute('product-id')),
      quantity: getNumber(itemEl.getAttribute('quantity')) || 1,
      price: getNumber(itemEl.getAttribute('price')),
      shipping: getNumber(itemEl.getAttribute('shipping')),
    }))
    .filter((item) => Number.isFinite(item.product))
}

function getCartOrderItemsFromSession() {
  const cartItemsData = sessionStorage.getItem('orderItems')
  if (!cartItemsData) return []

  try {
    const items = JSON.parse(cartItemsData)
    if (!Array.isArray(items)) return []
    return items.filter(Boolean)
  } catch (error) {
    console.error('cart_order 데이터 파싱 실패:', error)
    return []
  }
}

async function submitOrders() {
  const token = await getValidAccessToken()
  if (!token) {
    throw new Error('로그인 토큰이 없습니다.')
  }

  const paymentMethod = getSelectedPaymentMethod()
  if (!paymentMethod) {
    throw new Error('결제수단을 선택해주세요.')
  }

  const receiver = receiverNameEl?.value?.trim()
  const receiverPhoneNumber = getReceiverPhoneNumber()
  const address = getShippingAddress()
  const addressMessage = deliveryMessageEl?.value?.trim() || null

  if (!receiver) {
    throw new Error('수령인을 입력해주세요.')
  }
  if (!receiverPhoneNumber) {
    throw new Error('수령인 휴대폰 번호를 입력해주세요.')
  }
  if (receiverPhoneNumber.length < 10 || receiverPhoneNumber.length > 11) {
    throw new Error('휴대폰 번호는 숫자 10~11자리로 입력해주세요.')
  }
  if (!address) {
    throw new Error('배송주소를 입력해주세요.')
  }

  const cartOrderItems = getCartOrderItemsFromSession()
  if (cartOrderItems.length > 0) {
    const cartItemIds = cartOrderItems
      .map((item) => Number(item.productId || item.product?.id || item.product))
      .filter((id) => Number.isFinite(id))

    if (cartItemIds.length === 0) {
      throw new Error('카트 아이템 정보가 없습니다.')
    }

    const totalPrice = cartOrderItems.reduce(
      (sum, item) => sum + item.price * item.quantity + item.shipping,
      0
    )

    const payload = {
      order_type: 'cart_order',
      cart_items: cartItemIds,
      total_price: totalPrice,
      receiver,
      receiver_phone_number: receiverPhoneNumber,
      address,
      address_message: addressMessage,
      payment_method: paymentMethod,
    }

    const order = await postAuthRequest('order/', payload, token)
    return [order]
  }

  const items = getOrderItemsFromDom()
  if (items.length === 0) {
    throw new Error('주문할 상품이 없습니다.')
  }

  const orders = []

  for (const item of items) {
    const totalPrice = item.price * item.quantity + item.shipping

    const payload = {
      order_type: 'direct_order',
      product: item.product,
      quantity: item.quantity,
      total_price: totalPrice,
      receiver,
      receiver_phone_number: receiverPhoneNumber,
      address,
      address_message: addressMessage,
      payment_method: paymentMethod,
    }

    const order = await postAuthRequest('order/', payload, token)
    orders.push(order)
  }

  return orders
}

function getOrderErrorMessage(error) {
  const data = error?.data
  if (data) {
    const messages = [
      data.receiver,
      data.receiver_phone_number,
      data.address,
      data.address_message,
      data.payment_method,
      data.order_kind,
      data.order_type,
      data.non_field_errors,
      data.detail,
    ]
      .flat()
      .filter(Boolean)

    if (messages.length > 0) {
      return messages.join('\n')
    }
  }

  if (error?.message) return error.message

  return '주문에 실패했습니다. 잠시 후 다시 시도해주세요.'
}

async function getValidAccessToken() {
  const token = getAccessToken()
  if (!token) return null

  if (!isTokenExpired(token)) return token

  try {
    return await refreshAccessToken()
  } catch (error) {
    console.error('토큰 갱신 실패:', error)
    removeTokens()
    alert('로그인이 만료되었습니다. 다시 로그인해주세요.')
    window.location.href = '/src/pages/login/index.html'
    return null
  }
}
