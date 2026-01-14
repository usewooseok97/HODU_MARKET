# CSS 작성 규칙 - AI 지시용 문서

## 문서 목적
이 문서는 AI가 웹사이트 제작 시 준수해야 할 CSS 작성 규칙을 정의합니다. 일관성 있고 유지보수하기 쉬운 코드를 작성하기 위한 필수 지침입니다.

**사용 방법**: 웹사이트 제작 요청 시 이 문서를 참조하여 모든 CSS 코드를 작성하세요.

---

## 목차
1. [Reset CSS 규칙](#1-reset-css-규칙)
2. [CSS 변수 사용 규칙](#2-css-변수-사용-규칙)
3. [타이포그래피 & 단위 규칙](#3-타이포그래피--단위-규칙)
4. [레이아웃 규칙](#4-레이아웃-규칙)
5. [반응형 디자인 규칙](#5-반응형-디자인-규칙)
6. [접근성 & 인터랙션 규칙](#6-접근성--인터랙션-규칙)
7. [코드 품질 규칙](#7-코드-품질-규칙)

---

## 1. Reset CSS 규칙

모든 프로젝트는 반드시 Reset CSS로 시작하세요. 브라우저 기본 스타일을 초기화하여 일관성을 확보합니다.

### 1.1 Universal Selector 리셋

✅ **반드시 작성하세요**:
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

### 1.2 HTML 기본 설정

✅ **html 요소 설정**:
```css
html {
    font-size: 10px; /* rem 계산 편의성: 1.6rem = 16px */
}
```

**이유**: html에 `font-size: 10px`을 설정하면 rem 단위 계산이 쉬워집니다.

### 1.3 Body 기본 설정

✅ **body 요소 필수 속성**:
- `font-family`에는 Roboto,
                 Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
                 여기 이전의 값은 원하는 폰트를 넣도록 빈공간으로 남겨놓을것
```css
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                 Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    line-height: 1.5; /* 단위 없는 숫자로 작성! */
    color: #333;
    font-size: 1.6rem; /* 16px */
}
```

❌ **금지**:
- `line-height`에 px, %, rem 단위 사용 금지
- body에 고정 width 설정 금지
- max-width 나 min-width로 처리
### 1.4 이미지 반응형 설정

✅ **img 요소 설정**:
```css
img {
    max-width: 100%;
    height: auto;
}
```

### 1.5 링크 기본 스타일

✅ **a 요소 설정**:
```css
a {
    text-decoration: none;
    color: inherit;
}
```

### 1.6 리스트 스타일 제거

✅ **ul, ol 요소 설정**:
```css
ul, ol {
    list-style: none;
}
```

### 1.7 버튼 기본 스타일

✅ **button 요소 설정**:
```css
button {
    cursor: pointer;
    border: none;
    background-color: inherit;
}
```

### 1.8 접근성 유틸리티 클래스

✅ **반드시 접근성 관련 부분은 reset.css로 제작해서 따로 만들고 @import()로 연결하기**:

**스크린 리더 전용 텍스트**:
```css
.sr-only {
    position: absolute;
    left: -9999px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
}
```

**한 줄 말줄임**:
```css
.ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
```

**여러 줄 말줄임**:
```css
.multi-ellipsis {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3; /* 원하는 줄 수로 조정 */
}
```

---

## 2. CSS 변수 사용 규칙

프로젝트 전반에서 일관성 있는 스타일을 유지하기 위해 CSS 변수를 사용하세요.

### 2.1 정의 위치

✅ **:root에 모든 전역 CSS 변수를 정의하세요**:
```css
:root {
    /* 색상 */
    --background-color: #ffffff;
    --text-color: #333333;
    --primary-color: #0066cc;
    --secondary-color: #6c757d;
    --accent-color: #d97652;

    /* 간격 */
    --spacing-xs: 0.4rem;
    --spacing-sm: 0.8rem;
    --spacing-md: 1.6rem;
    --spacing-lg: 2.4rem;
    --spacing-xl: 3.2rem;

    /* 폰트 */
    --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --font-secondary: "Georgia", serif;

    /* 그림자 */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
}
```

### 2.2 네이밍 규칙

✅ **의미 기반 네이밍을 사용하세요**:
- ✅ 좋은 예: `--primary-color`, `--text-color`, `--spacing-md`
- ❌ 나쁜 예: `--blue`, `--color1`, `--space16`

### 2.3 다크모드 지원

✅ **다크모드가 필요한 경우 data-theme 속성을 사용하세요**:
```css
[data-theme="dark"] {
    --background-color: #222222;
    --text-color: #f0f0f0;
    --primary-color: #4d9fff;
}
```

### 2.4 사용 방법

✅ **var() 함수로 변수를 사용하세요**:
```css
body {
    background-color: var(--background-color);
    color: var(--text-color);
}

.button {
    padding: var(--spacing-md);
    background-color: var(--primary-color);
}
```

---

## 3. 타이포그래피 & 단위 규칙

### 3.1 단위 사용 규칙

#### Font Size

✅ **rem 단위를 사용하세요**:
```css
/* ✅ 권장 */
h1 { font-size: 3.2rem; } /* 32px */
h2 { font-size: 2.4rem; } /* 24px */
p { font-size: 1.6rem; }  /* 16px */
small { font-size: 1.4rem; } /* 14px */
```

❌ **body 이하 요소에 px 단위 사용 금지**:
```css
/* ❌ 금지 */
p { font-size: 16px; }
```

#### Line Height ⭐ (핵심)

✅ **반드시 단위 없는 숫자를 사용하세요**:
```css
/* ✅ 권장 */
body {
    line-height: 1.5;
}

h1 {
    line-height: 1.2;
}

p {
    line-height: 1.6;
}
```

❌ **절대 사용하지 마세요**:
```css
/* ❌ 절대 금지 - px 단위 */
p {
    line-height: 40px; /* 하드코딩된 픽셀값 */
}

/* ❌ 절대 금지 - 퍼센트 */
p {
    line-height: 150%;
}

/* ❌ 절대 금지 - rem/em 단위 */
p {
    line-height: 1.5rem;
    line-height: 1.5em;
}
```

**이유**:
- 단위 없는 숫자는 현재 요소의 font-size에 비례하여 계산됩니다
- 자식 요소가 상속받을 때 더 유연하게 적용됩니다
- 반응형 디자인에서 예측 가능한 결과를 제공합니다

#### Letter Spacing

✅ **em 단위를 사용하세요**:
```css
h2 {
    letter-spacing: 0.05em;
}

.subtitle {
    letter-spacing: 0.1em;
}
```

#### Width & Height

✅ **상황에 따라 적절한 단위를 선택하세요**:
```css
/* 반응형 */
.container {
    width: 100%;
    max-width: 128rem; /* 1280px */
}

/* 뷰포트 기반 */
.hero {
    height: 100vh;
    width: 100vw;
}

/* 고정 크기 (최소한으로) */
.icon {
    width: 2.4rem;
    height: 2.4rem;
}
```

#### Spacing (Margin/Padding)

✅ **rem 단위를 우선 사용하세요**:
```css
.card {
    padding: 2rem;
    margin-bottom: 3rem;
}

.button {
    padding: 1.2rem 2.4rem;
}
```

#### px 단위 사용 가능한 경우

⚠️ **다음 경우에만 px 사용을 허용합니다**:
```css
/* ✅ border */
.box {
    border: 1px solid #ddd;
}

/* ✅ border-radius (작은 값) */
.button {
    border-radius: 4px;
}

.card {
    border-radius: 8px;
}

/* ✅ box-shadow */
.card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* ✅ 최상단(header) 고정 높이 */
.header {
    height: 60px; /* 고정 높이가 필요한 경우 */
}
```

### 3.2 타이포그래피 규칙

#### 웹폰트 로딩

✅ **@font-face 사용 시 font-display: swap을 포함하세요**:
```css
@font-face {
    font-family: 'CustomFont';
    src: url('font.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap; /* FOIT 방지 */
}
```

#### 폰트 스택

✅ **시스템 폰트를 폴백으로 제공하세요**:
```css
body {
    font-family: 'CustomFont', -apple-system, BlinkMacSystemFont,
                 "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
}
```

#### 폰트 굵기

✅ **font-weight는 숫자로 작성하세요**:
```css
.text-light { font-weight: 300; }
.text-normal { font-weight: 400; }
.text-medium { font-weight: 500; }
.text-bold { font-weight: 700; }
```

❌ **키워드 사용 지양**:
```css
/* ❌ 지양 */
.text-bold { font-weight: bold; }
```

---

## 4. 레이아웃 규칙

### 4.1 Flexbox (우선 권장)

✅ **대부분의 레이아웃에 Flexbox를 사용하세요**:

**이유**: Flexbox는 Grid보다 더 유연하고 간단합니다.

**기본 패턴**:
```css
.container {
    display: flex;
    justify-content: center; /* 주축 정렬 */
    align-items: center; /* 교차축 정렬 */
    gap: 2rem; /* 아이템 간 간격 */
}
```

**gap 속성 우선 사용**:
```css
/* ✅ 권장 - gap 사용 */
.flex-container {
    display: flex;
    gap: 1.6rem;
}

/* ❌ 비권장 - margin 사용 */
.flex-container .item {
    margin-right: 1.6rem;
}
.flex-container .item:last-child {
    margin-right: 0;
}
```

### 4.2 Grid (정형화된 구조에만 사용)

⚠️ **Grid는 명확한 행/열 구조가 있는 경우에만 사용하세요**:
- ✅ 적합한 경우: 갤러리, 카드 그리드, 대시보드 레이아웃
- ❌ 부적합한 경우: 단순 나열, 유동적인 레이아웃 → Flexbox 사용

**기본 패턴**:
```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}
```

**반응형 Grid**:
```css
.responsive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}
```

**fr 단위 활용**:
```css
.grid-layout {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr; /* 1:2:1 비율 */
}
```

### 4.3 Position

✅ **relative/absolute 조합 패턴**:
```css
.parent {
    position: relative;
}

.child {
    position: absolute;
    top: 0;
    right: 0;
}
```

### 4.4 중앙 정렬 방법

상황에 맞게 적절한 방법을 선택하세요.

#### 방법 1: Flexbox 중앙정렬 (가장 일반적)

✅ **가장 많이 사용하는 방법**:
```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

#### 방법 2: Grid 중앙정렬 (Grid 사용 시)

✅ **Grid 레이아웃에서 중앙정렬**:
```css
.container {
    display: grid;
    place-items: center;
}
```

#### 방법 3: Position + Transform (절대 위치 필요 시)

✅ **부모 요소 내에서 정확한 중앙 배치**:
```css
.parent {
    position: relative;
}

.child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

#### 방법 4: margin auto (수평 중앙만 필요 시)

✅ **블록 요소의 수평 중앙 정렬**:
```css
.element {
    margin: 0 auto;
    max-width: 1200px;
}
```

### 4.5 레이아웃 선택 가이드

✅ **다음 기준으로 레이아웃 방식을 선택하세요**:
- **일반 레이아웃** → Flexbox 우선
- **명확한 행/열 그리드** → Grid (예: 3x4 카드 그리드)
- **겹침/레이어** → Position
- **텍스트 흐름** → Float (지양, Flexbox 사용)

---

## 5. 반응형 디자인 규칙

### 5.1 모바일 퍼스트 접근

✅ **반드시 모바일 퍼스트 방식으로 작성하세요**:
```css
/* 모바일 기본 스타일 */
.container {
    padding: 1rem;
    grid-template-columns: 1fr;
}

/* 태블릿 이상 */
@media (min-width: 768px) {
    .container {
        padding: 2rem;
        grid-template-columns: repeat(2, 1fr);
    }
}

/* 데스크톱 */
@media (min-width: 1200px) {
    .container {
        padding: 3rem;
        grid-template-columns: repeat(3, 1fr);
    }
}
```

### 5.2 브레이크포인트

✅ **다음 표준 브레이크포인트를 사용하세요**:
- **576px**: 세로 태블릿
- **768px**: 가로 태블릿
- **992px**: 작은 데스크톱
- **1200px**: 큰 데스크톱

### 5.3 미디어쿼리 작성

✅ **min-width를 사용하세요** (모바일 퍼스트):
```css
@media (min-width: 768px) {
    /* 768px 이상에서 적용 */
}
```

❌ **max-width는 데스크톱 퍼스트이므로 지양하세요**:
```css
/* ❌ 비권장 */
@media (max-width: 767px) {
    /* 모바일 스타일 */
}
```

### 5.4 컨테이너 max-width

✅ **데스크톱에서 최대 너비를 제한하세요**:
```css
.container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
}
```

### 5.5 반응형 이미지

✅ **이미지 반응형 설정**:
```css
img {
    max-width: 100%;
    height: auto;
}
```

✅ **aspect-ratio 활용**:
```css
.thumbnail {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
}
```

### 5.6 모바일 vs 태블릿 vs 데스크톱 차이점

✅ **각 디바이스에 맞는 스타일 적용**:

**모바일 (기본)**:
- 단일 컬럼 레이아웃
- 터치 영역 크게 (최소 44px)
- 간격 좁게 (`padding: 1rem`)
- 폰트 크기 작게

**태블릿 (768px 이상)**:
- 2컬럼 레이아웃
- 중간 간격 (`padding: 2rem`)
- 폰트 크기 중간

**데스크톱 (1200px 이상)**:
- 3-4컬럼 레이아웃
- 넓은 간격 (`padding: 3rem`)
- hover 효과 추가
- 폰트 크기 크게

```css
/* 모바일 */
.card {
    padding: 1.6rem;
    font-size: 1.4rem;
}

.button {
    min-height: 44px; /* 터치 영역 */
}

/* 태블릿 */
@media (min-width: 768px) {
    .card {
        padding: 2.4rem;
        font-size: 1.6rem;
    }
}

/* 데스크톱 */
@media (min-width: 1200px) {
    .card {
        padding: 3.2rem;
        font-size: 1.8rem;
    }

    .card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
    }
}
```

---

## 6. 접근성 & 인터랙션 규칙

### 6.1 접근성 규칙

#### 포커스 스타일

✅ **반드시 포커스 스타일을 제공하세요**:
```css
a:focus-visible,
button:focus-visible,
input:focus-visible {
    outline: 3px solid var(--primary-color);
    outline-offset: 3px;
}
```

❌ **outline: none을 전역으로 사용하지 마세요**:
```css
/* ❌ 절대 금지 */
*:focus {
    outline: none;
}
```

⚠️ **특정 요소에 outline 제거가 필요한 경우, 대체 시각적 표시를 제공하세요**:
```css
.custom-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--primary-color); /* 대체 표시 */
}
```

#### 스크린 리더 전용 텍스트

✅ **.sr-only 클래스 사용** (Reset CSS에 포함):
```css
.sr-only {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
}
```

**사용 예시**:
```html
<button>
    <span class="sr-only">메뉴 열기</span>
    <span aria-hidden="true">☰</span>
</button>
```

#### 색상 대비

✅ **WCAG AA 기준 이상의 색상 대비를 유지하세요**:
- 일반 텍스트: **4.5:1 이상**
- 큰 텍스트 (18pt 이상): **3:1 이상**

### 6.2 인터랙션 규칙

#### Transition

✅ **부드러운 인터랙션을 위해 transition을 사용하세요**:
```css
.button {
    background-color: var(--primary-color);
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.button:hover {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
}
```

✅ **특정 속성만 지정하는 것이 성능에 유리합니다**:
```css
/* ✅ 권장 */
transition: transform 0.3s ease, opacity 0.3s ease;

/* ⚠️ 가능하면 피하세요 */
transition: all 0.3s ease;
```

#### Animation

✅ **반복 애니메이션은 @keyframes를 사용하세요**:
```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.element {
    animation: fadeIn 0.5s ease-out;
}
```

#### Hover/Active 상태

✅ **모든 인터랙티브 요소에 hover/active 상태를 제공하세요**:
```css
.button {
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.button:hover {
    opacity: 0.9;
}

.button:active {
    transform: scale(0.98);
}
```

#### 성능 최적화

✅ **transform과 opacity만 애니메이션하세요** (GPU 가속):
```css
/* ✅ 성능 좋음 */
.element {
    transition: transform 0.3s, opacity 0.3s;
}

/* ❌ 성능 나쁨 - 리플로우 발생 */
.element {
    transition: width 0.3s, height 0.3s, left 0.3s;
}
```

#### Scroll 동작

✅ **부드러운 스크롤을 원하면 scroll-behavior를 사용하세요**:
```css
html {
    scroll-behavior: smooth;
}
```

---

## 7. 코드 품질 규칙

### 7.1 네이밍 규칙

#### kebab-case 사용

✅ **클래스명은 kebab-case를 사용하세요**:
```css
/* ✅ 권장 */
.card-container { }
.button-primary { }
.text-muted { }

/* ❌ 비권장 */
.cardContainer { } /* camelCase */
.Card_Container { } /* snake_case */
.CARD-CONTAINER { } /* UPPER-CASE */
```

#### 의미 기반 네이밍

✅ **스타일이 아닌 의미로 네이밍하세요**:
```css
/* ✅ 권장 - 의미 기반 */
.text-primary { color: var(--primary-color); }
.button-danger { background-color: var(--danger-color); }

/* ❌ 비권장 - 스타일 기반 */
.red-text { color: red; }
.big-button { font-size: 20px; }
```

#### 선택자 간단하게

✅ **선택자는 최대한 간단하게 작성하세요**:
```css
/* ✅ 권장 */
.card-title { }
.nav-link { }

/* ❌ 비권장 - 과도한 중첩 */
div.container .card .header .title { }
```

### 7.2 성능 규칙

#### 효율적인 선택자

✅ **클래스 선택자를 우선 사용하세요**:
```css
/* ✅ 빠름 */
.card { }
.button { }

/* ❌ 느림 */
div > div > div > p { }
[class^="col-"] { }
```

#### 리플로우/리페인트 최소화

✅ **transform과 opacity를 사용하세요**:
```css
/* ✅ 리플로우 없음 */
.element {
    transform: translateX(100px);
    opacity: 0.5;
}

/* ❌ 리플로우 발생 */
.element {
    left: 100px;
    width: 200px;
}
```

#### 폰트 로딩 최적화

✅ **font-display: swap을 사용하세요**:
```css
@font-face {
    font-family: 'CustomFont';
    src: url('font.woff2') format('woff2');
    font-display: swap; /* FOIT 방지 */
}
```

### 7.3 금지 사항

#### ❌ 절대 사용하지 말아야 할 것들

**line-height에 고정 단위 사용 금지**:
```css
/* ❌ 절대 금지 */
p {
    line-height: 40px;
    line-height: 2rem;
    line-height: 150%;
}

/* ✅ 올바른 방법 */
p {
    line-height: 1.5;
}
```

**전역 outline 제거 금지**:
```css
/* ❌ 절대 금지 */
*:focus {
    outline: none;
}
```

**!important 남용 금지**:
```css
/* ❌ 금지 */
.text {
    color: red !important;
}
```

**인라인 스타일 금지**:
```html
<!-- ❌ 금지 -->
<div style="color: red; font-size: 16px;">
```

**ID 선택자 스타일링 지양**:
```css
/* ❌ 지양 */
#header {
    background: white;
}

/* ✅ 클래스 사용 */
.header {
    background: white;
}
```

**float 레이아웃 지양**:
```css
/* ❌ 구식 방법 */
.column {
    float: left;
    width: 50%;
}

/* ✅ 현대적 방법 */
.container {
    display: flex;
    gap: 2rem;
}
```

**고정 width/height 지양**:
```css
/* ❌ 반응형 어려움 */
.container {
    width: 1200px;
    height: 600px;
}

/* ✅ 유연한 크기 */
.container {
    max-width: 1200px;
    width: 100%;
    min-height: 600px;
}
```

### 7.4 주의사항

⚠️ **Grid는 명확한 그리드 구조가 아니면 사용 지양**:
- Grid는 정형화된 행/열 구조에만 사용
- 대부분의 경우 Flexbox가 더 유연하고 간단합니다

⚠️ **px 사용은 제한적으로만 허용**:
- border: `border: 1px solid`
- border-radius (작은 값): `border-radius: 4px`
- box-shadow: `box-shadow: 0 2px 4px rgba(0,0,0,0.1)`
- header 고정 높이: `height: 60px` (필요한 경우만)

---

## 요약: 핵심 체크리스트

웹사이트 제작 시 다음을 반드시 확인하세요:

✅ **Reset CSS 포함**
- Universal selector 리셋
- html { font-size: 10px }
- body { line-height: 1.5 }
- .sr-only, .ellipsis, .multi-ellipsis 클래스

✅ **CSS 변수 정의**
- :root에 색상, 간격, 폰트 변수 정의
- 다크모드 지원 (필요시)

✅ **단위 사용**
- ⭐ **line-height: 단위 없는 숫자 (1.5)**
- font-size: rem
- letter-spacing: em
- spacing: rem
- px는 border, border-radius(작은 값), box-shadow만

✅ **레이아웃**
- 일반 레이아웃 → Flexbox 우선
- 명확한 그리드 → Grid
- gap 속성 사용

✅ **반응형**
- 모바일 퍼스트
- min-width 미디어쿼리
- 브레이크포인트: 576px, 768px, 992px, 1200px

✅ **접근성**
- focus-visible 스타일 제공
- 색상 대비 4.5:1 이상
- outline 제거 금지

✅ **인터랙션**
- transform, opacity만 애니메이션
- hover/active 상태 제공

✅ **코드 품질**
- kebab-case 네이밍
- 의미 기반 클래스명
- !important 사용 금지
- ID 선택자 지양

---

**이 문서의 모든 규칙을 따라 CSS 코드를 작성하세요.**
