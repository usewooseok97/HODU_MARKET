import '@component/logo/cart.js'


// src/component/header/seller.js

class HeaderSeller extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <header class="header-seller">
        <div class="header-seller-container">
          <div class="header-seller-left-group">
            <div class="header-seller-logo-wrapper">
              <logo-component width="80px"></logo-component>
            </div>
            <h1 class="header-seller-title">판매자 센터</h1>
          </div>
        </div>
      </header>
    `
    this.loadStyles()
  }

  loadStyles() {
    if (!document.querySelector('link[href*="header/seller.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/header/seller.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('header-seller', HeaderSeller)
