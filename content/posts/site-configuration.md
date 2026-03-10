---
title: "Centralized Site Configuration"
date: "2026.03.11"
category: ["Guide", "Config"]
excerpt: "Master the config.yml file to manage your entire site, from dynamic favicons to social link badges."
---

# Site Configuration Guide

HopLog uses a single source of truth for your site's identity: `content/config.yml`. This file controls your profile, metadata, branding, and professional experience.

## 1. Profile & Bio
Your personal information is managed in the `profile` section. This data appears in the **About** page and the site's footer.

```yaml
profile:
  name: "Your Name"
  role: "Software Engineer"
  email: "your@email.com"
  githubUsername: "yourgithub"
  bio: "Brief introduction about your engineering philosophy."
```

## 2. Site Metadata & Header
The `site` section defines how search engines see your blog and how the header displays your name.

- **title**: The main name shown in the Header.
- **titleTemplate**: The format for browser tab titles (e.g., `%s | Blog`).
- **description**: SEO meta description.

```yaml
site:
  title: "HopLog"
  description: "Minimalist & Professional Blog"
  titleTemplate: "%s | My Records"
```

## 3. Dynamic Favicon System
One of HopLog's unique features is the **Dynamic Favicon**. Instead of uploading a static `.ico` file, you can style your favicon directly in the config:

- **text**: Usually the first letter of your name/site.
- **color**: Background color of the icon.
- **accentColor**: The "2% primary" dot color.

```yaml
branding:
  favicon:
    text: "M"
    color: "#191f28"
    textColor: "#ffffff"
    accentColor: "#3182f6"
```

## 4. Social Link Badges
Adding a new social link to your footer is as easy as adding a new item to the `social` list. They will automatically appear as elegant badges in the bottom right corner.

```yaml
social:
  - platform: "LinkedIn"
    url: "https://linkedin.com/in/yourprofile"
  - platform: "Github"
    url: "https://github.com/yourgithub"
```

## 5. Professional Experience & Skills
The **About** page dynamically renders your career history and technical stack from these sections. Use these to showcase your professional journey without touching any code.

---

By mastering `config.yml`, you've completed the core HopLog configuration. You're now ready to share your engineering insights with the world!
