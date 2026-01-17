# HODU_MARKET

## 목표

### 오픈마켓 서비스

오픈마켓 서비스는 **판매자**와 **구매자**를 구별하여 판매자가 상품을 등록, 판매하며 구매자는 구매하는 서비스입니다.

귀여운 호두를 필두로 호두 관련 상품뿐만 아니라 다양한 상품을 판매하는 사이트입니다.

---

> **배포 URL** : https://hodudu.netlify.app/

---
## 코드 품질 관리

이 프로젝트는 **Prettier**와 **ESLint**를 사용하여 코드 품질을 관리합니다.

### 자동 포맷팅

VSCode에서 파일을 저장하면 자동으로 Prettier가 실행됩니다.

> `.vscode/settings.json` 파일에 이미 설정되어 있습니다.
---

## 기술 스택

- **Vite** - 빌드 도구
- **Java Script** - 컴포넌트 시스템
- **HTML** - 코드 포맷터
- **CSS** - 코드 린터

---


## 기능

###  로그인 / 회원가입
- 판매자, 구매자 구분
- JWT 검증 방식

###  판매자 기능
- 본인 상품 조회
- 상품 등록
- 상품 삭제
- 상품 수정

###  구매자 기능
- 상품 조회
- 상품 구매내역 확인
- 장바구니 목록 조회
- 장바구니 물건 등록
- 장바구니 수량 수정하기
- 장바구니 물건 삭제하기
- 상품 주문하기

---

##   팀 구성

| | | | | |
|:---:|:---:|:---:|:---:|:---:|
| ![팀장](./readmeImg/wooseok-icon.png) | ![팀원2](./readmeImg/juhyeon-icon.png) | ![팀원3](./readmeImg/daesick-icon.png) | ![팀원4](./readmeImg/namhue-icon.png) | ![팀원5](./readmeImg/seojun-icon.png) |
| **강우석** | **강주현** | **권대식** | **김남희** | **김서준** |
| 팀장 | 팀원 | 팀원 | 팀원 | 팀원 |

---

## 개발환경 및 배포

### 개발 환경
- **Vite** - 빌드 도구

### 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **ESLint** - 코드 린팅
- `.vscode/settings.json` 파일에 설정 완료


### Commit 메시지 규칙

| 타입    | 설명                           | 예시                      |
| ------- | ------------------------------ | ------------------------- |
| `feat`  | 새로운 기능 추가               | `feat: 로그인 기능 구현`  |
| `style` | 스타일 변경 (UI/CSS)           | `style: 버튼 색상 변경`   |
| `issue` | 문제 발생 보고                 | `issue: 로그인 오류 발생` |
| `fixed` | 버그 수정, 기능 삭제 및 최적화 | `fixed: 로그인 오류 수정` |
| `etc`   | 기타 변경사항                  | `etc: README 업데이트`    |

### 메인페이지 + Issue 기반 작업 플로우

> 페이지 배치 작업부터 이 플로우를 사용합니다.

#### 1. GitHub에서 Issue 생성

- **제목**: 해야 할 작업 작성 (기능 1~2개 정도 크기)
- **Description**: 제목으로 충분하므로 생략 가능

### 커스텀 플러그인
```javascript
autoComponentsPlugin({
  tagPrefix: '',           // 빈 문자열: prefix 없이 <folder-file> 형식
  componentDir: 'src/component',
  debug: true,
})
```
- `<folder-file>` 방식의 이름으로 컴포넌트 자동 불러오기

---
## 웹 컴포넌트 가이드!

이 프로젝트는 Web Components를 사용하여 재사용 가능한 UI 요소를 만듭니다.

### 자동 컴포넌트 등록 시스템

`vite-plugin-auto-components.js` 플러그인이 HTML 파일에서 커스텀 태그를 자동으로 감지하고 해당 컴포넌트를 임포트합니다.

#### 태그 형식 규칙

- **형식**: `<folder-file>` (kebab-case)
- **예시**:
  - `<hodu-footer>` → `src/component/hodu/footer.js`
  - `<imput-button>` → `src/component/imput/button.js`
  - `<user-profile-card>` → `src/component/user/profile-card.js`


## URL 구조

### 페이지 URL 목록

| 페이지 | URL |
|:---:|:---|
| 메인 | `/` |
| 로그인 | `/src/pages/login/` |
| 회원가입 | `/src/pages/regist/` |
| 마이페이지 | `/src/pages/mypage/` |
| 장바구니 | `/src/pages/shoppingCartPage/` |
| 결제 | `/src/pages/Payment/` |
| 상품 상세 | `/src/pages/productDetail/?product_id={ID}` |
| 404 | `/src/pages/page404/` |
| 판매자 센터 | `/src/adminpages/SellerCenter/` |
| 상품 등록/수정 | `/src/adminpages/makeProduct/` |

