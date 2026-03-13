---
title: "Comments, Search, and FAQ"
date: "2026.03.12"
category: ["EN", "Guide", "Config"]
excerpt: "Set up Giscus comments, local or Meilisearch full-text search, and the FAQ page."
---

# Comments, Search, and FAQ

## 1. Comments (Giscus)

HopLog supports GitHub Discussions-based comments via Giscus. Enable it in `config.yml`:

```yaml
comments:
  enabled: true
  giscus:
    repo: "owner/repo"                # GitHub repository
    repoId: "R_xxxxxxxxxxxx"          # GitHub GraphQL repo ID
    category: "Announcements"
    categoryId: "DIC_xxxxxxxxxxxx"    # GitHub GraphQL category ID
    mapping: "pathname"               # pathname | url | title | og:title | specific | number
    strict: false                     # Strict title matching
    reactionsEnabled: true            # Show reactions on main post
    inputPosition: "top"              # top | bottom
    lang: ""                          # Empty = uses persisted locale when available, otherwise "en"
```

### Setup

1. Visit [giscus.app](https://giscus.app) to connect your repository and get `repoId` and `categoryId`.
2. Fill in the values in `config.yml`.
3. Set `enabled: true` — comments appear at the bottom of every post.

For predictable behavior, set `lang` explicitly. If you leave it empty, Giscus uses HopLog's persisted locale value when available and otherwise falls back to English.

## 2. Search

HopLog supports two search backends. This repository's sample `content/config.yml` is already wired for Meilisearch, but runtime still falls back to local search until the required host/key env vars are present.

### Local Search (Built-In Fallback)

Works out of the box with no extra service. Searches post titles and excerpts on the client side.

```yaml
search:
  provider: "local"
```

### Meilisearch (Full-Text Search)

Searches across title, category, excerpt, and the full body content.

```yaml
search:
  provider: "meilisearch"
  meilisearch:
    hostEnv: "MEILISEARCH_HOST"           # Environment variable names
    searchKeyEnv: "MEILISEARCH_SEARCH_KEY"
    adminKeyEnv: "MEILISEARCH_ADMIN_KEY"  # Used for sync
    indexName: "posts"
    showRankingScore: true                # Display ranking scores in results
```

Set the actual values as environment variables:

```bash
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_SEARCH_KEY=your-search-key
MEILISEARCH_ADMIN_KEY=your-admin-key
```

### Syncing Posts

Two ways to sync posts to Meilisearch:

**Manual sync (script)**

```bash
bun run search:sync
```

Uses upsert (no index drop) for zero-downtime updates. Stale documents are automatically removed.

**Auto sync (sidecar)**

When deploying with Docker Compose using the `search` profile, the `search-sync` sidecar watches `content/posts/` and auto-syncs changes to Meilisearch with a 2-second debounce.

```bash
docker compose --profile search up -d
```

### Fallback

If Meilisearch is configured but unreachable, search automatically falls back to local mode.

## 3. FAQ

Enable the FAQ page in `config.yml` — this adds a link in the header and Command Palette:

```yaml
faq:
  enabled: true
```

FAQ content is managed as per-locale YAML files in `content/faq/`:

```
content/faq/
  en.yml
  ko.yml
  ja.yml
  zh.yml
```

### FAQ File Format

```yaml
title: "Frequently Asked Questions"
description: "FAQ about HopLog"
groups:
  - id: "general"
    title: "General"
    items:
      - id: "what-is-hoplog"
        question: "What is HopLog?"
        answer: "A Markdown-based blog for developers."
```

Falls back to English (`en.yml`) if the user's locale file doesn't exist.

---

Next: [SEO & Analytics](/posts/tutorial/seo-and-analytics) | [Deployment](/posts/tutorial/deployment)
