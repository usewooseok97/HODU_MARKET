// API 기본 URL 상수
export const API_BASE_URL = 'https://api.wenivops.co.kr/services/open-market/'

/**
 * HTTP 응답 에러 처리 함수
 * @param {Response} response - fetch 응답 객체
 * @returns {Promise<object>} - 응답 데이터 또는 에러
 */
const handleResponse = async (response) => {
  const data = await response.json()

  // 성공 응답 (200-299)
  if (response.ok) {
    return data
  }

  // 400번대 에러 (클라이언트 에러)
  if (response.status >= 400 && response.status < 500) {
    const errorMessage = data.error || data.message || '클라이언트 요청 오류'
    const error = new Error(errorMessage)
    error.status = response.status
    error.data = data
    throw error
  }

  // 500번대 에러 (서버 에러)
  if (response.status >= 500) {
    const error = new Error(
      '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    )
    error.status = response.status
    error.data = data
    throw error
  }

  // 기타 에러
  const error = new Error('알 수 없는 오류가 발생했습니다.')
  error.status = response.status
  error.data = data
  throw error
}

/**
 * GET 요청을 보내는 유틸리티 함수
 * @param {string} endpoint - API 엔드포인트 경로
 * @returns {Promise<object>} - 응답 데이터
 */
export const getRequest = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('GET 요청 실패:', error)
    throw error
  }
}

/**
 * POST 요청을 보내는 유틸리티 함수
 * @param {string} endpoint - API 엔드포인트 경로
 * @param {object} data - 전송할 데이터
 * @returns {Promise<object>} - 응답 데이터
 */
export const postRequest = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('POST 요청 실패:', error)
    throw error
  }
}
