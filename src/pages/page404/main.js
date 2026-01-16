// 웹 컴포넌트 직접 import (404 폴백 상황에서 안정성 확보)
import '@component/button/medium.js'

// DOM 요소 선택
const goHomeBtn = document.getElementById('goHomeBtn')
const goBackBtn = document.getElementById('goBackBtn')

// 메인으로 버튼 클릭 이벤트
goHomeBtn.addEventListener('button-click', () => {
  window.location.href = '/'
})

// 이전 페이지 버튼 클릭 이벤트
goBackBtn.addEventListener('button-click', () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    window.location.href = '/'
  }
})
