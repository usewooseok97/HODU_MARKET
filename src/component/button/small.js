class SButton extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    // width 제어 가능하도록 inline-block 지정
    if (!this.style.display) {
      this.style.display = 'inline-block'
    }

    this.render()
    this.applyWidth()
    this.attachEventListeners()
  }

  render() {
    const text = this.getAttribute('text') || '버튼'
    const disabled = this.hasAttribute('disabled')
    const variant = this.getAttribute('variant') || 'default'
    const type = this.getAttribute('type') || 'button'

    let buttonClass = 's-button'
    if (variant === 'white') {
      buttonClass += ' s-button--white'
    }

    this.innerHTML = `
      <button 
        class="${buttonClass}" 
        type="${type}"
        ${disabled ? 'disabled' : ''}
      >
        ${text}
      </button>
    `

    this.loadStyles()
  }

  attachEventListeners() {
    const button = this.querySelector('button')
    if (!button) return

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
    if (!document.querySelector('link[href*="button.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/button/button.css'
      document.head.appendChild(link)
    }
  }

  // ⭐ width 속성 추가
  static get observedAttributes() {
    return ['disabled', 'text', 'variant', 'width']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const button = this.querySelector('button')
    if (!button) return

    if (name === 'disabled') {
      button.disabled = newValue !== null
    }

    if (name === 'text') {
      button.textContent = newValue || '버튼'
    }

    if (name === 'variant') {
      button.className = 's-button'
      if (newValue === 'white') {
        button.classList.add('s-button--white')
      }
    }

    if (name === 'width') {
      this.applyWidth()
    }
  }

  // ⭐ width 적용
  applyWidth() {
    const widthAttr = this.getAttribute('width')

    if (!this.style.display) {
      this.style.display = 'inline-block'
    }

    if (widthAttr) {
      this.style.width = widthAttr // px, %, rem 지원
    } else {
      this.style.width = '100%' // 기본값
    }
  }

  // 프로그래밍 제어
  setDisabled(disabled) {
    const button = this.querySelector('button')
    if (button) {
      button.disabled = disabled
      if (disabled) this.setAttribute('disabled', '')
      else this.removeAttribute('disabled')
    }
  }

  setText(text) {
    this.setAttribute('text', text)
  }

  setVariant(variant) {
    this.setAttribute('variant', variant)
  }
}

customElements.define('button-small', SButton)
