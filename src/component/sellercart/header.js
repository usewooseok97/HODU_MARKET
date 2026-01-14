class SellerCartHeader extends HTMLElement {
  connectedCallback() {
    this.render()
    this.loadStyles()
  }

  render() {
    this.innerHTML = `
      <div class="header-text">
        <p>상품정보</p>
        <p>판매가격</p>
        <p>수정</p>
        <p>삭제</p>
      </div>
    `
  }

  loadStyles() {
    if (!document.querySelector('link[href*="sellercart/styles.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/sellercart/styles.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('sellercart-header', SellerCartHeader)
