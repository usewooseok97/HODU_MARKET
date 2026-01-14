class EtcAmountCounter extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.min = parseInt(this.getAttribute('min') || '1')
    this.max = parseInt(this.getAttribute('max') || '99')
    this.value = parseInt(this.getAttribute('value') || '1')

    this.render()
    this.attachEventListeners()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* 전체 컨테이너: 150px x 50px */
        .amount-counter {
          position: relative;
          width: 150px;
          height: 50px;
          background: #FFFFFF;
          border: 1px solid #C4C4C4;
          border-radius: 5px;
          overflow: hidden;
          display: flex;
          align-items: stretch;
          box-sizing: border-box;
        }

        /* 버튼 공통 스타일 */
        .amount-btn {
          position: relative;
          width: 48px;
          height: 100%;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
          flex-shrink: 0;
          transition: background-color 0.15s ease;
        }

        /* 버튼 hover 효과 */
        .amount-btn:hover:not(:disabled) {
          background: #E0E0E0;
        }

        .amount-btn:hover:not(:disabled) .minus-line,
        .amount-btn:hover:not(:disabled) .plus-horizontal,
        .amount-btn:hover:not(:disabled) .plus-vertical {
          background: #FFFFFF;
        }

        /* 버튼 active 효과 */
        .amount-btn:active:not(:disabled) {
          background: #D0D0D0;
        }

        .amount-btn:active:not(:disabled) .minus-line,
        .amount-btn:active:not(:disabled) .plus-horizontal,
        .amount-btn:active:not(:disabled) .plus-vertical {
          background: #FFFFFF;
        }

        /* 버튼 비활성화 */
        .amount-btn:disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }

        /* 가운데 숫자 영역: 52px */
        .amount-display {
          position: relative;
          width: 52px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-left: 1px solid #C4C4C4;
          border-right: 1px solid #C4C4C4;
          background: #FFFFFF;
        }

        /* 숫자 텍스트 */
        .amount-value {
          font-family: 'Spoqa Han Sans Neo', sans-serif;
          font-weight: 400;
          font-size: 1.8rem;
          line-height: 1;
          color: #000000;
          user-select: none;
        }

        /* 아이콘 컨테이너 */
        .icon-minus,
        .icon-plus {
          position: relative;
          width: 20px;
          height: 20px;
          display: block;
        }

        /* 마이너스 아이콘: 가로선 */
        .minus-line {
          position: absolute;
          width: 20px;
          height: 2px;
          left: 0;
          top: 9px;
          background: #C4C4C4;
          display: block;
        }

        .amount-btn:disabled .minus-line {
          background: #F2F2F2;
        }

        /* 플러스 아이콘: 가로선 */
        .plus-horizontal {
          position: absolute;
          width: 20px;
          height: 2px;
          left: 0;
          top: 9px;
          background: #C4C4C4;
          display: block;
        }

        /* 플러스 아이콘: 세로선 */
        .plus-vertical {
          position: absolute;
          width: 2px;
          height: 20px;
          left: 9px;
          top: 0;
          background: #C4C4C4;
          display: block;
        }

        .amount-btn:disabled .plus-horizontal,
        .amount-btn:disabled .plus-vertical {
          background: #F2F2F2;
        }
      </style>
      <div class="amount-counter">
        <button class="amount-btn btn-minus" aria-label="수량 감소" ${this.value <= this.min ? 'disabled' : ''}>
          <span class="icon-minus">
            <span class="minus-line"></span>
          </span>
        </button>
        <div class="amount-display">
          <span class="amount-value">${this.value}</span>
        </div>
        <button class="amount-btn btn-plus" aria-label="수량 증가" ${this.value >= this.max ? 'disabled' : ''}>
          <span class="icon-plus">
            <span class="plus-horizontal"></span>
            <span class="plus-vertical"></span>
          </span>
        </button>
      </div>
    `
  }

  attachEventListeners() {
    const minusBtn = this.shadowRoot.querySelector('.btn-minus')
    const plusBtn = this.shadowRoot.querySelector('.btn-plus')
    const valueSpan = this.shadowRoot.querySelector('.amount-value')

    minusBtn.addEventListener('click', () => {
      if (this.value > this.min) {
        this.value--
        valueSpan.textContent = this.value
        this.updateButtonStates()
        this.dispatchChangeEvent()
      }
    })

    plusBtn.addEventListener('click', () => {
      if (this.value < this.max) {
        this.value++
        valueSpan.textContent = this.value
        this.updateButtonStates()
        this.dispatchChangeEvent()
      }
    })
  }

  updateButtonStates() {
    const minusBtn = this.shadowRoot.querySelector('.btn-minus')
    const plusBtn = this.shadowRoot.querySelector('.btn-plus')

    if (this.value <= this.min) {
      minusBtn.disabled = true
    } else {
      minusBtn.disabled = false
    }

    if (this.value >= this.max) {
      plusBtn.disabled = true
    } else {
      plusBtn.disabled = false
    }
  }

  dispatchChangeEvent() {
    this.dispatchEvent(
      new CustomEvent('amountchange', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    )
  }

  getValue() {
    return this.value
  }

  setValue(newValue) {
    const value = parseInt(newValue)
    if (value >= this.min && value <= this.max) {
      this.value = value
      const valueSpan = this.shadowRoot.querySelector('.amount-value')
      if (valueSpan) {
        valueSpan.textContent = this.value
        this.updateButtonStates()
      }
    }
  }
}

customElements.define('etc-amountcounter', EtcAmountCounter)
