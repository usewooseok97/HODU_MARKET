// getter: 외부에서 value 접근 가능
// 1. getter로 값 읽기
// const item = document.querySelector('shoppingcart-item')
// console.log(item.quantity) // 현재 수량
// 2. setter로 값 변경
// item.quantity = 5 // 자동으로 화면 업데이트

// // 3. CustomEvent로 변경 감지
// item.addEventListener('quantity-change', (e) => {
//   console.log('수량 변경:', e.detail.quantity)
//   // 총 금액 계산, 장바구니 업데이트 등에 활용
// })

class CartListItem extends HTMLElement {
  constructor() {
    super()
    this._quantity = 1
  }

  connectedCallback() {
    this.render()
  }

  get quantity() {
    return this._quantity
  }

  // setter: 외부에서 value 변경 가능
  set quantity(value) {
    const newValue = Math.max(1, parseInt(value) || 1)
    if (this._quantity !== newValue) {
      this._quantity = newValue
      this.updateQuantityDisplay()
      this.dispatchQuantityChange()
    }
  }

  updateQuantityDisplay() {
    const valueSpan = this.querySelector('.quantity-value')
    if (valueSpan) {
      valueSpan.textContent = this._quantity
    }
  }

  dispatchQuantityChange() {
    const event = new CustomEvent('quantity-change', {
      detail: { quantity: this._quantity },
      bubbles: true,
    })
    this.dispatchEvent(event)
  }

  render() {
    const itemId = `cart-item-${Date.now()}`

    this.innerHTML = `
      <div class="cart-list-item cart-grid">
        <div class="cart-col-check">
          <input type="checkbox" id="${itemId}" name="cart-item" class="cart-checkbox" />
          <label for="${itemId}" class="sr-only">딥러닝 개발자 무릎 담요 선택</label>
        </div>
        <div class="cart-col-info">
          <div class="cart-product">
            <img src="./src/assets/cart-Product-list.png" alt="딥러닝 개발자 무릎 담요 상품 이미지" class="cart-product-image" />
            <div class="cart-product-details">
              <span class="cart-seller">백엔드글로벌</span>
              <h3 class="cart-product-name">딥러닝 개발자 무릎 담요</h3>
              <span class="cart-product-price">17,500원</span>
              <span class="cart-shipping">택배배송 / 무료배송</span>
            </div>
          </div>
        </div>
        <div class="cart-col-quantity">
          <div class="quantity-control">
            <button type="button" class="quantity-btn minus" aria-label="수량 감소">−</button>
            <span class="quantity-value">${this._quantity}</span>
            <button type="button" class="quantity-btn plus" aria-label="수량 증가">+</button>
          </div>
        </div>
        <div class="cart-col-price">
          <span class="cart-total-price">17,500원</span>
          <button type="button" class="order-btn">주문하기</button>
        </div>
        <button type="button" class="cart-delete-btn" aria-label="상품 삭제">×</button>
      </div>
    `

    this.loadStyles()
    this.initEventListeners()
  }

  loadStyles() {
    if (!document.querySelector('link[href*="cart.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/shoppingcart/cart.css'
      document.head.appendChild(link)
    }
  }

  initEventListeners() {
    const minusBtn = this.querySelector('.minus')
    const plusBtn = this.querySelector('.plus')

    minusBtn.addEventListener('click', () => {
      this.quantity = this._quantity - 1
    })

    plusBtn.addEventListener('click', () => {
      this.quantity = this._quantity + 1
    })
  }
}

customElements.define('shoppingcart-item', CartListItem)
