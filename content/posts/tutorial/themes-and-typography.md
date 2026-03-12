---
title: "Themes and Typography"
date: "2026.03.12"
category: ["EN", "Guide", "Design"]
excerpt: "Color theme system, default theme configuration, and custom font setup."
---

# Themes and Typography

## 1. Color Theme System

Drop a YAML file into `content/themes/` and it automatically appears in the Command Palette. No code changes needed.

### Built-in Themes

```
content/themes/
  default.yml        # Default Blue
  dracula.yml        # Dracula
  everforest.yml     # Everforest
  nord.yml           # Nord
  liquid-glass.yml   # Liquid Glass
```

### Theme File Format

```yaml
id: "my-theme"
name: "My Theme"
light:
  background: "#ffffff"
  foreground: "#191f28"
  card: "#ffffff"
  card-foreground: "#191f28"
  muted: "#f2f4f6"
  muted-foreground: "#8b95a1"
  border: "#e5e8eb"
  primary: "#3182f6"
  primary-foreground: "#ffffff"
dark:
  background: "#000000"
  foreground: "#f9fafb"
  card: "#131518"
  card-foreground: "#f9fafb"
  muted: "#1e2024"
  muted-foreground: "#8b95a1"
  border: "#222428"
  primary: "#3182f6"
  primary-foreground: "#ffffff"
```

`light` and `dark` define colors for each mode. Activity Grid level colors (`activity-0` through `activity-4`) are auto-generated from `primary`, so you don't need to define them.

### Default Theme

Set the default color theme for first-time visitors in `config.yml`:

```yaml
theme:
  default: "dracula"    # matches the id field in content/themes/dracula.yml
```

Once a user picks a theme from the Command Palette (`⌘⇧P`), their choice is stored in localStorage and takes priority on all future visits.

### Switching Themes

- Search for a theme name in the Command Palette to switch instantly
- Press `T` to toggle dark/light mode (with View Transition animation)

## 2. Custom Fonts

Fonts can be configured at two levels: **global** and **per-post**.

### Global (config.yml)

```yaml
typography:
  lineHeight: 1.75
  fontFamily: "'Noto Sans KR', sans-serif"
  fontUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap"
```

### Per-Post (Frontmatter)

```yaml
---
title: "My Post"
date: "2026.03.12"
category: ["EN", "Guide"]
fontFamily: "'Lora', serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap"
---
```

### Priority

1. Post frontmatter `fontFamily` / `fontUrl` (highest)
2. Global `config.yml` typography settings
3. System default (Geist)

If you set `fontFamily` without `fontUrl`, the browser uses the font only if it's installed locally.

## 3. Recommended Fonts

### Korean

| Font | Type | fontFamily |
|------|------|-----------|
| Noto Sans KR | Sans | `'Noto Sans KR', sans-serif` |
| Noto Serif KR | Serif | `'Noto Serif KR', serif` |
| IBM Plex Sans KR | Sans | `'IBM Plex Sans KR', sans-serif` |
| Nanum Gothic | Sans | `'Nanum Gothic', sans-serif` |
| Nanum Myeongjo | Serif | `'Nanum Myeongjo', serif` |
| Gowun Batang | Serif | `'Gowun Batang', serif` |

### English

| Font | Type | fontFamily |
|------|------|-----------|
| Inter | Sans | `'Inter', sans-serif` |
| DM Sans | Sans | `'DM Sans', sans-serif` |
| Lora | Serif | `'Lora', serif` |
| Merriweather | Serif | `'Merriweather', serif` |
| Playfair Display | Serif | `'Playfair Display', serif` |

Google Fonts URL format: `https://fonts.googleapis.com/css2?family=Font+Name:wght@400;700&display=swap`

---

Next: [Comments & Search](/posts/tutorial/comments-and-search) | [SEO & Analytics](/posts/tutorial/seo-and-analytics)
