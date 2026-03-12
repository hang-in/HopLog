---
title: "댓글, 검색, FAQ"
date: "2026.03.12"
category: ["KO", "Guide", "Config"]
excerpt: "Giscus 댓글, 로컬/Meilisearch 검색, FAQ 기능 설정 가이드."
---

## 댓글 (Giscus)

GitHub Discussions 기반의 댓글 시스템입니다. `config.yml`에서 활성화합니다.

```yaml
comments:
  enabled: true
  giscus:
    repo: "owner/repo"                # GitHub 저장소
    repoId: "R_xxxxxxxxxxxx"          # GitHub GraphQL repo ID
    category: "Announcements"
    categoryId: "DIC_xxxxxxxxxxxx"    # GitHub GraphQL category ID
    mapping: "pathname"               # pathname | url | title | og:title | specific | number
    strict: false                     # 엄격한 제목 매칭
    reactionsEnabled: true            # 메인 포스트 리액션
    inputPosition: "top"              # top | bottom
    lang: ""                          # 빈 값이면 사이트 로케일과 동기화
```

### 설정 방법

1. [giscus.app](https://giscus.app)에서 저장소를 연결하고 `repoId`, `categoryId`를 확인합니다.
2. 위 값을 `config.yml`에 입력합니다.
3. `enabled: true`로 설정하면 모든 포스트 하단에 댓글이 표시됩니다.

`lang`을 비워두면 사용자가 선택한 UI 언어에 맞춰 Giscus 인터페이스 언어가 자동 전환됩니다.

## 검색

HopLog는 두 가지 검색 방식을 지원합니다.

### 로컬 검색 (기본값)

별도 설정 없이 동작합니다. 클라이언트에서 포스트 제목과 요약을 대상으로 검색합니다.

```yaml
search:
  provider: "local"
```

### Meilisearch

제목, 카테고리, 요약, 본문 전체를 대상으로 검색이 가능합니다.

```yaml
search:
  provider: "meilisearch"
  meilisearch:
    hostEnv: "MEILISEARCH_HOST"           # 환경변수 이름
    searchKeyEnv: "MEILISEARCH_SEARCH_KEY"
    adminKeyEnv: "MEILISEARCH_ADMIN_KEY"  # 동기화용
    indexName: "posts"
    showRankingScore: true                # 검색 결과에 랭킹 점수 표시
```

실제 키 값은 환경변수로 관리합니다:

```bash
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_SEARCH_KEY=your-search-key
MEILISEARCH_ADMIN_KEY=your-admin-key
```

### 포스트 동기화

Meilisearch에 포스트를 동기화하는 방법은 두 가지입니다:

**수동 동기화 (스크립트)**

```bash
bun run search:sync
```

인덱스를 삭제하지 않고 upsert 방식으로 동작하여 다운타임 없이 동기화합니다. 삭제된 포스트도 자동으로 제거됩니다.

**자동 동기화 (사이드카)**

Docker Compose로 배포할 때 `search` 프로필을 사용하면 `search-sync` 사이드카가 `content/posts/` 디렉토리를 감시하고 변경 시 자동으로 동기화합니다.

```bash
docker compose --profile search up -d
```

### 폴백

Meilisearch가 설정되어 있지만 연결할 수 없는 경우 자동으로 로컬 검색으로 폴백합니다.

## FAQ

`config.yml`에서 활성화하면 헤더와 커맨드 팔레트에 FAQ 링크가 표시됩니다.

```yaml
faq:
  enabled: true
```

FAQ 콘텐츠는 `content/faq/` 디렉토리에 로케일별 YAML 파일로 관리합니다:

```text
content/faq/
  en.yml
  ko.yml
  ja.yml
  zh.yml
```

### FAQ 파일 형식

```yaml
title: "자주 묻는 질문"
description: "HopLog에 대한 FAQ"
groups:
  - id: "general"
    title: "일반"
    items:
      - id: "what-is-hoplog"
        question: "HopLog란 무엇인가요?"
        answer: "개발자를 위한 Markdown 블로그입니다."
```

사용자의 로케일에 맞는 파일이 없으면 영어(`en.yml`)로 폴백합니다.

---

다음: [SEO와 분석 도구](/posts/tutorial/ko/seo-and-analytics) | [배포](/posts/tutorial/ko/deployment)
