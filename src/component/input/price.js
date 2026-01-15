class PriceInput extends HTMLElement {
  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    this.innerHTML = `
      <div class="price-box">
        <label for="price" class="price-text">판매가</label>
        <div class="input-group">
          <input type="text" id="price" class="price-input" value="0" />
          <button class="unit-button" type="button">원</button>
        </div>
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
