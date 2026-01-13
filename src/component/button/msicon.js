class MSIconButton extends HTMLElement {
  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    // 속성 가져오기
    const text = this.getAttribute('text') || '상품 업로드'
    const disabled = this.hasAttribute('disabled')
    const type = this.getAttribute('type') || 'button'
    const icon = this.getAttribute('icon') || 'icon-plus.png' // 아이콘 이미지 파일명

    // 버튼 생성
    this.innerHTML = `
      <button 
        class="ms-icon-button" 
        type="${type}"
        ${disabled ? 'disabled' : ''}
      >
        <img src="/src/assets/images/${icon}" alt="icon" class="ms-icon-button__icon">
        <span class="ms-icon-button__text">${text}</span>
      </button>
    `

    // 스타일 로드
    this.loadStyles()
  }

  attachEventListeners() {
    const button = this.querySelector('button')

    // 클릭 이벤트 전파
    button.addEventListener('click', (e) => {
      this.dispatchEvent(
        new CustomEvent('button-click', {
          bubbles: true,
          detail: { originalEvent: e },
        })
      )
    })
  }

  loadStyles() {
    // button.css가 이미 로드되어 있는지 확인
    if (!document.querySelector('link[href*="button.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/button/button.css'
      document.head.appendChild(link)
    }
  }

  // 동적으로 속성 변경 가능
  static get observedAttributes() {
    return ['disabled', 'text', 'icon']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.querySelector('button')) return

    if (name === 'disabled') {
      const button = this.querySelector('button')
      if (newValue !== null) {
        button.disabled = true
      } else {
        button.disabled = false
      }
    } else if (name === 'text') {
      const textEl = this.querySelector('.ms-icon-button__text')
      if (textEl) textEl.textContent = newValue || '상품 업로드'
    } else if (name === 'icon') {
      const iconEl = this.querySelector('.ms-icon-button__icon')
      if (iconEl) iconEl.src = `/src/assets/images/${newValue}`
    }
  }

  // 프로그래밍 방식으로 제어
  setDisabled(disabled) {
    const button = this.querySelector('button')
    if (button) {
      button.disabled = disabled
      if (disabled) {
        this.setAttribute('disabled', '')
      } else {
        this.removeAttribute('disabled')
      }
    }
  }

  setText(text) {
    const textEl = this.querySelector('.ms-icon-button__text')
    if (textEl) {
      textEl.textContent = text
      this.setAttribute('text', text)
    }
  }

  setIcon(icon) {
    this.setAttribute('icon', icon)
  }
}

customElements.define('button-ms-icon', MSIconButton)
