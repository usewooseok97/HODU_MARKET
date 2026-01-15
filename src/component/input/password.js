class PasswordInput extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <div class="ps-box">
        <label for="password" class="ps-text">비밀번호</label>
        <input
          type="password"
          id="password"
          class="ps-input"
          placeholder="text"
        />
      </div>
    `

    this.loadStyles()
  }

  loadStyles() {
    if (!document.querySelector('link[href*="/src/component/input/styles.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/input/styles.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('input-password', PasswordInput)
