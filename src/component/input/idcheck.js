class IdCheckInput extends HTMLElement {
  static get observedAttributes() {
    return ['variant']
  }

  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    const variant = this.getAttribute('variant') || 'default'

    let inputClass = 'check-input'
    if (variant === 'error') {
      inputClass += ' check-input--error'
    } else if (variant === 'success') {
      inputClass += ' check-input--success'
    } else if (variant === 'dark') {
      inputClass += ' check-input--dark'
    }

    this.innerHTML = `
      <div class="check-box">
        <label for="id-check" class="check-label">아이디</label>
        <input type="text" id="id-check" class="${inputClass}" placeholder="text" />
        <p class="message"></p>
      </div>
    `

    this.loadStyles()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'variant' && oldValue !== newValue) {
      const input = this.querySelector('#id-check')
      if (input) {
        input.className = 'check-input'

        if (newValue === 'error') {
          input.classList.add('check-input--error')
        } else if (newValue === 'success') {
          input.classList.add('check-input--success')
        } else if (newValue === 'dark') {
          input.classList.add('check-input--dark')
        }
      }
    }
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
    const input = this.querySelector('#id-check')
    const message = this.querySelector('.message')

    if (input && message) {
      input.addEventListener('input', () => {
        const value = input.value

        if (value.length >= 4) {
          message.textContent = '사용 가능한 아이디입니다.'
          message.style.color = 'green'
          this.setAttribute('variant', 'success')
        } else if (value.length > 0) {
          message.textContent = '4자 이상 입력해주세요.'
          message.style.color = 'red'
          this.setAttribute('variant', 'error')
        } else {
          message.textContent = ''
          this.setAttribute('variant', 'default')
        }
      })
    }
  }
}

customElements.define('input-idcheck', IdCheckInput)
