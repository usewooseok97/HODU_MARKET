import './styles.css'

class ShopComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
       <a href="/src/pages/shoppingCartPage/index.html" class="shop"></a>
    `
  }
}

customElements.define('logo-shop', ShopComponent)
