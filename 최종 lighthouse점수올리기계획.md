# 최종 Lighthouse 점수 개선 계획 (SEO, 접근성, 성능 통합)

**목표**: Lighthouse 85~90점 이상 달성 및 웹 표준 준수
**기준 문서**: `lighthouse점수 올리기.md`, `SEOchangeLogic.md`

---

이 문서는 기존의 SEO, 접근성, 성능 분석 자료를 통합하여, 중복 제거 및 우선순위 정리를 통해 하나의 실행 가능한 최종 계획을 제공합니다.

## 목차
1. [전역 설정 (가장 먼저 실행)](#1-전역-설정)
2. [페이지별 수정 계획](#2-페이지별-수정-계획)
3. [우선순위별 실행 계획 요약](#3-우선순위별-실행-계획-요약)

---

## 1. 전역 설정 (가장 먼저 실행)

> 💡 프로젝트 전반에 영향을 미치는 설정들입니다. 가장 먼저 적용해야 효과가 큽니다.

### 1.1 `netlify.toml`
- **목표**: 캐시 효율성 증대 및 보안 강화
- **실행**: 아래 내용을 `netlify.toml`에 추가합니다.

```toml
# 캐시 제어 (이미지, 폰트 등 정적 자원은 길게, HTML은 매번 확인)
[[headers]]
  for = "/src/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

# 보안 헤더 (XSS, 클릭재킹 등 방어)
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Cross-Origin-Opener-Policy = "same-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Content-Security-Policy = "default-src 'self'; script-src 'self' https://t1.daumcdn.net; style-src 'self' 'unsafe-inline' https://spoqa.github.io; img-src 'self' data: https:; font-src 'self' https://spoqa.github.io; connect-src 'self' https://api.wenivops.co.kr"
```

### 1.2 `vite.config.js`
- **목표**: 프로덕션 빌드 시 불필요한 console, debugger 구문 제거하여 JavaScript 용량 축소
- **실행**: `build.terserOptions` 설정을 추가합니다.

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // (선택적) 코드 스플리팅
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})
```

### 1.3 `src/assets/styles/recommendReset.css`
- **목표**: 폰트 로딩 최적화 및 보안 요청 수정, 전역 포커스 스타일 추가
- **실행**:
    1. 폰트 `@import` URL을 `http:`가 아닌 `https:`로 명시합니다.
    2. 모든 인터랙티브 요소에 `focus-visible` 스타일을 추가하여 접근성을 개선합니다.

```css
/* src/assets/styles/recommendReset.css */

/* 수정 전 */
@import url(//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css);

/* 수정 후 */
@import url(https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css);

/* 파일 하단에 추가 (전역 포커스 스타일) */
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
    outline: 3px solid var(--button-color, #21BF48);
    outline-offset: 2px;
}
```

### 1.4 전역 CSS 규칙 수정
- **목표**: CSS 코딩 규칙 준수 및 렌더링 일관성 확보
- **실행**:
    - [ ] **`line-height` 단위 제거**: `px` 단위를 사용한 파일(`etc.css`, `check.css`, `button.css`, `productDetail/style.css`)을 찾아 단위 없는 숫자로 변경합니다. (예: `line-height: 22px` -> `line-height: 1.4`)
    - [ ] **`font-size` `rem` 단위 사용**: `px`로 된 `font-size`를 `rem`으로 변경합니다. (예: `login/style.css`의 `font-size: 22px` -> `font-size: 2.2rem`)

---

## 2. 페이지별 수정 계획

### 2.1 메인 페이지 (`index.html`)
- **목표**: SEO, 접근성, LCP(최대 콘텐츠풀 페인트) 성능 동시 개선
- **실행**:
    - [ ] `<html lang="en">` -> `<html lang="ko-KR">`로 변경
    - [ ] `<head>` 내부에 `<title>`, `meta description`, `og:*` 태그 추가/수정
    - [ ] `<head>` 내부에 폰트 최적화를 위한 `<link rel="preconnect" ...>` 추가
    - [ ] `<body>` 바로 다음에 스크린리더용 `<h1>` 태그 추가 (예: `<h1 class="sr-only">호두마켓</h1>`)
    - [ ] 슬라이드 배너 `<img>` 태그에 `width`, `height`, `loading="lazy"` 속성 추가하여 CLS(누적 레이아웃 이동) 방지 및 성능 개선

### 2.2 상품 목록 (`src/component/product/item.js`)
- **목표**: CLS 방지 및 이미지 접근성 개선
- **실행**:
    - [ ] 상품 `<img>` 태그에 `width`와 `height` 속성을 추가합니다.
    - [ ] 상품 `<img>` 태그의 `alt` 속성을 빈 값이 아닌, 상품명으로 채웁니다. (예: `alt="${product.name} 상품 이미지"`)

### 2.3 상품 상세 (`src/pages/productDetail/index.html`, `main.js`)
- **목표**: CLS 방지 및 동적 이미지 접근성 확보
- **실행**:
    - [ ] `main.js`에서 동적으로 로드되는 메인 `<img>` 태그에 `width`와 `height` 속성을 설정합니다.
    - [ ] `main.js`에서 `<img>`의 `alt` 속성을 동적으로 상품명과 함께 설정합니다. (예: `mainImage.alt = `${productName} 상품 이미지`;`)

### 2.4 회원가입 (`src/pages/regist/index.html`)
- **목표**: 접근성 및 시맨틱 구조 개선
- **실행**:
    - [ ] 페이지 제목을 나타내는 `<h1>회원가입</h1>` 태그 추가
    - [ ] 전화번호 입력 필드를 `<fieldset>`과 `<legend>`로 그룹화하고, 각 `<input>`에 `sr-only` 스타일의 `<label>`을 `for-id`로 연결합니다.

### 2.5 로그인 (`src/pages/login/index.html`)
- **목표**: SEO 및 시맨틱 구조 개선
- **실행**:
    - [ ] `<head>`에 `meta description`, `og:*` 태그 추가
    - [ ] `<div>`로만 구성된 레이아웃을 `<main>`, `<section>` 등 시맨틱 태그를 사용하여 구조화합니다.

### 2.6 결제 (`src/pages/Payment/index.html`)
- **목표**: 폼 접근성 개선
- **실행**:
    - [ ] 회원가입 페이지와 마찬가지로, 전화번호 입력 `<input>` 그룹을 `<fieldset>`과 `<legend>`로 묶고, 각 `<input>`에 `sr-only` `<label>`을 연결합니다.

### 2.7 공용 모달 (`src/component/modal/check.js`)
- **목표**: 웹 접근성 표준 준수
- **실행**:
    - [ ] 모달 컨테이너에 `role="dialog"`, `aria-modal="true"`, `aria-labelledby="모달제목ID"`를 추가합니다.
    - [ ] 모달이 열렸을 때 키보드 포커스가 모달 내에서만 움직이도록 '포커스 트랩'을 구현합니다.
    - [ ] 모달이 닫히면 이전 포커스 위치로 복귀시킵니다.

---

## 3. 우선순위별 실행 계획 요약

### 🔴 1순위 (즉시 실행 / 필수)
1.  **전역 설정 적용**: `netlify.toml`, `vite.config.js`, `recommendReset.css` 수정
2.  **`index.html`**: `lang` 변경, 핵심 `meta` 태그 추가, 보이지 않는 `<h1>` 추가
3.  **폼 접근성**: `regist/index.html` 및 `Payment/index.html`의 전화번호 필드 `label` 연결
4.  **CSS 규칙**: `line-height` 단위 제거 및 `font-size` `rem` 단위 사용

### 🟡 2순위 (성능 및 접근성 개선)
1.  **이미지 최적화**: 모든 `<img>` 태그(`index.html`, `product/item.js`, `productDetail/main.js` 등)에 `width`, `height` 속성 추가 및 의미 있는 `alt` 텍스트 제공
2.  **모달 접근성**: `modal/check.js`에 `role`, `aria-*` 속성 추가 및 포커스 트랩 초기 구현
3.  **시맨틱 HTML**: `login/index.html` 등 주요 페이지에 `<main>`, `<section>` 태그 적용
4.  **SEO 태그**: 전반적인 페이지(`mypage`, `SellerCenter` 등)에 `og:*` 태그 보강

### 🟢 3순위 (추가 개선 / 리팩토링)
1.  **CSS 리팩토링**: `!important` 사용 제거, `max-width` 미디어쿼리를 `min-width`(모바일 우선)로 점진적 전환
2.  **ARIA 고급 적용**: 드롭다운(`num-dropdown.js`), 탭(`tab.js`) 등에 `role`, `aria-expanded` 등 전체 ARIA 속성 적용
3.  **이미지 포맷 변경**: 주요 이미지(PNG)를 WebP/AVIF 포맷으로 변환하여 용량 최적화 (수동 작업 필요)
