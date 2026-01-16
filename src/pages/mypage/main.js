import { requireAuth } from '@/js/auth/routeGuard.js'
import { getAuthRequest } from '@/js/api.js'
import { getAccessToken } from '@/js/auth/token.js'

if (!requireAuth({ message: '마이페이지는 로그인이 필요합니다.' })) {
  throw new Error('Unauthorized')
}

const orderListEl = document.getElementById('orderList')
const orderEmptyEl = document.getElementById('orderEmpty')

const statusMap = {
  payment_pending: '결제 대기',
  payment_complete: '결제 완료',
  preparing: '상품 준비',
  shipping: '배송 중',
  delivered: '배송 완료',
  cancled: '주문 취소',
  cancelled: '주문 취소',
}

const methodMap = {
  card: '신용/체크카드',
  deposit: '무통장 입금',
  phone: '휴대폰 결제',
  naverpay: '네이버페이',
  kakaopay: '카카오페이',
}

document.addEventListener('DOMContentLoaded', () => {
  fetchOrders()
})

async function fetchOrders() {
  const token = getAccessToken()
  if (!token) return

  try {
    const data = await getAuthRequest('order/', token)
    const orders = data?.results || []
    renderOrders(orders)
  } catch (error) {
    console.error('주문 내역 조회 실패:', error)
    renderOrders([])
  }
}

function renderOrders(orders) {
  if (!orderListEl || !orderEmptyEl) return

  orderListEl.innerHTML = ''
  orderEmptyEl.style.display = orders.length === 0 ? 'block' : 'none'

  orders.forEach((order) => {
    const orderCard = document.createElement('div')
    orderCard.className = 'order-card'
    orderCard.appendChild(createOrderHeader(order))
    orderCard.appendChild(createOrderMeta(order))
    orderCard.appendChild(createOrderItems(order))
    orderCard.appendChild(createOrderTotal(order))
    orderListEl.appendChild(orderCard)
  })
}

function createOrderHeader(order) {
  const header = document.createElement('div')
  header.className = 'order-header'

  const number = document.createElement('span')
  number.className = 'order-number'
  number.textContent = `주문번호 ${order.order_number || order.id}`

  const status = document.createElement('span')
  status.className = 'order-status'
  status.textContent = statusMap[order.order_status] || order.order_status

  header.append(number, status)
  return header
}

function createOrderMeta(order) {
  const meta = document.createElement('div')
  meta.className = 'order-meta'

  const createdAt = formatDate(order.created_at)
  const payment = methodMap[order.payment_method] || order.payment_method
  const orderType =
    order.order_type === 'cart_order' ? '장바구니 주문' : '바로 구매'

  meta.innerHTML = `
    <span><strong>주문일:</strong> ${createdAt}</span>
    <span><strong>결제수단:</strong> ${payment}</span>
    <span><strong>주문유형:</strong> ${orderType}</span>
    <span><strong>수령인:</strong> ${order.receiver || '-'}</span>
    <span><strong>연락처:</strong> ${order.receiver_phone_number || '-'}</span>
    <span><strong>주소:</strong> ${order.address || '-'}</span>
  `

  return meta
}

function createOrderItems(order) {
  const itemsWrapper = document.createElement('div')
  itemsWrapper.className = 'order-items'

  const items = order.order_items || []
  if (items.length === 0) {
    const empty = document.createElement('div')
    empty.className = 'order-item'
    empty.textContent = '주문 상품 정보가 없습니다.'
    itemsWrapper.appendChild(empty)
    return itemsWrapper
  }

  items.forEach((item) => {
    const row = document.createElement('div')
    row.className = 'order-item'

    const name = document.createElement('span')
    name.className = 'order-item-name'
    name.textContent = item.product?.product_name || item.product?.name || '상품'

    const details = document.createElement('div')
    details.className = 'order-item-details'
    details.innerHTML = `
      <span>수량 ${item.ordered_quantity}개</span>
      <span>상품금액 ${formatPrice(item.ordered_unit_price)}원</span>
      <span>배송비 ${formatPrice(item.ordered_shipping_fee)}원</span>
      <span>합계 ${formatPrice(item.item_total_price)}원</span>
    `

    row.append(name, details)
    itemsWrapper.appendChild(row)
  })

  return itemsWrapper
}

function createOrderTotal(order) {
  const total = document.createElement('div')
  total.className = 'order-total'
  total.textContent = `총 결제금액 ${formatPrice(order.total_price)}원`
  return total
}

function formatPrice(value) {
  const numberValue = Number.parseInt(value, 10)
  if (Number.isNaN(numberValue)) return '0'
  return numberValue.toLocaleString('ko-KR')
}

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('ko-KR')
}
