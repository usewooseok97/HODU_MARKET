/**
 * Route Guard 유틸리티
 * 페이지 접근 권한을 체크하고 적절한 리다이렉트를 수행합니다.
 */

import { getAccessToken, getUserType, isTokenExpired } from './token.js'

const ROUTES = {
  HOME: '/',
  LOGIN: '/src/pages/login/',
}

/**
 * 로그인 필수 체크 (BUYER/SELLER 모두 허용)
 * @param {Object} options - 옵션
 * @param {string} options.message - 알림 메시지
 * @returns {boolean} - 접근 허용 여부
 */
export const requireAuth = (options = {}) => {
  const { message = '로그인이 필요합니다.' } = options
  const token = getAccessToken()

  if (!token || isTokenExpired(token)) {
    alert(message)
    window.location.href = ROUTES.LOGIN
    return false
  }
  return true
}

/**
 * SELLER 전용 체크
 * 비로그인 시 로그인 페이지로, BUYER는 메인 페이지로 리다이렉트
 * @param {Object} options - 옵션
 * @param {string} options.notLoggedInMessage - 비로그인 알림 메시지
 * @param {string} options.notSellerMessage - 권한 없음 알림 메시지
 * @returns {boolean} - 접근 허용 여부
 */
export const requireSeller = (options = {}) => {
  const {
    notLoggedInMessage = '로그인이 필요합니다.',
    notSellerMessage = '판매자 전용 페이지입니다.',
  } = options

  const token = getAccessToken()

  // 1. 로그인 체크
  if (!token || isTokenExpired(token)) {
    alert(notLoggedInMessage)
    window.location.href = ROUTES.LOGIN
    return false
  }

  // 2. SELLER 권한 체크
  if (getUserType() !== 'SELLER') {
    alert(notSellerMessage)
    window.location.href = ROUTES.HOME
    return false
  }

  return true
}
