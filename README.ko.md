<p align="center">
<img src="assets/banner.webp" alt="HopLog Banner" width="100%">
</p>

<p align="center">
  <a href="README.md">English</a> · <a href="README.ko.md">한국어</a>
</p>

# 🐰 HopLog

> 개발자가 쓰기 편하게 만든 심플한 블로그.
> 빠르게 글을 쓰고, 쉽게 커스터마이징하고, 편하게 읽을 수 있도록 만들었습니다.

HopLog는 Next.js 16과 Bun으로 만든 개발자 친화적인 블로그입니다. 빠른 시작 속도, 마크다운 기반 작성, 키보드 중심 탐색, 깔끔한 테마 시스템, 단순한 설정 구조에 집중합니다.

동시에 Jekyll 스타일 블로그의 단순함에서도 많은 영감을 받았습니다. 파일 기반 포스트 관리, frontmatter 중심 구성, 그리고 개발자에게 자연스러운 워크플로우를 그대로 녹여내려고 했습니다.

## ✨ 주요 특징

- **빠른 기본 성능**: Next.js 16(App Router)과 Tailwind CSS 4 기반으로 빠르게 동작합니다.
- **깔끔한 블로그 UI**: 불필요한 장식보다 글 자체에 집중할 수 있는 단순한 인터페이스를 제공합니다.
- **재귀 포스트 라우팅**: `content/posts/` 아래 중첩된 마크다운 파일이 그대로 `/posts/...` URL로 연결됩니다.
- **키보드 중심 탐색**: 커맨드 팔레트(⌘+⇧+P)와 전역 단축키를 지원합니다.
- **Git 활동 연동**: GitHub 기여도와 작성 밀도를 함께 보여줄 수 있습니다.
- **비공개 포스트 지원**: frontmatter 설정으로 초안이나 내부 글을 공개 영역에서 숨길 수 있습니다.
- **다국어 UI**: 영어, 한국어, 일본어, 중국어 UI 번역을 지원합니다.

## 🚀 빠른 시작

1. **저장소 클론**
   ```bash
   git clone https://github.com/rapidrabbit76/hoplog.git
   cd hoplog
   ```

2. **의존성 설치**
   ```bash
   bun install
   ```

3. **프로필 설정**
   ```bash
   cp content/profile.example.yml content/profile.yml
   ```
   `content/profile.yml`에서 이름, 소개, 소셜 링크, 경력, 기술 스택을 설정하세요.

4. **개발 서버 실행**
   ```bash
   bun dev
   ```

## 📝 글 작성

포스트는 `content/posts/` 아래 어디에나 둘 수 있습니다. 튜토리얼이나 시리즈처럼 폴더로 나눠도 자동으로 인식합니다.

예시:
- `content/posts/getting-started.md` → `/posts/getting-started`
- `content/posts/tutorial/advanced.md` → `/posts/tutorial/advanced`

### 포스트 메타데이터(frontmatter)

각 포스트는 YAML frontmatter를 사용합니다.

```yaml
---
title: "Your Post Title"
date: "2026.03.11"
category: ["Engineering", "Architecture"]
excerpt: "A brief summary for SEO and lists."
image: "/api/images/cover.jpg" # 선택
fontFamily: "'Noto Sans KR', sans-serif" # 선택
fontUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap" # 선택
visibility: "private" # 선택: 비공개 포스트
---
```

### 비공개 포스트

공개 사이트에서 포스트를 숨기려면 `visibility: "private"`를 사용하는 것을 권장합니다.

`public: false`도 이전 콘텐츠와의 호환을 위해 지원되지만, 앞으로는 `visibility` 형식을 쓰는 편이 더 명확합니다.

비공개 포스트는 다음에서 제외됩니다.

- 포스트 목록
- 정적 라우트 생성
- 메타데이터 생성
- `sitemap.xml`
- 직접 URL 접근

## 🎨 커스터마이징

### 사이트 설정
`content/config.yml`에서 사이트 메타데이터, hero 내용, 타이포그래피, title template을 설정합니다. 루트 SEO 설정은 `content/seo.yml`에서 관리합니다.

