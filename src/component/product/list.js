import { getproduct } from '/src/js/product/getproduct.js'

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
      <img src="${product.image}" alt="" class="product-image" />
      <div class="product-info">
        <div class="seller-name">${product.seller?.store_name || ''}</div>
        <div class="product-name">${product.info}</div>
        <div class="price">${this.formatPrice(product.price)}</div>
      </div>
    `

    // 클릭 시 상세 페이지로 이동
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
