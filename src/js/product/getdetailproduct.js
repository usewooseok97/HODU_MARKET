import { getRequest } from '../api'

export const getDetailProduct = async (productId) => {
  const data = await getRequest(`products/${productId}/`)
  return data
}
