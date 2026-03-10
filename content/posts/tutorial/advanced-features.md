---
title: "Mastering Markdown Features"
date: "2026.03.10"
category: ["Guide", "Typography"]
excerpt: "Explore the advanced markdown capabilities of HopLog, including code copying, ToC, and secure image serving."
image: "/api/images/hero-bg.jpg"
---

# Deep Dive into Typography

HopLog uses **Tailwind Typography** combined with custom components to deliver a superior reading experience for technical content.

## 1. Professional Code Blocks
HopLog handles code snippets with extra care. Hover over the block below to see the **Instant Copy** button.

```typescript
// HopLog automatically injects a copy button to every pre block
export function greet(name: string) {
  return `Welcome to the future of blogging, ${name}.`;
}
```

## 2. Table of Contents (ToC)
On large screens, look at the right sidebar. HopLog automatically generates a **Sticky ToC** based on your headings (`h1`, `h2`, `h3`). It also highlights your current position as you scroll.

## 3. Secure Image Serving
Images are served through a dedicated API route. Place your images in `content/images/` and reference them using the `/api/images/` path.

![Sample Infrastructure](/api/images/hero-bg.jpg)

This architecture allows you to keep your data folder outside the `public` directory for better security and organization.

## 4. Private Posts
HopLog also supports hidden posts through frontmatter:

```yaml
visibility: "private"
```

Private posts are excluded from index pages, route generation, sitemap metadata, and direct public access, which makes them useful for drafts or internal notes.
