---
title: "배포"
date: "2026.03.12"
category: ["KO", "Guide", "Engineering"]
excerpt: "Docker 배포, docker-compose 구성, 환경변수, 빌드 스크립트, Velog 가져오기를 다룹니다."
---

## 로컬 빌드

```bash
bun run build
bun start
```

Next.js 16 + Bun 기반이므로 Vercel, Netlify, 자체 호스팅 모두 가능합니다.

## Docker

### 단독 실행 (블로그만)

```bash
docker run -p 3000:3000 \
  -v $(pwd)/blog:/app/content \
  rapidrabbit76/hoplog:latest
```

`/app/content`에 `content/` 디렉토리를 마운트하면 포스트, 설정, 테마, 이미지가 모두 적용됩니다.

### Docker Compose

```bash
# 블로그만 실행
docker compose up -d

# Meilisearch + 자동 동기화 포함
docker compose --profile search up -d
```

### 서비스 구성

| 서비스       | 설명                    | 프로필  | 리소스          |
| ------------ | ----------------------- | ------- | --------------- |
| app          | HopLog 블로그           | 기본    | 1 CPU, 512MB    |
| meilisearch  | 검색 엔진               | search  | 1 CPU, 512MB    |
| search-sync  | 포스트 자동 동기화      | search  | 0.25 CPU, 128MB |

### 환경변수

```bash
# Meilisearch (search 프로필 사용 시)
MEILISEARCH_ADMIN_KEY=your-secure-key-at-least-16-bytes
MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_SEARCH_KEY=your-search-key

# Analytics (선택)
GA_MEASUREMENT_ID=G-XXXXXXXXXX
META_PIXEL_ID=1234567890
SENTRY_DSN=https://xxx@sentry.io/123
SENTRY_ENVIRONMENT=production
```

### search-sync 사이드카

`search` 프로필을 사용하면 Go 기반 사이드카가 함께 실행됩니다:

- `content/posts/` 디렉토리를 실시간 감시 (fsnotify)
- Markdown 파일 변경 시 디바운스(2초) 후 Meilisearch에 자동 동기화
- 인덱스 생성, 설정 업데이트, 문서 upsert, 삭제된 포스트 제거를 자동 처리
- Meilisearch가 준비될 때까지 최대 60초 대기

로그는 `[search-sync]` 프리픽스로 출력됩니다:

```bash
docker compose logs -f search-sync
```

## 멀티 아키텍처 빌드

CI/CD 또는 수동으로 `linux/amd64`, `linux/arm64` 이미지를 빌드할 수 있습니다:

```bash
# 앱
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --push \
    -t your-registry/hoplog:latest \
    .

# 사이드카
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --push \
    -t your-registry/hoplog-search-sync:latest \
    ./sidecar/search-sync
```

GitHub Actions CI가 설정되어 있다면 태그 푸시 또는 main 브랜치 푸시 시 자동으로 빌드됩니다.

## 유용한 스크립트

```bash
# Meilisearch 수동 동기화
bun run search:sync

# Velog 포스트 가져오기
bun run import:velog -- <username> [output-dir] [private|public]
```

### Velog 가져오기

Velog GraphQL API를 통해 포스트를 Markdown으로 가져옵니다:

```bash
# 기본 (content/posts/<username>/ 에 저장, private으로 표시)
bun run import:velog -- myvelogid

# 특정 디렉토리에 public으로 저장
bun run import:velog -- myvelogid content/posts/imported public
```

- 프론트매터에 원본 Velog URL, ID, 태그 등 메타데이터 보존
- 날짜는 `YYYY.MM.DD` 형식으로 자동 변환
- `.json` 백업 파일도 함께 생성

## 헬스 체크

앱 서비스는 `/api/health` 엔드포인트로 헬스 체크를 수행합니다 (GET, HEAD 지원). Docker Compose에서 자동으로 30초 간격으로 확인합니다.

## 배포 전 체크리스트

- [ ] `content/profile.yml`에 프로필 정보 설정
- [ ] `content/config.yml`에서 사이트 제목, 히어로 텍스트 수정
- [ ] `content/seo.yml`에서 `siteUrl`, OG 이미지 설정
- [ ] 비공개 포스트에 `visibility: "private"` 확인
- [ ] Meilisearch 사용 시 환경변수 설정
- [ ] Analytics 사용 시 환경변수 설정
