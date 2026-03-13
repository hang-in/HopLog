---
title: "사이트 설정"
date: "2026.03.12"
category: ["KO", "Guide", "Config"]
excerpt: "config.yml, profile.yml, seo.yml 세 파일로 사이트 전체를 설정하는 방법을 다룹니다."
---

HopLog의 설정은 세 개의 YAML 파일로 나뉩니다.

## config.yml — 사이트 메타데이터

```yaml
site:
  title: "HopLog"
  description: "A developer-friendly blog"
  titleTemplate: "%s | HopLog"      # 브라우저 탭 제목 형식

faq:
  enabled: true                      # FAQ 페이지 활성화

performance:
  postsCacheTtlSeconds: 60           # 포스트 캐시 TTL (프로덕션 전용)

theme:
  default: "dracula"                 # 기본 컬러 테마 ID (content/themes/ 파일의 id와 일치해야 함)

hero:
  title: 'A simple blog<br />for <span class="text-primary">developers</span>'
  description: "Write technical posts in Markdown."
  background:
    image: "/api/images/hero-bg.webp"
    opacity: 0.12

typography:
  lineHeight: 1.75
  fontFamily: ""                     # 전역 폰트 (빈 값이면 시스템 기본 Geist)
  fontUrl: ""                        # Google Fonts URL

sharing:
  - twitter
  - facebook
  - linkedin
  - copyLink
```

`theme.default`는 처음 방문하는 사용자에게 적용되는 기본 컬러 테마입니다. `content/themes/` 디렉토리의 YAML 파일 `id` 값과 일치해야 합니다. 사용자가 커맨드 팔레트에서 테마를 변경하면 localStorage에 저장되어 이후 방문 시 우선 적용됩니다.

`sharing`은 각 포스트 하단에 렌더링되는 아이콘 전용 공유 버튼을 제어합니다. 배열 순서가 그대로 유지되며, 현재 구현이 지원하는 provider는 `twitter`, `facebook`, `linkedin`, `copyLink`입니다.

## profile.yml — 프로필 및 About 페이지

```yaml
profile:
  name: "Your Name"
  role: "Software Engineer"
  email: "your@email.com"
  github: "https://github.com/yourgithub"
  githubUsername: "yourgithub"       # GitHub Activity Grid 연동
  bio: "A short introduction."

social:
  - platform: "LinkedIn"
    url: "https://linkedin.com/in/yourprofile"
  - platform: "Github"
    url: "https://github.com/yourgithub"

experience:
  - company: "Company Name"
    position: "Backend Engineer"
    period: "2024.01 - Present"
    description: "Working on distributed systems."

skills:
  - "TypeScript"
  - "Go"
  - "Docker"
```

- `githubUsername`을 설정하면 About 페이지에 GitHub 잔디 Activity Grid가 표시됩니다.
- `social` 목록의 각 항목은 About 페이지에 배지로 렌더링됩니다.

## seo.yml — 검색 엔진 최적화

```yaml
siteUrl: "https://yourblog.com"
host: "https://yourblog.com"        # 선택 (siteUrl과 다를 경우)
language: "ko-KR"
keywords:
  - "blog"
  - "developer"

robots:
  policy: "index, follow"
  rules:                             # 크롤러별 접근 제어
    - userAgent: "GPTBot"
      allow: "/"
    - userAgent: "ClaudeBot"
      allow: "/"
    - userAgent: "Googlebot"
      allow: "/"

openGraph:
  type: "website"
  siteName: "HopLog"
  title: "HopLog"
  description: "A developer blog"
  image: "/og-image.png"
  imageWidth: 1200
  imageHeight: 630

twitter:
  card: "summary_large_image"
  site: "@yourhandle"
  creator: "@yourhandle"
  image: "/og-image.png"
```

AI 크롤러(GPTBot, ClaudeBot, PerplexityBot 등)별로 `allow`, `disallow`, `crawlDelay`를 세밀하게 제어할 수 있습니다.

---

다음: [테마와 타이포그래피](/posts/tutorial/ko/themes-and-typography) | [댓글과 검색](/posts/tutorial/ko/comments-and-search)
