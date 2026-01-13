class MyComponent extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('text') || '기본값'

    this.innerHTML = `
      <button>${text}</button>
    `

    this.querySelector('button').addEventListener('click', () => {
      console.log('클릭!')
    })
  }
}

customElements.define('input-index', MyComponent)
