// 웹 컴포넌트는 vite-plugin-auto-components에서 자동으로 import됩니다
import '@component/modal/check.js'
import '@component/button/small.js'
import '@component/logo/delete.js'
import { getDetailProduct } from '/src/js/product/getdetailproduct.js'
import { getAccessToken } from '/src/js/auth/token.js'
import { addToCart } from '/src/js/cart/addToCart.js'
import { getCart } from '/src/js/cart/getCart.js'

// 현재 상품 데이터 저장
let currentProduct = null

const sellerNameEl = document.getElementById('sellerName')
const sellerModal = document.getElementById('sellerModal')

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
  updateButtonsByStock(product.stock)
}

// 재고에 따른 버튼 활성화/비활성화
function updateButtonsByStock(stock) {
  const buyNowBtn = document.getElementById('buyNowBtn')
  const addToCartBtn = document.getElementById('addToCartBtn')

  if (stock <= 0) {
    // 품절 시 버튼 비활성화
    if (buyNowBtn) {
      buyNowBtn.setAttribute('disabled', '')
      buyNowBtn.setAttribute('text', '품절')
    }
    if (addToCartBtn) {
      addToCartBtn.setAttribute('disabled', '')
      addToCartBtn.setAttribute('text', '품절')
    }
  } else {
    // 재고 있을 시 버튼 활성화
    if (buyNowBtn) {
      buyNowBtn.removeAttribute('disabled')
      buyNowBtn.setAttribute('text', '바로 구매')
    }
    if (addToCartBtn) {
      addToCartBtn.removeAttribute('disabled')
      addToCartBtn.setAttribute('text', '장바구니')
    }
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

// 로그인 상태 확인
function isAuthenticated() {
  return !!getAccessToken()
}

// 수량 가져오기
function getQuantity() {
  const counter = document.getElementById('productQuantity')
  // 웹 컴포넌트의 getValue() 메서드를 시도하거나 attribute를 확인
  return (
    counter?.getValue?.() || parseInt(counter?.getAttribute('value') || '1')
  )
}

// 수량 변경 시 가격 업데이트
const quantityCounter = document.getElementById('productQuantity')
const totalQuantityEl = document.getElementById('totalQuantity')
const totalPriceEl = document.getElementById('totalPrice')

if (quantityCounter) {
  quantityCounter.addEventListener('amountchange', (e) => {
    const quantity = e.detail.value

    // 총 수량 업데이트
    if (totalQuantityEl) {
      totalQuantityEl.textContent = quantity
    }

    // 총 금액 업데이트
    if (totalPriceEl && currentProduct) {
      const totalPrice = currentProduct.price * quantity
      totalPriceEl.textContent = formatPrice(totalPrice)
    }
  })
}

// 로그인 모달
const loginModal = document.getElementById('loginModal')
if (loginModal) {
  loginModal.addEventListener('modal-confirm', () => {
    window.location.href = '/src/pages/login/index.html'
  })
}

// 장바구니 중복 모달
const cartDuplicateModal = document.getElementById('cartDuplicateModal')
if (cartDuplicateModal) {
  cartDuplicateModal.addEventListener('modal-confirm', () => {
    window.location.href = '/src/pages/cart/index.html'
  })
}

// 재고 수량 초과 모달
const stockExceededModal = document.getElementById('stockExceededModal')

// 바로 구매 버튼
const buyNowBtn = document.getElementById('buyNowBtn')
if (buyNowBtn) {
  buyNowBtn.addEventListener('button-click', () => {
    if (!isAuthenticated()) {
      loginModal?.setAttribute('open', '')
      return
    }
    if (!currentProduct) return

    // [중요 수정] 장바구니에서 넘어온 데이터가 남아있을 수 있으므로 제거함
    sessionStorage.removeItem('orderItems')

    // sessionStorage에 현재 상세 페이지의 상품 데이터 저장
    sessionStorage.setItem(
      'orderProduct',
      JSON.stringify({
        ...currentProduct,
        quantity: getQuantity(),
      })
    )
    window.location.href = '/src/pages/Payment/index.html'
  })
}

// 장바구니 버튼
const addToCartBtn = document.getElementById('addToCartBtn')
if (addToCartBtn) {
  addToCartBtn.addEventListener('button-click', async () => {
    if (!isAuthenticated()) {
      loginModal?.setAttribute('open', '')
      return
    }
    if (!currentProduct) return

    const quantity = getQuantity()

    // 현재 장바구니에서 해당 상품의 수량 확인
    try {
      const cartItems = await getCart()
      const existingItem = cartItems.find((item) => {
        const cartProductId = item.product_id || item.product
        return Number(cartProductId) === Number(currentProduct.id)
      })
      const existingQuantity = existingItem?.quantity || 0

      // 기존 수량 + 새 수량이 재고 초과인지 확인
      if (existingQuantity + quantity > currentProduct.stock) {
        stockExceededModal?.setAttribute('open', '')
        return
      }
    } catch (error) {
      console.error('장바구니 조회 실패:', error)
    }

    try {
      await addToCart(currentProduct.id, quantity)
      alert('장바구니에 상품이 담겼습니다.')
    } catch (error) {
      console.error('장바구니 추가 실패:', error)
      if (error.isDuplicate) {
        cartDuplicateModal?.setAttribute('open', '')
      } else if (error.isStockExceeded) {
        stockExceededModal?.setAttribute('open', '')
      } else {
        alert('장바구니 추가에 실패했습니다.')
      }
    }
  })
}

// 탭 버튼 토글 (하나만 활성화)
const tabButtons = document.querySelectorAll('.tabs-header button-tab')
tabButtons.forEach((tab) => {
  tab.addEventListener('tab-click', () => {
    // 모든 탭 비활성화
    tabButtons.forEach((t) => t.setActive(false))
    // 클릭된 탭만 활성화
    tab.setActive(true)
  })
})
