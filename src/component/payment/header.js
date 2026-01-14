class PaymentHeader extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <div class="payment-header payment-grid">
        <div class="payment-col-info">상품정보</div>
        <div class="payment-col-discount">할인</div>
        <div class="payment-col-shipping">배송비</div>
        <div class="payment-col-total">주문금액</div>
      </div>
    `

    this.loadStyles()
  }

  loadStyles() {
    if (!document.querySelector('link[href*="payment.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/payment/payment.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('payment-header', PaymentHeader)
