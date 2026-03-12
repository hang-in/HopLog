---
title: "Site Configuration"
date: "2026.03.12"
category: ["EN", "Guide", "Config"]
excerpt: "Configure your entire site with three YAML files: config.yml, profile.yml, and seo.yml."
---

HopLog splits configuration across three focused YAML files.

## config.yml — Site Metadata

```yaml
site:
  title: "HopLog"
  description: "A developer-friendly blog"
  titleTemplate: "%s | HopLog"      # Browser tab title format

faq:
  enabled: true                      # Show FAQ page in header & command palette

performance:
  postsCacheTtlSeconds: 60           # Posts cache TTL (production only)

theme:
  default: "darcula"                 # Default color theme ID (must match a theme file in content/themes/)

hero:
  title: 'A simple blog<br />for <span class="text-primary">developers</span>'
  description: "Write technical posts in Markdown."
  background:
    image: "/api/images/hero-bg.webp"
    opacity: 0.12

typography:
  lineHeight: 1.75
  fontFamily: ""                     # Global font (empty = system default Geist)
  fontUrl: ""                        # Google Fonts URL
```

`theme.default` sets the color theme for first-time visitors. It must match the `id` field of a YAML file in `content/themes/`. Once a user picks a different theme from the Command Palette, their choice is stored in localStorage and takes priority on subsequent visits.

## profile.yml — Profile and About Page

```yaml
profile:
  name: "Your Name"
  role: "Software Engineer"
  email: "your@email.com"
  github: "https://github.com/yourgithub"
  githubUsername: "yourgithub"       # Powers the GitHub Activity Grid
  bio: "A short introduction."

social:
  - platform: "LinkedIn"
    url: "https://linkedin.com/in/yourprofile"
  - platform: "Github"
    url: "https://github.com/yourgithub"

experience:
  - company: "Company Name"
    position: "Backend Engineer"
    period: "2024.01 - Present"
    description: "Working on distributed systems."

skills:
  - "TypeScript"
  - "Go"
  - "Docker"
```

- Setting `githubUsername` displays a GitHub contribution Activity Grid on the About page.
- Each `social` entry renders as a badge on the About page.

## seo.yml — Search Engine Optimization

```yaml
siteUrl: "https://yourblog.com"
host: "https://yourblog.com"        # optional (if different from siteUrl)
language: "ko-KR"
keywords:
  - "blog"
  - "developer"

robots:
  policy: "index, follow"
  rules:                             # Per-crawler access control
    - userAgent: "GPTBot"
      allow: "/"
    - userAgent: "ClaudeBot"
      allow: "/"
    - userAgent: "Googlebot"
      allow: "/"

openGraph:
  type: "website"
  siteName: "HopLog"
  title: "HopLog"
  description: "A developer blog"
  image: "/og-image.png"
  imageWidth: 1200
  imageHeight: 630

twitter:
  card: "summary_large_image"
  site: "@yourhandle"
  creator: "@yourhandle"
  image: "/og-image.png"
```

You can control access per AI crawler (GPTBot, ClaudeBot, PerplexityBot, etc.) with `allow`, `disallow`, and `crawlDelay`.

---

Next: [Themes & Typography](/posts/tutorial/themes-and-typography) | [Comments & Search](/posts/tutorial/comments-and-search)
