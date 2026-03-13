# Contributing to HopLog

Thanks for your interest in contributing to HopLog, a simple blog engine built for developers.

## Prerequisites

- Node.js 22+
- Bun

## Local Development Setup

1. Install dependencies:
   ```bash
   bun install
   ```

2. Initialize configuration:
   ```bash
   cp content/profile.example.yml content/profile.yml
   ```

3. Start the development server:
   ```bash
   bun dev
   ```

## Available Commands

- `bun dev`: Start development server
- `bun run build`: Build for production
- `bun run lint`: Run ESLint
- `bun run test:e2e`: Run Playwright E2E tests
- `bun run test:unit`: Run Vitest unit tests

## Writing Content

Blog posts are stored in `content/posts/` as Markdown (`.md`) files. Nested directories are supported, but MDX is not currently loaded by the post scanner.

### Frontmatter Format

Each post should include a frontmatter block at the top:

```yaml
---
title: "Your Post Title"
date: "2026.03.12"
category: ["Engineering"]
excerpt: "A brief summary for SEO and lists."
---
```

## Project Structure

- `src/app/`: Next.js App Router pages
- `src/components/`: React components
- `src/lib/`: Core logic (config, posts, i18n, search, themes)
- `src/store/`: Zustand state management
- `content/`: Blog content, themes, and configuration
- `messages/`: i18n translation files
- `tests/e2e/`: Playwright E2E tests

## Pull Request Guidelines

- Use a descriptive title for your PR.
- Reference the related issue if it exists.
- Ensure that `bun run lint` passes before submitting.
- Keep changes focused and atomic.
