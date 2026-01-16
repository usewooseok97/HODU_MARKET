import './styles.css'

class CartIconComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <span class="cart-icon">
        <span class="cart-icon__default"></span>
        <span class="cart-icon__active"></span>
      </span>
    `
  }
}

customElements.define('logo-cart', CartIconComponent)
