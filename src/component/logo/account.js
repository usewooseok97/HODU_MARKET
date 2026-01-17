import './styles.css'

class AccountIconComponent extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <span class="account-icon">
        <span class="account-icon__default"></span>
        <span class="account-icon__active"></span>
      </span>
    `
  }
}

customElements.define('logo-account', AccountIconComponent)
