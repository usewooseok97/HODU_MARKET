// src/component/modal/check.js
class Modal extends HTMLElement {
  constructor() {
    super()
    this.message = ''
    this.onConfirm = null
    this.onCancel = null
    this.isOpen = false
  }

  static get observedAttributes() {
    return ['message', 'open']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return

    if (name === 'open') {
      this.isOpen = newValue !== null
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
            <div class="modal-message">
              ${this.message || '상품을 삭제하시겠습니까?'}
            </div>
          </div>

          <!-- 하단 버튼 -->
          <div class="modal-buttons">
            <button-small 
              class="modal-cancel-btn" 
              text="아니오" 
              variant="white"
              width="100px"
            ></button-small>

            <button-small 
              class="modal-confirm-btn" 
              text="예"
              width="100px"
            ></button-small>
          </div>
        </div>
      </div>
    `

    this.loadStyles()
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
    this.dispatchEvent(
      new CustomEvent('modal-confirm', {
        detail: {},
        bubbles: true,
        composed: true,
      })
    )

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
