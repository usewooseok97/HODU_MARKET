/**
 * NumDropdown Web Component
 * 스크롤 가능한 번호 선택 드롭다운 (010, 011, 016, 017 등)
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
    this.selectedIndex = null
  }

  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    // 드롭다운 HTML 생성
    this.innerHTML = `
      <div class="num-dropdown">
        <ul class="num-dropdown__list">
          ${this.numbers
            .map(
              (num, index) => `
            <li class="num-dropdown__item" data-number="${num}" data-index="${index}">
              ${num}
            </li>
          `
            )
            .join('')}
        </ul>
        
        <!-- 스크롤바 영역 -->
        <div class="num-dropdown__scrollbar">
          <div class="num-dropdown__scrollbar-thumb"></div>
        </div>
      </div>
    `

    // 스타일 로드
    this.loadStyles()
  }

  attachEventListeners() {
    const items = this.querySelectorAll('.num-dropdown__item')
    const list = this.querySelector('.num-dropdown__list')

    // 아이템 클릭 이벤트
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const number = item.dataset.number
        const index = parseInt(item.dataset.index)

        // 기존 선택 제거
        items.forEach((i) => i.classList.remove('num-dropdown__item--selected'))

        // 새 선택 추가
        item.classList.add('num-dropdown__item--selected')
        this.selectedIndex = index

        // 커스텀 이벤트 발생
        this.dispatchEvent(
          new CustomEvent('num-select', {
            detail: { number },
            bubbles: true,
          })
        )
      })
    })

    // 스크롤 이벤트 (스크롤바 업데이트)
    list.addEventListener('scroll', () => {
      this.updateScrollbar()
    })
  }

  updateScrollbar() {
    const list = this.querySelector('.num-dropdown__list')
    const thumb = this.querySelector('.num-dropdown__scrollbar-thumb')

    if (!list || !thumb) return

    const scrollPercentage =
      list.scrollTop / (list.scrollHeight - list.clientHeight)
    const maxThumbTop = 150 - 90 - 12 // 전체 높이 - thumb 높이 - 패딩
    const thumbTop = 6 + scrollPercentage * maxThumbTop

    thumb.style.top = `${thumbTop}px`
  }

  loadStyles() {
    // CSS 파일이 이미 로드되었는지 확인
    if (document.querySelector('link[href*="num-dropdown.css"]')) {
      return
    }

    // CSS 파일 동적 로드
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/src/component/etc/num-dropdown.css'
    document.head.appendChild(link)
  }
}

// 커스텀 엘리먼트 등록
customElements.define('etc-num-dropdown', NumDropdown)

export default NumDropdown
