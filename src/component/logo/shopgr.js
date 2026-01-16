import './styles.css'

class ShopGrComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <a href="/src/pages/shoppingCartPage/index.html" class="shop-gr"></a>
    `
  }
}

customElements.define('logo-shopgr', ShopGrComponent)
