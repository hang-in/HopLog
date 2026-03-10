---
title: "Custom Fonts in HopLog"
date: "2026.03.10"
category: ["Guide", "Typography"]
excerpt: "Configure custom fonts globally or per-post using Google Fonts. A complete reference of 22 verified fonts with copy-paste URLs."
fontFamily: "'Noto Serif KR', serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap"
---

# Custom Fonts

HopLog supports custom fonts at two levels: **global** (via `config.yml`) and **per-post** (via frontmatter). Per-post settings always take priority over global settings.

> This post itself uses **Noto Serif KR** as a per-post font override. Notice the serif typeface.

## Configuration

### Global (config.yml)

Set a default font for all post bodies:

```yaml
typography:
  lineHeight: 1.75
  fontFamily: "'Noto Sans KR', sans-serif"
  fontUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap"
```

### Per-Post (Frontmatter)

Override the global font for a specific post:

```yaml
---
title: "My Post"
date: "2026.03.10"
category: ["Guide"]
excerpt: "A post with a custom font."
fontFamily: "'Lora', serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap"
visibility: "public"
---
```

### Priority

1. Post frontmatter `fontFamily` / `fontUrl`
2. Global `config.yml` typography settings
3. Default system font (Geist)

If only `fontFamily` is set (no `fontUrl`), the browser will use the font if it's already installed on the system.

---

## Font Reference

All URLs below are verified against Google Fonts API.

### Korean Fonts

These fonts support both Korean and Latin characters.

#### Noto Sans KR — Sans-serif

Clean, neutral sans-serif. The most widely used Korean web font.

```yaml
fontFamily: "'Noto Sans KR', sans-serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap"
```

#### Noto Serif KR — Serif

Elegant serif for long-form reading. Pairs well with Noto Sans KR.

```yaml
fontFamily: "'Noto Serif KR', serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap"
```

#### IBM Plex Sans KR — Sans-serif

IBM's corporate typeface with Korean support. Technical and precise.

```yaml
fontFamily: "'IBM Plex Sans KR', sans-serif"
fontUrl: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;700&display=swap"
```

#### Gothic A1 — Sans-serif

Modern geometric sans-serif. Good for UI-heavy content.

```yaml
fontFamily: "'Gothic A1', sans-serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Gothic+A1:wght@400;700&display=swap"
```

#### Nanum Gothic — Sans-serif

Classic Korean sans-serif by Naver. Familiar and readable.

```yaml
fontFamily: "'Nanum Gothic', sans-serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700&display=swap"
```

#### Nanum Myeongjo — Serif

Traditional Korean serif. Ideal for literary or editorial content.

```yaml
fontFamily: "'Nanum Myeongjo', serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap"
```

#### Gowun Batang — Serif

Warm, humanist serif with a gentle personality.

```yaml
fontFamily: "'Gowun Batang', serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap"
```

#### Gowun Dodum — Sans-serif

Rounded, friendly sans-serif. Single weight only (400).

```yaml
fontFamily: "'Gowun Dodum', sans-serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap"
```

#### Sunflower — Sans-serif

Light and airy display font. Available weights: 300, 500, 700 (no 400).

```yaml
fontFamily: "'Sunflower', sans-serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Sunflower:wght@300;500;700&display=swap"
```

#### Do Hyeon — Sans-serif

Bold display font with strong presence. Single weight (400).

```yaml
fontFamily: "'Do Hyeon', sans-serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap"
```

#### Jua — Sans-serif

Playful, rounded display font. Single weight (400).

```yaml
fontFamily: "'Jua', sans-serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Jua&display=swap"
```

#### Black Han Sans — Sans-serif

Heavy impact font for headlines. Single weight (400).

```yaml
fontFamily: "'Black Han Sans', sans-serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap"
```

---

### English Fonts

These fonts support Latin characters only. Korean text will fall back to the system font.

#### Inter — Sans-serif

Designed for screens. Excellent readability at small sizes.

```yaml
fontFamily: "'Inter', sans-serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
```

#### DM Sans — Sans-serif

Geometric sans-serif with a contemporary feel.

```yaml
fontFamily: "'DM Sans', sans-serif"
fontUrl: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap"
```

#### Space Grotesk — Sans-serif

Proportional companion to Space Mono. Technical yet approachable.

```yaml
fontFamily: "'Space Grotesk', sans-serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap"
```

#### Plus Jakarta Sans — Sans-serif

Modern, versatile sans-serif with a professional tone.

```yaml
fontFamily: "'Plus Jakarta Sans', sans-serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700&display=swap"
```

#### Source Sans 3 — Sans-serif

Adobe's open-source sans-serif. Clean and highly legible.

```yaml
fontFamily: "'Source Sans 3', sans-serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;700&display=swap"
```

#### Lora — Serif

Well-balanced serif for body text. Pairs beautifully with sans-serif headings.

```yaml
fontFamily: "'Lora', serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap"
```

#### Merriweather — Serif

Designed for screens with strong readability. A safe serif choice.

```yaml
fontFamily: "'Merriweather', serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap"
```

#### Playfair Display — Serif

High-contrast display serif. Best for headlines and titles.

```yaml
fontFamily: "'Playfair Display', serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap"
```

#### Crimson Text — Serif

Old-style serif inspired by classic book typography.

```yaml
fontFamily: "'Crimson Text', serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;700&display=swap"
```

#### Libre Baskerville — Serif

Optimized Baskerville for body text on screen.

```yaml
fontFamily: "'Libre Baskerville', serif"
fontUrl: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap"
```

---

## Tips

- **Korean blog?** Start with `Noto Sans KR` for body and `Noto Serif KR` for editorial posts.
- **English-only?** `Inter` or `DM Sans` for body, `Playfair Display` for headings.
- **Mixed content?** Use a Korean font as the primary — it includes Latin glyphs.
- **Performance:** Each font URL adds a network request. Use one font per post at most.
- **Single-weight fonts** (Do Hyeon, Jua, Gowun Dodum, Black Han Sans) won't render bold — best for display/headings, not body text.
