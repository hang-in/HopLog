---
title: "Deployment"
date: "2026.03.12"
category: ["EN", "Guide", "Engineering"]
excerpt: "Docker deployment, docker-compose setup, environment variables, build scripts, and Velog import."
---

## Local Build

```bash
bun run build
bun start
```

Built on Next.js 16 + Bun, so Vercel, Netlify, and self-hosting all work.

## Docker

### Standalone (Blog Only)

```bash
docker run -p 3000:3000 \
  -v $(pwd)/blog:/app/content \
  rapidrabbit76/hoplog:latest
```

Mount your `content/` directory to `/app/content` — posts, config, themes, and images all apply.

### Docker Compose

```bash
# Blog only
docker compose up -d

# With Meilisearch + auto sync
docker compose --profile search up -d
```

### Services

| Service      | Description             | Profile | Resources       |
| ------------ | ----------------------- | ------- | --------------- |
| app          | HopLog blog             | default | 1 CPU, 512MB    |
| meilisearch  | Full-text search engine | search  | 1 CPU, 512MB    |
| search-sync  | Auto-sync sidecar       | search  | 0.25 CPU, 128MB |

### Environment Variables

```bash
# Meilisearch (when using search profile)
MEILISEARCH_ADMIN_KEY=your-secure-key-at-least-16-bytes
MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_SEARCH_KEY=your-search-key

# Analytics (optional)
GA_MEASUREMENT_ID=G-XXXXXXXXXX
META_PIXEL_ID=1234567890
SENTRY_DSN=https://xxx@sentry.io/123
SENTRY_ENVIRONMENT=production
```

### search-sync Sidecar

The `search` profile runs a Go-based sidecar that:

- Watches `content/posts/` in real time (fsnotify)
- Debounces changes (2 seconds), then auto-syncs to Meilisearch
- Handles index creation, settings, document upsert, and stale document removal
- Waits up to 60 seconds for Meilisearch to become ready

Logs are prefixed with `[search-sync]`:

```bash
docker compose logs -f search-sync
```

## Multi-Architecture Builds

Build `linux/amd64` and `linux/arm64` images manually or via CI:

```bash
# App
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --push \
    -t your-registry/hoplog:latest \
    .

# Sidecar
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --push \
    -t your-registry/hoplog-search-sync:latest \
    ./sidecar/search-sync
```

GitHub Actions CI automatically builds on tag push or main branch push when configured.

## Useful Scripts

```bash
# Manual Meilisearch sync
bun run search:sync

# Import posts from Velog
bun run import:velog -- <username> [output-dir] [private|public]
```

### Velog Import

Fetches posts from the Velog GraphQL API and converts them to Markdown:

```bash
# Default (saves to content/posts/<username>/, marked as private)
bun run import:velog -- myvelogid

# Save to specific directory as public
bun run import:velog -- myvelogid content/posts/imported public
```

- Preserves original Velog URL, ID, tags, and metadata in frontmatter
- Dates auto-formatted to `YYYY.MM.DD`
- Creates `.json` backup files alongside each post

## Health Check

The app exposes `/api/health` (GET and HEAD). Docker Compose checks it every 30 seconds automatically.

## Pre-Deployment Checklist

- [ ] Set your profile in `content/profile.yml`
- [ ] Customize site title and hero text in `content/config.yml`
- [ ] Set `siteUrl` and OG image in `content/seo.yml`
- [ ] Mark draft posts with `visibility: "private"`
- [ ] Configure Meilisearch environment variables (if using search)
- [ ] Configure analytics environment variables (if using analytics)
