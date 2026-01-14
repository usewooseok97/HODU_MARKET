class SellerCartItem extends HTMLElement {
  connectedCallback() {
    this.render()
    this.loadStyles()
  }

  render() {
    // 속성값 가져오기
    const imgSrc =
      this.getAttribute('img-src') || '/src/assets/images/rabbit.png'
    const imgAlt = this.getAttribute('img-alt') || '판매상품'
    const productName =
      this.getAttribute('product-name') || '딥러닝 개발자 무릎 담요'
    const stock = this.getAttribute('stock') || '370'
    const price = this.getAttribute('price') || '17,500원'

    this.innerHTML = `
      <div class="product-item">
        <!-- 상품 정보 -->
        <div class="contents">
          <img
            src="${imgSrc}"
            alt="${imgAlt}"
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
      </div>
    `

    this.attachEventListeners()
  }

  attachEventListeners() {
    const editBtn = this.querySelector('.btn-edit button-small')
    const deleteBtn = this.querySelector('.btn-delete button-small')

    if (editBtn) {
      editBtn.addEventListener('button-click', () => {
        this.dispatchEvent(
          new CustomEvent('edit-click', {
            bubbles: true,
            detail: {
              productName: this.getAttribute('product-name'),
              stock: this.getAttribute('stock'),
              price: this.getAttribute('price'),
            },
          })
        )
      })
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('button-click', () => {
        this.dispatchEvent(
          new CustomEvent('delete-click', {
            bubbles: true,
            detail: {
              productName: this.getAttribute('product-name'),
            },
          })
        )
      })
    }
  }

  static get observedAttributes() {
    return ['img-src', 'img-alt', 'product-name', 'stock', 'price']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render()
    }
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

customElements.define('sellercart-item', SellerCartItem)
