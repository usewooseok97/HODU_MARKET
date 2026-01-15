class CartIconComponent extends HTMLElement {
  connectedCallback() {
    this.render()
    this.loadStyles()
  }

  render() {
    this.innerHTML = `
      <span class="cart-icon">
        <span class="cart-icon__default"></span>
        <span class="cart-icon__active"></span>
      </span>
    `
  }

  loadStyles() {
    if (!document.querySelector('link[href*="logo/styles.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/logo/styles.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('logo-cart', CartIconComponent)
