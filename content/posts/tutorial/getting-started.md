---
title: "Getting Started with HopLog"
date: "2026.03.11"
category: ["Guide", "HopLog"]
excerpt: "Learn how to set up your professional engineering workspace and write your first markdown post."
---

# Welcome to HopLog

HopLog is a developer-friendly blog built to make writing and publishing feel simple. This guide walks through the core pieces you will touch first.

## 1. Project Philosophy
HopLog follows the **"Function as Design"** principle. We prioritize:
- **Essence Over Decoration**: Neutral colors with a 2% primary accent.
- **Developer Experience**: Keyboard-centric navigation and ultra-fast runtimes (Bun + Next.js).
- **Flexibility**: Content storage separated from the core logic.

## 2. Writing Your First Post
Simply create a `.md` file anywhere under `content/posts/`. HopLog scans this directory recursively, so nested paths like `content/posts/tutorial/getting-started.md` are supported and become `/posts/tutorial/getting-started`.

Use the `Frontmatter` block at the top to define your post metadata:

```yaml
---
title: "Your Post Title"
date: "2026.03.11"
category: ["Dev", "Tech"]
excerpt: "A short summary of your content."
image: "/api/images/your-image.jpg"        # optional: card thumbnail & hover background
fontFamily: "'Noto Sans KR', sans-serif"   # optional: override global body font
fontUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap" # optional
visibility: "private"                      # optional: hide this post from routes, metadata, and sitemap
seo:                                       # optional: per-post SEO overrides
  title: "Custom SEO Title"                # overrides post title for meta tag
  description: "Custom meta description"   # overrides excerpt for meta tag
  keywords: ["keyword1", "keyword2"]       # post-specific keywords
  ogTitle: "Custom OG Title"               # OpenGraph title override
  ogDescription: "Custom OG description"   # OpenGraph description override
  ogImage: "/api/images/og-cover.jpg"      # OpenGraph image override
  ogImageWidth: 1200
  ogImageHeight: 630
  twitterCard: "summary_large_image"       # Twitter card type override
  twitterTitle: "Custom Twitter Title"
  twitterDescription: "Custom Twitter desc"
  twitterImage: "/api/images/twitter.jpg"  # Twitter image override
  canonical: "https://example.com/original" # canonical URL override
  noindex: false                           # set true to prevent search engine indexing
---
```

If a post should stay hidden, use `visibility: "private"`. `public: false` is still supported for compatibility, but `visibility` is the recommended format. Private posts are treated as if they do not exist: they are excluded from lists, static routes, sitemap metadata, and direct URL access.

### SEO Priority Rules
Per-post SEO fields always take priority over the global `seo.yml` configuration. When a field is not specified in the post frontmatter, HopLog falls back to the global defaults. The priority chain is:

1. **`seo.*` fields** in the post frontmatter (highest priority)
2. **`image`** field — if a post has a thumbnail image, it is automatically used as the OG and Twitter image
3. **Global `seo.yml`** configuration (lowest priority)

## 3. Translating the UI
UI text is stored in external locale files at the project root:

- `messages/en.json`
- `messages/ko.json`
- `messages/ja.json`
- `messages/zh.json`

Each file shares the same nested structure, so contributors can update translations without editing application code.

## 4. Dynamic Hotkeys
Try pressing these keys right now:
- <kbd>?</kbd> : Open shortcut help
- <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>P</kbd> : Open Command Palette
- <kbd>T</kbd> : Toggle Dark/Light mode

Next steps:

- [Site Configuration](/posts/tutorial/site-configuration)
- [Advanced Features](/posts/tutorial/advanced-features)
- [Custom Fonts](/posts/tutorial/custom-fonts)
