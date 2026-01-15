class CartListHeader extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <div class="cart-list-header cart-grid">
        <div class="cart-col-check">
          <label class="cart-checkbox-wrapper">
            <input type="checkbox" id="select-all" class="cart-checkbox-input" />
            <span class="cart-checkbox-custom"></span>
            <span class="sr-only">전체 상품 선택</span>
          </label>
        </div>
        <div class="cart-col-info">상품정보</div>
        <div class="cart-col-quantity">수량</div>
        <div class="cart-col-price">상품금액</div>
      </div>
    `

    this.loadStyles()
  }

  loadStyles() {
    if (!document.querySelector('link[href*="cart.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/shoppingcart/cart.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('shoppingcart-header', CartListHeader)
