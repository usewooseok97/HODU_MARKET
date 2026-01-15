class IdCheckInput extends HTMLElement {
  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    const label = this.getAttribute('label') || '아이디'
    const placeholder = this.getAttribute('placeholder') || ''
    const hideLabel = this.hasAttribute('hide-label')
    const inputId = this.getAttribute('id') || 'id-check'

    this.innerHTML = `
      <div class="idcheck-box">
        ${hideLabel ? '' : `<label for="${inputId}-input" class="idcheck-label">${label}</label>`}
        <input type="text" id="${inputId}-input" class="idcheck-input" placeholder="${placeholder}" />
        <p class="idcheck-message"></p>
      </div>
    `

    this.loadStyles()
  }

  loadStyles() {
    if (!document.querySelector('link[href*="/src/component/input/styles.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/input/styles.css'
      document.head.appendChild(link)
    }
  }

  attachEventListeners() {
    const input = this.querySelector('.idcheck-input')

    if (input) {
      input.addEventListener('input', () => {
        this.dispatchEvent(new CustomEvent('input-change', {
          bubbles: true,
          detail: { value: input.value }
        }))
      })
    }
  }

  setMessage(text, type = '') {
    const message = this.querySelector('.idcheck-message')
    const input = this.querySelector('.idcheck-input')

    if (message) {
      message.textContent = text
      message.className = 'idcheck-message'
      if (type) message.classList.add(type)
    }

    if (input) {
      input.classList.remove('error', 'success')
      if (type) input.classList.add(type)
    }
  }

  getValue() {
    const input = this.querySelector('.idcheck-input')
    return input ? input.value : ''
  }

  setValue(value) {
    const input = this.querySelector('.idcheck-input')
    if (input) input.value = value
  }

  static get observedAttributes() {
    return ['label', 'placeholder', 'hide-label']
  }
}

customElements.define('input-idcheck', IdCheckInput)
