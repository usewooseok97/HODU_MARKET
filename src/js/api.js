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

/**
 * FormData POST 요청을 보내는 유틸리티 함수 (파일 업로드용)
 * @param {string} endpoint - API 엔드포인트 경로
 * @param {FormData} formData - 전송할 FormData
 * @param {string} token - 인증 토큰
 * @returns {Promise<object>} - 응답 데이터
 */
export const postFormDataRequest = async (endpoint, formData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('FormData POST 요청 실패:', error)
    throw error
  }
}

/**
 * 인증이 필요한 GET 요청
 * @param {string} endpoint - API 엔드포인트 경로
 * @param {string} token - 인증 토큰
 * @returns {Promise<object>} - 응답 데이터
 */
export const getAuthRequest = async (endpoint, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('인증 GET 요청 실패:', error)
    throw error
  }
}

/**
 * 인증이 필요한 POST 요청
 * @param {string} endpoint - API 엔드포인트 경로
 * @param {object} data - 전송할 데이터
 * @param {string} token - 인증 토큰
 * @returns {Promise<object>} - 응답 데이터
 */
export const postAuthRequest = async (endpoint, data, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('인증 POST 요청 실패:', error)
    throw error
  }
}

/**
 * 인증이 필요한 PUT 요청
 * @param {string} endpoint - API 엔드포인트 경로
 * @param {object} data - 전송할 데이터
 * @param {string} token - 인증 토큰
 * @returns {Promise<object>} - 응답 데이터
 */
export const putAuthRequest = async (endpoint, data, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('인증 PUT 요청 실패:', error)
    throw error
  }
}

/**
 * 인증이 필요한 DELETE 요청
 * @param {string} endpoint - API 엔드포인트 경로
 * @param {string} token - 인증 토큰
 * @returns {Promise<object>} - 응답 데이터
 */
export const deleteAuthRequest = async (endpoint, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    // DELETE는 204 No Content 또는 빈 응답일 수 있음
    if (response.status === 204 || response.status === 200) {
      // 응답 본문이 있는지 확인
      const text = await response.text()
      if (!text) {
        return { success: true }
      }
      try {
        return JSON.parse(text)
      } catch {
        return { success: true }
      }
    }

    return await handleResponse(response)
  } catch (error) {
    console.error('인증 DELETE 요청 실패:', error)
    throw error
  }
}
