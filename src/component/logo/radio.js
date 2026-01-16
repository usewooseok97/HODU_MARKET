import './styles.css'

class RadioComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    // checked 속성이 있으면 radio-on, 없으면 radio-off
    const radioClass = this.hasAttribute('checked') ? 'radio-on' : 'radio-off'
    this.innerHTML = `
      <div class="${radioClass}"></div>
    `
  }

  // checked 속성이 변경될 때 호출됨
  static get observedAttributes() {
    return ['checked']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'checked') {
      this.render()
    }
  }
}

customElements.define('logo-radio', RadioComponent)
