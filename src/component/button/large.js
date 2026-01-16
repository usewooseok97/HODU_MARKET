import './button.css'

class LButton extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    // 기본 display 설정(한 줄 요소로 쓰기 좋게)
    if (!this.style.display) {
      this.style.display = 'inline-block'
    }

    this.render()
    this.applyWidth()
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

  }

  attachEventListeners() {
    const button = this.querySelector('button')
    if (!button) return

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

  // ✅ width 속성까지 감지하도록 확장
  static get observedAttributes() {
    return ['disabled', 'text', 'width']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return

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
    } else if (name === 'width') {
      // ✅ width 속성 변경 시 반영
      this.applyWidth()
    }
  }

  // ✅ width 적용 로직
  applyWidth() {
    const widthAttr = this.getAttribute('width')

    // 기본 display 보장
    if (!this.style.display) {
      this.style.display = 'inline-block'
    }

    if (widthAttr) {
      // px, %, rem 등 아무거나 받게 그대로 적용
      this.style.width = widthAttr
    } else {
      // 기본값: 부모를 꽉 채우고 싶으면 100%, 아니면 auto로 바꿔도 됨
      this.style.width = '100%'
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

customElements.define('button-large', LButton)
