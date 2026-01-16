import './styles.css'

class ItemNameInput extends HTMLElement {
  static get observedAttributes() {
    return ['variant']
  }

  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    const name = this.getAttribute('name') || ''
    const nameAttr = name ? `name="${name}"` : ''
    const variant = this.getAttribute('variant') || 'default'

    let inputClass = 'item-input'
    if (variant === 'error') {
      inputClass += ' item-input--error'
    } else if (variant === 'success') {
      inputClass += ' item-input--success'
    } else if (variant === 'dark') {
      inputClass += ' item-input--dark'
    }

    this.innerHTML = `
      <div class="item-box">
        <label for="itemName" class="item-text">상품명</label>
        <div class="input-wrapper">
          <input
            type="text"
            id="itemName"
            class="${inputClass}"
            placeholder="상품명을 입력해주세요."
            maxlength="50"
            ${nameAttr}
          />
          <span class="char-count">
            <span id="currentCount">0</span>/50
          </span>
        </div>
      </div>
    `

  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'variant' && oldValue !== newValue) {
      const input = this.querySelector('#itemName')
      if (input) {
        input.className = 'item-input'

        if (newValue === 'error') {
          input.classList.add('item-input--error')
        } else if (newValue === 'success') {
          input.classList.add('item-input--success')
        } else if (newValue === 'dark') {
          input.classList.add('item-input--dark')
        }
      }
    }
  }

  attachEventListeners() {
    const itemNameInput = this.querySelector('#itemName')
    const countSpan = this.querySelector('#currentCount')

    if (itemNameInput && countSpan) {
      itemNameInput.addEventListener('input', function () {
        countSpan.textContent = this.value.length
      })
    }
  }
}

customElements.define('input-itemname', ItemNameInput)
