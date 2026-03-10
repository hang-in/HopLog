---
title: "Dynamic Color Schemas: Redesigning with a Single YAML File"
date: "2026.03.11"
category: "Dev, Design"
excerpt: "The infinite theme extensibility of HopLog, powered by the magic of content/schemas.yml"
---

When building a blog or portfolio site, one of the most common concerns is, **"How do I apply my own brand colors?"** In the past, this meant hardcoding CSS or manually modifying Tailwind theme files.

To completely eliminate this inconvenience, HopLog introduces the **Dynamic Color Schemas** system.

## The Magic of schemas.yml

Users don't need to touch any code. Just by modifying a single file, `content/schemas.yml`, the site's entire light and dark themes are instantly replaced.

```yaml
- id: "dracula"
  name: "Dracula"
  light:
    background: "#f8f8f2"
    foreground: "#282a36"
    primary: "#ff79c6"
    # ...
  dark:
    background: "#282a36"
    foreground: "#f8f8f2"
    primary: "#ff79c6"
    # ...
```

Simply defining an array of Hex codes as shown above is all it takes.

## Real-time Updates via Command Palette

The color themes you define are instantly mapped and automatically added to the "Color Schemas" category in the Command Palette (**`⌘ + ⇧ + P`**).

Without refreshing the page, users can select their desired theme using the arrow keys. In the background, CSS variables are reassigned in real-time, completely transforming the tone and manner of the entire screen in just a second.

## Design Philosophy

**"Function is design."**  
This feature goes beyond mere decoration. It is designed to provide the **true flexibility of open-source**, allowing anyone—even users or external contributors without coding knowledge—to easily personalize their templates.

Open the Command Palette right now and try changing your theme! Finding your perfect color palette and adding it to `schemas.yml` is an excellent way to get started.
