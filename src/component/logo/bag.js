import './styles.css'

class BagComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <a href="" class="bag"></a>
    `
  }
}

customElements.define('logo-bag', BagComponent)
