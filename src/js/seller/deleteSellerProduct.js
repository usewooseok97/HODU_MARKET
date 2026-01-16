import { deleteAuthRequest } from '../api'
import { getAccessToken } from '../auth/token.js'

/**
 * 판매자 상품 삭제
 * @param {number|string} productId - 상품 ID
 * @returns {Promise<object>}
 */
export const deleteSellerProduct = async (productId) => {
  try {
    const token = getAccessToken()
    if (!token) {
      throw new Error('로그인이 필요합니다.')
    }

    return await deleteAuthRequest(`products/${productId}/`, token)
  } catch (error) {
    console.error('상품 삭제 실패:', error)
    throw error
  }
}
