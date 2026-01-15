// src/component/header/search.js

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
                <div class="icon-wrapper">
                  <logo-shop class="icon-default"></logo-shop>
                  <logo-shopgr class="icon-active"></logo-shopgr>
                </div>
                <span class="nav-text">장바구니</span>

              <!-- 마이페이지 -->
                <div class="icon-wrapper">
                  <logo-user class="icon-default"></logo-user>
                  <logo-usergr class="icon-active"></logo-usergr>
                </div>
                <span class="nav-text">마이페이지</span>
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

        // 모든 nav-item에서 active 제거
        navItems.forEach((nav) => nav.classList.remove('active'))

        // 클릭된 항목에 active 추가
        item.classList.add('active')

        // 커스텀 이벤트 발생
        const navType = item.dataset.nav
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
