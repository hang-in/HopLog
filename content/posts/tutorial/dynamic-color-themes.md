---
title: "Dynamic Color Themes: Redesigning with a Theme Directory"
date: "2026.03.11"
category: ["Dev", "Design"]
excerpt: "The infinite theme extensibility of HopLog, powered by drop-in theme files inside content/themes/"
---

When building a blog or portfolio site, one of the most common concerns is, **"How do I apply my own brand colors?"** In the past, this meant hardcoding CSS or manually modifying Tailwind theme files.

To completely eliminate this inconvenience, HopLog introduces the **Dynamic Color Themes** system.

## The Magic of `content/themes/`

Users don't need to touch any code. Just by adding or editing a `.yml` file in `content/themes/`, the site's entire light and dark themes can be extended immediately.

```yaml
id: "dracula"
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

Each file defines exactly one theme, which makes it easier to add, remove, version, and review themes independently.

## Real-time Updates via Command Palette

The color themes you define are instantly mapped and automatically added to the "Themes" category in the Command Palette (**`⌘ + ⇧ + P`**).

Without refreshing the page, users can select their desired theme using the arrow keys. In the background, CSS variables are reassigned in real-time, completely transforming the tone and manner of the entire screen in just a second.

## Design Philosophy

**"Function is design."**  
This feature goes beyond mere decoration. It is designed to provide the **true flexibility of open-source**, allowing anyone—even users or external contributors without coding knowledge—to easily personalize their templates.

Open the Command Palette right now and try changing your theme! Finding your perfect color palette and adding a new file to `content/themes/` is an excellent way to get started.

If you are localizing the rest of the UI too, keep color themes in `content/themes/` and text translations in `messages/*.json` so contributors can work on design and language independently.
