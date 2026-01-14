// Logo 컴포넌트
class Logo extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <div class="logo-box">
        <a href="" class="logo">
          <img src="./src/assets/images/Logo-hodu.png" alt="Hodu" />
        </a>
      </div>
    `

    this.loadStyles()
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

customElements.define('logo-component', Logo)
