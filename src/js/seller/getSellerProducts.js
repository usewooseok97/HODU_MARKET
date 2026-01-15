import { getRequest } from '../api'

/**
 * 판매자별 상품 목록을 가져오는 함수
 * @param {string} sellerName - 판매자의 name
 * @returns {Promise<object>} - 상품 데이터
 */
export const getSellerProducts = async (sellerName) => {
  try {
    const data = await getRequest(`${sellerName}/products/`)
    console.log(data)

    return data
  } catch (error) {
    console.error('판매자 상품 불러오기 실패:', error)
    throw error
  }
}
