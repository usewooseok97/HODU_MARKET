class MypageDropdown extends HTMLElement {
  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    // 드롭다운 HTML 생성 (ul li 구조)
    this.innerHTML = `
      <div class="mypage-dropdown">
        <ul class="mypage-dropdown__list">
          <li class="mypage-dropdown__item" data-action="mypage">
            마이페이지
          </li>
          <li class="mypage-dropdown__item" data-action="logout">
            로그아웃
          </li>
        </ul>
      </div>
    `

    // 스타일 로드
    this.loadStyles()
  }

  attachEventListeners() {
    const items = this.querySelectorAll('.mypage-dropdown__item')

    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        const action = item.getAttribute('data-action')

        // 커스텀 이벤트 발생
        this.dispatchEvent(
          new CustomEvent('dropdown-select', {
            bubbles: true,
            detail: { action },
          })
        )

        // action에 따른 기본 동작
        if (action === 'logout') {
          this.handleLogout()
        } else if (action === 'mypage') {
          this.handleMypage()
        }
      })
    })
  }

  handleMypage() {
    // 마이페이지로 이동
    window.location.href = '/src/pages/mypage/index.html'
  }

  handleLogout() {
    // 토큰 및 사용자 정보 삭제
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_type')

    // 로그인 페이지로 이동
    window.location.href = '/src/pages/login/index.html'
  }

  loadStyles() {
    // CSS 파일이 로드되어 있는지 확인
    if (!document.querySelector('link[href*="mypage.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/etc/mypage.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('etc-mypage', MypageDropdown)
