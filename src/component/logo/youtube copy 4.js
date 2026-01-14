class RadioComponent extends HTMLElement {
  connectedCallback() {
    this.render()
    this.loadStyles()
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

  loadStyles() {
    if (!document.querySelector('link[href*="radio/styles.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/radio/styles.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('radio-component', RadioComponent)
