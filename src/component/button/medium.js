class MButton extends HTMLElement {
  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    // 속성 가져오기
    const text = this.getAttribute('text') || '버튼'
    const disabled = this.hasAttribute('disabled')
    const variant = this.getAttribute('variant') || 'default' // default, dark, white
    const type = this.getAttribute('type') || 'button'

    // variant에 따른 클래스 결정
    let buttonClass = 'm-button'
    if (variant === 'dark') {
      buttonClass += ' m-button--dark'
    } else if (variant === 'white') {
      buttonClass += ' m-button--white'
    }

    // 버튼 생성
    this.innerHTML = `
      <button 
        class="${buttonClass}" 
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
      this.dispatchEvent(
        new CustomEvent('button-click', {
          bubbles: true,
          detail: { originalEvent: e },
        })
      )
    })
  }

  loadStyles() {
    // button.css가 이미 로드되어 있는지 확인
    if (!document.querySelector('link[href*="button.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/button/button.css'
      document.head.appendChild(link)
    }
  }

  // 동적으로 속성 변경 가능
  static get observedAttributes() {
    return ['disabled', 'text', 'variant']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.querySelector('button')) return

    const button = this.querySelector('button')

    if (name === 'disabled') {
      if (newValue !== null) {
        button.disabled = true
      } else {
        button.disabled = false
      }
    } else if (name === 'text') {
      button.textContent = newValue || '버튼'
    } else if (name === 'variant') {
      // variant 변경 시 클래스 업데이트
      button.className = 'm-button'
      if (newValue === 'dark') {
        button.classList.add('m-button--dark')
      } else if (newValue === 'white') {
        button.classList.add('m-button--white')
      }
    }
  }

  // 프로그래밍 방식으로 제어
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

  setText(text) {
    const button = this.querySelector('button')
    if (button) {
      button.textContent = text
      this.setAttribute('text', text)
    }
  }

  setVariant(variant) {
    this.setAttribute('variant', variant)
  }
}

customElements.define('button-m', MButton)
