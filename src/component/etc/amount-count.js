class AmountCounter extends HTMLElement {
  constructor() {
    super();
    this.stylesLoaded = false;
  }

  // CSS 파일 로드 함수
  loadStyles() {
    if (this.stylesLoaded) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      // 이미 로드된 스타일시트가 있는지 확인
      const existingLink = document.querySelector('link[href*="etc.css"]');
      if (existingLink) {
        this.stylesLoaded = true;
        resolve();
        return;
      }

      // 새 link 요소 생성
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/src/component/etc/etc.css';
      
      link.onload = () => {
        this.stylesLoaded = true;
        resolve();
      };
      
      link.onerror = () => {
        reject(new Error('Failed to load amount-counter.css'));
      };
      
      document.head.appendChild(link);
    });
  }

  async connectedCallback() {
    // CSS 로드 대기
    try {
      await this.loadStyles();
    } catch (error) {
      console.error('AmountCounter CSS loading error:', error);
    }

    // 속성 가져오기
    const min = parseInt(this.getAttribute('min')) || 1;
    const max = parseInt(this.getAttribute('max')) || 99;
    const value = parseInt(this.getAttribute('value')) || min;
    const disabled = this.hasAttribute('disabled');

    this.min = min;
    this.max = max;
    this.value = value;

    // HTML 렌더링
    this.innerHTML = `
      <div class="amount-counter">
        <button class="amount-btn minus" aria-label="감소">
          <span class="icon-minus-line">
            <span class="vector-1"></span>
          </span>
        </button>

        <div class="amount-display">
          <span class="amount-value">${this.value}</span>
        </div>
        
        <button class="amount-btn plus" aria-label="증가">
          <span class="icon-plus-line">
            <span class="vector-2"></span>
            <span class="vector-3"></span>
          </span>
        </button>
      </div>
    `;

    // 이벤트 리스너 등록
    this.minusBtn = this.querySelector('.minus');
    this.plusBtn = this.querySelector('.plus');
    this.valueDisplay = this.querySelector('.amount-value');

    this.minusBtn.addEventListener('click', () => this.decrease());
    this.plusBtn.addEventListener('click', () => this.increase());

    // 초기 상태 업데이트
    this.updateButtonStates();

    if (disabled) {
      this.setDisabled(true);
    }
  }

  decrease() {
    if (this.value > this.min) {
      this.value--;
      this.updateDisplay();
      this.triggerChange();
    }
  }

  increase() {
    if (this.value < this.max) {
      this.value++;
      this.updateDisplay();
      this.triggerChange();
    }
  }

  updateDisplay() {
    this.valueDisplay.textContent = this.value;
    this.updateButtonStates();
  }

  updateButtonStates() {
    // 최소값일 때 마이너스 버튼 비활성화
    this.minusBtn.disabled = this.value <= this.min;
    
    // 최대값일 때 플러스 버튼 비활성화
    this.plusBtn.disabled = this.value >= this.max;
  }

  triggerChange() {
    // 커스텀 이벤트 발생
    const event = new CustomEvent('amount-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);

    // value 속성 업데이트
    this.setAttribute('value', this.value);
  }

  // 외부에서 값 설정
  setValue(newValue) {
    const value = parseInt(newValue);
    if (value >= this.min && value <= this.max) {
      this.value = value;
      this.updateDisplay();
    }
  }

  // 외부에서 값 가져오기
  getValue() {
    return this.value;
  }

  // 비활성화 설정
  setDisabled(disabled) {
    if (disabled) {
      this.minusBtn.disabled = true;
      this.plusBtn.disabled = true;
    } else {
      this.updateButtonStates();
    }
  }

  // 속성 변경 감지
  static get observedAttributes() {
    return ['value', 'min', 'max', 'disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.valueDisplay) return;

    switch (name) {
      case 'value':
        this.setValue(newValue);
        break;
      case 'min':
        this.min = parseInt(newValue) || 1;
        this.updateButtonStates();
        break;
      case 'max':
        this.max = parseInt(newValue) || 99;
        this.updateButtonStates();
        break;
      case 'disabled':
        this.setDisabled(newValue !== null);
        break;
    }
  }
}

customElements.define('etc-amount-counter', AmountCounter);
