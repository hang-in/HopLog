---
title: "검색"
date: "2026.03.12"
category: ["KO", "Guide", "Config"]
excerpt: "로컬 검색, Meilisearch 검색, 커맨드 팔레트 연동, 동기화, search-sync 사이드카 가이드."
---

HopLog는 커맨드 팔레트(`⌘⇧P` / `Ctrl+Shift+P`)에 내장된 검색을 제공하며, 로컬과 Meilisearch 두 가지 모드로 동작합니다.

## 로컬 검색 (기본값)

별도 서비스 없이 바로 동작합니다. 클라이언트에서 포스트 제목과 요약을 대상으로 퍼지 키워드 매칭으로 검색합니다.

```yaml
search:
  provider: "local"
```

기본값이므로 `config.yml`에 추가하지 않아도 됩니다.

## Meilisearch

포스트가 많거나 본문 전체를 검색해야 할 때 Meilisearch로 전환합니다. 제목, 카테고리, 요약, 본문 전체를 인덱싱합니다.

### 설정

```yaml
search:
  provider: "meilisearch"
  meilisearch:
    hostEnv: "MEILISEARCH_HOST"
    searchKeyEnv: "MEILISEARCH_SEARCH_KEY"
    adminKeyEnv: "MEILISEARCH_ADMIN_KEY"
    indexName: "posts"
    showRankingScore: true
```

config에는 환경변수 **이름**을 저장합니다. 실제 키 값은 환경변수로 설정합니다:

```bash
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_SEARCH_KEY=your-search-key
MEILISEARCH_ADMIN_KEY=your-admin-key
```

### 인덱싱 필드

| 필드     | 검색 가능 | 필터 가능 | 정렬 가능 | 표시 |
| -------- | --------- | --------- | --------- | ---- |
| title    | O         |           |           | O    |
| category | O         | O         |           | O    |
| excerpt  | O         |           |           | O    |
| content  | O         |           |           |      |
| date     |           |           | O         | O    |
| id       |           |           |           | O    |

### 랭킹 점수

`showRankingScore: true`로 설정하면 커맨드 팔레트의 검색 결과 옆에 관련성 점수가 표시됩니다. 특정 결과가 왜 나타났는지 이해하는 데 도움이 됩니다.

## Meilisearch에 포스트 동기화

검색하려면 포스트를 먼저 인덱싱해야 합니다. 두 가지 방법이 있습니다:

### 수동 동기화 (스크립트)

```bash
bun run search:sync
```

이 스크립트는:
- 인덱스가 없으면 생성 (멱등)
- 인덱스 설정 업데이트 (검색/필터/정렬 속성)
- 모든 공개 포스트를 upsert (인덱스 삭제 없음 — 무중단)
- 디스크에서 삭제된 포스트의 문서를 자동 제거

사이드카를 사용하지 않을 때, 포스트를 추가/수정/삭제한 후 실행하세요.

### 자동 동기화 (search-sync 사이드카)

Docker Compose로 배포할 때 `search` 프로필을 사용하면 Go 기반 사이드카가 실시간으로 파일 변경을 감시합니다:

```bash
docker compose --profile search up -d
```

사이드카 동작:
- fsnotify로 `content/posts/`를 재귀적으로 감시
- 빠른 편집을 묶기 위해 2초 디바운스
- 트리거마다 전체 동기화 실행 (upsert + 삭제된 문서 제거)
- 시작 시 Meilisearch가 준비될 때까지 최대 60초 대기
- 연결 직후 초기 전체 동기화 실행

로그는 `[search-sync]` 프리픽스로 출력됩니다:

```bash
docker compose logs -f search-sync
```

출력 예시:

```text
[search-sync] waiting for Meilisearch at http://meilisearch:7700...
[search-sync] Meilisearch is ready
[search-sync] starting full sync...
[search-sync] full sync done: 42 docs in 128ms
[search-sync] watching /app/content/posts for changes (debounce 2s)
```

### 비공개 포스트

`visibility: "private"` (또는 `public: false`)로 설정된 포스트는 두 가지 동기화 방법 모두에서 자동으로 검색 인덱스에서 제외됩니다.

## 폴백 동작

`provider`가 `"meilisearch"`로 설정되어 있지만 연결에 실패하면 (호스트 누락, 잘못된 키, 서버 미응답) HopLog는 자동으로 로컬 검색으로 폴백합니다. 본문 검색은 안 되지만 검색 기능 자체는 유지됩니다.

## Docker Compose로 빠른 설정

Meilisearch 검색을 가장 빠르게 시작하는 방법:

```bash
# 1. 관리자 키 설정
export MEILISEARCH_ADMIN_KEY=your-secure-key-at-least-16-bytes

# 2. 모든 서비스 시작
docker compose --profile search up -d

# 3. 포스트가 자동으로 동기화됨 — 검색 준비 완료
```

수동 동기화가 필요 없습니다. 사이드카가 모든 것을 처리합니다.

---

다음: [댓글과 FAQ](/posts/tutorial/ko/comments-and-search) | [SEO와 분석 도구](/posts/tutorial/ko/seo-and-analytics) | [배포](/posts/tutorial/ko/deployment)
