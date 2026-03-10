---
title: "Customizing and Deploying HopLog"
date: "2026.03.09"
category: ["Guide", "Engineering"]
excerpt: "Ready to go live? Learn how to customize the brand and deploy your HopLog blog to production."
---

# Going Global with HopLog

You've mastered the writing experience. Now it's time to make HopLog your own and share it with the world.

## 1. Customizing Your Brand
All core settings are stored in the `content/` directory as JSON files:
- **about.json**: Update your profile, social links, and GitHub username.
- **hero.json**: Change the main banner text and background opacity.
- **icon.svg**: Replace the favicon in `src/app/` to match your personal logo.

## 2. Dynamic Activity Grid
HopLog automatically syncs with your **GitHub Contributions**. Just update your username in `about.json`, and the system will fetch your coding activity in real-time, displaying it alongside your writing history.

## 3. Production Deployment
HopLog is built on Next.js 16 and Bun, making it ready for Vercel, Netlify, or self-hosting.

```bash
# To build for production:
bun run build

# To start the production server:
bun start
```

### Final Thoughts
HopLog is designed to scale with your career. As you grow as an engineer, your records will build up into a powerful proof of your expertise. 

**Start your journey today.**
