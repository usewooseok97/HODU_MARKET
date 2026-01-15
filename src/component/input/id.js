class IdInput extends HTMLElement {
  static get observedAttributes() {
    return ['variant']
  }

  connectedCallback() {
    this.render()
  }

  render() {
    const variant = this.getAttribute('variant') || 'default'
    const placeholder = this.getAttribute('placeholder') || '아이디'

    let inputClass = 'id-input'
    if (variant === 'error') {
      inputClass += ' id-input--error'
    } else if (variant === 'success') {
      inputClass += ' id-input--success'
    } else if (variant === 'dark') {
      inputClass += ' id-input--dark'
    }

    this.innerHTML = `
      <div class="id-box">
        <input type="text" id="id" class="${inputClass}" placeholder="${placeholder}" />
      </div>
    `

    this.loadStyles()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'variant' && oldValue !== newValue) {
      const input = this.querySelector('#id')
      if (input) {
        input.className = 'id-input'

        if (newValue === 'error') {
          input.classList.add('id-input--error')
        } else if (newValue === 'success') {
          input.classList.add('id-input--success')
        } else if (newValue === 'dark') {
          input.classList.add('id-input--dark')
        }
      }
    }
  }

  loadStyles() {
    if (
      !document.querySelector('link[href*="/src/component/input/styles.css"]')
    ) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/input/styles.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('input-id', IdInput)

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
    if (
      !document.querySelector('link[href*="/src/component/input/styles.css"]')
    ) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/input/styles.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('input-password', PasswordInput)

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
    if (
      !document.querySelector('link[href*="/src/component/input/styles.css"]')
    ) {
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

class PriceInput extends HTMLElement {
  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    this.innerHTML = `
      <div class="price-box">
        <label for="price" class="price-text">판매가</label>
        <div class="input-group">
          <input type="text" id="price" class="price-input" value="0" />
          <button class="unit-button" type="button">원</button>
        </div>
      </div>
    `

    this.loadStyles()
  }

  loadStyles() {
    if (
      !document.querySelector('link[href*="/src/component/input/styles.css"]')
    ) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/input/styles.css'
      document.head.appendChild(link)
    }
  }

  attachEventListeners() {
    const priceInput = this.querySelector('#price')

    if (priceInput) {
      priceInput.addEventListener('input', function (e) {
        let value = this.value.replace(/[^\d]/g, '')

        if (value) {
          value = Number(value).toLocaleString()
        }

        this.value = value
      })
    }
  }
}

customElements.define('input-price', PriceInput)

class IdCheckInput extends HTMLElement {
  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    this.innerHTML = `
      <div class="check-box">
        <label for="id-check" class="check-label">아이디</label>
        <input type="text" id="id-check" class="check-input" placeholder="text" />
        <p class="message"></p>
      </div>
    `

    this.loadStyles()
  }

  loadStyles() {
    if (
      !document.querySelector('link[href*="/src/component/input/styles.css"]')
    ) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/input/styles.css'
      document.head.appendChild(link)
    }
  }

  attachEventListeners() {
    const input = this.querySelector('#id-check')
    const message = this.querySelector('.message')

    if (input && message) {
      input.addEventListener('input', function () {
        const value = this.value

        if (value.length >= 4) {
          message.textContent = '사용 가능한 아이디입니다.'
          message.style.color = 'green'
        } else if (value.length > 0) {
          message.textContent = '4자 이상 입력해주세요.'
          message.style.color = 'red'
        } else {
          message.textContent = ''
        }
      })
    }
  }
}

customElements.define('input-id', IdCheckInput)
