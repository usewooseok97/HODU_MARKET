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
    throw new Error(data.detail || data.message || '장바구니 추가에 실패했습니다.')
  }

  console.log('장바구니 추가 성공:', data)
  return data
}
