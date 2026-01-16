import './styles.css'

class UserGrComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <a href="/src/pages/mypage/index.html" class="user-gr"></a>
    `
  }
}

customElements.define('logo-usergr', UserGrComponent)
