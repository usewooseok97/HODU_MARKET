import './styles.css'

class MinusComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <a href="" class="minus"></a>
    `
  }
}

customElements.define('logo-minus', MinusComponent)
