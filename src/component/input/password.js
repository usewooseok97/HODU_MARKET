class PasswordInput extends HTMLElement {
  static get observedAttributes() {
    return ['variant']
  }

  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    const label = this.getAttribute('label') || '비밀번호'
    const placeholder = this.getAttribute('placeholder') || ''
    const inputId = this.getAttribute('id') || 'password'

    this.innerHTML = `
      <div class="ps-box">
        <label for="${inputId}-input" class="ps-text">${label}</label>
        <div class="ps-input-wrapper">
          <input
            type="password"
            id="${inputId}-input"
            class="ps-input"
            placeholder="${placeholder}"
          />
          <span class="ps-status-icon"></span>
        </div>
        <p class="ps-message"></p>
      </div>
    `

    this.loadStyles()
  }

  attachEventListeners() {
    const input = this.querySelector('.ps-input')

    if (input) {
      input.addEventListener('input', () => {
        this.dispatchEvent(new CustomEvent('input-change', {
          bubbles: true,
          detail: { value: input.value }
        }))
      })
    }
  }

  loadStyles() {
    if (
      !document.querySelector('link[href*="/src/component/input/styles.css"]')
    ) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/input/styles.css'
      document.head.appendChild(link)
    }
  }

  // 상태 설정 (success, error)
  setStatus(status, message = '') {
    const input = this.querySelector('.ps-input')
    const wrapper = this.querySelector('.ps-input-wrapper')
    const icon = this.querySelector('.ps-status-icon')
    const msg = this.querySelector('.ps-message')

    // 클래스 초기화
    if (input) input.classList.remove('success', 'error')
    if (wrapper) wrapper.classList.remove('success', 'error')
    if (icon) icon.classList.remove('success', 'error')

    if (status) {
      if (input) input.classList.add(status)
      if (wrapper) wrapper.classList.add(status)
      if (icon) icon.classList.add(status)
    }

    if (msg) {
      msg.textContent = message
      msg.className = 'ps-message'
      if (status) msg.classList.add(status)
    }
  }

  getValue() {
    const input = this.querySelector('.ps-input')
    return input ? input.value : ''
  }

  setValue(value) {
    const input = this.querySelector('.ps-input')
    if (input) input.value = value
  }

  static get observedAttributes() {
    return ['label', 'placeholder']
  }
}

customElements.define('input-password', PasswordInput)
