// 웹 컴포넌트는 vite-plugin-auto-components에서 자동으로 import됩니다
import '@component/modal/check.js'
import '@component/button/small.js'
import '@component/logo/delete.js'
import { getDetailProduct } from '/src/js/product/getdetailproduct.js'
import { getAccessToken } from '/src/js/auth/token.js'
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
const buyNowBtn = document.getElementById('buyNowBtn')
const addToCartBtn = document.getElementById('addToCartBtn')

// =========================
// 유틸
// =========================
function formatPrice(price) {
  return price.toLocaleString('ko-KR')
}

function isAuthenticated() {
  return !!getAccessToken()
}

function getQuantity() {
  const counter = document.getElementById('productQuantity')
  return counter?.getValue?.() || Number(counter?.getAttribute('value') || 1)
}

// =========================
// 판매자 모달
// =========================
function buildSellerInfoHtml({
  name,
  phone_number,
  company_registration_number,
  store_name,
}) {
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
  sellerModal.setAttribute(
    'message',
    buildSellerInfoHtml(currentProduct.seller)
  )
  sellerModal.setAttribute('open', '')
}

sellerNameEl?.addEventListener('click', openSellerModal)
sellerNameEl?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    openSellerModal()
  }
})

// =========================
// 상품 렌더링
// =========================
function renderProductDetail(product) {
  document.getElementById('mainImage').src = product.image
  sellerNameEl.textContent = product.seller?.store_name || ''
  document.querySelector('.product-name').textContent = product.name
  document.querySelector('.price-section .price').textContent = formatPrice(
    product.price
  )

<<<<<<< HEAD
  // 판매자명
  if (sellerNameEl) {
    sellerNameEl.textContent = product.seller?.store_name || ''
  }

  // 상품명
  const productName = document.querySelector('.product-name')
  if (productName) {
    productName.textContent = product.name || ''
  }

  // 상세 설명
  const detailInfo = document.getElementById('detailInfo')
  if (detailInfo) {
    detailInfo.textContent = product.info || ''
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
    shippingLabel.textContent =
      product.shipping_method === 'PARCEL' ? '택배배송 / ' : '직접배송 / '
  }
  if (shippingFree) {
    shippingFree.textContent =
      product.shipping_fee === 0
        ? '무료배송'
        : `배송비 ${formatPrice(product.shipping_fee)}원`
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

  // 재고에 따른 버튼 상태 업데이트
=======
  document.getElementById('productQuantity')?.setAttribute('max', product.stock)
>>>>>>> origin/main
  updateButtonsByStock(product.stock)
}

function updateButtonsByStock(stock) {
  if (stock <= 0) {
    buyNowBtn?.setAttribute('disabled', '')
    addToCartBtn?.setAttribute('disabled', '')
    buyNowBtn?.setAttribute('text', '품절')
    addToCartBtn?.setAttribute('text', '품절')
  } else {
    buyNowBtn?.removeAttribute('disabled')
    addToCartBtn?.removeAttribute('disabled')
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
const quantityCounter = document.getElementById('productQuantity')
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

// =========================
// 바로 구매
// =========================
buyNowBtn?.addEventListener('button-click', () => {
  if (!isAuthenticated()) {
    loginModal?.setAttribute('open', '')
    return
  }

  sessionStorage.removeItem('orderItems')
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
// 장바구니 버튼 (⭐ 핵심 수정 부분)
// =========================
addToCartBtn?.addEventListener('button-click', async () => {
  if (!isAuthenticated()) {
    loginModal?.setAttribute('open', '')
    return
  }
  if (!currentProduct) return

  const quantity = getQuantity()

  try {
    const cartItems = await getCart()

    console.log('cartItems:', cartItems) // 디버깅용

    const existingItem = cartItems.find((item) => {
      const cartProductId =
        item.product_id ||
        item.product?.id || // ⭐ 핵심
        item.product

      return Number(cartProductId) === Number(currentProduct.id)
    })

    // ✅ 중복이면 바로 모달
    if (existingItem) {
      cartDuplicateModal?.setAttribute('open', '')
      return
    }

    await addToCart(currentProduct.id, quantity)
    alert('장바구니에 상품이 담겼습니다.')
  } catch (error) {
    console.error('장바구니 처리 실패:', error)
    alert('장바구니 추가 실패')
  }
})

// =========================
// 탭 토글
// =========================
document.querySelectorAll('.tabs-header button-tab').forEach((tab) => {
  tab.addEventListener('tab-click', () => {
    document
      .querySelectorAll('.tabs-header button-tab')
      .forEach((t) => t.setActive(false))
    tab.setActive(true)
  })
})