또한 `content/config.yml`에서 `ga`, `metaPixel`, `sentry`를 켜거나 끌 수 있습니다. 각 provider는 개별 `enabled` 플래그를 가지므로 독립적으로 비활성화할 수 있고, 실제 값은 `GA_MEASUREMENT_ID`, `META_PIXEL_ID`, `SENTRY_DSN` 같은 env에서 읽습니다.

### 선택형 Meilisearch
검색은 기본적으로 현재의 로컬 Command Palette 인덱스를 사용합니다. Meilisearch로 전환하려면 `content/config.yml`에서 `search.provider`를 `meilisearch`로 바꾸고, `MEILISEARCH_HOST`, `MEILISEARCH_SEARCH_KEY`, `MEILISEARCH_ADMIN_KEY`를 설정한 뒤 `bun run search:sync`로 포스트 인덱스를 동기화하면 됩니다.

### 테마
테마는 `content/themes/` 아래 개별 YAML 파일로 정의합니다. 추가한 테마는 자동으로 로드되고 커맨드 팔레트(⌘+⇧+P)에 나타납니다.

### UI 번역
UI 문구는 `messages/*.json` 파일에 분리되어 있습니다. 애플리케이션 코드 수정 없이 번역 작업을 할 수 있습니다.

지원 로케일:
- `en` (영어)
- `ko` (한국어)
- `ja` (일본어)
- `zh` (중국어)

자세한 사용 흐름은 `content/posts/tutorial/` 아래 튜토리얼 문서에서 이어서 볼 수 있습니다.

- Analytics 설정 튜토리얼: `/posts/tutorial/site-configuration`

## 🔎 기술 정보

- **메타데이터 생성**: `sitemap.xml`, `robots.txt`를 자동 생성합니다.
- **테마 반영 에러 페이지**: 커스텀 `404`, `500` 페이지가 현재 테마와 로케일을 반영합니다.
- **미디어 지원**: 이미지는 `/api/images/[...path]` 경로로 제공합니다.
- **기술 스택**: Next.js 16 (React 19), Tailwind CSS 4 (OKLCH), Bun, Zustand, Remark/Rehype

## 🐳 Docker

### 빠른 시작

```bash
docker compose up -d
```

첫 실행 시 `blog/` 디렉토리가 생성되고 기본 콘텐츠(포스트, 테마, 설정, FAQ)가 자동으로 복사됩니다. `blog/` 안의 파일을 수정하여 사이트를 커스터마이징하세요. 이후 실행에서는 기존 콘텐츠를 유지합니다.

`profile.yml`은 이미지에 포함되지 않습니다. 없을 경우 `profile.example.yml`에서 자동 생성됩니다.

### 환경 변수

모든 변수는 선택 사항이며 런타임에 읽으므로, 이미지 재빌드 없이 변경할 수 있습니다.

| 변수 | 설명 |
| :--- | :--- |
| `GA_MEASUREMENT_ID` | Google Analytics 측정 ID |
| `META_PIXEL_ID` | Meta Pixel ID |
| `SENTRY_DSN` | Sentry DSN |
| `SENTRY_ENVIRONMENT` | Sentry 환경 이름 |

### 선택 사항: Meilisearch

검색은 내장 로컬 인덱스로 기본 동작합니다. Meilisearch는 **필수가 아닙니다**.

활성화하려면:

```bash
docker compose --profile search up -d
```

이후 `blog/config.yml`에서 `search.provider`를 `meilisearch`로 변경하고 동기화합니다:

```bash
docker compose exec app bun run search:sync
```

Meilisearch 사용 시 추가 변수:

| 변수 | 설명 |
| :--- | :--- |
| `MEILISEARCH_HOST` | Meilisearch 엔드포인트 URL |
| `MEILISEARCH_SEARCH_KEY` | 공개 검색 키 |
| `MEILISEARCH_ADMIN_KEY` | 관리 키 |

## 🛠 명령어

| 명령어 | 설명 |
| :--- | :--- |
| `bun dev` | 개발 서버 실행 |
| `bun run lint` | ESLint 검사 |
| `bun run build` | 프로덕션 빌드 |
| `bun start` | 프로덕션 서버 실행 |

## 📜 라이선스

[MIT License](LICENSE)로 배포합니다. 기여는 언제든 환영합니다.
