// src/component/header/search.js
import '@component/etc/mypage.js'
import '@component/button/msicon.js'

class Header extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
    this.setupEventListeners()
  }

  // 로그인 여부 확인
  isLoggedIn() {
    return !!localStorage.getItem('refresh_token')
  }

  // 사용자 타입 확인
  getUserType() {
    return localStorage.getItem('user_type')
  }

  render() {
    const isLoggedIn = this.isLoggedIn()
    const userType = this.getUserType()
    const authText = isLoggedIn ? '마이페이지' : '로그인'

    // SELLER일 때 장바구니 숨김, 판매자 센터 표시
    const showCart = userType !== 'SELLER'
    const showSellerCenter = isLoggedIn && userType === 'SELLER'

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

          <!-- 오른쪽 그룹: 장바구니(조건부) + 로그인/마이페이지 + 판매자 센터(조건부) -->
          <div class="right-group">
            <nav class="nav-wrapper">
              ${showCart ? `
              <!-- 장바구니 -->
              <div class="nav-item" data-nav="cart">
                <logo-cart></logo-cart>
                <span class="nav-text">장바구니</span>
              </div>
              ` : ''}

              <!-- 로그인/마이페이지 -->
              <div class="nav-item" data-nav="mypage">
                <logo-account></logo-account>
                <span class="nav-text">${authText}</span>
                <div class="mypage-dropdown-wrapper"></div>
              </div>

              ${showSellerCenter ? `
              <!-- 판매자 센터 -->
              <div class="nav-item nav-item--seller-center" data-nav="seller-center">
                <button-msicon
                  text="판매자 센터"
                  icon="icon-shopping-bag.png"
                  width="168px">
                </button-msicon>
              </div>
              ` : ''}
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
        const navType = item.dataset.nav

        if (navType === 'mypage') {
          e.preventDefault()
          if (this.isLoggedIn()) {
            // 로그인 상태: 드롭다운 토글
            navItems.forEach((nav) => nav.classList.remove('active'))
            item.classList.add('active')
            this.toggleMypageDropdown(item)
          } else {
            // 비로그인 상태: 로그인 페이지로 이동
            window.location.href = '/src/pages/login/index.html'
          }
        } else if (navType === 'cart') {
          // 장바구니 클릭 시
          if (this.isLoggedIn()) {
            // 로그인 상태: 장바구니 페이지로 이동
            window.location.href = '/src/pages/shoppingCartPage/index.html'
          } else {
            // 비로그인 상태: 로그인 페이지로 이동
            window.location.href = '/src/pages/login/index.html'
          }
        } else if (navType === 'seller-center') {
          // 판매자 센터 클릭 시
          e.preventDefault()
          window.location.href = '/src/adminpages/SellerCenter/index.html'
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
