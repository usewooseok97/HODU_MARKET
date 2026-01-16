// 웹 컴포넌트 명시적 import
import '@/component/shoppingcart/item.js'
import { getAuthRequest, putAuthRequest, getRequest, deleteAuthRequest } from '@/js/api.js'
import { getAccessToken } from '@/js/auth/token.js'

// ===== DOM 요소 선택 =====
const emptyCartEl = document.getElementById('emptyCart')
const cartItemsListEl = document.getElementById('cartItemsList')
const paymentSectionEl = document.getElementById('paymentSection')
const totalProductPriceEl = document.getElementById('totalProductPrice')
const totalPaymentPriceEl = document.getElementById('totalPaymentPrice')
const orderButton = document.getElementById('orderButton')

// ===== 상태 관리 =====
let cartItems = []

// ===== 초기화 =====
async function init() {
  // 로그인 확인
  const token = getAccessToken()
  if (!token) {
    // 비로그인 상태면 로그인 페이지로 이동
    alert('로그인이 필요합니다.')
    window.location.href = '/src/pages/login/index.html'
    return
  }

  // API에서 장바구니 데이터 가져오기
  try {
    cartItems = await fetchCartItems()
    console.log('가져온 장바구니 아이템:', cartItems)
    console.log('장바구니 아이템 개수:', cartItems.length)
  } catch (error) {
    console.error('장바구니 데이터 로드 실패:', error)
    // API 실패 시 빈 배열로 처리
    cartItems = []
  }

  renderCart()
}

// ===== 장바구니 렌더링 =====
function renderCart() {
  if (cartItems.length === 0) {
    // 빈 장바구니 표시
    showEmptyCart()
  } else {
    // 장바구니 아이템 표시
    showCartItems()
  }
}

// ===== 빈 장바구니 표시 =====
function showEmptyCart() {
  emptyCartEl.classList.add('show')
  cartItemsListEl.innerHTML = ''
  paymentSectionEl.classList.remove('show') // 결제 정보 숨김
}

// ===== 장바구니 아이템 표시 =====
function showCartItems() {
  console.log('showCartItems 호출됨, 아이템 수:', cartItems.length)
  emptyCartEl.classList.remove('show')
  paymentSectionEl.classList.add('show') // 결제 정보 표시

  // 기존 아이템 제거
  cartItemsListEl.innerHTML = ''

  // 아이템 렌더링
  cartItems.forEach((item, index) => {
    console.log(`아이템 ${index + 1} 렌더링:`, item)
    const itemElement = createCartItem(item)
    cartItemsListEl.appendChild(itemElement)
  })

  // 컴포넌트가 렌더링된 후 이벤트 설정 및 금액 계산
  setTimeout(() => {
    setupSelectAllCheckbox()
    calculateTotalPrice()
  }, 50)
}

// ===== 장바구니 아이템 생성 =====
function createCartItem(item) {
  const cartItem = document.createElement('shoppingcart-item')

  // 데이터 속성 설정
  cartItem.dataset.itemId = item.id
  cartItem.dataset.productId = item.productId
  cartItem.dataset.price = item.price

  // 컴포넌트에 데이터 전달 (setItemData 호출)
  // connectedCallback 이후에 호출되도록 setTimeout 사용
  setTimeout(() => {
    cartItem.setItemData(item)
    setupCartItemEvents(cartItem, item)
  }, 0)

  return cartItem
}

