import { API_BASE_URL } from '../api'
import { getAccessToken } from '../auth/token'

export const addToCart = async (productId, quantity) => {
  const token = getAccessToken()

  if (!token) {
    throw new Error('로그인이 필요합니다.')
  }

  const response = await fetch(`${API_BASE_URL}cart/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId, quantity }),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('장바구니 추가 API 에러:', data)
    const errorMessage = data.detail || data.message || '장바구니 추가에 실패했습니다.'
    const error = new Error(errorMessage)
    // 중복 상품 여부 판단
    error.isDuplicate = errorMessage.includes('이미')
    // 재고 초과 여부 판단
    error.isStockExceeded = errorMessage.includes('재고') || errorMessage.includes('수량')
    throw error
  }

  console.log('장바구니 추가 성공:', data)
  return data
}
