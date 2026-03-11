---
title: "Centralized Site Configuration"
date: "2026.03.11"
category: ["Guide", "Config"]
excerpt: "Master HopLog's configuration files, translation messages, and metadata behavior."
---

# Site Configuration Guide

HopLog uses a small set of focused configuration sources instead of one giant settings file:

- `content/config.yml` for site metadata, hero content, and typography
- `content/profile.yml` for your profile, social links, and professional experience
- `content/themes/*.yml` for color themes
- `messages/*.json` for UI translations

## 1. Profile & Bio (`profile.yml`)
Your personal information is managed in `content/profile.yml`. This data appears in the **About** page and the site's footer.

```yaml
profile:
  name: "Your Name"
  role: "Software Engineer"
  email: "your@email.com"
  githubUsername: "yourgithub"
  bio: "A short introduction to your blog and the kind of posts you publish."
```

## 2. Site Metadata & Header (`config.yml`)
The `site` section defines how search engines see your blog and how the header displays your name.

- **title**: The main name shown in the Header.
- **titleTemplate**: The format for browser tab titles (e.g., `%s | Blog`).
- **description**: SEO meta description.

Route-level metadata can still override the tab title. For example, the About page and individual post pages now set their own titles automatically.

```yaml
site:
  title: "HopLog"
  description: "A developer-friendly blog for writing and publishing technical posts."
  titleTemplate: "%s | My Records"
```

## 3. Social Link Badges
Adding a new social link is as easy as adding a new item to the `social` list in `profile.yml`. They will automatically appear as elegant badges on the About page.

```yaml
social:
  - platform: "LinkedIn"
    url: "https://linkedin.com/in/yourprofile"
  - platform: "Github"
    url: "https://github.com/yourgithub"
```

## 4. Professional Experience & Skills
The **About** page dynamically renders your career history and technical stack from `profile.yml`. Use these to showcase your professional journey without touching any code.

## 5. Analytics & Monitoring Providers
HopLog can enable Google Analytics, Meta Pixel, and Sentry from `content/config.yml`.

```yaml
analytics:
  enabled: false
  ga:
    enabled: false
    measurementIdEnv: "GA_MEASUREMENT_ID"
  metaPixel:
    enabled: false
    pixelIdEnv: "META_PIXEL_ID"
  sentry:
    enabled: false
    dsnEnv: "SENTRY_DSN"
```

Each provider can be disabled independently. The config file controls whether a provider is active, while the actual IDs and DSN values stay in environment variables.

## 6. UI Translations (`messages/*.json`)
HopLog keeps interface strings in external locale files using a contributor-friendly structure:

```text
messages/
  en.json
  ko.json
  ja.json
  zh.json
```

Each file mirrors the same nested key structure (`header`, `postList`, `error`, and so on), which makes translation work straightforward in pull requests.

## 7. Theme Definitions (`content/themes/*.yml`)
Each theme lives in its own YAML file under `content/themes/`.

```text
content/themes/
  default.yml
  dracula.yml
  nord.yml
```

This keeps visual themes decoupled from site metadata and easier to review independently.

---

By mastering `config.yml` and `profile.yml`, you've completed the core HopLog configuration. You're now ready to shape the blog around your own writing workflow.
