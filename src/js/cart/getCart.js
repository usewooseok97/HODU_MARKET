import { getAuthRequest } from '../api'
import { getAccessToken } from '../auth/token'

export const getCart = async () => {
  const token = getAccessToken()
  if (!token) return []

  const data = await getAuthRequest('cart/', token)
  return data.results || data || []
}
