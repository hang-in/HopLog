---
title: "테마와 타이포그래피"
date: "2026.03.12"
category: ["KO", "Guide", "Design"]
excerpt: "컬러 테마 시스템, 기본 테마 설정, 커스텀 폰트 설정을 다룹니다."
---

## 컬러 테마 시스템

`content/themes/` 디렉토리에 YAML 파일을 추가하면 자동으로 커맨드 팔레트에 등록됩니다. 코드 수정이 필요 없습니다.

### 기본 제공 테마

```text
content/themes/
  default.yml        # Default Blue
  dracula.yml        # Dracula
  everforest.yml     # Everforest
  nord.yml           # Nord
  liquid-glass.yml   # Liquid Glass
```

### 테마 파일 형식

```yaml
id: "my-theme"
name: "My Theme"
light:
  background: "#ffffff"
  foreground: "#191f28"
  card: "#ffffff"
  card-foreground: "#191f28"
  muted: "#f2f4f6"
  muted-foreground: "#8b95a1"
  border: "#e5e8eb"
  primary: "#3182f6"
  primary-foreground: "#ffffff"
dark:
  background: "#000000"
  foreground: "#f9fafb"
  card: "#131518"
  card-foreground: "#f9fafb"
  muted: "#1e2024"
  muted-foreground: "#8b95a1"
  border: "#222428"
  primary: "#3182f6"
  primary-foreground: "#ffffff"
```

`light`와 `dark`는 각각 라이트/다크 모드에 적용되는 색상입니다. Activity Grid 레벨 색상(`activity-0` ~ `activity-4`)은 `primary` 색상에서 자동 생성되므로 별도 정의가 필요 없습니다.

### 기본 테마 설정

`config.yml`에서 처음 방문하는 사용자에게 적용할 기본 테마를 지정할 수 있습니다:

```yaml
theme:
  default: "dracula"    # content/themes/dracula.yml의 id 값
```

사용자가 커맨드 팔레트(`⌘⇧P`)에서 테마를 변경하면 localStorage에 저장되어 이후 방문부터는 사용자 선택이 우선합니다.

### 테마 전환

- 커맨드 팔레트에서 테마 이름으로 검색하여 즉시 전환
- `T` 키로 라이트/다크 모드 전환 (View Transition 애니메이션 적용)

## 커스텀 폰트

폰트는 **전역**과 **포스트별** 두 단계로 설정할 수 있습니다.

### 전역 설정 (config.yml)

```yaml
typography:
  lineHeight: 1.75
  fontFamily: "'Noto Sans KR', sans-serif"
  fontUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap"
```

### 포스트별 오버라이드 (프론트매터)

```yaml
---
title: "My Post"
date: "2026.03.12"
category: ["KO", "Guide"]
fontFamily: "'Lora', serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap"
---
```

### 우선순위

1. 포스트 프론트매터 `fontFamily` / `fontUrl` (최우선)
2. `config.yml`의 `typography` 설정
3. 시스템 기본 폰트 (Geist)

`fontFamily`만 지정하고 `fontUrl`을 생략하면 시스템에 설치된 폰트를 사용합니다.

## 추천 폰트

### 한국어

| 폰트             | 분류 | fontFamily                          |
| ---------------- | ---- | ----------------------------------- |
| Noto Sans KR     | 고딕 | `'Noto Sans KR', sans-serif`        |
| Noto Serif KR    | 명조 | `'Noto Serif KR', serif`            |
| IBM Plex Sans KR | 고딕 | `'IBM Plex Sans KR', sans-serif`    |
| Nanum Gothic     | 고딕 | `'Nanum Gothic', sans-serif`        |
| Nanum Myeongjo   | 명조 | `'Nanum Myeongjo', serif`           |
| Gowun Batang     | 명조 | `'Gowun Batang', serif`             |

### 영문

| 폰트             | 분류  | fontFamily                          |
| ---------------- | ----- | ----------------------------------- |
| Inter            | Sans  | `'Inter', sans-serif`               |
| DM Sans          | Sans  | `'DM Sans', sans-serif`             |
| Lora             | Serif | `'Lora', serif`                     |
| Merriweather     | Serif | `'Merriweather', serif`             |
| Playfair Display | Serif | `'Playfair Display', serif`         |

Google Fonts URL 형식: `https://fonts.googleapis.com/css2?family=Font+Name:wght@400;700&display=swap`

---

다음: [댓글과 검색](/posts/tutorial/ko/comments-and-search) | [SEO와 분석 도구](/posts/tutorial/ko/seo-and-analytics)
