// checkbox.js
class CheckboxComponent extends HTMLElement {
  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    const id = this.getAttribute('id') || 'checkbox-' + Math.random()

    this.innerHTML = `
      <div class="checkbox-wrapper">
        <input type="checkbox" id="${id}" class="hidden-checkbox" style="display: none;" />
        <label for="${id}" class="checkbox-label">
          <img src="./src/assets/images/check-box.png" alt="unchecked" class="checkbox-img" />
        </label>
      </div>
    `

    this.loadStyles()
  }

  loadStyles() {
    if (!document.querySelector('link[href*="checkbox/styles.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/checkbox/styles.css'
      document.head.appendChild(link)
    }
  }

  attachEventListeners() {
    const checkbox = this.querySelector('.hidden-checkbox')
    const checkboxImg = this.querySelector('.checkbox-img')

    if (checkbox && checkboxImg) {
      checkbox.addEventListener('change', function () {
        // 체크 상태에 따라 이미지 변경
        if (this.checked) {
          checkboxImg.src = './src/assets/images/check-fill-box.png'
          checkboxImg.alt = 'checked'
        } else {
          checkboxImg.src = './src/assets/images/check-box.png'
          checkboxImg.alt = 'unchecked'
        }
      })
    }
  }
}

customElements.define('logo-checkbox', CheckboxComponent)
