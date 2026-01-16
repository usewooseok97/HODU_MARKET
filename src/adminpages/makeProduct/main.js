// 웹 컴포넌트는 vite-plugin-auto-components에서 자동으로 import됩니다

import { postProduct } from '@/js/seller/postSetProduct'
import { requireAuth } from '@/js/auth/routeGuard.js'

// 로그인 확인 (Route Guard)
if (!requireAuth({ message: '결제 페이지는 로그인이 필요합니다.' })) {
  throw new Error('Unauthorized')
}
/**
 * 검증/에러 메시지 표시
 * @param {string} message - 표시할 메시지
 * @param {boolean} isError - 에러 여부 (true: 에러, false: 성공)
 */
const showProductValidation = (message, isError = true) => {
  const validationElement = document.querySelector('.validation-message')

  if (validationElement) {
    validationElement.textContent = message
    validationElement.style.display = 'block'
    validationElement.style.color = isError ? 'red' : 'green'
  } else {
    if (isError) {
      console.error(message)
    } else {
      console.log(message)
    }
  }
}

/**
 * 배송방법 버튼 초기화
 */
const initShippingMethodButtons = () => {
  const deliveryButtons = document.querySelectorAll(
    '.delivery-buttons button-ms16p'
  )
  const hiddenInput = document.querySelector('input[name="shipping_method"]')

  deliveryButtons.forEach((btn) => {
    btn.addEventListener('button-click', (e) => {
      const value = e.detail.value
      if (hiddenInput && value) {
        hiddenInput.value = value
      }

      // 버튼 스타일 토글
      deliveryButtons.forEach((b) => {
        if (b === btn) {
          b.setAttribute('variant', 'default')
        } else {
          b.setAttribute('variant', 'white')
        }
      })
    })
  })
}

/**
 * 폼 submit 핸들러 초기화
 */
const initFormSubmit = () => {
  const formElement = document.querySelector('.product-form')

  if (!formElement) {
    console.error('Form element not found')
    return
  }

  formElement.addEventListener('submit', async (e) => {
    e.preventDefault()

    try {
      // eslint-disable-next-line no-undef
      const formData = new FormData(formElement)

      // FormData 디버깅 출력
      console.log('=== FormData 내용 ===')
      for (const [key, value] of formData.entries()) {
        // eslint-disable-next-line no-undef
        if (value instanceof File) {
          console.log(`${key}: [File] ${value.name} (${value.size} bytes)`)
        } else {
          console.log(`${key}: ${value}`)
        }
      }
      console.log('====================')

      // 필수 필드 검증
      const requiredFields = [
        'name',
        'image',
        'price',
        'shipping_method',
        'shipping_fee',
        'stock',
      ]

      for (const field of requiredFields) {
        const value = formData.get(field)
        if (!value || (field === 'image' && value.size === 0)) {
          showProductValidation(`${field} 필드는 필수 항목입니다.`, true)
          return
        }
      }

      // 숫자 필드 검증
      const numericFields = ['price', 'shipping_fee', 'stock']
      for (const field of numericFields) {
        const value = formData.get(field)
        if (isNaN(parseInt(value, 10))) {
          showProductValidation(
            `${field}에 유효한 정수(integer)를 넣어주세요.`,
            true
          )
          return
        }
      }

      const result = await postProduct(formData)

      showProductValidation('상품이 등록되었습니다!', false)
      console.log('상품 등록 성공:', result)

      // 상품 상세 페이지로 이동
      setTimeout(() => {
        window.location.href = `/src/pages/productDetail/?id=${result.id}`
      }, 1000)
    } catch (error) {
      let errorMessage = '상품 등록에 실패했습니다.'

      if (error.data) {
        if (error.data.detail) {
          errorMessage = error.data.detail
        } else if (typeof error.data === 'object') {
          const errors = Object.values(error.data).flat()
          errorMessage = errors.join(', ')
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      showProductValidation(errorMessage, true)
    }
  })
}

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
  initShippingMethodButtons()
  initFormSubmit()
})
