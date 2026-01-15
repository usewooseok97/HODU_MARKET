// 웹 컴포넌트는 vite-plugin-auto-components에서 자동으로 import됩니다

const orderProductListEl = document.getElementById('orderProductList')
const totalOrderAmountEl = document.getElementById('totalOrderAmount')
const agreementCheckEl = document.getElementById('agreementCheck')
const paymentBtnEl = document.getElementById('paymentBtn')

function getNumber(value) {
  const num = Number.parseInt(value, 10)
  return Number.isNaN(num) ? 0 : num
}

function getItemData(itemEl) {
  return {
    price: getNumber(itemEl.getAttribute('price')),
    quantity: getNumber(itemEl.getAttribute('quantity')) || 1,
    shipping: getNumber(itemEl.getAttribute('shipping')),
    discount: getNumber(itemEl.getAttribute('discount')),
  }
}

function updateFinalPaymentInfo(productAmount, totalShipping, totalDiscount) {
  const productAmountEl = document.querySelector(
    '.payment-detail-row:nth-child(1) .detail-amount'
  )
  if (productAmountEl) {
    productAmountEl.textContent = productAmount.toLocaleString('ko-KR')
  }

  const discountAmountEl = document.querySelector(
    '.payment-detail-row:nth-child(2) .detail-amount'
  )
  if (discountAmountEl) {
    discountAmountEl.textContent = totalDiscount.toLocaleString('ko-KR')
  }

  const shippingAmountEl = document.querySelector(
    '.payment-detail-row:nth-child(3) .detail-amount'
  )
  if (shippingAmountEl) {
    shippingAmountEl.textContent = totalShipping.toLocaleString('ko-KR')
  }

  const finalAmount = productAmount + totalShipping - totalDiscount
  const finalAmountEl = document.querySelector('.final-amount')
  if (finalAmountEl) {
    finalAmountEl.textContent = `${finalAmount.toLocaleString('ko-KR')}원`
  }
}

function calculateTotalsFromDom() {
  if (!orderProductListEl) return

  const items = Array.from(orderProductListEl.querySelectorAll('payment-item'))
  let productAmount = 0
  let totalShipping = 0
  let totalDiscount = 0

  items.forEach((itemEl) => {
    const { price, quantity, shipping, discount } = getItemData(itemEl)
    productAmount += price * quantity
    totalShipping += shipping
    totalDiscount += discount
  })

  const totalAmount = productAmount + totalShipping - totalDiscount
  if (totalOrderAmountEl) {
    totalOrderAmountEl.textContent = `${totalAmount.toLocaleString('ko-KR')}원`
  }

  updateFinalPaymentInfo(productAmount, totalShipping, totalDiscount)
}

function isAgreementChecked() {
  const input = agreementCheckEl?.querySelector('input[type="checkbox"]')
  return Boolean(input?.checked)
}

function setupAgreementCheck() {
  if (!agreementCheckEl || !paymentBtnEl) return

  agreementCheckEl.addEventListener('etc-change', (e) => {
    paymentBtnEl.disabled = !e.detail?.checked
  })
}

document.addEventListener('DOMContentLoaded', () => {
  calculateTotalsFromDom()
  setupAgreementCheck()
})

if (orderProductListEl) {
  orderProductListEl.addEventListener('payment-item-change', () => {
    calculateTotalsFromDom()
  })
}

if (paymentBtnEl) {
  paymentBtnEl.addEventListener('click', () => {
    if (!isAgreementChecked()) {
      alert('주문 내용 확인 및 정보 제공에 동의해주세요.')
    }
  })
}
