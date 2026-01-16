import './styles.css'
import iconInsta from '@/assets/images/icon-insta.png'

class InstaComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <img src="${iconInsta}" alt="instagram" class="instar" />
    `
  }
}

customElements.define('logo-instar', InstaComponent)
