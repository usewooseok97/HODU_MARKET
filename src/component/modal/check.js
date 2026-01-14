// src/component/modal/check.js
class Modal extends HTMLElement {
  constructor() {
    super()
    this.type = 'confirm' // 'confirm' | 'amount'
    this.message = ''
    this.onConfirm = null
    this.onCancel = null
    this.isOpen = false
  }

  // variant 로도 제어할 수 있게 추가
  static get observedAttributes() {
    return ['type', 'variant', 'message', 'open']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return

    if (name === 'open') {
      this.isOpen = newValue !== null
    } else if (name === 'variant') {
      // variant="amount" 같은 걸 type 이랑 동일하게 취급
      this.type = newValue || 'confirm'
    } else {
      this[name] = newValue
    }

    if (this.isConnected) {
      this.render()
    }
  }

  connectedCallback() {
    this.render()
    this.setupEventListeners()
  }

  render() {
    const isAmountType = this.type === 'amount'

    if (!this.isOpen) {
      this.innerHTML = ''
      return
    }

    this.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-container">
          <!-- 오른쪽 위 X 버튼 -->
          <button class="modal-close" aria-label="닫기">
            <logo-delete></logo-delete>
          </button>

          <!-- 내용 영역 -->
          <div class="modal-content">
            ${isAmountType ? this.renderAmountContent() : this.renderConfirmContent()}
          </div>

          <!-- 하단 버튼 -->
          <div class="modal-buttons">
            <button-small 
              class="modal-cancel-btn" 
              text="취소" 
              variant="white"
              width="100px"
            ></button-small>

            <button-small 
              class="modal-confirm-btn" 
              text="${isAmountType ? '수정' : '확인'}"
              width="100px"
            ></button-small>
          </div>
        </div>
      </div>
    `

    this.loadStyles()
  }

  renderAmountContent() {
    return `
      <div class="modal-amount-wrapper">
        <etc-amount-counter></etc-amount-counter>
      </div>
    `
  }

  renderConfirmContent() {
    return `
      <div class="modal-message">
        ${this.message || '상품을 삭제하시겠습니까?'}
      </div>
    `
  }

  setupEventListeners() {
    const overlay = this.querySelector('.modal-overlay')
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.close()
      }
    })

    const closeBtn = this.querySelector('.modal-close')
    closeBtn?.addEventListener('click', () => this.close())

    const cancelBtn = this.querySelector('.modal-cancel-btn')
    cancelBtn?.addEventListener('click', () => this.cancel())

    const confirmBtn = this.querySelector('.modal-confirm-btn')
    confirmBtn?.addEventListener('click', () => this.confirm())

    this.handleEscKey = (e) => {
      if (e.key === 'Escape') this.close()
    }
    document.addEventListener('keydown', this.handleEscKey)
  }

  confirm() {
    if (this.type === 'amount') {
      const counter = this.querySelector('etc-amount-counter')
      const value = counter?.getAttribute('value') || 1

      this.dispatchEvent(
        new CustomEvent('modal-confirm', {
          detail: { value: parseInt(value, 10) },
          bubbles: true,
          composed: true,
        })
      )
    } else {
      this.dispatchEvent(
        new CustomEvent('modal-confirm', {
          detail: {},
          bubbles: true,
          composed: true,
        })
      )
    }

    if (this.onConfirm) this.onConfirm()
    this.close()
  }

  cancel() {
    this.dispatchEvent(
      new CustomEvent('modal-cancel', {
        bubbles: true,
        composed: true,
      })
    )

    if (this.onCancel) this.onCancel()
    this.close()
  }

  close() {
    document.removeEventListener('keydown', this.handleEscKey)
    this.remove()
  }

  loadStyles() {
    if (!document.querySelector('link[href*="modal/check.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/modal/check.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('modal-check', Modal)
