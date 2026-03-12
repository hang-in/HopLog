---
title: "SEO와 분석 도구"
date: "2026.03.12"
category: ["KO", "Guide", "Config"]
excerpt: "글로벌/포스트별 SEO 설정, robots 크롤러 제어, Google Analytics, Meta Pixel, Sentry 설정 가이드."
---

## 글로벌 SEO (seo.yml)

`content/seo.yml`에서 사이트 전체의 SEO를 관리합니다. OpenGraph, Twitter Card, robots 정책을 포함합니다.

```yaml
siteUrl: "https://yourblog.com"
language: "ko-KR"
keywords: ["blog", "developer", "tech"]

robots:
  policy: "index, follow"
  rules:
    - userAgent: "GPTBot"
      allow: "/"
    - userAgent: "Googlebot"
      allow: "/"
      crawlDelay: 1

openGraph:
  type: "website"
  siteName: "My Blog"
  title: "My Blog"
  description: "A developer blog"
  image: "/og-image.png"
  imageWidth: 1200
  imageHeight: 630

twitter:
  card: "summary_large_image"
  site: "@handle"
  creator: "@handle"
  image: "/og-image.png"
```

## 포스트별 SEO 오버라이드

각 포스트의 프론트매터에서 글로벌 SEO 설정을 오버라이드할 수 있습니다:

```yaml
---
title: "My Post"
date: "2026.03.12"
category: ["KO", "Dev"]
image: "/api/images/my-post.jpg"
seo:
  title: "커스텀 SEO 제목"
  description: "커스텀 메타 설명"
  keywords: ["custom", "keywords"]
  ogTitle: "OG 제목"
  ogDescription: "OG 설명"
  ogImage: "/api/images/og-custom.jpg"
  ogImageWidth: 1200
  ogImageHeight: 630
  twitterCard: "summary_large_image"
  twitterTitle: "Twitter 제목"
  twitterDescription: "Twitter 설명"
  twitterImage: "/api/images/twitter-custom.jpg"
  canonical: "https://example.com/original-post"
  noindex: false
---
```

### 우선순위

1. `seo.*` 프론트매터 필드 (최우선)
2. `image` 프론트매터 필드 (OG/Twitter 이미지로 자동 사용)
3. `seo.yml` 글로벌 설정 (폴백)

`noindex: true`를 설정하면 해당 포스트가 검색 엔진 인덱싱에서 제외되지만 공개 상태는 유지됩니다. 완전히 숨기려면 `visibility: "private"`를 사용하세요.

## Robots 크롤러 제어

`seo.yml`의 `robots.rules`로 크롤러별 접근을 세밀하게 제어합니다:

```yaml
robots:
  policy: "index, follow"
  rules:
    - userAgent: "GPTBot"
      allow: "/"
    - userAgent: "ChatGPT-User"
      allow: "/"
    - userAgent: "ClaudeBot"
      allow: "/"
    - userAgent: "PerplexityBot"
      allow: "/"
    - userAgent: "Google-Extended"
      disallow: "/"
    - userAgent: "Yeti"
      crawlDelay: 10
```

각 규칙에 `allow`, `disallow`, `crawlDelay`를 조합할 수 있습니다.

## Analytics

`config.yml`에서 세 가지 분석 도구를 독립적으로 설정합니다. 실제 키 값은 환경변수로 관리합니다.

```yaml
analytics:
  enabled: true           # 마스터 토글
  debug: false            # 디버그 모드

  ga:
    enabled: true
    measurementIdEnv: "GA_MEASUREMENT_ID"

  metaPixel:
    enabled: false
    pixelIdEnv: "META_PIXEL_ID"

  sentry:
    enabled: false
    dsnEnv: "SENTRY_DSN"
    environmentEnv: "SENTRY_ENVIRONMENT"
    tracesSampleRate: 1   # 0~1 (샘플링 비율)
```

### 환경변수 예시

```bash
GA_MEASUREMENT_ID=G-XXXXXXXXXX
META_PIXEL_ID=1234567890
SENTRY_DSN=https://xxx@sentry.io/123
SENTRY_ENVIRONMENT=production
```

`analytics.enabled: false`로 설정하면 개별 프로바이더 설정과 관계없이 모든 분석이 비활성화됩니다.

---

다음: [배포](/posts/tutorial/ko/deployment)
