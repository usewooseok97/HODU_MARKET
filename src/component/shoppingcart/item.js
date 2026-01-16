import './cart.css'
// 수량 카운터 컴포넌트 import
import '../etc/amountCounter.js'

class CartListItem extends HTMLElement {
  constructor() {
    super()
    this._quantity = 1
    this._itemData = null
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

  // 아이템 데이터 설정
  setItemData(data) {
    this._itemData = data
    this._quantity = data.quantity || 1
    this.render()
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
    const data = this._itemData || {}

    // 데이터 추출 (기본값 포함)
    const image = data.image || '/src/assets/images/icon-img.png'
    const seller = data.seller || '판매자'
    const productName = data.productName || '상품명'
    const price = data.price || 0
    const shipping = data.shipping || 0
    const shippingMethod = data.shippingMethod || '택배배송'
    const stock = data.stock || 99

    // 가격 포맷팅
    const formattedPrice = price.toLocaleString('ko-KR')
    const shippingText = shipping === 0 ? '무료배송' : `${shipping.toLocaleString('ko-KR')}원`
    const totalPrice = (price * this._quantity).toLocaleString('ko-KR')

    this.innerHTML = `
      <div class="cart-list-item cart-grid">
        <div class="cart-col-check">
          <label class="cart-checkbox-wrapper">
            <input type="checkbox" id="${itemId}" name="cart-item" class="cart-checkbox-input" checked />
            <span class="cart-checkbox-custom"></span>
            <span class="sr-only">상품 선택</span>
          </label>
        </div>
        <div class="cart-col-info">
          <div class="cart-product">
            <img src="${image}" alt="${productName}" class="cart-product-image" />
            <div class="cart-product-details">
              <span class="cart-seller">${seller}</span>
              <h3 class="cart-product-name">${productName}</h3>
              <span class="cart-product-price">${formattedPrice}원</span>
              <span class="cart-shipping">${shippingMethod} / ${shippingText}</span>
            </div>
          </div>
        </div>
        <div class="cart-col-quantity">
          <etc-amountcounter
            min="1"
            max="${stock}"
            value="${this._quantity}"
            class="cart-amount-counter">
          </etc-amountcounter>
        </div>
        <div class="cart-col-price">
          <span class="cart-total-price">${totalPrice}원</span>
          <button type="button" class="order-btn">주문하기</button>
        </div>
        <button type="button" class="cart-delete-btn" aria-label="상품 삭제">×</button>
      </div>
    `

    this.initEventListeners()
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
