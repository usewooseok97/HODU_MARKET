/ src/component/etc/checkbox.js

class EtcCheckbox extends HTMLElement {
  constructor() {
    super()
    this.loadStyle()
  }

  connectedCallback() {
    const text = this.getAttribute('text') || '주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.'
    const checked = this.hasAttribute('checked')
    const name = this.getAttribute('name') || ''
    const value = this.getAttribute('value') || 'on'

    this.innerHTML = `
      <div class="check-text">
        <div class="check-box">
          <input 
            type="checkbox" 
            id="${this._generateId()}"
            name="${name}"
            value="${value}"
            ${checked ? 'checked' : ''}
          >
          <label for="${this._generateId()}"></label>
        </div>
        <label for="${this._generateId()}" class="check-label">
          ${text}
        </label>
      </div>
    `
    this._setupEventListeners()
  }

  loadStyle() {
    // 이미 로드되었는지 확인
    if (document.querySelector('link[href*="checkbox.css"]')) {
      return
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/src/component/etc/checkbox.css' // 프로젝트 경로에 맞게 수정
    document.head.appendChild(link)
  }

  _generateId() {
    if (!this._id) {
      this._id = `checkbox-${Math.random().toString(36).substr(2, 9)}`
    }
    return this._id
  }

  _setupEventListeners() {
    const checkbox = this.querySelector('input[type="checkbox"]')

    checkbox.addEventListener('change', (e) => {
      // 커스텀 이벤트 발생
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: {
            checked: e.target.checked,
            value: e.target.value,
          },
          bubbles: true,
        })
      )
    })
  }

  // 외부에서 체크 상태 확인
  get checked() {
    return this.querySelector('input[type="checkbox"]')?.checked || false
  }

  // 외부에서 체크 상태 변경
  set checked(value) {
    const checkbox = this.querySelector('input[type="checkbox"]')
    if (checkbox) {
      checkbox.checked = value
    }
  }

  // 외부에서 값 가져오기
  get value() {
    return this.querySelector('input[type="checkbox"]')?.value || ''
  }
}

customElements.define('etc-checkbox', EtcCheckbox)
