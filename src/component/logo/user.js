import './styles.css'

class UserComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <a href="/src/pages/mypage/index.html" class="user"></a>
    `
  }
}

customElements.define('logo-user', UserComponent)
