class EtcCheckbox extends HTMLElement {
  static get observedAttributes() {
    return ['text', 'checked', 'disabled', 'name', 'value', 'variant']
  }

  constructor() {
    super()
    this._id = `etc-checkbox-${crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`
    this._labelId = `${this._id}-label`

    this._onChange = this._onChange.bind(this)
    this._onSlotChange = this._onSlotChange.bind(this)
    this._onLabelClick = this._onLabelClick.bind(this)
    this._onLabelKeydown = this._onLabelKeydown.bind(this)

    this._loadStyleOnce()
  }

  connectedCallback() {
    if (!this._mounted) {
      this._render()
      this._cache()
      this._attach()
      this._mounted = true
    }
    this._syncFromAttributes()
    this._updateFallbackVisibility()
  }

  disconnectedCallback() {
    this._detach()
  }

  attributeChangedCallback() {
    if (!this._mounted) return
    this._syncFromAttributes()
    this._updateFallbackVisibility()
  }

  _render() {
    const id = this._id
    const labelId = this._labelId

    this.innerHTML = `
      <div class="check-text">
        <div class="check-box">
          <input type="checkbox" id="${id}" aria-labelledby="${labelId}">
          <!-- 체크 UI 전용 라벨(박스 클릭 토글) -->
          <label for="${id}" class="check-ui" aria-hidden="true"></label>
        </div>

        <!-- 문구 영역: 링크를 포함할 수 있으므로 label 태그로 감싸지 않음 -->
        <div
          id="${labelId}"
          class="check-label"
          role="button"
          tabindex="0"
          aria-controls="${id}"
        >
          <slot></slot>
          <span class="fallback-text"></span>
        </div>
      </div>
    `
  }

  _cache() {
    this.$container = this.querySelector('.check-text')
    this.$input = this.querySelector('input[type="checkbox"]')
    this.$fallback = this.querySelector('.fallback-text')
    this.$slot = this.querySelector('slot')
    this.$label = this.querySelector('.check-label')
  }

  _attach() {
    this.$input?.addEventListener('change', this._onChange)
    this.$slot?.addEventListener('slotchange', this._onSlotChange)

    // 문구 영역 클릭/키보드로 체크 토글(링크 클릭은 제외)
    this.$label?.addEventListener('click', this._onLabelClick)
    this.$label?.addEventListener('keydown', this._onLabelKeydown)
  }

  _detach() {
    this.$input?.removeEventListener('change', this._onChange)
    this.$slot?.removeEventListener('slotchange', this._onSlotChange)

    this.$label?.removeEventListener('click', this._onLabelClick)
    this.$label?.removeEventListener('keydown', this._onLabelKeydown)
  }

  _onChange(e) {
    const detail = {
      checked: e.target.checked,
      value: e.target.value,
      name: e.target.name,
    }

    // 기존 호환 이벤트
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true }))
    // 명시적 이벤트(권장)
    this.dispatchEvent(new CustomEvent('etc-change', { detail, bubbles: true }))
  }

  _onSlotChange() {
    this._updateFallbackVisibility()
  }

  _onLabelClick(e) {
    // 링크/버튼 등 "상호작용 요소" 클릭이면 체크 토글하지 않음
    if (e.target.closest('a, button, input, select, textarea')) return
    if (!this.$input || this.$input.disabled) return

    this._toggleAndEmit()
  }

  _onLabelKeydown(e) {
    // 접근성: Space/Enter로 토글
    if (e.key !== ' ' && e.key !== 'Enter') return
    if (!this.$input || this.$input.disabled) return

    e.preventDefault() // Space 스크롤 방지
    this._toggleAndEmit()
  }

  _toggleAndEmit() {
    // 체크 토글
    this.$input.checked = !this.$input.checked

    // change 이벤트를 "input에서" 발생시켜 기존 로직(_onChange)을 재사용
    this.$input.dispatchEvent(new Event('change', { bubbles: true }))
  }

  _syncFromAttributes() {
    const text =
      this.getAttribute('text') ||
      '호두샵의 이용약관 및 개인정보처리방침에 대한 내용을 확인하였고 동의합니다.'

    const checked = this.hasAttribute('checked')
    const disabled = this.hasAttribute('disabled')
    const name = this.getAttribute('name') || ''
    const value = this.getAttribute('value') || 'on'
    const variant = this.getAttribute('variant') || 'default'

    if (this.$fallback) this.$fallback.innerHTML = text

    if (this.$input) {
      this.$input.checked = checked
      this.$input.disabled = disabled
      this.$input.name = name
      this.$input.value = value
    }

    if (this.$container) {
      this.$container.className = `check-text variant-${variant}`
    }
  }

  _updateFallbackVisibility() {
    if (!this.$slot || !this.$fallback) return

    const nodes = this.$slot.assignedNodes({ flatten: true }).filter((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return true
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0
      return false
    })

    this.$fallback.style.display = nodes.length > 0 ? 'none' : 'inline'
  }

  _loadStyleOnce() {
    const href = '/src/component/etc/etc.css'
    if (document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }
}

customElements.define('etc-checkbox', EtcCheckbox)
