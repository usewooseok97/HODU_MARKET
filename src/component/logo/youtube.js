import './styles.css'

class YoutubeComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <img src="/src/assets/images/icon-yt.png" alt="Youtube" class="youtube" />
    `
  }
}

customElements.define('logo-youtube', YoutubeComponent)
