import { putAuthRequest } from '../api'
import { getAccessToken } from '../auth/token.js'

/**
 * 판매자 상품 수정
 * @param {number|string} productId - 상품 ID
 * @param {object} updates - 변경할 필드
 * @returns {Promise<object>}
 */
export const updateSellerProduct = async (productId, updates = {}) => {
  try {
    const token = getAccessToken()
    if (!token) {
      throw new Error('로그인이 필요합니다.')
    }

    const payload = { ...updates }
    return await putAuthRequest(`products/${productId}/`, payload, token)
  } catch (error) {
    console.error('상품 수정 실패:', error)
    throw error
  }
}
