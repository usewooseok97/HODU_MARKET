import './styles.css'

class PlusIconComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <a href="" class="plus-icon"></a>
    `
  }
}

customElements.define('logo-plusicon', PlusIconComponent)
