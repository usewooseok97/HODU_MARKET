class ImgIconComponent extends HTMLElement {
  connectedCallback() {
    this.render()
    this.loadStyles()
    this.attachEventListeners()
  }

  render() {
    const isClick = this.hasAttribute('isclick')
    const name = this.getAttribute('name') || ''
    const nameAttr = name ? `name="${name}"` : ''

    if (isClick) {
      this.innerHTML = `
        <label class="img-upload">
          <input type="file" accept="image/*" class="sr-only" ${nameAttr} />
          <span class="img-upload__icon"></span>
        </label>
      `
    } else {
      this.innerHTML = `
        <div class="img-upload img-upload--disabled">
          <span class="img-upload__icon"></span>
        </div>
      `
    }
  }

  attachEventListeners() {
    const input = this.querySelector('input[type="file"]')
    if (!input) return

    input.addEventListener('change', (e) => {
      const file = e.target.files[0]
      if (file) {
        this.dispatchEvent(
          new CustomEvent('image-selected', {
            bubbles: true,
            detail: { file },
          })
        )
      }
    })
  }

  loadStyles() {
    if (!document.querySelector('link[href*="logo/styles.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/logo/styles.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('logo-imgicon', ImgIconComponent)
