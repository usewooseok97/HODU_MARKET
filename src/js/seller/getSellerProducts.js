import { getAuthRequest } from '../api'
import { getAccessToken, getUsername } from '../auth/token.js'

/**
 * 판매자별 상품 목록을 가져오는 함수
 * @param {string} sellerName - 판매자의 name
 * @returns {Promise<object>} - 상품 데이터
 */
export const getSellerProducts = async () => {
  try {
    const sellerName = getUsername()
    if (!sellerName) {
      throw new Error('판매자 정보를 찾을 수 없습니다.')
    }

    const token = getAccessToken()
    if (!token) {
      throw new Error('로그인이 필요합니다.')
    }

    const data = await getAuthRequest('products/', token)
    const results = Array.isArray(data) ? data : data?.results ?? []
    const filtered = results.filter(
      (product) => product?.seller?.username === sellerName
    )
    const normalized = Array.isArray(data)
      ? filtered
      : { ...data, results: filtered, count: filtered.length }
    console.log(normalized)

    return normalized
  } catch (error) {
    console.error('판매자 상품 불러오기 실패:', error)
    throw error
  }
}
