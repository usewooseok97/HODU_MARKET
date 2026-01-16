import './style.css'

// ==========================================
// 메인 슬라이드 및 상품 로드 JavaScript
// ==========================================

import { getproduct } from '/src/js/product/getproduct.js'
import '/src/component/product/item.js'

// DOMContentLoaded 이벤트: HTML이 모두 로드되면 실행
document.addEventListener('DOMContentLoaded', async function () {
  // 로그인 모달 이벤트 리스너
  const loginModal = document.querySelector('#loginModal')
  loginModal?.addEventListener('modal-confirm', () => {
    location.href = '/src/pages/login/index.html'
  })

  // 장바구니 추가 성공 모달 이벤트 리스너
  const addToCartSuccessModal = document.querySelector('#addToCartSuccessModal')
  addToCartSuccessModal?.addEventListener('modal-confirm', () => {
    location.href = '/src/pages/shoppingCartPage/index.html'
  })
  // ===== API에서 상품 데이터 가져오기 =====
  let products = []
  let hasApiData = false

  try {
    const data = await getproduct()
    products = data.results || data

    if (products && products.length > 0) {
      hasApiData = true
      console.log('상품 데이터 로드 완료:', products.length, '개')

      // 슬라이드를 API 데이터로 업데이트
      updateSliderWithProducts(products)

      // 상품 목록 렌더링
      const productItems = document.querySelector('product-items')
      if (productItems) {
        productItems.setProducts(products)
      }
    } else {
      console.log('상품 데이터가 없습니다. 기본 슬라이더를 사용합니다.')
    }
  } catch (error) {
    console.error('상품 로드 실패:', error)
  }

  // API 데이터가 없으면 기존 정적 슬라이더 사용
  if (!hasApiData) {
    setupSlider()
  }
})

/**
 * 가격 포맷팅 함수 (천 단위 콤마)
 */
function formatPrice(price) {
  return price.toLocaleString('ko-KR')
}

/**
 * API 상품 데이터로 슬라이더 업데이트
 * @param {Array} products - 상품 데이터 배열
 */
function updateSliderWithProducts(products) {
  const sliderWrapper = document.querySelector('.slider-wrapper')
  const sliderIndicators = document.querySelector('.slider-indicators')

  if (!sliderWrapper || !sliderIndicators) {
    console.error('슬라이더 요소를 찾을 수 없습니다.')
    return
  }

  // 기존 슬라이드 및 인디케이터 제거
  sliderWrapper.innerHTML = ''
  sliderIndicators.innerHTML = ''

  // 슬라이드로 표시할 상품 (최대 5개)
  const slideProducts = products.slice(0, 5)

  // 슬라이드 생성
  slideProducts.forEach((product, index) => {
    const slide = document.createElement('div')
    slide.className = index === 0 ? 'slide active' : 'slide'
    slide.style.cursor = 'pointer'
    slide.dataset.productId = product.id

    // API에서 받은 데이터를 변수에 저장
    const productName = product.name
    const productPrice = product.price

    slide.innerHTML = `
      <div class="slide-info">
        <h3 class="slide-product-name">${productName}</h3>
        <p class="slide-price">${formatPrice(productPrice)}원</p>
      </div>
      <div class="slide-image-wrapper">
        <img src="${product.image}" alt="${productName}" />
      </div>
      <div class="slide-info">
      </div>
    `

    // 슬라이드 클릭 시 상세 페이지로 이동
    slide.addEventListener('click', () => {
      window.location.href = `/src/pages/productDetail/index.html?product_id=${product.id}`
    })

    sliderWrapper.appendChild(slide)
  })

  // 인디케이터 생성
  slideProducts.forEach((_, index) => {
    const indicator = document.createElement('button')
    indicator.className = index === 0 ? 'indicator active' : 'indicator'
    indicator.dataset.slide = index
    indicator.setAttribute('aria-label', `${index + 1}번 슬라이드로 이동`)

    sliderIndicators.appendChild(indicator)
  })

  // 슬라이드 기능 초기화
  setupSlider()
}

/**
 * 슬라이드 기능 설정
 */
