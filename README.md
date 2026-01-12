# HODU_MARKET

Vite 기반의 멀티 페이지 애플리케이션(MPA) 프로젝트입니다.

## 프로젝트 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 코드 품질 관리

이 프로젝트는 **Prettier**와 **ESLint**를 사용하여 코드 품질을 관리합니다.

### 자동 포맷팅

VSCode에서 파일을 저장하면 자동으로 Prettier가 실행됩니다.

> `.vscode/settings.json` 파일에 이미 설정되어 있습니다.

## 폴더 구조

```
HODU_MARKET/
├── public/                 # 정적 파일 (favicon, 이미지 등)
│   └── favicon.ico
├── src/
│   ├── assets/            # 공통 리소스
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   └── recommendReset.css
│   │   └── images/
│   ├── js/                # 공통 JS 모듈
│   │   └── utils.js
│   ├── pages/             # 각 페이지별 폴더
│   │   ├── home/
│   │   │   ├── index.html
│   │   │   ├── main.js
│   │   │   └── style.css
│   │   ├── about/
│   │   │   ├── index.html
│   │   │   ├── main.js
│   │   │   └── style.css
│   │   └── contact/
│   │       ├── index.html
│   │       ├── main.js
│   │       └── style.css
├── index.html             # 루트 페이지
├── vite.config.js         # Vite 설정
├── eslint.config.js       # ESLint 설정
├── .prettierrc            # Prettier 설정
└── package.json
```

## Vite 설정

새 페이지를 추가할 때는 `vite.config.js`에 등록해야 합니다:

```javascript
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'src/pages/about/index.html'),
        contact: resolve(__dirname, 'src/pages/contact/index.html'),
        // 새 페이지 추가 시 여기에 등록
      },
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@js': resolve(__dirname, 'src/js'),
    },
  },
})
```

## 웹 컴포넌트 가이드

이 프로젝트는 Web Components를 사용하여 재사용 가능한 UI 요소를 만듭니다.

### 자동 컴포넌트 등록 시스템

`vite-plugin-auto-components.js` 플러그인이 HTML 파일에서 커스텀 태그를 자동으로 감지하고 해당 컴포넌트를 임포트합니다.

#### 태그 형식 규칙

- **형식**: `<folder-file>` (kebab-case)
- **예시**:
  - `<hodu-footer>` → `src/component/hodu/footer.js`
  - `<imput-button>` → `src/component/imput/button.js`
  - `<user-profile-card>` → `src/component/user/profile-card.js`

#### 폴더/파일 이름 규칙

**폴더명**: 소문자, 하이픈 없이 작성 (예: `hodu`, `imput`, `user`)
**파일명**: 소문자, 하이픈 사용 가능 (예: `footer.js`, `button.js`, `profile-card.js`)

```
src/component/
├── hodu/              ✅ 올바른 폴더명
│   ├── footer.js      → <hodu-footer>
│   └── header.js      → <hodu-header>
├── imput/             ✅ 올바른 폴더명
│   └── button.js      → <imput-button>
└── user-profile/      ❌ 잘못된 폴더명 (하이픈 사용 불가)
```

#### 설정 (`vite.config.js`)

```javascript
autoComponentsPlugin({
  tagPrefix: '', // 빈 문자열: prefix 없이 <folder-file> 형식
  componentDir: 'src/component',
  debug: true,
})
```

### 컴포넌트 작성 방법

```javascript
class MyComponent extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('text') || '기본값'

    this.innerHTML = `
      <button>${text}</button>
    `

    this.querySelector('button').addEventListener('click', () => {
      console.log('클릭!')
    })
  }
}

customElements.define('my-component', MyComponent)
```

### HTML에서 사용하기

```html
<!-- 자동으로 src/component/hodu/footer.js를 임포트 -->
<hodu-footer></hodu-footer>

<!-- 자동으로 src/component/imput/button.js를 임포트 -->
<imput-button text="클릭하세요"></imput-button>
```

## 기술 스택

- **Vite** - 빌드 도구
- **Web Components** - 컴포넌트 시스템
- **Prettier** - 코드 포맷터
- **ESLint** - 코드 린터
