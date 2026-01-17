import './num-dropdown.css'

/**
 * NumDropdown Web Component
 * 클릭하면 드롭다운이 열리는 번호 선택 컴포넌트
 *
 * @example
 * <etc-num-dropdown></etc-num-dropdown>
 *
 * @fires num-select - 번호 선택 시 발생
 *   detail: { number: '010' }
 */

class NumDropdown extends HTMLElement {
  constructor() {
    super()
    this.numbers = ['010', '011', '016', '017', '018', '019']
    this.selectedNumber = '010'
    this.isOpen = false
    this._onDocumentClick = this._onDocumentClick.bind(this)
  }

  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onDocumentClick)
  }

  render() {
    this.innerHTML = `
      <div class="num-dropdown">
        <button type="button" class="num-dropdown__trigger">
          <span class="num-dropdown__value">${this.selectedNumber}</span>
          <span class="num-dropdown__arrow"></span>
        </button>
        <div class="num-dropdown__menu">
          <ul class="num-dropdown__list">
            ${this.numbers
              .map(
                (num) => `
              <li class="num-dropdown__item${num === this.selectedNumber ? ' num-dropdown__item--selected' : ''}" data-number="${num}">
                ${num}
              </li>
            `
              )
              .join('')}
          </ul>
          <div class="num-dropdown__scrollbar">
            <div class="num-dropdown__scrollbar-thumb"></div>
          </div>
        </div>
      </div>
    `

  }

  attachEventListeners() {
    const trigger = this.querySelector('.num-dropdown__trigger')
    const items = this.querySelectorAll('.num-dropdown__item')
    const list = this.querySelector('.num-dropdown__list')

    // 트리거 클릭 - 드롭다운 열기/닫기
    trigger.addEventListener('click', (e) => {
      e.stopPropagation()
      this.toggle()
    })

    // 아이템 클릭 이벤트
    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation()
        const number = item.dataset.number

        // 선택 업데이트
        this.selectedNumber = number
        this.querySelector('.num-dropdown__value').textContent = number

        // 선택 상태 업데이트
        items.forEach((i) => i.classList.remove('num-dropdown__item--selected'))
        item.classList.add('num-dropdown__item--selected')

        // 드롭다운 닫기
        this.close()

        // 커스텀 이벤트 발생
        this.dispatchEvent(
          new CustomEvent('num-select', {
            detail: { number },
            bubbles: true,
          })
        )
      })
    })

    // 스크롤 이벤트
    list.addEventListener('scroll', () => {
      this.updateScrollbar()
    })

    // 외부 클릭 시 닫기
    document.addEventListener('click', this._onDocumentClick)
  }

  _onDocumentClick(e) {
    if (!this.contains(e.target)) {
      this.close()
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    this.isOpen = true
    this.querySelector('.num-dropdown').classList.add('num-dropdown--open')
    this.querySelector('.num-dropdown__arrow').classList.add('num-dropdown__arrow--up')
  }

  close() {
    this.isOpen = false
    this.querySelector('.num-dropdown')?.classList.remove('num-dropdown--open')
    this.querySelector('.num-dropdown__arrow')?.classList.remove('num-dropdown__arrow--up')
  }

  updateScrollbar() {
    const list = this.querySelector('.num-dropdown__list')
    const thumb = this.querySelector('.num-dropdown__scrollbar-thumb')

    if (!list || !thumb) return

    const scrollPercentage =
      list.scrollTop / (list.scrollHeight - list.clientHeight)
    const maxThumbTop = 150 - 90 - 12
    const thumbTop = 6 + scrollPercentage * maxThumbTop

    thumb.style.top = `${thumbTop}px`
  }

  getValue() {
    return this.selectedNumber
  }
}

customElements.define('etc-num-dropdown', NumDropdown)

export default NumDropdown
