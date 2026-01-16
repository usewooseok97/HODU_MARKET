import './styles.css'

class SwiperLComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <a href="" class="swiper-l"></a>
    `
  }
}

customElements.define('logo-swiperl', SwiperLComponent)
