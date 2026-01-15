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

customElements.define('input-idcheck', IdCheckInput)
