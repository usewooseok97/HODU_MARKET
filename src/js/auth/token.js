import { postRequest } from '../api.js'

// localStorage 키 상수
const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_TYPE_KEY = 'user_type'

export const saveToken = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const saveUserType = (userType) => {
  if (userType === 'BUYER' || userType === 'SELLER') {
    localStorage.setItem(USER_TYPE_KEY, userType)
  }
}

export const getUserType = () => {
  return localStorage.getItem(USER_TYPE_KEY)
}

export const removeUserType = () => {
  localStorage.removeItem(USER_TYPE_KEY)
}

export const removeTokens = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  removeUserType()
}

/**
 * Access Token 갱신
 */
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    throw new Error('Refresh token이 없습니다.')
  }

  try {
    const data = await postRequest('accounts/token/refresh/', {
      refresh: refreshToken,
    })

    if (data.access) {
      localStorage.setItem(TOKEN_KEY, data.access)
      return data.access
    }

    throw new Error('토큰 갱신에 실패했습니다.')
  } catch (error) {
    console.error('토큰 갱신 실패:', error)
    throw error
  }
}

export const isTokenExpired = (token) => {
  if (!token) return true

  try {
    // eslint-disable-next-line no-undef
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiry = payload.exp * 1000 // ms로 변환
    return Date.now() > expiry
  } catch {
    return true
  }
}
