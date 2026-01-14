class YoutubeComponent extends HTMLElement {
  connectedCallback() {
    this.render()
    this.loadStyles()
  }

  render() {
    this.innerHTML = `
      <a href="" class="youtube">
        <img src="./src/assets/images/icon-yt.png" alt="Youtube" />
      </a>
    `
  }

  loadStyles() {
    if (!document.querySelector('link[href*="logo/styles.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/logo/styles.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('logo-youtube', YoutubeComponent)
