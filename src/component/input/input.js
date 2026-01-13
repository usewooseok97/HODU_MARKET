class InputComponents extends HTMLElement {
  connectedCallback() {
    this.render()
    this.attachEventListeners()
  }

  render() {
    this.innerHTML = `
      <div class="input-components-container">
        <!-- 아이디 입력 -->
        <div class="id-box">
          <label for="id">아이디</label>
          <input type="text" id="id" class="id-input" />
        </div>

        <!-- 비밀번호 입력 -->
        <div class="ps-box">
          <label for="password" class="ps-text">비밀번호</label>
          <input
            type="password"
            id="password"
            class="ps-input"
            placeholder="text"
          />
        </div>

        <!-- 상품명 입력 (글자수 카운트) -->
        <div class="item-box">
          <label for="itemName" class="item-text">상품명</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="itemName"
              class="item-input"
              placeholder="상품명을 입력해주세요."
              maxlength="50"
            />
            <span class="char-count">
              <span id="currentCount">0</span>/50
            </span>
          </div>
        </div>

        <!-- 판매가 입력 (숫자 포맷팅) -->
        <div class="price-box">
          <label for="price" class="price-text">판매가</label>
          <div class="input-group">
            <input type="text" id="price" class="price-input" value="0" />
            <button class="unit-button" type="button">원</button>
          </div>
        </div>

        <!-- 아이디 체크 입력 -->
        <div class="check-box">
          <label for="id-check" class="check-label">아이디</label>
          <input type="text" id="id-check" class="check-input" placeholder="text" />
          <p class="message"></p>
        </div>
      </div>
    `

    this.loadStyles()
  }

  loadStyles() {
    // CSS 파일이 이미 로드되어 있지 않은 경우에만 추가
    if (!document.querySelector('link[href*="styles.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/src/component/styles.css'
      document.head.appendChild(link)
    }
  }

  attachEventListeners() {
    // 상품명 글자수 카운트 기능
    const itemNameInput = this.querySelector('#itemName')
    const countSpan = this.querySelector('#currentCount')

    if (itemNameInput && countSpan) {
      itemNameInput.addEventListener('input', function () {
        countSpan.textContent = this.value.length
      })
    }

    // 판매가 숫자 포맷팅 기능 (천 단위 콤마)
    const priceInput = this.querySelector('#price')

    if (priceInput) {
      priceInput.addEventListener('input', function (e) {
        // 숫자가 아닌 문자 제거
        let value = this.value.replace(/[^\d]/g, '')

        // 빈 값이 아니면 천 단위 콤마 추가
        if (value) {
          value = Number(value).toLocaleString()
        }

        this.value = value
      })
    }
  }
}

// 커스텀 엘리먼트 등록
customElements.define('input-input', InputComponents)
