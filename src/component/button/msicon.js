import './button.css'
import iconPlus from '@assets/images/icon-plus.png'

class MSIconButton extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    // width 제어 가능하도록 block/inline-block 지정
    if (!this.style.display) {
      this.style.display = 'inline-block'
    }

    this.render()
    this.applyWidth()
    this.attachEventListeners()
  }

  render() {
    const text = this.getAttribute('text') || '상품 업로드'
    const disabled = this.hasAttribute('disabled')
    const type = this.getAttribute('type') || 'button'
    const icon = this.getAttribute('icon') || 'icon-plus.png'
    const iconSrc = this.resolveIcon(icon)

    this.innerHTML = `
      <button 
        class="ms-icon-button" 
        type="${type}"
        ${disabled ? 'disabled' : ''}
      >
        <img src="${iconSrc}" alt="icon" class="ms-icon-button__icon">
        <span class="ms-icon-button__text">${text}</span>
      </button>
    `

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

  // ⭐ width까지 observe
  static get observedAttributes() {
    return ['disabled', 'text', 'icon', 'width']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.querySelector('button')) return

    if (name === 'disabled') {
      const button = this.querySelector('button')
      button.disabled = newValue !== null
    }

    if (name === 'text') {
      const textEl = this.querySelector('.ms-icon-button__text')
      if (textEl) textEl.textContent = newValue || '상품 업로드'
    }

    if (name === 'icon') {
      const iconEl = this.querySelector('.ms-icon-button__icon')
      if (iconEl) iconEl.src = this.resolveIcon(newValue)
    }

    if (name === 'width') {
      this.applyWidth()
    }
  }

  // ⭐ width 적용 로직
  applyWidth() {
    const widthAttr = this.getAttribute('width')

    // inline-block 보장
    if (!this.style.display) {
      this.style.display = 'inline-block'
    }

    if (widthAttr) {
      this.style.width = widthAttr // px, %, rem 등 허용
    } else {
      this.style.width = '100%' // 기본값
    }
  }

  // 프로그램 제어 API 유지
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

  setIcon(icon) {
    this.setAttribute('icon', icon)
  }

  resolveIcon(icon) {
    if (!icon || icon === 'icon-plus.png') return iconPlus
    return iconPlus
  }
}

customElements.define('button-msicon', MSIconButton)
