import './styles.css'

class RightArrowComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <a href="" class="right-arrow"></a>
    `
  }
}

customElements.define('logo-rightarrow', RightArrowComponent)
