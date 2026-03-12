import { expect, test } from "@playwright/test";

test("home page shows all published posts", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /latest posts/i })).toBeVisible();
  const postLinks = page.locator('article a[href^="/posts/"]');
  await expect(postLinks).not.toHaveCount(0);
  await expect(page.getByRole("link", { name: /Getting Started with HopLog/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Centralized Site Configuration/i })).toBeVisible();
});

test("category filter narrows the visible post list", async ({ page }) => {
  await page.goto("/");

  await page.locator("select").selectOption("Config");

  await expect(page.locator('article a[href^="/posts/"]')).toHaveCount(1);
  await expect(page.getByRole("link", { name: /Centralized Site Configuration/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Getting Started with HopLog/i })).toHaveCount(0);
});

test("category filter supports categories with multiple posts", async ({ page }) => {
  await page.goto("/");

  await page.locator("select").selectOption("Typography");

  await expect(page.locator('article a[href^="/posts/"]')).toHaveCount(2);
  await expect(page.getByRole("link", { name: /Mastering Markdown Features/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Custom Fonts in HopLog/i })).toBeVisible();
});
