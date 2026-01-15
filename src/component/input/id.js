class IdInput extends HTMLElement {
  static get observedAttributes() {
    return ['variant']
  }

  connectedCallback() {
    this.render()
  }

  render() {
    const variant = this.getAttribute('variant') || 'default'
    const placeholder = this.getAttribute('placeholder') || '아이디'

    let inputClass = 'id-input'
    if (variant === 'error') {
      inputClass += ' id-input--error'
    } else if (variant === 'success') {
      inputClass += ' id-input--success'
    } else if (variant === 'dark') {
      inputClass += ' id-input--dark'
    }

    this.innerHTML = `
      <div class="id-box">
        <input type="text" id="id" class="${inputClass}" placeholder="${placeholder}" />
      </div>
    `

    this.loadStyles()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'variant' && oldValue !== newValue) {
      const input = this.querySelector('#id')
      if (input) {
        input.className = 'id-input'

        if (newValue === 'error') {
          input.classList.add('id-input--error')
        } else if (newValue === 'success') {
          input.classList.add('id-input--success')
        } else if (newValue === 'dark') {
          input.classList.add('id-input--dark')
        }
      }
    }
  }

  loadStyles() {
    if (!document.querySelector('link[href*="styles.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/input/styles.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('input-id', IdInput)
