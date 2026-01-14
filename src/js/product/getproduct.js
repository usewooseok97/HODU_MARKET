import { getRequest } from '../api'

export const getproduct = async () => {
  try {
    const data = await getRequest('products/')
    console.log(data)

    return data
  } catch (error) {
    console.error('로그인 실패:', error)
    throw error
  }
}
