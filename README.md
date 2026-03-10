<p align="center">
  <img src="assets/banner.png" alt="HopLog Banner" width="100%">
</p>

# 🐰 HopLog

> **Recording the leaps of engineering.**
> A minimalist workspace for developers who value speed, depth, and the essence of software craftsmanship.

HopLog is a focused workspace for engineers built on Next.js 16 and Bun. It offers an ultra-fast developer experience, optimized SEO ("Engineering", "Software Architecture", "Minimalism"), and a distraction-free reading interface.

## Key Features

- **Performance First**: Built on Next.js 16 (App Router) and Tailwind CSS 4 for blazing fast load times.
- **Minimalist Aesthetics**: Clean, monochrome design with a "2% primary accent" philosophy.
- **Flexible Theming**: Configure your site metadata in `config.yml` and add color themes as individual YAML files in `content/themes/`.
- **Translation-Friendly UI**: Keep interface copy in external `messages/*.json` files for English, Korean, Japanese, and Chinese.
- **Keyboard-Centric**: Built-in command palette (⌘+⇧+P) and global hotkeys for power users.
- **Git-Integrated Activity**: Real-time GitHub contribution sync and writing density visualization.
- **Recursive Content Routing**: Nested markdown files under `content/posts/` become nested `/posts/...` routes automatically.
- **Private Post Support**: Hide posts from routes, metadata, and sitemap output with frontmatter visibility flags.

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4 (OKLCH color space)
- **Runtime**: Bun
- **Content**: Markdown (remark/rehype)
- **State**: Zustand
- **Localization**: External JSON message catalogs

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rapidrabbit76/hoplog.git
    cd hoplog
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up your profile:**
    ```bash
    cp content/profile.example.yml content/profile.yml
    ```
    Edit `content/profile.yml` to fill in your name, bio, social links, experience, and skills.

4.  **Run development server:**
    ```bash
    bun dev
    ```

5.  **Customize your brand & UI:**
    Edit `content/config.yml` for site metadata and hero content.
    Add or edit `.yml` files in `content/themes/` to define dynamic color themes for the site. Users can switch between these themes in real-time via the Command Palette (⌘+⇧+P).
    Update `messages/*.json` if you want to localize the interface.

## Configuration Layout

HopLog keeps configuration concerns separated:

- `content/config.yml` - site metadata, hero content, typography, title template
- `content/profile.yml` - profile, social links, experience, GitHub username
- `content/themes/*.yml` - color theme definitions, one file per theme
- `messages/*.json` - UI translations, one file per locale

Supported UI locales:

- `en`
- `ko`
- `ja`
- `zh`

## 📝 Writing Posts

Add your markdown files anywhere under `content/posts/`. Posts are discovered recursively, so nested folders are supported.

Examples:

- `content/posts/getting-started.md` -> `/posts/getting-started`
- `content/posts/tutorial/getting-started.md` -> `/posts/tutorial/getting-started`

Each post should have the following frontmatter:

```yaml
---
title: "Your Post Title"
date: "YYYY.MM.DD"
category: ["Category1", "Category2"]
excerpt: "A brief summary of your post."
image: "/api/images/cover.jpg" # optional
fontFamily: "'Noto Sans KR', sans-serif" # optional
fontUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap" # optional
visibility: "private" # optional
---
```

### Post Visibility

Posts are public by default.

To hide a post completely from the public site, use either of these frontmatter options:

```yaml
visibility: "private"
```

or

```yaml
public: false
```

Private posts are treated as nonexistent on the public side:

- excluded from post lists
- excluded from static route generation
- excluded from metadata generation
- excluded from `sitemap.xml`
- direct URL access returns not found

## 🌍 UI Localization

UI copy lives in external locale files at the project root:

```text
messages/
  en.json
  ko.json
  ja.json
  zh.json
```

Each file uses the same nested structure, for example:

```json
{
  "header": {
    "about": "About"
  },
  "postList": {
    "latestPosts": "Latest Posts"
  }
}
```

This keeps translation work approachable for open-source contributors without requiring TypeScript edits.

## 🎨 Themes

Each color theme lives in its own YAML file under `content/themes/`:

```text
content/themes/
  default.yml
  dracula.yml
  nord.yml
```

Themes are loaded automatically and exposed in the command palette.

## 🔎 Metadata and Routing

- Root metadata comes from `content/config.yml` and `content/seo.yml`
- Page titles update based on the current route
- Post pages use the post title as the browser tab title
- About page sets its own title
- Nested markdown paths map directly to nested post URLs

Generated metadata helpers:

- `sitemap.xml`
- `robots.txt`

## 🚨 Error Pages

HopLog includes custom themed error pages instead of the default Next.js screens:

- custom `404` page
- custom `500` page

They respect the current visual theme and localized UI strings.

## Commands

```bash
bun dev
bun run lint
bun run build
bun start
```

## 📜 License

MIT License. Feel free to use and contribute!
