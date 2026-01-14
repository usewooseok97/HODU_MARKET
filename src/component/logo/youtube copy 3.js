// validation-icon.js
class ValidationIcon extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <div class="validation-icon">
        <img src="./src/assets/images/icon-check-off.png" alt="invalid" class="icon-img off" />
        <img src="./src/assets/images/icon-check-on.png" alt="valid" class="icon-img on" />
      </div>
    `

    this.loadStyles()

    // 초기 상태: off만 보이기
    const onIcon = this.querySelector('.on')
    if (onIcon) {
      onIcon.style.display = 'none'
    }
  }

  loadStyles() {
    if (!document.querySelector('link[href*="validation-icon/styles.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/validation-icon/styles.css'
      document.head.appendChild(link)
    }
  }

  // 상태 변경 메서드
  setValid(isValid) {
    const offIcon = this.querySelector('.off')
    const onIcon = this.querySelector('.on')

    if (isValid) {
      offIcon.style.display = 'none'
      onIcon.style.display = 'inline-block'
    } else {
      offIcon.style.display = 'inline-block'
      onIcon.style.display = 'none'
    }
  }

  // 숨기기 메서드 (아무것도 표시 안함)
  hide() {
    const offIcon = this.querySelector('.off')
    const onIcon = this.querySelector('.on')
    offIcon.style.display = 'none'
    onIcon.style.display = 'none'
  }

  // 보이기 메서드
  show(isValid = false) {
    this.setValid(isValid)
  }
}

customElements.define('logo-validation', ValidationIcon)
