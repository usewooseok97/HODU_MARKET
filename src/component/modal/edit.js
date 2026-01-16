import '@component/button/small.js'

class ProductEditModal extends HTMLElement {
  constructor() {
    super()
    this.product = null
    this._onOverlayClick = this._onOverlayClick.bind(this)
  }

  static get observedAttributes() {
    return ['open']
  }

  connectedCallback() {
    this.render()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open' && oldValue !== newValue) {
      this.render()
    }
  }

  open(product) {
    this.product = product
    this.setAttribute('open', '')
  }

  close() {
    this.removeAttribute('open')
  }

  render() {
    if (!this.hasAttribute('open')) {
      this.innerHTML = ''
      return
    }

    const name = this.product?.name ?? ''
    const price = this.product?.price ?? ''
    const stock = this.product?.stock ?? ''

    this.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-container" role="dialog" aria-modal="true" aria-label="상품 수정">
          <div class="modal-header">
            <h2>상품 수정</h2>
            <button class="modal-close" aria-label="닫기">×</button>
          </div>
          <div class="modal-body">
            <label class="modal-field">
              <span>상품명</span>
              <input type="text" class="modal-input" name="name" value="${name}">
            </label>
            <label class="modal-field">
              <span>판매가</span>
              <input type="text" class="modal-input" name="price" value="${price}">
            </label>
            <label class="modal-field">
              <span>재고</span>
              <input type="text" class="modal-input" name="stock" value="${stock}">
            </label>
          </div>
          <div class="modal-actions">
            <button-small class="modal-cancel" text="취소" variant="white" width="100px"></button-small>
            <button-small class="modal-save" text="저장" width="100px"></button-small>
          </div>
        </div>
      </div>
    `

    this.loadStyles()
    this.attachEvents()
  }

  attachEvents() {
    const overlay = this.querySelector('.modal-overlay')
    const closeBtn = this.querySelector('.modal-close')
    const cancelBtn = this.querySelector('.modal-cancel')
    const saveBtn = this.querySelector('.modal-save')

    overlay?.addEventListener('click', this._onOverlayClick)
    closeBtn?.addEventListener('click', () => this.close())
    cancelBtn?.addEventListener('button-click', () => this.close())
    saveBtn?.addEventListener('button-click', () => this.handleSave())
  }

  _onOverlayClick(e) {
    if (e.target === this.querySelector('.modal-overlay')) {
      this.close()
    }
  }

  handleSave() {
    if (!this.product) return

    const nameInput = this.querySelector('input[name="name"]')
    const priceInput = this.querySelector('input[name="price"]')
    const stockInput = this.querySelector('input[name="stock"]')

    const updates = {}
    const nameValue = nameInput?.value?.trim() ?? ''
    const priceValue = priceInput?.value?.trim() ?? ''
    const stockValue = stockInput?.value?.trim() ?? ''

    if (nameValue !== '' && nameValue !== this.product.name) {
      updates.name = nameValue
    }

    if (priceValue !== '') {
      const price = Number.parseInt(priceValue, 10)
      if (Number.isNaN(price)) {
        alert('판매가는 숫자여야 합니다.')
        return
      }
      if (price !== this.product.price) updates.price = price
    }

    if (stockValue !== '') {
      const stock = Number.parseInt(stockValue, 10)
      if (Number.isNaN(stock)) {
        alert('재고는 숫자여야 합니다.')
        return
      }
      if (stock !== this.product.stock) updates.stock = stock
    }

    this.dispatchEvent(
      new CustomEvent('product-save', {
        bubbles: true,
        composed: true,
        detail: {
          productId: this.product.id,
          updates,
        },
      })
    )

    this.close()
  }

  loadStyles() {
    if (!document.querySelector('link[href*="modal/edit.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/modal/edit.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('modal-edit', ProductEditModal)
