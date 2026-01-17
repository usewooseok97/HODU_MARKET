import './styles.css'

class PlusComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <a href="" class="plus"></a>
    `
  }
}

customElements.define('logo-plus', PlusComponent)
