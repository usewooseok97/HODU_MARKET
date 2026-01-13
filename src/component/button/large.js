class LButton extends HTMLElement {
  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    // 속성 가져오기
    const text = this.getAttribute('text') || '버튼'
    const disabled = this.hasAttribute('disabled')
    const type = this.getAttribute('type') || 'button'

    // 버튼 생성
    this.innerHTML = `
      <button 
        class="l-button" 
        type="${type}"
        ${disabled ? 'disabled' : ''}
      >
        ${text}
      </button>
    `

    // 스타일 로드
    this.loadStyles()
  }

  attachEventListeners() {
    const button = this.querySelector('button')

    // 클릭 이벤트 전파
    button.addEventListener('click', (e) => {
      // 커스텀 이벤트 발생
      this.dispatchEvent(
        new CustomEvent('button-click', {
          bubbles: true,
          detail: { originalEvent: e },
        })
      )
    })
  }

  loadStyles() {
    if (!document.querySelector('link[href*="button.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/button/button.css'
      document.head.appendChild(link)
    }
  }

  // 동적으로 disabled 속성 변경 가능하도록
  static get observedAttributes() {
    return ['disabled', 'text']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      const button = this.querySelector('button')
      if (button) {
        if (newValue !== null) {
          button.disabled = true
        } else {
          button.disabled = false
        }
      }
    } else if (name === 'text') {
      const button = this.querySelector('button')
      if (button) {
        button.textContent = newValue || '버튼'
      }
    }
  }

  // 프로그래밍 방식으로 disabled 설정
  setDisabled(disabled) {
    const button = this.querySelector('button')
    if (button) {
      button.disabled = disabled
      if (disabled) {
        this.setAttribute('disabled', '')
      } else {
        this.removeAttribute('disabled')
      }
    }
  }

  // 버튼 텍스트 변경
  setText(text) {
    const button = this.querySelector('button')
    if (button) {
      button.textContent = text
      this.setAttribute('text', text)
    }
  }
}

customElements.define('button-l', LButton)
