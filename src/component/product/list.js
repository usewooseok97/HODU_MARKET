import { getproduct } from '/src/js/product/getproduct.js'
import { addToCart } from '/src/js/cart/addToCart.js'
import { getAccessToken } from '/src/js/auth/token.js'

class ProductList extends HTMLElement {
  connectedCallback() {
    this.render()
    this.loadProducts()
  }

  render() {
    this.innerHTML = `
      <div class="product-container">
        <div id="product-list" class="product-grid">
          <!-- 상품 목록이 렌더링됩니다 -->
        </div>
      </div>
    `

    this.loadStyles()
  }

  loadStyles() {
    if (!document.querySelector('link[href*="product.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/product/product.css'
      document.head.appendChild(link)
    }
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
        <img src="${product.image}" alt="" class="product-image" />
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

      // 로그인 확인
      if (!getAccessToken()) {
        alert('로그인이 필요합니다.')
        window.location.href = '/src/pages/login/index.html'
        return
      }

      try {
        await addToCart(product.id, 1)
        alert('장바구니에 상품이 담겼습니다.')
      } catch (error) {
        console.error('장바구니 추가 실패:', error)
        alert('장바구니 추가에 실패했습니다.')
      }
    })

    // 카드 클릭 시 상세 페이지로 이동
    card.addEventListener('click', () => {
      window.location.href = `/src/pages/productDetail/index.html?product_id=${product.id}`
    })

    return card
  }

  // 상품 목록 렌더링
  renderProducts(products) {
    const productList = this.querySelector('#product-list')

    products.forEach((product) => {
      const card = this.createProductCard(product)
      productList.appendChild(card)
    })
  }

  // 상품 데이터 로드
  async loadProducts() {
    try {
      const data = await getproduct()
      const products = data.results || data

      // 처음 5개만 렌더링
      this.renderProducts(products)
    } catch (error) {
      console.error('상품 로드 실패:', error)
    }
  }
}

customElements.define('product-list', ProductList)
