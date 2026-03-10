<p align="center">
  <img src="assets/banner.png" alt="HopLog Banner" width="100%">
</p>

<p align="center">
  <a href="README.md">English</a> · <a href="README.ko.md">한국어</a>
</p>

# 🐰 HopLog

> A simple blog built for developers.
> Fast to write in, easy to customize, and pleasant to read.

HopLog is a developer-friendly blog built with Next.js 16 and Bun. It focuses on the things developers actually care about: fast startup, markdown-based writing, keyboard-friendly navigation, clean theming, and straightforward customization.

## ✨ Key Capabilities

- **Fast by Default**: Built on Next.js 16 (App Router) and Tailwind CSS 4 for quick load times and a responsive editing/viewing experience.
- **Clean Blog UI**: A simple visual style that keeps attention on your posts instead of the chrome around them.
- **Recursive Content Routing**: Nested markdown files under `content/posts/` automatically map to nested `/posts/...` routes.
- **Keyboard-First Navigation**: Built-in command palette (⌘+⇧+P) and global hotkeys for seamless navigation.
- **Git-Integrated Activity**: Real-time GitHub contribution sync and writing density visualization.
- **Private Post Support**: Hide drafts or internal notes from routes, metadata, and sitemaps using frontmatter flags.
- **Multilingual UI**: Interface translations are available for English, Korean, Japanese, and Chinese.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/rapidrabbit76/hoplog.git
   cd hoplog
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure your profile**
   ```bash
   cp content/profile.example.yml content/profile.yml
   ```
   Edit `content/profile.yml` to set your name, bio, social links, experience, and skills.

4. **Launch development server**
   ```bash
   bun dev
   ```

## 📝 Writing Content

Add your markdown files anywhere under `content/posts/`. HopLog supports deep nesting, making it easy to organize tutorials and series.

**Examples:**
- `content/posts/getting-started.md` → `/posts/getting-started`
- `content/posts/tutorial/advanced.md` → `/posts/tutorial/advanced`

### Post Metadata (Frontmatter)

Each post uses YAML frontmatter for configuration:

```yaml
---
title: "Your Post Title"
date: "2026.03.11"
category: ["Engineering", "Architecture"]
excerpt: "A brief summary for SEO and lists."
image: "/api/images/cover.jpg" # Optional cover image
fontFamily: "'Noto Sans KR', sans-serif" # Optional custom font
fontUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap" # Optional font link
visibility: "private" # Optional: set to 'private' to hide post
---
```

### Private Posts
To hide a post from the public site (lists, sitemaps, and direct access), use either:
- `visibility: "private"`
- `public: false`

## 🎨 Customization & Branding

### Site Configuration
Edit `content/config.yml` to manage site-wide metadata, hero content, typography, and title templates. Root SEO settings are managed in `content/seo.yml`.

### Dynamic Themes
Define themes as individual YAML files in `content/themes/`. They are loaded automatically and exposed in the Command Palette (⌘+⇧+P).

### UI Localization
Interface strings are isolated in `messages/*.json` files. This allows for easy translation without touching the application logic. Supported locales include:
- `en` (English)
- `ko` (Korean)
- `ja` (Japanese)
- `zh` (Chinese)

## 🔎 Technical Details

- **Metadata Generation**: Automatically generates `sitemap.xml` and `robots.txt`.
- **Themed Error Pages**: Custom `404` and `500` pages that respect your active theme and locale.
- **Media Support**: Images can be served via the `/api/images/[...path]` endpoint.
- **Tech Stack**: Next.js 16 (React 19), Tailwind CSS 4 (OKLCH), Bun, Zustand, and Remark/Rehype.

## 🛠 Commands

| Command | Description |
| :--- | :--- |
| `bun dev` | Start the development server |
| `bun run lint` | Run ESLint checks |
| `bun run build` | Create a production build |
| `bun start` | Start the production server |

## 📜 License

Licensed under the [MIT License](LICENSE). Contributions are welcome!
