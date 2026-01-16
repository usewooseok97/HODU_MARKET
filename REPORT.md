# 프로젝트 코드 분석 및 최적화 보고서

본 보고서는 `C:\HODU_MARKET` 프로젝트의 코드 품질, 구조, 보안 및 비즈니스 로직을 분석하고 개선 방안을 제안합니다.

## 1. 로그인 및 보안 메커니즘 분석

### 현재 구현 (Current Implementation)
*   **인증 방식:** JWT (JSON Web Token) 기반 인증.
*   **토큰 관리:** `localStorage`에 Access Token과 Refresh Token 저장 (`src/js/auth/token.js`).
*   **인증 흐름:**
    1.  로그인 API (`accounts/login/`) 호출.
    2.  발급받은 토큰을 로컬 스토리지에 저장.
    3.  `api.js`의 `getAuthRequest`, `postAuthRequest` 등에서 `Authorization: Bearer <token>` 헤더를 포함하여 요청.
*   **사용자 식별:** 토큰의 Payload를 `atob`로 디코딩하여 `user_id`, `username` 추출.

### 보안 및 개선점
*   **토큰 저장소:** `localStorage`는 XSS(Cross-Site Scripting) 공격에 취약할 수 있습니다. 보안 강화를 위해 **HttpOnly Cookie** 사용을 고려하거나, XSS 방지 대책(Content Security Policy 등)이 필요합니다.
*   **토큰 디코딩:** `atob`를 사용하여 토큰을 파싱하고 있습니다. 이는 표준적인 방법이지만, 비정상적인 문자열에 대한 예외 처리가 필요하며, 서명 검증 없이 Payload만 신뢰하므로 민감한 로직은 반드시 서버 사이드에서 검증되어야 합니다.

## 2. 비즈니스 로직 및 흐름 파악

### 상품 (Product)
*   **데이터 흐름:** `src/js/product/getproduct.js` 등을 통해 API에서 데이터를 가져와 `src/pages/`의 `main.js`에서 DOM을 업데이트합니다.
*   **이슈:**
    *   에러 처리가 `console.error` 후 재거부(throw)하는 단순한 패턴입니다. 사용자에게 보여줄 에러 UI 처리가 분산되어 있습니다.

### 장바구니 (Cart)
*   **로직:** `addToCart.js`에서 상품 추가 시 API 응답의 에러 메시지 텍스트(`errorMessage.includes('이미')`)를 분석하여 중복/재고 오류를 판단합니다.
*   **이슈:**
    *   **취약한 에러 핸들링:** 서버의 에러 메시지 텍스트가 변경되면 클라이언트 로직이 깨집니다. 서버에서 명확한 **Error Code**를 반환받아 처리하도록 개선해야 합니다.

### 판매자 (Seller)
*   **로직:** `src/js/seller/getSellerProducts.js`에서 **모든 상품을 호출한 후(`products/`) 클라이언트(브라우저)에서 판매자 이름으로 필터링**하고 있습니다.
*   **성능 문제 (Critical):** 상품 수가 늘어날수록 성능이 급격히 저하됩니다. API 레벨에서 `products/?seller_id=...`와 같이 필터링된 데이터를 요청하도록 변경이 **시급**합니다.

## 3. 구조 및 코드 중복 분석

### 주요 문제점
1.  **파일 파편화 (File Explosion):** `getproduct.js`, `createproduct.js`, `deleteproduct.js` 등 함수 단위로 파일이 지나치게 쪼개져 있어 관리가 어렵습니다 (`src/js/product/`).
2.  **중복 코드:**
    *   API 호출 래퍼(`api.js`)가 잘 구성되어 있으나, 각 서비스 로직에서 `try-catch`와 `console.error` 패턴이 반복됩니다.
    *   DOM 조작 코드가 여러 `main.js`에 산재되어 있습니다.

## 4. 최적화 및 리팩토링 제안

### 4.1. 공통 모듈화 (Common Utils)

중복되는 로직을 통합하여 유지보수성을 높입니다.

| 구분 | 변경 전 (Current) | 변경 후 (Proposed) |
| :--- | :--- | :--- |
| **API 서비스** | 함수별 개별 파일 (`getproduct.js`, `createproduct.js`...) | **도메인별 통합 서비스 파일** (`services/productService.js`, `services/authService.js`) |
| **에러 핸들링** | 각 함수에서 `console.error` 및 `alert` 개별 구현 | **Global Error Handler** 또는 `api.js` 내부 인터셉터에서 통합 처리 |
| **상수 관리** | 파일마다 하드코딩 또는 개별 선언 | `constants/config.js` 등으로 URL, 메시지, 유효성 검사 규칙 통합 관리 |

### 4.3. 성능 및 유지보수 우선순위

1.  **판매자 상품 조회 로직 개선 (최우선):** 클라이언트 필터링을 제거하고 백엔드 API 쿼리 파라미터 사용으로 변경.
2.  **서비스 파일 통합:** 흩어진 JS 파일들을 도메인별 Service 파일로 병합하여 import 경로 단순화 및 응집도 향상.
3.  **에러 핸들링 견고화:** 문자열 매칭 방식의 에러 처리를 상태 코드 기반으로 변경.

---
**결론:** 현재 프로젝트는 기능 구현은 되어 있으나, 데이터 규모가 커질 경우 성능 이슈(판매자 상품 조회)가 발생할 수 있으며, 파일 구조가 파편화되어 있어 유지보수 효율이 떨어집니다. 위 제안된 구조로 리팩토링을 진행하면 확장성과 안정성이 크게 향상될 것입니다.
