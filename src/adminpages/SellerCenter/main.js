// 웹 컴포넌트는 vite-plugin-auto-components에서 자동으로 import됩니다

// button-msicon의 button-click 이벤트를 이벤트 위임으로 처리
document.addEventListener('button-click', (e) => {
  const button = e.target.closest('button-msicon')
  const link = button?.getAttribute('data-link')

  if (link) {
    window.location.href = link
  }
})
