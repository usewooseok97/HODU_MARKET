import './styles.css'

class FaceComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <img src="/src/assets/images/icon-fb.png" alt="facebook" class="face" />
    `
  }
}

customElements.define('logo-face', FaceComponent)
