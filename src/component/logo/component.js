// logo.js
class Logo extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    // 속성으로 크기, href, class를 받을 수 있도록 설정
    const width = this.getAttribute('width') || '300'
    const href = this.getAttribute('href') || ''
    const linkClass = this.getAttribute('link-class') || 'hodu'

    this.innerHTML = `
      <a href="${href}" class="${linkClass}" style="display: inline-block; width: ${width}px;">
        <img src="/src/assets/images/Logo-hodu.png" alt="Hodu" style="width: 100%; height: auto; display: block;" />
      </a>
    `
  }
}

customElements.define('logo-component', Logo)
