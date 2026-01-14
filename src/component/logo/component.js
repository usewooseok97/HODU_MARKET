// logo.js
class Logo extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    // 속성으로 크기를 받을 수 있도록 설정 (기본값: 300px)
    const width = this.getAttribute('width') || '300'
    const href = this.getAttribute('href') || '/'

    this.innerHTML = `
      <div class="logo-box" style="width: ${width}px;">
        <a href="${href}" class="logo">
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
