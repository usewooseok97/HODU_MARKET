import './payment.css'

class PaymentItem extends HTMLElement {
  // 기본 속성 정의
  static get observedAttributes() {
    return [
      'product-id',
      'image',
      'seller',
      'name',
      'price',
      'quantity',
      'shipping',
      'discount',
    ]
  }

  constructor() {
    super()
    this._data = {
      productId: null,
      image: '/src/assets/images/icon-img.png',
      seller: '',
      name: '',
      price: 0,
      quantity: 1,
      shipping: 0,
      discount: 0,
    }
  }

  connectedCallback() {
    this.initFromAttributes()
    this.render()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.initFromAttributes()
      if (this.isConnected) {
        this.render()
      }
    }
  }

  // 속성에서 데이터 초기화
  initFromAttributes() {
    this._data.productId = this.getAttribute('product-id')
    this._data.image =
    this.getAttribute('image') || '/src/assets/images/icon-img.png'
    this._data.seller = this.getAttribute('seller') || ''
    this._data.name = this.getAttribute('name') || ''
    this._data.price = parseInt(this.getAttribute('price')) || 0
    this._data.quantity = parseInt(this.getAttribute('quantity')) || 1
    this._data.shipping = parseInt(this.getAttribute('shipping')) || 0
    this._data.discount = parseInt(this.getAttribute('discount')) || 0
  }

  // Getter/Setter for quantity
  get quantity() {
    return this._data.quantity
  }

  set quantity(value) {
    const newValue = Math.max(1, parseInt(value) || 1)
    if (this._data.quantity !== newValue) {
      this._data.quantity = newValue
      this.setAttribute('quantity', newValue)
      this.updateDisplay()
      this.dispatchPriceChange()
    }
  }

  // 외부에서 데이터 설정
  setData(data) {
    this._data = { ...this._data, ...data }
    this.render()
    this.dispatchPriceChange()
  }

  // 가격 계산
  calculateTotalPrice() {
    const itemTotal = this._data.price * this._data.quantity
    const shippingCost = this._data.shipping || 0
    const discountAmount = this._data.discount || 0
    return itemTotal + shippingCost - discountAmount
  }

  // 가격 포맷팅
  formatPrice(price) {
    return price.toLocaleString('ko-KR') + '원'
  }

  // 배송비 표시 텍스트
  getShippingText() {
    if (!this._data.shipping || this._data.shipping === 0) {
      return '무료배송'
    }
    return this.formatPrice(this._data.shipping)
  }

  // 할인 표시 텍스트
  getDiscountText() {
    if (!this._data.discount || this._data.discount === 0) {
      return '-'
    }
    return '-' + this.formatPrice(this._data.discount)
  }

  // 가격 변경 이벤트 발송 (총합 계산용)
  dispatchPriceChange() {
    const event = new CustomEvent('payment-item-change', {
      detail: {
        productId: this._data.productId,
        price: this._data.price,
        quantity: this._data.quantity,
        shipping: this._data.shipping,
        discount: this._data.discount,
        totalPrice: this.calculateTotalPrice(),
      },
      bubbles: true,
    })
    this.dispatchEvent(event)
  }

  // 화면 업데이트 (수량 변경 시)
  updateDisplay() {
    const quantityEl = this.querySelector('.payment-quantity')
    const totalPriceEl = this.querySelector('.payment-total-price')

    if (quantityEl) {
      quantityEl.textContent = `수량 : ${this._data.quantity}개`
    }
    if (totalPriceEl) {
      totalPriceEl.textContent = this.formatPrice(this.calculateTotalPrice())
    }
  }

  render() {
    // 주문금액 = 상품 가격 × 수량 (배송비/할인 제외)
    const orderAmount = this._data.price * this._data.quantity

    this.innerHTML = `
      <div class="payment-item payment-grid">
        <div class="payment-col-info">
          <div class="payment-product">
            <img src="${this._data.image}" alt="${
              this._data.name
            } 상품 이미지" class="payment-product-image" />
            <div class="payment-product-details">
              <span class="payment-seller">${this._data.seller}</span>
              <h3 class="payment-product-name">${this._data.name}</h3>
              <span class="payment-quantity">수량 : ${
                this._data.quantity
              }개</span>
            </div>
          </div>
        </div>
        <div class="payment-col-discount">
          <span class="payment-discount-value">${this.getDiscountText()}</span>
        </div>
        <div class="payment-col-shipping">
          <span class="payment-shipping-value">${this.getShippingText()}</span>
        </div>
        <div class="payment-col-total">
          <span class="payment-total-price">${this.formatPrice(
            orderAmount
          )}</span>
        </div>
      </div>
    `

  }
}

customElements.define('payment-item', PaymentItem)
