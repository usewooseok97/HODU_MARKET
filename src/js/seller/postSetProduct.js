import { postFormDataRequest } from '../api.js'
import { getAccessToken } from '../auth/token.js'

/**
 * 상품 등록
 * @param {FormData} productData - 상품 데이터 (FormData)
 * @returns {Promise<object>}
 */
export const postProduct = async (productData) => {
  try {
    const token = getAccessToken()

    if (!token) {
      throw new Error('로그인이 필요합니다.')
    }

    const data = await postFormDataRequest('products/', productData, token)
    return data
  } catch (error) {
    console.error('상품 등록 실패:', error)
    throw error
  }
}
