import './styles.css'

class SwiperRComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <a href="" class="swiper-r"></a>
    `
  }
}

customElements.define('logo-swiperr', SwiperRComponent)
