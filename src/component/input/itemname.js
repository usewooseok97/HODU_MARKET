class ItemNameInput extends HTMLElement {
  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    this.innerHTML = `
      <div class="item-box">
        <label for="itemName" class="item-text">상품명</label>
        <div class="input-wrapper">
          <input
            type="text"
            id="itemName"
            class="item-input"
            placeholder="상품명을 입력해주세요."
            maxlength="50"
          />
          <span class="char-count">
            <span id="currentCount">0</span>/50
          </span>
        </div>
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
