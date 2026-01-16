import './button.css'

class MButton extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    // 기본 display 설정
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

    let buttonClass = 'm-button'
    if (variant === 'dark') {
      buttonClass += ' m-button--dark'
    } else if (variant === 'white') {
      buttonClass += ' m-button--white'
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

  }

  attachEventListeners() {
    const button = this.querySelector('button')
    if (!button) return

    button.addEventListener('click', (e) => {
      if (this.hasAttribute('disabled')) return
      this.dispatchEvent(
        new CustomEvent('button-click', {
          bubbles: true,
          detail: { originalEvent: e },
        })
      )
    })
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
      button.className = 'm-button'
      if (newValue === 'dark') {
        button.classList.add('m-button--dark')
      } else if (newValue === 'white') {
        button.classList.add('m-button--white')
      }
    }

    if (name === 'width') {
      this.applyWidth()
    }
  }

  // ⭐ width 적용 로직
  applyWidth() {
    const widthAttr = this.getAttribute('width')

    if (widthAttr) {
      this.style.width = widthAttr
    } else {
      this.style.width = '100%' // 기본값
    }
  }

  // 개발자 컨트롤 API 유지
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

customElements.define('button-medium', MButton)