### 접근 권한

| 권한 | 페이지 |
|:---:|:---|
| 공개 | 메인, 로그인, 회원가입, 상품 상세, 404 |
| 로그인 필요 | 마이페이지, 장바구니, 결제 |
| SELLER 전용 | 판매자 센터, 상품 등록/수정 |

---

## 요구사항 명세 및 기능 명세

<!-- Diagram 사진 --> 
![요구사항 명세](workflow)

---

##  프로젝트 구조

HODU_MARKET/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── vite-plugin-auto-components.js
├── eslint.config.js
├── jsconfig.json
├── netlify.toml
│
├── public/
│   
└── src/
    ├── main.js
    ├── style.css
    │
    ├── adminpages/
    │   ├── SellerCenter/
    │   │   ├── index.html
    │   │   ├── main.js
    │   │   └── style.css
    │   └── makeProduct/
    │
    ├── assets/
    │   ├── images/
    │   │   
    │   └── styles/
    │       └── recommendReset.css
    │
    ├── component/
    │   ├── bottom/
    │   ├── button/
    │   │   ├── large.js
    │   │   ├── medium.js
    │   │   ├── small.js
    │   │   ├── tab.js
    │   │   ├── tebmenu.js
    │   │   ├── ms16p.js
    │   │   ├── msicon.js
    │   │   └── button.css
    │   ├── etc/
    │   ├── header/
    │   ├── input/
    │   ├── logo/
    │   ├── modal/
    │   ├── payment/
    │   ├── product/
    │   ├── sellercart/
    │   └── shoppingcart/
    ├── js/
    │   ├── api.js
    │   ├── auth/
    │   ├── cart/
    │   │   ├── addToCart.js
    │   │   └── getCart.js
    │   ├── product/
    │   └── seller/
    │
    └── pages/
        ├── Payment/
        │   ├── index.html
        │   ├── main.js
        │   └── style.css
        ├── login/
        ├── mypage/
        ├── page404/
        ├── productDetail/
        ├── regist/
        └── shoppingCartPage/


## 개발 일정

<!--개발일정 사진 삽입 -->
![개발 일정](./readmeImg/date.png)

---

## 역할 분담

| 이름 | 역할 |
|:---:|:---|
| **강우석** | 팀장, |
| **강주현** | 팀원 |
| **권대식** | 팀원 |
| **김남희** | 팀원 |
| **김서준** | 팀원 |

---

##  와이어프레임

<!-- 피그마전체이미지 캡쳐 삽입 -->
![와이어프레임](./readmeImg/와이어프레임.png)

---

## 화면 설계

<!-- 실제 화면 캡쳐 삽입 -->
| | |
|:---:|:---:|
| ![화면1](./readmeImg/구매페이지.png) | ![화면2](./readmeImg/장바구니.png) |
| ![화면3](./readmeImg/판매자센터페이지.png) | ![화면4](./readmeImg/회원가입페이지.png) |

---

## Architecture

<!--workflow 사진 삽입 -->
![Architecture](./readmeImg/workflow.png)

---

## 메인 기능

<!--main archtecture 사진 삽입 -->
![메인기능](./readmeImg/메인페이지.png)

---

## 에러와 에러 해결

### 강우석
| 항목 | 내용 |
|:---:|:---|
| **언제** | |
| **어디서** | |
| **누가** | |
| **무엇을** | |
| **어떻게** | |
| **왜** | |

### 강주현
| 항목 | 내용 |
|:---:|:---|
| **언제** | |
| **어디서** | |
| **누가** | |
| **무엇을** | |
| **어떻게** | |
| **왜** | |

### 권대식
| 항목 | 내용 |
|:---:|:---|
| **언제** | |
| **어디서** | |
| **누가** | |
| **무엇을** | |
| **어떻게** | |
| **왜** | |

### 김남희
| 항목 | 내용 |
|:---:|:---|
| **언제** | |
| **어디서** | |
| **누가** | |
| **무엇을** | |
| **어떻게** | |
| **왜** | |

### 김서준
| 항목 | 내용 |
|:---:|:---|
| **언제** | |
| **어디서** | |
| **누가** | |
| **무엇을** | |
| **어떻게** | |
| **왜** | |

---

## 개발하면서 느낀점

### 강우석
> 

### 강주현
> 

### 권대식
> 

### 김남희
> 

### 김서준
> 

---

## 추후 개발 사항

- [ ] 판매자 계정의 마이페이지 변경
- [ ] 비밀번호 찾기 페이지 제작
- [ ] 검색 기능

---
