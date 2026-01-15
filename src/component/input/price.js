class PriceInput extends HTMLElement {
  static get observedAttributes() {
    return ['variant']
  }

  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
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
        <label for="price" class="price-text">판매가</label>
        <div class="input-group">
          <input type="text" id="price" class="${inputClass}" value="0" />
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
    if (!document.querySelector('link[href*="styles.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/input/styles.css'
      document.head.appendChild(link)
    }
  }

  attachEventListeners() {
    const priceInput = this.querySelector('#price')

    if (priceInput) {
      priceInput.addEventListener('input', function (e) {
        let value = this.value.replace(/[^\d]/g, '')

        if (value) {
          value = Number(value).toLocaleString()
        }

        this.value = value
      })
    }
  }
}

customElements.define('input-price', PriceInput)
