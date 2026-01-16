import './styles.css'

class DeleteComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <a href="" class="delect"></a>
    `
  }
}

customElements.define('logo-delete', DeleteComponent)
