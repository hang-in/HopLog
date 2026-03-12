---
title: "Search"
date: "2026.03.12"
category: ["EN", "Guide", "Config"]
excerpt: "Local search, Meilisearch full-text search, Command Palette integration, syncing, and the search-sync sidecar."
---

HopLog ships with a built-in Command Palette search (`⌘⇧P` / `Ctrl+Shift+P`) that works in two modes: local or Meilisearch.

## Local Search (Default)

Works out of the box. No external service needed. Searches post titles and excerpts on the client side with fuzzy keyword matching.

```yaml
search:
  provider: "local"
```

This is the default — you don't even need to add this to `config.yml`.

## Meilisearch (Full-Text Search)

For larger blogs or when you need to search the full body content, switch to Meilisearch. It indexes title, category, excerpt, and the entire post body.

### Configuration

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

The config stores environment variable **names**, not the values themselves. Set the actual keys in your environment:

```bash
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_SEARCH_KEY=your-search-key
MEILISEARCH_ADMIN_KEY=your-admin-key
```

### Indexed Fields

| Field      | Searchable | Filterable | Sortable | Displayed |
| ---------- | ---------- | ---------- | -------- | --------- |
| title      | yes        | no         | no       | yes       |
| category   | yes        | yes        | no       | yes       |
| excerpt    | yes        | no         | no       | yes       |
| content    | yes        | no         | no       | no        |
| date       | no         | no         | yes      | yes       |
| id         | no         | no         | no       | yes       |

### Ranking Score

When `showRankingScore: true`, search results in the Command Palette display a relevance score next to each result. This helps users understand why a particular result appeared.

## Syncing Posts to Meilisearch

Posts need to be indexed before they can be searched. Two methods are available:

### Manual Sync (Script)

```bash
bun run search:sync
```

This script:
- Creates the index if it doesn't exist (idempotent)
- Updates index settings (searchable, filterable, sortable attributes)
- Upserts all public posts (no index drop — zero downtime)
- Removes stale documents that no longer exist on disk

Run this after adding, editing, or deleting posts when not using the sidecar.

### Auto Sync (search-sync Sidecar)

When deploying with Docker Compose, the `search` profile includes a Go-based sidecar that watches for file changes in real time:

```bash
docker compose --profile search up -d
```

The sidecar:
- Watches `content/posts/` recursively using fsnotify
- Debounces changes (2 seconds) to batch rapid edits
- Runs a full sync on each trigger (upsert + stale removal)
- Waits up to 60 seconds for Meilisearch to become ready on startup
- Runs an initial full sync immediately after connecting

Logs are prefixed with `[search-sync]`:

```bash
docker compose logs -f search-sync
```

Example output:

```text
[search-sync] waiting for Meilisearch at http://meilisearch:7700...
[search-sync] Meilisearch is ready
[search-sync] starting full sync...
[search-sync] full sync done: 42 docs in 128ms
[search-sync] watching /app/content/posts for changes (debounce 2s)
```

### Private Posts

Posts with `visibility: "private"` (or `public: false`) are automatically excluded from the search index in both sync methods.

## Fallback Behavior

If `provider` is set to `"meilisearch"` but the connection fails (missing host, invalid key, or unreachable server), HopLog automatically falls back to local search. Users still get search functionality — just without full-text body search.

## Quick Setup with Docker Compose

The fastest way to get full-text search running:

```bash
# 1. Set your admin key
export MEILISEARCH_ADMIN_KEY=your-secure-key-at-least-16-bytes

# 2. Start all services
docker compose --profile search up -d

# 3. Posts are automatically synced — search is ready
```

No manual sync needed. The sidecar handles everything.

---

Next: [Comments & FAQ](/posts/tutorial/comments-and-search) | [SEO & Analytics](/posts/tutorial/seo-and-analytics) | [Deployment](/posts/tutorial/deployment)
