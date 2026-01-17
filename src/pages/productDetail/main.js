import './style.css'
import '@component/modal/check.js'
import '@component/button/small.js'
import '@component/logo/delete.js'
import '@component/etc/amountCounter.js'
import { getDetailProduct } from '/src/js/product/getdetailproduct.js'
import { getAccessToken, getUserType } from '/src/js/auth/token.js'
import { addToCart } from '/src/js/cart/addToCart.js'
import { getCart } from '/src/js/cart/getCart.js'

// =========================
// 전역 상태
// =========================
let currentProduct = null

// =========================
// DOM
// =========================
const sellerNameEl = document.getElementById('sellerName')
const sellerModal = document.getElementById('sellerModal')
const loginModal = document.getElementById('loginModal')
const cartDuplicateModal = document.getElementById('cartDuplicateModal')
const stockExceededModal = document.getElementById('stockExceededModal')
const addToCartSuccessModal = document.getElementById('addToCartSuccessModal')
const addToCartErrorModal = document.getElementById('addToCartErrorModal')
const buyNowBtn = document.getElementById('buyNowBtn')
const addToCartBtn = document.getElementById('addToCartBtn')
const quantityCounter = document.getElementById('productQuantity')

// =========================
// 유틸
// =========================
function formatPrice(price) {
  return price.toLocaleString('ko-KR')
}

function isAuthenticated() {
  return !!getAccessToken()
}

// ✅ 로컬스토리지에서 판매자 여부 판단
function isSellerUser() {
  const userType = getUserType()
  return userType === 'SELLER'
}

function getQuantity() {
  return (
    quantityCounter?.getValue?.() ||
    Number(quantityCounter?.getAttribute('value') || 1)
  )
}

// =========================
// 판매자일 경우 구매 UI 비활성화 (⭐ 핵심)
// =========================
function disablePurchaseUIForSeller() {
  // 수량카운터 비활성화
  quantityCounter?.setAttribute('disabled', '')
  // 바로구매, 장바구니 버튼 비활성화
  buyNowBtn?.setAttribute('disabled', '')
  addToCartBtn?.setAttribute('disabled', '')

  buyNowBtn?.setAttribute('text', '판매자 계정')
  addToCartBtn?.setAttribute('text', '판매자 계정')
}

// =========================
// 판매자 모달
// =========================
function openSellerModal() {
  if (!sellerModal || !currentProduct?.seller) return
  sellerModal.setAttribute(
    'message',
    `
    <div>
      <p>스토어명: ${currentProduct.seller.store_name}</p>
      <p>이름: ${currentProduct.seller.name}</p>
    </div>
    `
  )
  sellerModal.setAttribute('open', '')
}

sellerNameEl?.addEventListener('click', openSellerModal)

// =========================
// 상품 렌더링
// =========================
function renderProductDetail(product) {
  const mainImage = document.getElementById('mainImage')
  mainImage.src = product.image
  mainImage.alt = `${product.name} 상품 이미지`
  sellerNameEl.textContent = product.seller?.store_name || ''
  document.querySelector('.product-name').textContent = product.name
  document.querySelector('.price-section .price').textContent = formatPrice(
    product.price
  )

  // 배송 정보 렌더링
  const shippingMethod =
    product.shipping_method === 'PARCEL' ? '택배배송' : '직접배송'
  const shippingFee = product.shipping_fee || 0
  const shippingText =
    shippingFee === 0 ? '무료배송' : `${formatPrice(shippingFee)}원`

  const shippingLabelEl = document.querySelector('.shipping-label')
  const shippingFreeEl = document.querySelector('.shipping-free')
  if (shippingLabelEl) shippingLabelEl.textContent = `${shippingMethod} / `
  if (shippingFreeEl) shippingFreeEl.textContent = shippingText

  quantityCounter?.setAttribute('max', product.stock)

  // 초기 총 금액 설정
  const initialQuantity = getQuantity()
  document.getElementById('totalQuantity').textContent = initialQuantity
  document.getElementById('totalPrice').textContent = formatPrice(
    product.price * initialQuantity
  )

  // ✅ 판매자 계정이면 바로 비활성화
  if (isSellerUser()) {
    disablePurchaseUIForSeller()
  }
}

// =========================
// 상품 로드
// =========================
async function loadProductDetail() {
  const productId = new URLSearchParams(location.search).get('product_id')
  if (!productId) return

  try {
    const product = await getDetailProduct(productId)
    currentProduct = product
    renderProductDetail(product)
  } catch (e) {
    console.error('상품 로드 실패', e)
  }
}

loadProductDetail()

// =========================
// 수량 변경
// =========================
quantityCounter?.addEventListener('amountchange', (e) => {
  const quantity = e.detail.value
  document.getElementById('totalQuantity').textContent = quantity
  document.getElementById('totalPrice').textContent = formatPrice(
    currentProduct.price * quantity
  )
})

// =========================
// 모달 이벤트
// =========================
loginModal?.addEventListener('modal-confirm', () => {
  location.href = '/src/pages/login/index.html'
})

cartDuplicateModal?.addEventListener('modal-confirm', () => {
  location.href = '/src/pages/shoppingCartPage/index.html'
})

addToCartSuccessModal?.addEventListener('modal-confirm', () => {
  location.href = '/src/pages/shoppingCartPage/index.html'
})

// =========================
// 바로 구매
// =========================
buyNowBtn?.addEventListener('button-click', () => {
  if (!isAuthenticated()) {
    loginModal?.setAttribute('open', '')
    return
  }

  if (isSellerUser()) return

  sessionStorage.setItem(
    'orderProduct',
    JSON.stringify({
      ...currentProduct,
      quantity: getQuantity(),
    })
  )

  location.href = '/src/pages/Payment/index.html'
})

// =========================
// 장바구니
// =========================
addToCartBtn?.addEventListener('button-click', async () => {
  if (!isAuthenticated()) {
    loginModal?.setAttribute('open', '')
    return
  }

  if (isSellerUser()) return

  try {
    const cartItems = await getCart()

    const existingItem = cartItems.find(
      (item) => item.product?.id === currentProduct.id
    )

    if (existingItem) {
      cartDuplicateModal?.setAttribute('open', '')
      return
    }

    await addToCart(currentProduct.id, getQuantity())
    addToCartSuccessModal?.setAttribute('open', '')
  } catch (e) {
    console.error(e)
    addToCartErrorModal?.setAttribute('open', '')
  }
})

// =========================
// 탭
// =========================
document.querySelectorAll('.tabs-header button-tab').forEach((tab) => {
  tab.addEventListener('tab-click', () => {
    document
      .querySelectorAll('.tabs-header button-tab')
      .forEach((t) => t.setActive(false))
    tab.setActive(true)
  })
})
