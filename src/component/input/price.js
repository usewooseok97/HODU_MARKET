class PriceInput extends HTMLElement {
  static get observedAttributes() {
    return ['variant']
  }

  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    const labelText = this.getAttribute('text') || '판매가'
    const name = this.getAttribute('name') || ''
    const variant = this.getAttribute('variant') || 'default'

    let inputClass = 'price-input'
    if (variant === 'error') {
      inputClass += ' price-input--error'
    } else if (variant === 'success') {
      inputClass += ' price-input--success'
    } else if (variant === 'dark') {
      inputClass += ' price-input--dark'
    }

    this.innerHTML = `
      <div class="price-box">
        <label for="price" class="price-text">${labelText}</label>
        <div class="input-group">
          <input type="text" id="price" class="price-input" value="0" />
          ${name ? `<input type="hidden" name="${name}" value="0" />` : ''}
          <button class="unit-button" type="button">원</button>
        </div>
      </div>
    `

    this.loadStyles()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'variant' && oldValue !== newValue) {
      const input = this.querySelector('#price')
      if (input) {
        input.className = 'price-input'

        if (newValue === 'error') {
          input.classList.add('price-input--error')
        } else if (newValue === 'success') {
          input.classList.add('price-input--success')
        } else if (newValue === 'dark') {
          input.classList.add('price-input--dark')
        }
      }
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

  attachEventListeners() {
    const priceInput = this.querySelector('.price-input')
    const hiddenInput = this.querySelector('input[type="hidden"]')

    if (priceInput) {
      priceInput.addEventListener('input', function () {
        let value = this.value.replace(/[^\d]/g, '')

        if (value) {
          // hidden input에 정수값 저장
          if (hiddenInput) {
            hiddenInput.value = value
          }
          value = Number(value).toLocaleString()
        } else {
          if (hiddenInput) {
            hiddenInput.value = '0'
          }
        }

        this.value = value
      })
    }
  }
}

customElements.define('input-price', PriceInput)
