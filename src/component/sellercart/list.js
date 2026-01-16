import { getSellerProducts } from '../../js/seller/getSellerProducts.js'
import { deleteSellerProduct } from '../../js/seller/deleteSellerProduct.js'
import '@component/button/small.js'

class SellerCartList extends HTMLElement {
  constructor() {
    super()
    this._products = []
  }

  connectedCallback() {
    this.render()
    this.loadProducts()
  }

  static get observedAttributes() {
    return ['seller-name']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'seller-name' && oldValue !== newValue && newValue) {
      this.loadProducts()
    }
  }

  render() {
    this.innerHTML = `
      <div class="sellercart-container">
        <div id="sellercart-list" class="sellercart-grid">
          <!-- 판매 상품 목록이 렌더링됩니다 -->
        </div>
      </div>
    `

    this.loadStyles()
  }

  loadStyles() {
    if (!document.querySelector('link[href*="sellercart/styles.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/sellercart/styles.css'
      document.head.appendChild(link)
    }
  }

  // 가격 포맷팅 함수 (천 단위 콤마)
  formatPrice(price) {
    return price.toLocaleString('ko-KR')
  }

  // 상품 아이템 HTML 생성
  createProductItem(product) {
    const item = document.createElement('div')
    item.className = 'product-item'
    item.dataset.productId = product.id

    const imgSrc = product.image || '/src/assets/images/rabbit.png'
    const productName = product.name || '상품명 없음'
    const stock = product.stock !== undefined ? product.stock : 0
    const price =
      product.price !== undefined
        ? `${this.formatPrice(product.price)}원`
        : '0원'

    item.innerHTML = `
      <!-- 상품 정보 -->
      <div class="contents">
        <img
          src="${imgSrc}"
          alt="${productName}"
        />
        <div class="contents-text">
          <p>${productName}</p>
          <p>재고 : ${stock}개</p>
        </div>
      </div>

      <!-- 가격 -->
      <p class="price">${price}</p>

      <!-- 수정 버튼 -->
      <div class="btn-edit">
        <button-small text="수정" width="80px"></button-small>
      </div>

      <!-- 삭제 버튼 -->
      <div class="btn-delete">
        <button-small text="삭제" width="80px" variant="white"></button-small>
      </div>
    `

    this.attachItemEventListeners(item, product)

    return item
  }

  // 개별 아이템 이벤트 리스너
  attachItemEventListeners(item, product) {
    const editBtn = item.querySelector('.btn-edit button-small')
    const deleteBtn = item.querySelector('.btn-delete button-small')

    if (editBtn) {
      editBtn.addEventListener('button-click', () => {
        this.dispatchEvent(
          new CustomEvent('edit-click', {
            bubbles: true,
            detail: product,
          })
        )
      })
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('button-click', () => {
        const confirmed = window.confirm('이 상품을 삭제하시겠습니까?')
        if (!confirmed) return

        this.handleDelete(product)
      })
    }
  }

  async handleDelete(product) {
    try {
      await deleteSellerProduct(product.id)
      this.loadProducts()
    } catch (error) {
      console.error('삭제 처리 실패:', error)
      alert('상품 삭제에 실패했습니다.')
    }
  }

  // 상품 목록 렌더링
  renderProducts(products) {
    const productList = this.querySelector('#sellercart-list')
    productList.innerHTML = '' // 기존 내용 초기화

    if (products.length === 0) {
      productList.innerHTML =
        '<p class="empty-message">등록된 상품이 없습니다.</p>'
      return
    }

    products.forEach((product) => {
      const item = this.createProductItem(product)
      productList.appendChild(item)
    })
  }

  // 상품 데이터 로드
  async loadProducts() {
    const productList = this.querySelector('#sellercart-list')

    try {
      const data = await getSellerProducts()
      const products = Array.isArray(data) ? data : data?.results ?? []

      this._products = products
      this.renderProducts(products)
    } catch (error) {
      console.error('판매자 상품 로드 실패:', error)
      if (productList) {
        productList.innerHTML =
          '<p class="empty-message">상품을 불러오지 못했습니다.</p>'
      }
    }
  }

  // 외부에서 상품 목록 새로고침
  refresh() {
    this.loadProducts()
  }

  // 현재 상품 목록 반환
  get products() {
    return this._products
  }
}

customElements.define('sellercart-list', SellerCartList)
