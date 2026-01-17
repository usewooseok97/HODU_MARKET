import './styles.css'
import logoHodu from '@/assets/images/Logo-hodu.png'

class LogoComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    // 속성값 가져오기 (기본값 설정)
    const href = this.getAttribute('href') || '/'
    const src = this.getAttribute('src') || logoHodu
    const alt = this.getAttribute('alt') || 'hodu'
    const width = this.getAttribute('width') || ''
    const height = this.getAttribute('height') || ''

    // width, height 속성 문자열 생성
    const widthAttr = width ? `width="${width}"` : ''
    const heightAttr = height ? `height="${height}"` : ''

    this.innerHTML = `
      <a href="${href}" class="logo-link">
        <img src="${src}" alt="${alt}" class="logo-img" ${widthAttr} ${heightAttr} />
      </a>
    `
  }

  // 속성 변경 감지
  static get observedAttributes() {
    return ['href', 'src', 'alt', 'width', 'height']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render()
    }
  }
}

customElements.define('logo-component', LogoComponent)
