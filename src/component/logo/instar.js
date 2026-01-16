import './styles.css'

class InstaComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <img src="/src/assets/images/icon-insta.png" alt="instagram" class="instar" />
    `
  }
}

customElements.define('logo-instar', InstaComponent)