// ===== 장바구니 아이템 데이터 업데이트 =====
function updateCartItemData(cartItem, item) {
  // 이미지
  const image = cartItem.querySelector('.cart-product-image')
  if (image) image.src = item.image

  // 판매자
  const seller = cartItem.querySelector('.cart-seller')
  if (seller) seller.textContent = item.seller

  // 상품명
  const productName = cartItem.querySelector('.cart-product-name')
  if (productName) productName.textContent = item.productName

  // 가격
  const price = cartItem.querySelector('.cart-product-price')
  if (price) price.textContent = `${item.price.toLocaleString('ko-KR')}원`

  // 배송 정보
  const shipping = cartItem.querySelector('.cart-shipping')
  if (shipping) {
    const shippingText =
      item.shipping === 0
        ? '무료배송'
        : `${item.shipping.toLocaleString('ko-KR')}원`
    shipping.textContent = `${item.shippingMethod} / ${shippingText}`
  }

  // 수량 카운터 max 값 설정 (재고 기반)
  const amountCounter = cartItem.querySelector('etc-amountcounter')
  if (amountCounter && item.stock) {
    amountCounter.setAttribute('max', item.stock)
  }

  // 총 가격
  updateItemTotalPrice(cartItem, item)
}

// ===== 아이템별 총 가격 업데이트 =====
function updateItemTotalPrice(cartItem, item) {
  const totalPrice = cartItem.querySelector('.cart-total-price')
  if (totalPrice) {
    const total = item.price * cartItem.quantity
    totalPrice.textContent = `${total.toLocaleString('ko-KR')}원`
  }
}

// ===== 장바구니 아이템 이벤트 설정 =====
function setupCartItemEvents(cartItem, item) {
  // 수량 변경 이벤트
  cartItem.addEventListener('quantity-change', async (e) => {
    const newQuantity = e.detail.quantity
    console.log(`상품 ${item.id} 수량 변경:`, newQuantity)

    // 데이터 업데이트
    item.quantity = newQuantity

    // 아이템 총 가격 업데이트
    updateItemTotalPrice(cartItem, item)

    // 전체 총 금액 재계산
    calculateTotalPrice()

    // API 호출 - 장바구니 수량 업데이트
    try {
      await updateCartItemQuantity(item.id, newQuantity, item.productId)
    } catch (error) {
      console.error('수량 업데이트 API 실패:', error)
    }
  })

  // 삭제 버튼 이벤트
  const deleteBtn = cartItem.querySelector('.cart-delete-btn')
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      console.log(`상품 ${item.id} 삭제 요청`)

      // 모달 표시
      showDeleteModal(item, cartItem)
    })
  }

  // 개별 체크박스 이벤트
  const checkbox = cartItem.querySelector('.cart-checkbox-input')
  if (checkbox) {
    checkbox.addEventListener('change', () => {
      calculateTotalPrice()
      updateSelectAllCheckbox()
    })
  }

  // 주문하기 버튼 이벤트 (개별)
  const orderBtn = cartItem.querySelector('.order-btn')
  if (orderBtn) {
    orderBtn.addEventListener('click', () => {
      console.log(`상품 ${item.id} 개별 주문`)
      // TODO: 주문 페이지로 이동
      alert('주문/결제 페이지는 아직 구현되지 않았습니다.')
    })
  }
}

// ===== 전체 선택 체크박스 설정 =====
function setupSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById('select-all')
  if (!selectAllCheckbox) {
    console.warn('전체 선택 체크박스를 찾을 수 없습니다.')
    return
  }

  // 기존 이벤트 리스너 제거 (중복 방지)
  const newCheckbox = selectAllCheckbox.cloneNode(true)
  selectAllCheckbox.parentNode.replaceChild(newCheckbox, selectAllCheckbox)

  // 새로운 이벤트 리스너 추가
  newCheckbox.addEventListener('change', (e) => {
    const isChecked = e.target.checked
    const itemCheckboxes = cartItemsListEl.querySelectorAll('.cart-checkbox-input')

    console.log(`전체 선택: ${isChecked}, 아이템 수: ${itemCheckboxes.length}`)

    itemCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked
    })

    calculateTotalPrice()
  })

  console.log('전체 선택 체크박스 이벤트 설정 완료')
}

