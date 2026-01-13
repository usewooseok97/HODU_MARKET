// 웹 컴포넌트는 vite-plugin-auto-components에서 자동으로 import됩니다

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
