import './product.css'
import { addToCart } from '/src/js/cart/addToCart.js'
import { getAccessToken, getUserType } from '/src/js/auth/token.js'
import '/src/component/modal/check.js'

class ProductItems extends HTMLElement {
  constructor() {
    super()
    this.products = []
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <div class="product-container">
        <div id="product-list" class="product-grid">
          <!-- 상품 목록이 렌더링됩니다 -->
        </div>
      </div>
    `

  }

  // 가격 포맷팅 함수 (천 단위 콤마)
  formatPrice(price) {
    return price.toLocaleString('ko-KR')
  }

  // 상품 카드 HTML 생성
  createProductCard(product) {
    const card = document.createElement('div')
    card.className = 'product-card'
    card.style.cursor = 'pointer'

    card.innerHTML = `
      <div class="product-image-wrapper">
        <img src="${product.image}" alt="${product.name} 상품 이미지" class="product-image" loading="lazy" width="280" height="280" />
        <button type="button" class="cart-btn" data-product-id="${product.id}" aria-label="장바구니에 담기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      <div class="product-info">
        <div class="seller-name">${product.seller?.store_name || ''}</div>
        <div class="product-name">${product.name}</div>
        <div class="price">${this.formatPrice(product.price)}</div>
        <div class="stock">${product.stock > 0 ? '' : '품절'}</div>
      </div>
    `

    // 장바구니 버튼 클릭 이벤트
    const cartBtn = card.querySelector('.cart-btn')
    cartBtn.addEventListener('click', async (e) => {
      e.stopPropagation() // 카드 클릭 이벤트 전파 방지

      // 비로그인 확인
      if (!getAccessToken()) {
        const loginModal = document.querySelector('#loginModal')
        if (loginModal) {
          loginModal.setAttribute('open', '')
        }
        return
      }

      // 판매자 계정 확인
      if (getUserType() === 'SELLER') {
        const sellerModal = document.querySelector('#sellerModal')
        if (sellerModal) {
          sellerModal.setAttribute('open', '')
        }
        return
      }

      // 구매자 - 장바구니 추가
      try {
        await addToCart(product.id, 1)
        const successModal = document.querySelector('#addToCartSuccessModal')
        if (successModal) {
          successModal.setAttribute('open', '')
        }
      } catch (error) {
        console.error('장바구니 추가 실패:', error)
        const errorModal = document.querySelector('#addToCartErrorModal')
        if (errorModal) {
          errorModal.setAttribute('open', '')
        }
      }
    })

    // 카드 클릭 시 상세 페이지로 이동
    card.addEventListener('click', () => {
      window.location.href = `/src/pages/productDetail/index.html?product_id=${product.id}`
    })

    return card
  }

  // 외부에서 상품 데이터를 설정하는 메서드
  setProducts(products) {
    this.products = products
    this.renderProducts(products)
  }

  // 상품 목록 렌더링
  renderProducts(products) {
    const productList = this.querySelector('#product-list')
    productList.innerHTML = '' // 기존 내용 초기화

    products.forEach((product) => {
      const card = this.createProductCard(product)
      productList.appendChild(card)
    })
  }
}

customElements.define('product-items', ProductItems)
