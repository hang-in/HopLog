---
title: "Getting Started with HopLog"
date: "2026.03.11"
category: ["Guide", "HopLog"]
excerpt: "Learn how to set up your professional engineering workspace and write your first markdown post."
---

# Welcome to HopLog

HopLog is more than just a blog—it's a high-performance **workspace for engineers**. This guide will walk you through the core features of the system.

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
---
```

If a post should stay hidden, use either `visibility: "private"` or `public: false`. Private posts are treated as if they do not exist: they are excluded from lists, static routes, sitemap metadata, and direct URL access.

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

Proceed to the next step to learn about advanced typography and image management.
