class PasswordInput extends HTMLElement {
  static get observedAttributes() {
    return ['variant']
  }

  connectedCallback() {
    this.render()
  }

  render() {
    const variant = this.getAttribute('variant') || 'default'

    let inputClass = 'ps-input'
    if (variant === 'error') {
      inputClass += ' ps-input--error'
    } else if (variant === 'success') {
      inputClass += ' ps-input--success'
    } else if (variant === 'dark') {
      inputClass += ' ps-input--dark'
    }

    this.innerHTML = `
      <div class="ps-box">
        <label for="password" class="ps-text">비밀번호</label>
        <input
          type="password"
          id="password"
          class="${inputClass}"
          placeholder="text"
        />
      </div>
    `

    this.loadStyles()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'variant' && oldValue !== newValue) {
      const input = this.querySelector('#password')
      if (input) {
        input.className = 'ps-input'

        if (newValue === 'error') {
          input.classList.add('ps-input--error')
        } else if (newValue === 'success') {
          input.classList.add('ps-input--success')
        } else if (newValue === 'dark') {
          input.classList.add('ps-input--dark')
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

customElements.define('input-password', PasswordInput)
