// src/component/imput/button.js
// 작성자: 팀 (2026.01.13)
// 설명: Figma 디자인 기반 버튼 웹 컴포넌트 구현
// 기능: 8가지 버튼 타입, 4가지 색상, 토글 상태 지원

import './button.css'

class ImputButton extends HTMLElement {
  connectedCallback() {
    // ========== 1. 속성(Attribute) 파싱 ==========
    // 버튼 텍스트, 사이즈, 색상, 타입, 상태, 배지, 아이콘, 비활성화 여부
    const text = this.getAttribute('text') || '버튼'
    const size = this.getAttribute('size') || 'M' // L, M, MS, S
    const color = this.getAttribute('color') || 'green' // green, dark, white, disabled
    const type = this.getAttribute('type') || 'base' // base, tab, menu
    const state = this.getAttribute('state') || 'default' // default, hover
    const badge = this.getAttribute('badge') || ''
    const hasIcon = this.hasAttribute('icon')
    const disabled = this.hasAttribute('disabled')

    // ========== 2. CSS 클래스 동적 구성 ==========
    // 버튼 상태에 따라 CSS 클래스를 조합하여 스타일링
    const classList = [
      'hodu-btn',
      `btn-${type}`,
      `size-${size}`,
      state !== 'default' ? `state-${state}` : '',
      disabled ? 'color-disabled' : `color-${color}`,
      hasIcon ? 'has-icon' : '',
    ]
      .filter(Boolean)
      .join(' ')

    // ========== 3. 아이콘 HTML 생성 ==========
    // icon 속성이 있으면 + 기호 아이콘 렌더링
    const iconHTML = hasIcon ? '<span class="icon-plus"></span>' : ''

    // ========== 4. 배지 HTML 생성 ==========
    // badge 속성이 있으면 빨간 원형 배지(숫자/텍스트) 우측에 표시
    const badgeHTML = badge ? `<span class="badge-count">${badge}</span>` : ''

    // ========== 5. 버튼 엘리먼트 렌더링 ==========
    // 아이콘, 텍스트, 배지를 포함한 버튼 마크업 생성
    this.innerHTML = `
      <button class="${classList}">
        ${iconHTML}
        <span class="btn-text">${text}</span>
        ${badgeHTML}
      </button>
    `

    // ========== 6. 클릭 이벤트 처리 ==========
    // 토글 기능: 클릭 시 enabled ↔ disabled 상태 전환
    const button = this.querySelector('button')
    if (button) {
      button.addEventListener('click', (e) => {
        // 현재 disabled 상태 확인
        const isCurrentlyDisabled = this.hasAttribute('disabled')

        console.log(`버튼 클릭됨: ${text}`)

        if (isCurrentlyDisabled) {
          // disabled → enabled로 변환
          this.removeAttribute('disabled')
          button.classList.remove('color-disabled')
          button.classList.add(`color-${color}`)
        } else {
          // enabled → disabled로 변환
          this.setAttribute('disabled', '')
          button.classList.remove(`color-${color}`)
          button.classList.add('color-disabled')
        }

        // 외부에서 버튼 클릭 감지 가능하도록 커스텀 이벤트 발생
        this.dispatchEvent(
          new CustomEvent('button-click', { detail: { text } })
        )
      })
    }
  }
}

customElements.define('imput-button', ImputButton)
