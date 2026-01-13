class LogoComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <a href="" class="logo">
        <img src="./src/assets/images/Logo-hodu.png" alt="Hodu" />
      </a>
    `
  }
}

customElements.define('logo-component', LogoComponent)