function setupSlider() {
  // ===== 필요한 요소들 선택 =====

  // 모든 슬라이드 요소들을 선택 (NodeList 배열 형태로 반환)
  const slides = document.querySelectorAll('.slide')

  // 모든 인디케이터(점) 요소들을 선택
  const indicators = document.querySelectorAll('.indicator')

  // 이전 버튼 선택
  const prevBtn = document.querySelector('.prev-btn')

  // 다음 버튼 선택
  const nextBtn = document.querySelector('.next-btn')

  if (slides.length === 0) {
    console.log('슬라이드가 없습니다.')
    return
  }

  // ===== 변수 선언 =====

  // 현재 보이는 슬라이드의 인덱스 (0부터 시작: 0, 1, 2)
  let currentIndex = 0

  // 전체 슬라이드 개수
  const totalSlides = slides.length

  // 자동 슬라이드 전환을 위한 타이머 저장 변수
  let autoSlideTimer

  // ===== 함수 정의 =====

  /**
   * 특정 인덱스의 슬라이드를 보여주는 함수
   * @param {number} index - 보여줄 슬라이드의 인덱스
   */
  function showSlide(index) {
    // 모든 슬라이드를 순회하면서
    slides.forEach(function (slide, i) {
      // 현재 인덱스와 일치하는 슬라이드에만 active 클래스 추가
      if (i === index) {
        slide.classList.add('active') // active 클래스 추가 (보이게 함)
      } else {
        slide.classList.remove('active') // active 클래스 제거 (숨김)
      }
    })

    // 모든 인디케이터를 순회하면서
    indicators.forEach(function (indicator, i) {
      // 현재 인덱스와 일치하는 인디케이터에만 active 클래스 추가
      if (i === index) {
        indicator.classList.add('active') // active 클래스 추가 (활성 상태)
      } else {
        indicator.classList.remove('active') // active 클래스 제거 (비활성 상태)
      }
    })
  }

  /**
   * 다음 슬라이드로 이동하는 함수
   */
  function nextSlide() {
    // 현재 인덱스를 1 증가시킴
    currentIndex++

    // 마지막 슬라이드를 넘어가면 첫 번째 슬라이드로 돌아감 (순환)
    if (currentIndex >= totalSlides) {
      currentIndex = 0 // 인덱스를 0으로 초기화
    }

    // 계산된 인덱스의 슬라이드를 보여줌
    showSlide(currentIndex)
  }

  /**
   * 이전 슬라이드로 이동하는 함수
   */
  function prevSlide() {
    // 현재 인덱스를 1 감소시킴
    currentIndex--

    // 첫 번째 슬라이드보다 앞으로 가면 마지막 슬라이드로 이동 (순환)
    if (currentIndex < 0) {
      currentIndex = totalSlides - 1 // 마지막 슬라이드 인덱스로 설정
    }

    // 계산된 인덱스의 슬라이드를 보여줌
    showSlide(currentIndex)
  }

  /**
   * 자동 슬라이드 전환을 시작하는 함수
   */
  function startAutoSlide() {
    // setInterval: 일정 시간마다 함수를 반복 실행
    // 3000ms = 3초마다 nextSlide 함수 실행
    autoSlideTimer = setInterval(nextSlide, 3000)
  }

  /**
   * 자동 슬라이드 전환을 중지하는 함수
   */
  function stopAutoSlide() {
    // clearInterval: setInterval로 설정한 타이머를 중지
    clearInterval(autoSlideTimer)
  }

  /**
   * 자동 슬라이드를 재시작하는 함수
   * (사용자가 수동으로 슬라이드를 변경한 후 다시 자동 전환 시작)
   */
  function resetAutoSlide() {
    stopAutoSlide() // 기존 타이머 중지
    startAutoSlide() // 새로운 타이머 시작
  }

  // ===== 이벤트 리스너 등록 =====

  // 이전 버튼 클릭 이벤트
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      prevSlide() // 이전 슬라이드로 이동
      resetAutoSlide() // 자동 슬라이드 재시작
    })
  }

  // 다음 버튼 클릭 이벤트
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      nextSlide() // 다음 슬라이드로 이동
      resetAutoSlide() // 자동 슬라이드 재시작
    })
  }

  // 각 인디케이터(점)에 클릭 이벤트 등록
  indicators.forEach(function (indicator, index) {
    indicator.addEventListener('click', function () {
      currentIndex = index // 클릭한 인디케이터의 인덱스로 변경
      showSlide(currentIndex) // 해당 슬라이드 보여주기
      resetAutoSlide() // 자동 슬라이드 재시작
    })
  })

  // 키보드 화살표 키로도 슬라이드 조작 가능하게 (선택적 기능)
  document.addEventListener('keydown', function (e) {
    // 왼쪽 화살표 키를 누르면
    if (e.key === 'ArrowLeft') {
      prevSlide() // 이전 슬라이드로 이동
      resetAutoSlide() // 자동 슬라이드 재시작
    }
    // 오른쪽 화살표 키를 누르면
    else if (e.key === 'ArrowRight') {
      nextSlide() // 다음 슬라이드로 이동
      resetAutoSlide() // 자동 슬라이드 재시작
    }
  })

  // 마우스가 슬라이드 영역에 들어오면 자동 전환 중지
  const sliderContainer = document.querySelector('.slider-container')

  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', function () {
      stopAutoSlide() // 자동 슬라이드 중지
    })

    // 마우스가 슬라이드 영역에서 나가면 자동 전환 재시작
    sliderContainer.addEventListener('mouseleave', function () {
      startAutoSlide() // 자동 슬라이드 시작
    })
  }

  // ===== 초기 실행 =====

  // 첫 번째 슬라이드를 보여줌 (인덱스 0)
  showSlide(currentIndex)

  // 자동 슬라이드 전환 시작
  startAutoSlide()
}
