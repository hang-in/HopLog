---
title: "SEO and Analytics"
date: "2026.03.12"
category: ["EN", "Guide", "Config"]
excerpt: "Global and per-post SEO configuration, robots crawler control, Google Analytics, Meta Pixel, and Sentry."
---

# SEO and Analytics

## 1. Global SEO (seo.yml)

`content/seo.yml` manages site-wide SEO including OpenGraph, Twitter Cards, and robots policy.

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

## 2. Per-Post SEO Overrides

Override global SEO settings in any post's frontmatter:

```yaml
---
title: "My Post"
date: "2026.03.12"
category: ["EN", "Dev"]
image: "/api/images/my-post.jpg"
seo:
  title: "Custom SEO Title"
  description: "Custom meta description"
  keywords: ["custom", "keywords"]
  ogTitle: "Custom OG Title"
  ogDescription: "Custom OG Description"
  ogImage: "/api/images/og-custom.jpg"
  ogImageWidth: 1200
  ogImageHeight: 630
  twitterCard: "summary_large_image"
  twitterTitle: "Custom Twitter Title"
  twitterDescription: "Custom Twitter Description"
  twitterImage: "/api/images/twitter-custom.jpg"
  canonical: "https://example.com/original-post"
  noindex: false
---
```

### Priority Chain

1. `seo.*` frontmatter fields (highest)
2. `image` frontmatter field (auto-used as OG/Twitter image)
3. Global `seo.yml` settings (fallback)

Setting `noindex: true` prevents search engines from indexing the post while keeping it publicly accessible. To hide a post entirely, use `visibility: "private"` instead.

## 3. Robots Crawler Control

Use `robots.rules` in `seo.yml` for fine-grained per-crawler access:

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

Each rule supports any combination of `allow`, `disallow`, and `crawlDelay`.

## 4. Analytics

Configure three analytics providers independently in `config.yml`. Actual keys are managed as environment variables.

```yaml
analytics:
  enabled: true           # Master toggle
  debug: false            # Debug mode

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
    tracesSampleRate: 1   # 0-1 (sampling rate)
```

### Environment Variables

```bash
GA_MEASUREMENT_ID=G-XXXXXXXXXX
META_PIXEL_ID=1234567890
SENTRY_DSN=https://xxx@sentry.io/123
SENTRY_ENVIRONMENT=production
```

Setting `analytics.enabled: false` disables all providers regardless of their individual settings.

---

Next: [Deployment](/posts/tutorial/deployment)
