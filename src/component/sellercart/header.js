import './styles.css'

class SellerCartHeader extends HTMLElement {
  connectedCallback() {
    this.render()
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
}

customElements.define('sellercart-header', SellerCartHeader)
