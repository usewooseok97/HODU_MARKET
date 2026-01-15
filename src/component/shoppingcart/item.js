// 수량 카운터 컴포넌트 import
import '../etc/amountCounter.js'

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

  set quantity(value) {
    const newValue = Math.max(1, parseInt(value) || 1)
    if (this._quantity !== newValue) {
      this._quantity = newValue
      this.updateQuantityDisplay()
      this.dispatchQuantityChange()
    }
  }

  updateQuantityDisplay() {
    const amountCounter = this.querySelector('etc-amountcounter')
    if (amountCounter) {
      amountCounter.setAttribute('value', this._quantity)
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
          <label class="cart-checkbox-wrapper">
            <input type="checkbox" id="${itemId}" name="cart-item" class="cart-checkbox-input" />
            <span class="cart-checkbox-custom"></span>
            <span class="sr-only">상품 선택</span>
          </label>
        </div>
        <div class="cart-col-info">
          <div class="cart-product">
            <img src="/src/assets/images/cart-Product-list.png" alt="상품 이미지" class="cart-product-image" />
            <div class="cart-product-details">
              <span class="cart-seller">백엔드글로벌</span>
              <h3 class="cart-product-name">딥러닝 개발자 무릎 담요</h3>
              <span class="cart-product-price">17,500원</span>
              <span class="cart-shipping">택배배송 / 무료배송</span>
            </div>
          </div>
        </div>
        <div class="cart-col-quantity">
          <etc-amountcounter
            min="1" 
            max="999" 
            value="${this._quantity}"
            class="cart-amount-counter">
          </etc-amountcounter>
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
    // etc-amountcounter의 수량 변경 이벤트 감지
    const amountCounter = this.querySelector('etc-amountcounter')
    if (amountCounter) {
      amountCounter.addEventListener('amountchange', (e) => {
        this.quantity = e.detail.value
      })
    }
  }
}

customElements.define('shoppingcart-item', CartListItem)
