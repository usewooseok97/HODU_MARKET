import './styles.css'
import iconFb from '@/assets/images/icon-fb.png'

class FaceComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <img src="${iconFb}" alt="facebook" class="face" />
    `
  }
}

customElements.define('logo-face', FaceComponent)
