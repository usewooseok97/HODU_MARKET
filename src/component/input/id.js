import './styles.css'

// 기본 아이디/텍스트 입력 컴포넌트 (type 속성 지원)
class IdInput extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'placeholder', 'type']
  }

  connectedCallback() {
    this.render()
  }

  render() {
    const variant = this.getAttribute('variant') || 'default'
    const placeholder = this.getAttribute('placeholder') || '아이디'
    const type = this.getAttribute('type') || 'text'
    const name = this.getAttribute('name') || 'username'

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
        <input 
          type="${type}" 
          id="id" 
          name="${name}"
          class="${inputClass}" 
          placeholder="${placeholder}" 
        />
      </div>
    `

  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (
      (name === 'variant' || name === 'placeholder' || name === 'type') &&
      oldValue !== newValue
    ) {
      this.render()
    }
  }
}

customElements.define('input-id', IdInput)
