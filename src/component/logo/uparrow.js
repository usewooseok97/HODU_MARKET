import './styles.css'

class UpArrowComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <a href="" class="up-arrow"></a>
    `
  }
}

customElements.define('logo-uparrow', UpArrowComponent)
