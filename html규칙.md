# HTML 코딩 규칙 (AI 생성용 프롬프트)

---

**버전**: 1.0.0
**최종 수정일**: 2025-12-23

---

## 목차

0. [AI에게 이 규칙을 적용하는 방법](#0-ai에게-이-규칙을-적용하는-방법)
1. [문서 기본 구조](#1-문서-기본-구조)
2. [SEO 및 메타데이터 (필수)](#2-seo-및-메타데이터-필수)
3. [웹 접근성 (필수)](#3-웹-접근성-필수)
4. [시맨틱 마크업](#4-시맨틱-마크업)
5. [이미지 처리](#5-이미지-처리)
6. [폼 요소](#6-폼-요소)
7. [테이블](#7-테이블)
8. [인터랙티브 요소](#8-인터랙티브-요소)
9. [금지 사항](#9-금지-사항)
10. [종합 예시](#10-종합-예시)

---

## 0. AI에게 이 규칙을 적용하는 방법

이 문서를 AI에게 제공하고 다음과 같이 요청하세요:

```
위의 "HTML 코딩 규칙"을 준수하여 [요구사항]을 만들어주세요.

요구사항:
- 메뉴 섹션, 위치 섹션, 문의 폼 포함
- 반응형 디자인
```

AI는 자동으로:
1. SEO 메타 태그가 포함된 HTML 생성
2. 모든 이미지에 alt 텍스트 추가
3. 폼 요소에 label 연결
4. 시맨틱 태그로 구조화
5. heading 계층 준수
6. 접근성 고려 (sr-only, aria 속성)

---

## 1. 문서 기본 구조

### 1.1 DOCTYPE 및 언어 설정

**반드시 준수할 것:**
- `<!DOCTYPE html>` 선언을 최상단에 작성할 것
- `<html>` 태그에 `lang="ko-KR"` 속성을 반드시 명시할 것
- UTF-8 인코딩을 사용할 것: `<meta charset="UTF-8" />`
- 반응형을 위한 viewport 메타 태그를 반드시 포함할 것

✅ **좋은 예시:**
```html
<!DOCTYPE html>
<html lang="ko-KR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>구체적인 페이지 제목</title>
  </head>
  <body>
    <!-- 내용 -->
  </body>
</html>
```

❌ **나쁜 예시:**
```html
<!DOCTYPE html>
<html>  <!-- lang 속성 누락 -->
  <head>
    <meta charset="UTF-8" />
    <title></title>  <!-- 빈 title -->
  </head>
</html>
```

---

## 2. SEO 및 메타데이터 (필수)

### 2.1 Title 태그

**반드시 작성할 것:**
- 모든 페이지는 고유하고 구체적인 `<title>`을 가져야 함
- 빈 title 태그를 절대 남기지 말 것
- 50-60자 이내로 작성할 것

✅ **좋은 예시:**
```html
<title>당근마켓 - 우리 동네 중고거래</title>
<title>로그인 또는 회원가입 - 위니브</title>
<title>1만 시간의 법칙 - 전문가 되기 계산기</title>
```

❌ **나쁜 예시:**
```html
<title></title>  <!-- 절대 금지 -->
<title>웹사이트</title>  <!-- 너무 일반적 -->
```

### 2.2 Meta Description

**반드시 작성할 것:**
- 모든 페이지에 `meta description`을 포함할 것
- 페이지 내용을 120-160자 이내로 요약할 것

✅ **좋은 예시:**
```html
<meta
  name="description"
  content="1만시간의 법칙의 설명과 매일 하면 얼마나 걸릴지에 대해 알려주는 사이트"
/>
<meta
  name="description"
  content="귀여운 고양이hodu를 소개하는 페이지"
/>
```

### 2.3 Open Graph (OG) 태그

**소셜 공유를 위해 반드시 포함할 것:**
- `og:title`: 페이지 제목
- `og:description`: 페이지 설명
- `og:image`: 대표 이미지 (절대 경로 권장)

✅ **좋은 예시:**
```html
<meta property="og:title" content="귀여운 고양이hodu를 소개합니다" />
<meta
  property="og:description"
  content="귀여운 고양이hodu를 소개하는 페이지"
/>
<meta property="og:image" content="./asset/고양이/cat-boxhat.png" />
```

❌ **나쁜 예시:**
```html
<meta property="og:title" content="" />  <!-- 빈 값 -->
<meta property="og:image" content="" />  <!-- 이미지 경로 누락 -->
```

---

## 3. 웹 접근성 (필수)

### 3.1 Screen Reader Only (sr-only) 클래스

**시각적으로 숨기되 스크린 리더는 읽어야 하는 요소에 사용할 것:**

**CSS 정의 (필수):**
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

✅ **좋은 예시:**
```html
<h1 class="sr-only">1만시간의 법칙</h1>
<h2 class="sr-only">1만시간의 법칙 입력칸</h2>
<label class="sr-only" for="type">입력칸</label>
<h2 class="sr-only">이메일 전송 완료</h2>
```

**사용해야 하는 경우:**
- 시각적으로 명확하지만 스크린 리더 사용자에게 문맥 제공이 필요한 경우
- 로고 이미지로 대체된 h1 태그
- placeholder만 있고 시각적 label이 없는 input
- 아이콘 버튼에 텍스트 설명 추가

### 3.2 이미지 대체 텍스트 (alt)

**모든 이미지에 alt 속성을 반드시 작성할 것:**
- 의미 있는 이미지: 구체적인 설명 작성
- 장식용 이미지: `alt=""` (빈 문자열)
- SVG 아이콘: 텍스트 설명 또는 aria-label 사용

✅ **좋은 예시:**
```html
<img src="./images/rosy.png" alt="위니브 검은 토끼 캐릭터 로지" />
<img src="chart.png" alt="2025년에 매출이 증가하고 있는 차트" />
<img src="cat.png" alt="박스를 모자처럼 쓴 고양이hodu" />
<img src="icon-close.png" alt="창 닫기" />

<!-- 장식용 이미지 -->
<img src="decoration.png" alt="" />

<!-- SVG with sr-only -->
<button class="inline">
  <svg>...</svg>
  <span class="sr-only">weniv</span>
</button>
```

❌ **나쁜 예시:**
```html
<img src="image.png" />  <!-- alt 속성 누락 -->
<img src="image.png" alt="이미지" />  <!-- 너무 일반적 -->
<img src="logo.png" alt="로고" />  <!-- 구체적이지 않음 -->
```

### 3.3 폼 접근성 (label 연결)

**모든 input은 label과 연결되어야 함:**
- `label`의 `for` 속성과 `input`의 `id`를 일치시킬 것
- label이 시각적으로 불필요한 경우 `class="sr-only"` 사용

✅ **좋은 예시:**
```html
<!-- 명시적 label -->
<label for="id">아이디</label>
<input type="text" id="id" name="id" />

<!-- sr-only 활용 -->
<label class="sr-only" for="subscribe-email">이메일 주소</label>
<input
  type="email"
  id="subscribe-email"
  name="email"
  placeholder="Enter your e-mail address"
  required
  aria-required="true"
/>
```

❌ **나쁜 예시:**
```html
<!-- label 없음 -->
<input type="text" placeholder="아이디" />

<!-- label과 input 연결 안됨 -->
<label>아이디</label>
<input type="text" id="username" />
```

### 3.4 ARIA 속성

**필요한 경우 ARIA 속성을 사용할 것:**
- `aria-label`: 버튼, 링크에 텍스트 설명
- `aria-required`: 필수 입력 필드
- `role`: 역할 명시 (필요한 경우만)

✅ **좋은 예시:**
```html
<button type="button" aria-label="메뉴 열기">
  <span></span>
  <span></span>
  <span></span>
</button>

<a href="#TOP" class="back-to-top" aria-label="맨 위로 가기"></a>

<input
  type="email"
  required
  aria-required="true"
/>
```

### 3.5 Heading 구조

**heading 태그(h1-h6)를 계층적으로 사용할 것:**
- 페이지당 h1은 하나만
- h2, h3... 순차적으로 사용 (건너뛰지 말 것)
- 시각적으로 숨겨야 할 경우 sr-only 사용

✅ **좋은 예시:**
```html
<h1 class="sr-only">고양이hodu 소개 페이지</h1>
<main>
  <section>
    <h2>Lorem Ipsum is simply</h2>
    <p>...</p>
  </section>
  <section>
    <h2>당근 소개 및 모바일 어플 다운로드</h2>
    <h3>중고거래</h3>
  </section>
</main>
```

❌ **나쁜 예시:**
```html
<h1>제목</h1>
<h3>소제목</h3>  <!-- h2를 건너뛰고 h3 사용 -->
<h2>또 다른 섹션</h2>  <!-- 계층 구조 혼란 -->
```

---

## 4. 시맨틱 마크업

### 4.1 페이지 구조

**시맨틱 태그를 활용하여 명확한 문서 구조를 만들 것:**
- `<header>`: 헤더, 로고, 네비게이션
- `<nav>`: 주요 네비게이션 링크
- `<main>`: 페이지의 주요 콘텐츠 (페이지당 하나)
- `<section>`: 주제별 콘텐츠 그룹 (반드시 heading 포함)
- `<article>`: 독립적으로 배포 가능한 콘텐츠
- `<aside>`: 사이드바, 관련 콘텐츠
- `<footer>`: 푸터, 저작권, 연락처

✅ **좋은 예시:**
```html
<header>
  <h1><a href="">weniv</a></h1>
  <nav>
    <ul>
      <li><a href="">위니브 소개</a></li>
      <li><a href="">위니브 강의</a></li>
      <li><a href="">위니브 오시는 길</a></li>
    </ul>
  </nav>
</header>

<main>
  <section>
    <h2>위니브 소개</h2>
    <p>위니브는 제주에 위치한 ICT 교육 기업입니다.</p>
  </section>

  <section>
    <h2>위니브 강의</h2>
    <!-- 강의 내용 -->
  </section>
</main>

<aside>
  <h2>사이드 메뉴</h2>
  <ul>...</ul>
</aside>

<footer>
  <address>
    위니브 | 대표자: 이호준 | 사업자등록번호: 123-45-67890
  </address>
</footer>
```

❌ **나쁜 예시:**
```html
<div class="header">  <!-- header 태그 사용해야 함 -->
  <div class="nav">  <!-- nav 태그 사용해야 함 -->
    <a href="">링크</a>
  </div>
</div>

<div class="content">  <!-- main 태그 사용해야 함 -->
  <div>  <!-- section 태그 사용해야 함 -->
    <p>내용</p>  <!-- heading 누락 -->
  </div>
</div>
```

### 4.2 article vs section

**구분하여 사용할 것:**
- `<article>`: RSS 피드로 배포 가능한 독립적 콘텐츠 (블로그 글, 뉴스 기사)
- `<section>`: 주제별로 그룹화된 콘텐츠

✅ **좋은 예시:**
```html
<!-- article: 독립적인 위젯 -->
<article>
  <h2>날씨 위젯</h2>
  <!-- 위젯 내용 -->
</article>

<!-- section: 페이지 섹션 -->
<section>
  <h2>중고거래</h2>
  <p>믿을만한 이웃 간 중고거래</p>
</section>
```

### 4.3 address 태그

**연락처 정보는 address 태그를 사용할 것:**

✅ **좋은 예시:**
```html
<footer>
  <address>
    서울특별시 구로구 디지털로 300, 10층 (당근서비스)
  </address>

  <dl>
    <dt>전화</dt>
    <dd><a href="tel:1544-9796">1544-9796</a></dd>
    <dt>고객 문의</dt>
    <dd><address>cs@daangnservice.com</address></dd>
  </dl>
</footer>
```

### 4.4 dl, dt, dd (정의 목록)

**키-값 쌍 데이터는 dl, dt, dd를 사용할 것:**

✅ **좋은 예시:**
```html
<dl>
  <dt>대표</dt>
  <dd>김용현, 황도연</dd>

  <dt>사업자번호</dt>
  <dd>375-87-00088</dd>

  <dt>통신판매업 신고번호</dt>
  <dd>2021-서울서초-2875</dd>
</dl>
```

❌ **나쁜 예시:**
```html
<!-- 단순 p 태그 사용하지 말 것 -->
<p>대표: 김용현, 황도연</p>
<p>사업자번호: 375-87-00088</p>
```

---

## 5. 이미지 처리

### 5.1 figure와 figcaption

**이미지, 차트, 코드 등 캡션이 필요한 콘텐츠에 사용할 것:**

✅ **좋은 예시:**
```html
<figure>
  <img src="chart.png" alt="2025년에 매출이 증가하고 있는 차트" />
  <figcaption>2025년 분기별 매출</figcaption>
</figure>

<figure>
  <pre>
     /\_/\
    ( o.o )
     > ^ <
  </pre>
  <figcaption>그림 1: 귀여운 고양이 아스키 아트</figcaption>
</figure>
```

### 5.2 반응형 이미지 (picture 태그)

**화면 크기별로 다른 이미지를 제공할 때 사용할 것:**

✅ **좋은 예시:**
```html
<picture>
  <source srcset="./image/small.jpg" media="(max-width: 320px)" />
  <source srcset="./image/medium.jpg" media="(max-width: 800px)" />
  <img src="./image/large.jpg" alt="기본 이미지" />
</picture>
```

### 5.3 SVG 처리

**인라인 SVG 사용 시 접근성 텍스트를 반드시 포함할 것:**

✅ **좋은 예시:**
```html
<button class="inline">
  <svg width="42" height="42" viewBox="0 0 42 42">
    <rect width="42" height="42" rx="10" fill="#2E6FF2" />
    <!-- 경로들 -->
  </svg>
  <span class="sr-only">weniv</span>
</button>
```

### 5.4 로고 이미지 접근성

**로고를 링크로 감쌀 때:**

✅ **좋은 예시:**
```html
<h1>
  <a href="/">
    <img src="logo.png" alt="당근마켓" />
  </a>
</h1>

<!-- 또는 -->
<h1>
  <a href="/">
    <img src="logo.png" alt="당근마켓 로고" />
  </a>
</h1>
```

❌ **나쁜 예시:**
```html
<h1>
  <a href="/">
    <img src="logo.png" alt="로고" />  <!-- 구체적이지 않음 -->
  </a>
</h1>
```

### 5.5 의미 없는 이미지는 CSS로 처리

**장식용 이미지는 HTML에 포함하지 말고 CSS background-image로 처리할 것:**


❌ **나쁜 예시:**
```html
<!-- 순수 장식 이미지를 HTML에 포함 -->
<img src="decoration.png" alt="" />
```

---

## 6. 폼 요소

### 6.1 기본 폼 구조

**form 요소에는 method와 action을 명시할 것:**

✅ **좋은 예시:**
```html
<form action="#" method="post">
  <div>
    <label for="id">아이디</label>
    <input type="text" id="id" name="id" />
  </div>
  <div>
    <label for="pw">비밀번호</label>
    <input type="password" id="pw" name="pw" />
  </div>
  <button type="submit">로그인</button>
</form>
```

### 6.2 fieldset과 legend

**라디오 버튼, 체크박스 그룹은 fieldset으로 감쌀 것:**

✅ **좋은 예시:**
```html
<fieldset>
  <legend>성별</legend>
  <input type="radio" name="sex" id="male" />
  <label for="male">남성</label>
  <input type="radio" name="sex" id="female" />
  <label for="female">여성</label>
</fieldset>

<fieldset>
  <legend>사용기술</legend>
  <input type="checkbox" id="html" name="html" />
  <label for="html">HTML</label>
  <input type="checkbox" id="css" name="css" />
  <label for="css">CSS</label>
</fieldset>
```

❌ **나쁜 예시:**
```html
<div>
  <input type="radio" name="sex" id="male" />
  <label for="male">남성</label>
  <input type="radio" name="sex" id="female" />
  <label for="female">여성</label>
</div>
```

### 6.3 select와 optgroup

**select 요소도 label과 연결할 것, 옵션 그룹화 시 optgroup 사용:**

✅ **좋은 예시:**
```html
<label for="language">사용하는 개발 언어를 선택하세요</label>
<select id="language" name="language">
  <optgroup label="프로그래밍 언어">
    <option value="python">Python</option>
    <option value="javascript">JavaScript</option>
  </optgroup>
  <optgroup label="데이터베이스">
    <option value="mysql">MySQL</option>
    <option value="postgresql">PostgreSQL</option>
  </optgroup>
</select>

<!-- 숨겨진 label -->
<label hidden for="language-selector">언어 선택:</label>
<select id="language-selector" name="language-code">
  <option value="ko" lang="ko" selected>한국어</option>
  <option value="en" lang="en">English</option>
</select>
```

### 6.4 필수 입력 필드

**required 속성과 aria-required를 함께 사용할 것:**

✅ **좋은 예시:**
```html
<label for="email">이메일 주소</label>
<input
  type="email"
  id="email"
  name="email"
  required
  aria-required="true"
/>
```

---

## 7. 테이블

### 7.1 테이블 기본 구조

**테이블은 반드시 caption을 포함하고 구조화할 것:**
- `<caption>`: 테이블 제목 (필수)
- `<thead>`, `<tbody>`, `<tfoot>`: 테이블 구조화
- `<th>`: 헤더 셀에 `scope` 속성 명시

✅ **좋은 예시:**
```html
<table>
  <caption>2023 학년도 대학수학능력시험 성적통지표</caption>
  <thead>
    <tr>
      <th scope="col">구분</th>
      <th scope="col">한국사영역</th>
      <th scope="col">국어 영역</th>
      <th scope="col">수학 영역</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">표준점수</th>
      <td>100</td>
      <td>131</td>
      <td>137</td>
    </tr>
    <tr>
      <th scope="row">백분위</th>
      <td>100</td>
      <td>93</td>
      <td>95</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">등급</th>
      <td>2</td>
      <td>2</td>
      <td>2</td>
    </tr>
  </tfoot>
</table>
```

### 7.2 scope 속성

**th 태그에는 scope 속성을 명시할 것:**
- `scope="col"`: 열 헤더
- `scope="row"`: 행 헤더
- `scope="colgroup"`: 열 그룹 헤더
- `scope="rowgroup"`: 행 그룹 헤더

### 7.3 colspan과 rowspan

**셀 병합 시 colspan, rowspan 사용:**

✅ **좋은 예시:**
```html
<th scope="col" rowspan="2">한국사영역</th>
<th scope="col" colspan="2">탐구 영역</th>
```

---

## 8. 인터랙티브 요소

### 8.1 dialog (모달)

**모달 팝업은 dialog 태그를 사용할 것:**

✅ **좋은 예시:**
```html
<dialog id="subscribeModal" class="subscribe-modal">
  <div class="modal-content">
    <h2 class="sr-only">이메일 전송 완료</h2>
    <img src="./asset/cat.png" alt="고양이 hodu" />
    <strong>Thank you!</strong>
    <p>Lorem Ipsum is simply dummy text.</p>
    <button type="button" class="modal-btn">OK! I Love HODU</button>
  </div>
</dialog>

```

### 8.2 details와 summary

**확장/축소 가능한 콘텐츠는 details/summary 사용:**

✅ **좋은 예시:**
```html
<details>
  <summary>CSS가 뭔가요?</summary>
  <p>
    CSS는 Cascading Style Sheets의 약자로,
    웹 페이지를 스타일링하고 레이아웃을 구성하는 데 사용됩니다.
  </p>
</details>
```

### 8.3 time 태그

**날짜/시간 정보는 time 태그로 마크업할 것:**

✅ **좋은 예시:**
```html
<time datetime="14:30:00">오후 2시 30분</time>
<time datetime="2025-12-23">2025년 12월 23일</time>
```

### 8.4 버튼 type 명시

**button 요소에는 항상 type을 명시할 것:**

✅ **좋은 예시:**
```html
<button type="submit">로그인</button>
<button type="button">모달 열기</button>
<button type="reset">초기화</button>
```

❌ **나쁜 예시:**
```html
<button>클릭</button>  <!-- type 누락, 기본값은 submit -->
```

---

## 9. 금지 사항

### 9.1 절대 하지 말 것

❌ **빈 title 태그 남기기**
```html
<title></title>  <!-- 절대 금지 -->
```

❌ **alt 속성 누락**
```html
<img src="image.png" />  <!-- alt 필수 -->
```

❌ **label 없는 input**
```html
<input type="text" placeholder="이름" />  <!-- label 연결 필수 -->
```

❌ **div와 span 남용**
```html
<div class="header">  <!-- header 태그 사용 -->
  <div class="nav">  <!-- nav 태그 사용 -->
```

❌ **heading 순서 건너뛰기**
```html
<h1>제목</h1>
<h3>소제목</h3>  <!-- h2 건너뜀, 금지 -->
```

❌ **불필요한 role 속성**
```html
<a href="" role="link">링크</a>  <!-- a 태그는 기본이 link -->
<button role="button">버튼</button>  <!-- button 태그는 기본이 button -->
```

❌ **인라인 스타일 사용**
```html
<div style="color: red;">텍스트</div>  <!-- CSS 파일로 분리 -->
```

### 9.2 주의사항

⚠️ **테이블을 레이아웃 용도로 사용하지 말 것**
- 테이블은 데이터 표현에만 사용
- 레이아웃은 CSS Flexbox/Grid 사용

⚠️ **HTML5 시맨틱 태그 우선 사용**
- div 대신 header, nav, main, section, article, aside, footer 사용
- span 대신 strong, em 등 의미론적 태그 사용

---

## 10. 종합 예시

### 완벽한 HTML 문서 템플릿

```html
<!DOCTYPE html>
<html lang="ko-KR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="구체적인 페이지 설명 120-160자 이내"
    />
    <meta property="og:title" content="소셜 공유용 제목" />
    <meta
      property="og:description"
      content="소셜 공유용 설명"
    />
    <meta property="og:image" content="./images/og-image.png" />
    <title>구체적인 페이지 제목 - 사이트명</title>
    <link rel="stylesheet" href="./css/reset.css" />
    <link rel="stylesheet" href="./css/main.css" />
  </head>
  <body>
    <header>
      <h1>
        <a href="/">
          <img src="./logo.png" alt="사이트명 로고" />
        </a>
      </h1>
      <nav>
        <ul>
          <li><a href="#about">소개</a></li>
          <li><a href="#service">서비스</a></li>
          <li><a href="#contact">연락처</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section id="about">
        <h2>회사 소개</h2>
        <p>본문 내용...</p>
      </section>

      <section id="service">
        <h2>서비스</h2>
        <article>
          <h3>서비스 1</h3>
          <figure>
            <img src="service1.png" alt="서비스 1 스크린샷" />
            <figcaption>서비스 1 화면</figcaption>
          </figure>
        </article>
      </section>

      <section id="contact">
        <h2>문의하기</h2>
        <form action="/submit" method="post">
          <div>
            <label for="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label for="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              aria-required="true"
            />
          </div>
          <button type="submit">전송</button>
        </form>
      </section>
    </main>

    <footer>
      <h2 class="sr-only">사이트 정보</h2>
      <address>
        서울특별시 강남구 테헤란로 123<br />
        <a href="tel:02-1234-5678">02-1234-5678</a><br />
        <a href="mailto:contact@example.com">contact@example.com</a>
      </address>
      <p>&copy; 2025 회사명. All rights reserved.</p>
    </footer>
  </body>
</html>
```

---

## CSS 파일에 포함할 sr-only 스타일

프로젝트의 reset.css나 base.css에 다음을 추가:

```css
/* ===== 접근성 ===== */
.sr-only {
    position: absolute;
    left: -9999px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
}
```

---



**이 규칙을 준수하여 웹 접근성과 SEO가 뛰어난 HTML을 작성하세요!**
