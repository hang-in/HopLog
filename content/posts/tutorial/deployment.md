---
title: "Customizing and Deploying HopLog"
date: "2026.03.09"
category: ["Guide", "Engineering"]
excerpt: "Ready to go live? Learn how to customize the brand and deploy your HopLog blog to production."
---

# Going Global with HopLog

You've mastered the writing experience. Now it's time to make HopLog your own and share it with the world.

## 1. Customizing Your Brand
All core settings are stored in the `content/` directory as YAML files:
- **profile.yml**: Update your profile, social links, and GitHub username.
- **config.yml**: Change the site metadata, hero banner text, background opacity, and typography.
- **themes/**: Add or edit color themes as individual YAML files.

UI translations are stored separately in `messages/*.json`, which keeps copy changes and content changes easy to review.

## 2. Dynamic Activity Grid
HopLog automatically syncs with your **GitHub Contributions**. Just update your `githubUsername` in `profile.yml`, and the system will fetch your coding activity in real-time, displaying it alongside your writing history.

## 3. Production Deployment
HopLog is built on Next.js 16 and Bun, making it ready for Vercel, Netlify, or self-hosting.

Before deploying, double-check that any draft-only articles are marked with `visibility: "private"` (or `public: false`) in frontmatter. Private posts are excluded from generated routes, metadata, and sitemap output.

```bash
# To build for production:
bun run build

# To start the production server:
bun start
```

### Final Thoughts
HopLog is designed to scale with your career. As you grow as an engineer, your records will build up into a powerful proof of your expertise. 

**Start your journey today.**