// ===== 전체 선택 체크박스 상태 업데이트 =====
function updateSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById('select-all')
  if (!selectAllCheckbox) return

  const itemCheckboxes = Array.from(
    cartItemsListEl.querySelectorAll('.cart-checkbox-input')
  )
  const allChecked =
    itemCheckboxes.length > 0 && itemCheckboxes.every((cb) => cb.checked)

  selectAllCheckbox.checked = allChecked
}

// ===== 총 금액 계산 =====
function calculateTotalPrice() {
  let totalPrice = 0

  // 체크된 아이템만 계산
  const checkedItems = cartItemsListEl.querySelectorAll(
    '.cart-checkbox-input:checked'
  )

  checkedItems.forEach((checkbox) => {
    const cartItem = checkbox.closest('shoppingcart-item')
    if (cartItem) {
      const price = parseInt(cartItem.dataset.price) || 0
      const quantity = cartItem.quantity || 1
      totalPrice += price * quantity
    }
  })

  // 화면 업데이트
  totalProductPriceEl.textContent = totalPrice.toLocaleString('ko-KR')
  totalPaymentPriceEl.textContent = totalPrice.toLocaleString('ko-KR')

  console.log('총 금액:', totalPrice)
}

// ===== 전체 주문하기 버튼 =====
if (orderButton) {
  orderButton.addEventListener('button-click', () => {
    const checkedItems = cartItemsListEl.querySelectorAll(
      '.cart-checkbox-input:checked'
    )

    if (checkedItems.length === 0) {
      alert('주문할 상품을 선택해주세요.')
      return
    }

    console.log('전체 주문하기 클릭, 선택된 상품 수:', checkedItems.length)

    // TODO: 주문 페이지로 이동
    alert('주문/결제 페이지는 아직 구현되지 않았습니다.')
  })
}

// ===== 페이지 로드 시 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('장바구니 페이지 로드 완료')

  // 헤더의 장바구니 아이콘 활성화
  activateCartIcon()

  init()
})

// ===== 삭제 확인 모달 표시 =====
function showDeleteModal(item, cartItemElement) {
  const modal = document.getElementById('deleteModal')

  if (!modal) {
    console.error('모달을 찾을 수 없습니다')
    return
  }

  console.log('모달 열기:', item)

  // 확인 버튼 핸들러
  const handleConfirm = async () => {
    console.log('✅ 확인 버튼 클릭! 상품 삭제:', item.id)

    // API 호출 - 서버에서 장바구니 아이템 삭제
    try {
      const token = getAccessToken()
      await deleteAuthRequest(`cart/${item.id}/`, token)
      console.log('서버에서 아이템 삭제 완료')
    } catch (error) {
      console.error('장바구니 삭제 API 실패:', error)
    }

    // 로컬 배열에서도 삭제
    const index = cartItems.findIndex((i) => i.id === item.id)
    if (index > -1) {
      cartItems.splice(index, 1)
      console.log('아이템 삭제 완료. 남은 아이템:', cartItems.length)
    }

    // 재렌더링
    renderCart()

    // 이벤트 리스너 제거
    cleanup()
  }

  // 취소 버튼 핸들러
  const handleCancel = () => {
    console.log('❌ 취소 버튼 클릭! 삭제 취소')
    cleanup()
  }

  // 이벤트 리스너 정리 함수
  const cleanup = () => {
    modal.removeEventListener('modal-confirm', handleConfirm)
    modal.removeEventListener('modal-cancel', handleCancel)
  }

  // 이벤트 리스너 등록
  modal.addEventListener('modal-confirm', handleConfirm, { once: true })
  modal.addEventListener('modal-cancel', handleCancel, { once: true })

  console.log('이벤트 리스너 등록 완료')

  // 모달 열기 (이벤트 리스너 등록 후)
  modal.setAttribute('open', '')

  console.log('모달 open 속성 설정 완료')
}

