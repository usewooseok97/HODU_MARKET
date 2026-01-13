class TabButton extends HTMLElement {
  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    // 속성 가져오기
    const text = this.getAttribute('text') || '버튼'
    const active = this.hasAttribute('active') // active 속성이 있으면 활성화
    const type = this.getAttribute('type') || 'button'

    // active 상태에 따른 클래스 결정
    const buttonClass = active ? 'tab-button tab-button--active' : 'tab-button'

    // 버튼 생성
    this.innerHTML = `
      <button 
        class="${buttonClass}" 
        type="${type}"
      >
        <span class="tab-button__text">${text}</span>
        <span class="tab-button__indicator"></span>
      </button>
    `

    // 스타일 로드
    this.loadStyles()
  }

  attachEventListeners() {
    const button = this.querySelector('button')

    // 클릭 이벤트 전파
    button.addEventListener('click', (e) => {
      // 클릭 시 active 상태로 변경 (옵션)
      this.setActive(true)

      this.dispatchEvent(
        new CustomEvent('tab-click', {
          bubbles: true,
          detail: {
            originalEvent: e,
            text: this.getAttribute('text'),
          },
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
    return ['active', 'text']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.querySelector('button')) return

    const button = this.querySelector('button')

    if (name === 'active') {
      // active 속성 변경 시 클래스 업데이트
      if (newValue !== null) {
        button.classList.add('tab-button--active')
      } else {
        button.classList.remove('tab-button--active')
      }
    } else if (name === 'text') {
      const textEl = this.querySelector('.tab-button__text')
      if (textEl) textEl.textContent = newValue || '버튼'
    }
  }

  // 프로그래밍 방식으로 제어
  setActive(active) {
    const button = this.querySelector('button')
    if (button) {
      if (active) {
        this.setAttribute('active', '')
        button.classList.add('tab-button--active')
      } else {
        this.removeAttribute('active')
        button.classList.remove('tab-button--active')
      }
    }
  }

  setText(text) {
    const textEl = this.querySelector('.tab-button__text')
    if (textEl) {
      textEl.textContent = text
      this.setAttribute('text', text)
    }
  }

  isActive() {
    return this.hasAttribute('active')
  }
}

customElements.define('button-tab', TabButton)
