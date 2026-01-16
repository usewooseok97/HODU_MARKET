import './check.css'

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
      if (this.isOpen) {
        // 모달이 열릴 때만 이벤트 리스너 설정
        this.setupEventListeners()
      }
    }
  }

  connectedCallback() {
    this.render()
    if (this.isOpen) {
      this.setupEventListeners()
    }
  }

  render() {
    if (!this.isOpen) {
      this.innerHTML = ''
      return
    }
    const cancelText = this.getAttribute('cancel-text') ?? '취소'
    const confirmText = this.getAttribute('confirm-text') ?? '확인'

    this.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-container">
        <button class="modal-close" aria-label="닫기">
          <logo-delete></logo-delete>
        </button>

        <div class="modal-content">
          <div class="modal-message">
            ${this.message || ''}
          </div>
        </div>

        <div class="modal-buttons">
          <button-small
            class="modal-cancel-btn"
            text="${cancelText}"
            variant="white"
            width="100px"
          ></button-small>

          <button-small
            class="modal-confirm-btn"
            text="${confirmText}"
            width="100px"
          ></button-small>
        </div>
      </div>
    </div>
  `
  }

  setupEventListeners() {
    console.log('[Modal] setupEventListeners 호출됨')

    // 이전 이벤트 리스너 정리
    this.removeEventListeners()

    // 오버레이 클릭 시 모달 닫기
    const overlay = this.querySelector('.modal-overlay')
    if (overlay) {
      this.overlayClickHandler = (e) => {
        if (e.target === overlay) {
          console.log('[Modal] 오버레이 클릭 - 취소')
          this.cancel() // 배경 클릭 시 취소로 처리
        }
      }
      overlay.addEventListener('click', this.overlayClickHandler)
      console.log('[Modal] 오버레이 이벤트 등록')
    }

    // X 버튼 클릭 시 모달 닫기
    const closeBtn = this.querySelector('.modal-close')
    if (closeBtn) {
      this.closeBtnClickHandler = () => {
        console.log('[Modal] X 버튼 클릭 - 취소')
        this.cancel()
      }
      closeBtn.addEventListener('click', this.closeBtnClickHandler)
      console.log('[Modal] X 버튼 이벤트 등록')
    }

    // 취소 버튼 클릭
    const cancelBtn = this.querySelector('.modal-cancel-btn')
    if (cancelBtn) {
      this.cancelBtnClickHandler = () => {
        console.log('[Modal] 취소 버튼 클릭')
        this.cancel()
      }
      cancelBtn.addEventListener('click', this.cancelBtnClickHandler)
      cancelBtn.addEventListener('button-click', this.cancelBtnClickHandler)
      console.log('[Modal] 취소 버튼 이벤트 등록')
    }

    // 확인 버튼 클릭
    const confirmBtn = this.querySelector('.modal-confirm-btn')
    if (confirmBtn) {
      this.confirmBtnClickHandler = () => {
        console.log('[Modal] 확인 버튼 클릭')
        this.confirm()
      }
      confirmBtn.addEventListener('click', this.confirmBtnClickHandler)
      confirmBtn.addEventListener('button-click', this.confirmBtnClickHandler)
      console.log('[Modal] 확인 버튼 이벤트 등록')
    }

    // ESC 키로 모달 닫기
    this.handleEscKey = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        console.log('[Modal] ESC 키 누름 - 취소')
        this.cancel()
      }
    }
    document.addEventListener('keydown', this.handleEscKey)
    console.log('[Modal] ESC 키 이벤트 등록')
  }

  removeEventListeners() {
    if (this.handleEscKey) {
      document.removeEventListener('keydown', this.handleEscKey)
    }
  }

  confirm() {
    console.log('[Modal] confirm() 메소드 호출 - 커스텀 이벤트 발생')
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
    console.log('[Modal] cancel() 메소드 호출 - 커스텀 이벤트 발생')
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
    this.isOpen = false
    this.removeAttribute('open')
    this.removeEventListeners()
    this.render()
  }

  disconnectedCallback() {
    this.removeEventListeners()
  }
}

customElements.define('modal-check', Modal)
