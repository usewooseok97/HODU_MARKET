import './styles.css'

class DownArrowComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <a href="" class="down-arrow"></a>
    `
  }
}

customElements.define('logo-downarrow', DownArrowComponent)
