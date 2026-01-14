class Footer extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <footer class="hodu-footer">
        <div class="footer-container">
          <div class="footer-top">
            <nav class="footer-nav">
              <ul class="footer-links">
                <li><a href="#">호두샵 소개</a></li>
                <li><a href="#">이용약관</a></li>
                <li><a href="#" class="bold">개인정보처리방침</a></li>
                <li><a href="#">전자금융거래약관</a></li>
                <li><a href="#">청소년보호정책</a></li>
                <li><a href="#">제휴문의</a></li>
              </ul>
            </nav>
            <div class="footer-social">
                <logo-instar></logo-instar>
                <logo-face></logo-face>
                <logo-youtube></logo-youtube>
            </div>
          </div>

          <div class="footer-bottom">
            <div class="company-info">
              <p class="company-name">(주)HODU SHOP</p>
              <p class="company-details">
                <span>제주특별자치도 제주시 동광로 137 제주코딩베이스캠프</span><br>
                <span>사업자 번호 : 000-0000-0000 | 통신판매업</span><br>
                <span>대표 : 김호두</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    `

    this.loadStyles()
  }

  loadStyles() {
    if (!document.querySelector('link[href*="footer.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/bottom/footer.css'
      document.head.appendChild(link)
    }
  }
}

customElements.define('bottom-footer', Footer)
