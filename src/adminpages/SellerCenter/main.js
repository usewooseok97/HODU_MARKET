import './style.css'

// 웹 컴포넌트는 vite-plugin-auto-components에서 자동으로 import됩니다
import { requireAuth } from '@/js/auth/routeGuard.js'

// 로그인 확인 (Route Guard)
if (!requireAuth({ message: '결제 페이지는 로그인이 필요합니다.' })) {
  throw new Error('Unauthorized')
}

// button-msicon의 button-click 이벤트를 이벤트 위임으로 처리
document.addEventListener('button-click', (e) => {
  const button = e.target.closest('button-msicon')
  const link = button?.getAttribute('data-link')

  if (link) {
    window.location.href = link
  }
})

function setActiveTebMenu(target) {
  const menus = document.querySelectorAll('button-tebmenu')
  menus.forEach((menu) => {
    if (menu === target) {
      menu.setActive?.(true) ?? menu.setAttribute('active', '')
    } else {
      menu.setActive?.(false) ?? menu.removeAttribute('active')
    }
  })

  const productTable = document.querySelector('.product-table')
  if (productTable) {
    const isFirst = menus[0] === target
    const header = productTable.querySelector('sellercart-header')
    const list = productTable.querySelector('sellercart-list')
    let emptyState = productTable.querySelector('.dashboard-empty')

    if (!emptyState) {
      emptyState = document.createElement('div')
      emptyState.className = 'dashboard-empty'
      emptyState.textContent = '선택한 메뉴의 내용이 없습니다.'
      productTable.appendChild(emptyState)
    }

    if (header) header.style.display = ''
    if (list) list.style.display = isFirst ? '' : 'none'
    emptyState.style.display = isFirst ? 'none' : 'block'
  }
}

document.addEventListener('teb-menu-click', (e) => {
  const target = e.target.closest('button-tebmenu')
  if (!target) return
  setActiveTebMenu(target)
})

document.addEventListener('DOMContentLoaded', () => {
  const menus = document.querySelectorAll('button-tebmenu')
  if (menus.length === 0) return
  const hasActive = Array.from(menus).some((menu) => menu.hasAttribute('active'))
  if (!hasActive) {
    setActiveTebMenu(menus[0])
  }
})