// ===== 헤더 장바구니 아이콘 활성화 =====
function activateCartIcon() {
  // header-search 컴포넌트가 로드될 때까지 대기
  const checkHeader = setInterval(() => {
    const cartLink = document.querySelector('.cart-link')

    if (cartLink) {
      // 모든 nav-item에서 active 제거
      const navItems = document.querySelectorAll('.nav-item')
      navItems.forEach((item) => {
        item.classList.remove('active')
        // 모든 아이콘 초기화
        const defaultIcon = item.querySelector('.icon-default')
        const activeIcon = item.querySelector('.icon-active')
        if (defaultIcon) defaultIcon.style.display = 'block'
        if (activeIcon) activeIcon.style.display = 'none'

        const navText = item.querySelector('.nav-text')
        if (navText) navText.style.color = '#767676'
      })

      // 장바구니에 active 추가
      cartLink.classList.add('active')

      // 장바구니 아이콘 활성화
      const cartDefaultIcon = cartLink.querySelector('.icon-default')
      const cartActiveIcon = cartLink.querySelector('.icon-active')
      const cartText = cartLink.querySelector('.nav-text')

      if (cartDefaultIcon) cartDefaultIcon.style.display = 'none'
      if (cartActiveIcon) cartActiveIcon.style.display = 'block'
      if (cartText) cartText.style.color = '#21BF48'

      console.log('장바구니 아이콘 활성화 완료')
      clearInterval(checkHeader)
    }
  }, 100)

  // 5초 후에도 찾지 못하면 중단
  setTimeout(() => clearInterval(checkHeader), 5000)
}

// ===== API 연동 =====

/**
 * 장바구니 데이터 가져오기
 */
async function fetchCartItems() {
  const token = getAccessToken()
  if (!token) {
    throw new Error('인증 토큰이 없습니다.')
  }

  const data = await getAuthRequest('cart/', token)
  console.log('장바구니 API 원본 응답:', data)

  // API 응답을 화면에 맞게 변환
  const results = data.results || data || []
  console.log('results 배열:', results)

  // 각 장바구니 아이템을 화면용 데이터로 변환
  const cartItemsData = await Promise.all(
    results.map(async (item, index) => {
      console.log(`원본 아이템 ${index}:`, item)

      // product가 숫자(ID)인지 객체인지 확인
      let product = typeof item.product === 'object' ? item.product : null
      const productId = product?.id || item.product_id || item.product
      const cartItemId = item.cart_item_id || item.id

      console.log(`아이템 ${index} - productId:`, productId, ', cartItemId:', cartItemId, ', product 객체:', product)

      // product가 ID만 있는 경우 상품 정보를 별도로 가져옴
      if (!product && productId) {
        try {
          console.log(`상품 정보 가져오기: products/${productId}/`)
          product = await getRequest(`products/${productId}/`)
          console.log(`상품 정보 응답:`, product)
        } catch (error) {
          console.error(`상품 ${productId} 정보 가져오기 실패:`, error)
          product = null
        }
      }

      return {
        id: cartItemId,
        productId: productId,
        image: product?.image || '/src/assets/images/cart-Product-list.png',
        seller: product?.seller?.store_name || product?.store_name || '판매자',
        productName: product?.product_name || product?.name || '상품명',
        price: product?.price || 0,
        quantity: item.quantity || 1,
        shipping: product?.shipping_fee || 0,
        shippingMethod: product?.shipping_method === 'PARCEL' ? '택배배송' : '직접배송',
        stock: product?.stock || 99,
      }
    })
  )

  return cartItemsData
}

/**
 * 장바구니 아이템 수량 업데이트
 */
async function updateCartItemQuantity(itemId, quantity, productId) {
  const token = getAccessToken()
  if (!token) {
    throw new Error('인증 토큰이 없습니다.')
  }

  const data = await putAuthRequest(`cart/${itemId}/`, {
    product_id: productId,
    quantity: quantity,
    is_active: true,
  }, token)

  console.log('수량 업데이트 API 응답:', data)
  return data
}
