import { API_BASE_URL } from '../api'
import { getAccessToken } from '../auth/token'

export const addToCart = async (productId, quantity) => {
  const token = getAccessToken()
  const response = await fetch(`${API_BASE_URL}cart/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId, quantity }),
  })
  return response.json()
}
