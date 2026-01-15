// src/component/header/search.js
import '@component/etc/mypage.js'

class Header extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
    this.setupEventListeners()
  }

  render() {
    this.innerHTML = `
      <header class="header">
        <div class="header-container">
          <!-- 왼쪽 그룹: 로고 + 검색창 -->
          <div class="left-group">
            <!-- 로고 영역 -->
            <div class="logo-wrapper">
              <logo-component width="124px"></logo-component>
            </div>

            <!-- 검색바 영역 -->
            <div class="search-wrapper">
              <div class="search-container">
                <input 
                  type="text" 
                  class="search-input" 
                  placeholder="상품을 검색해보세요!"
                  aria-label="상품 검색"
                >
                <button class="search-button" aria-label="검색">
                  <svg class="search-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11.5" cy="11.5" r="7.5" stroke="#21BF48" stroke-width="3"/>
                    <line x1="16.5" y1="16.5" x2="22.5" y2="22.5" stroke="#21BF48" stroke-width="3" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 오른쪽 그룹: 장바구니 + 마이페이지 -->
          <div class="right-group">
            <nav class="nav-wrapper">
              <!-- 장바구니 -->
              <div class="nav-item" data-nav="cart">
                <div class="icon-wrapper">
                  <logo-shop class="icon-default"></logo-shop>
                  <logo-shopgr class="icon-active"></logo-shopgr>
                </div>
                <span class="nav-text">장바구니</span>
              </div>

              <!-- 마이페이지 -->
              <div class="nav-item nav-item--mypage" data-nav="mypage">
                <div class="icon-wrapper">
                  <logo-user class="icon-default"></logo-user>
                  <logo-usergr class="icon-active"></logo-usergr>
                </div>
                <span class="nav-text">마이페이지</span>

                <!-- 드롭다운이 붙을 자리 -->
                <div class="mypage-dropdown-wrapper"></div>
              </div>
          </nav>
        </div>
      </div>
    </header>
    `

    this.loadStyles()
  }

  setupEventListeners() {
    const navItems = this.querySelectorAll('.nav-item')

    navItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault()

        const navType = item.dataset.nav

        // active 토글
        navItems.forEach((nav) => nav.classList.remove('active'))
        item.classList.add('active')

        // 마이페이지 클릭이면 드롭다운 토글
        if (navType === 'mypage') {
          this.toggleMypageDropdown(item)
        }

        // 커스텀 이벤트 (필요 시)
        this.dispatchEvent(
          new CustomEvent('nav-click', {
            detail: { type: navType },
            bubbles: true,
            composed: true,
          })
        )
      })
    })

    // 검색 입력 이벤트
    const searchInput = this.querySelector('.search-input')
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.dispatchEvent(
          new CustomEvent('search-input', {
            detail: { value: e.target.value },
            bubbles: true,
            composed: true,
          })
        )
      })
    }
  }
  toggleMypageDropdown(mypageItem) {
    const wrapper = mypageItem.querySelector('.mypage-dropdown-wrapper')
    const existing = wrapper.querySelector('etc-mypage')

    // 이미 열려 있으면 제거(=토글)
    if (existing) {
      existing.remove()
      return
    }

    // 새로 생성해서 붙이기
    const dropdown = document.createElement('etc-mypage')
    wrapper.appendChild(dropdown)

    // 바깥 클릭하면 닫히게
    const handleOutsideClick = (e) => {
      if (!dropdown.contains(e.target) && !mypageItem.contains(e.target)) {
        dropdown.remove()
        document.removeEventListener('click', handleOutsideClick)
      }
    }

    // 이벤트 버블링 때문에 한 틱 뒤에 등록
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick)
    }, 0)
  }

  loadStyles() {
    // CSS 파일이 이미 로드되었는지 확인
    if (!document.querySelector('link[href*="header/search.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/header/search.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('header-search', Header)
