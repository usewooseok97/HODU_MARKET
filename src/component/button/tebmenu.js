// tebmenu.js
class TebMenuButton extends HTMLElement {
  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    const text = this.getAttribute('text') || '판매중인 상품(3)'
    const count = this.getAttribute('count') || '1'
    const active = this.hasAttribute('active')
    const type = this.getAttribute('type') || 'button'

    const buttonClass = active ? 'teb-menu teb-menu--active' : 'teb-menu'

    this.innerHTML = `
      <button class="${buttonClass}" type="${type}">
        <span class="teb-menu__text">${text}</span>
        <span class="teb-menu__badge">${count}</span>
      </button>
    `
  }

  attachEventListeners() {
    const button = this.querySelector('button')
    if (!button) return

    button.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('teb-menu-click', {
          bubbles: true,
          composed: true,
          detail: {
            text: this.getAttribute('text'),
            count: this.getAttribute('count'),
            active: this.isActive(),
          },
        })
      )
    })
  }

  // 외부에서 상태 제어용
  setActive(isActive) {
    const button = this.querySelector('button')
    if (!button) return

    if (isActive) {
      this.setAttribute('active', '')
      button.classList.add('teb-menu--active')
    } else {
      this.removeAttribute('active')
      button.classList.remove('teb-menu--active')
    }
  }

  isActive() {
    return this.hasAttribute('active')
  }

  setText(text) {
    const textEl = this.querySelector('.teb-menu__text')
    if (textEl) {
      textEl.textContent = text
      this.setAttribute('text', text)
    }
  }

  setCount(count) {
    const badgeEl = this.querySelector('.teb-menu__badge')
    if (badgeEl) {
      badgeEl.textContent = count
      this.setAttribute('count', count)
    }
  }

  static get observedAttributes() {
    return ['active', 'text', 'count']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.isConnected) return
    const button = this.querySelector('button')

    if (name === 'active' && button) {
      if (newValue !== null) {
        button.classList.add('teb-menu--active')
      } else {
        button.classList.remove('teb-menu--active')
      }
    } else if (name === 'text') {
      const textEl = this.querySelector('.teb-menu__text')
      if (textEl && newValue !== null) {
        textEl.textContent = newValue
      }
    } else if (name === 'count') {
      const badgeEl = this.querySelector('.teb-menu__badge')
      if (badgeEl && newValue !== null) {
        badgeEl.textContent = newValue
      }
    }
  }
}

customElements.define('teb-menu', TebMenuButton)
