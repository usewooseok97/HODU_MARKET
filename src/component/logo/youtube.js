import './styles.css'
import iconYt from '@/assets/images/icon-yt.png'

class YoutubeComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <img src="${iconYt}" alt="Youtube" class="youtube" />
    `
  }
}

customElements.define('logo-youtube', YoutubeComponent)
