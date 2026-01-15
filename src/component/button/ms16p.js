class MS16pButton extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    // `inline-block` 보장 (width 적용 가능하도록)
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

    let buttonClass = 'ms-16p-button'
    if (variant === 'white') {
      buttonClass += ' ms-16p-button--white'
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
      const value = this.getAttribute('value') || ''
      this.dispatchEvent(
        new CustomEvent('button-click', {
          bubbles: true,
          detail: { originalEvent: e, value },
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
      button.className = 'ms-16p-button'
      if (newValue === 'white') {
        button.classList.add('ms-16p-button--white')
      }
    }

    if (name === 'width') {
      this.applyWidth()
    }
  }

  // ⭐ width 적용
  applyWidth() {
    const widthAttr = this.getAttribute('width')

    // inline-block 보장
    if (!this.style.display) {
      this.style.display = 'inline-block'
    }

    if (widthAttr) {
      this.style.width = widthAttr // px, %, rem 등 다 허용
    } else {
      this.style.width = '100%' // 기본값
    }
  }

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

customElements.define('button-ms16p', MS16pButton)
