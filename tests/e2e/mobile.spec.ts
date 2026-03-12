import { devices, expect, test } from "@playwright/test";

test.use({
  viewport: devices["iPhone 13"].viewport,
  userAgent: devices["iPhone 13"].userAgent,
  deviceScaleFactor: devices["iPhone 13"].deviceScaleFactor,
  isMobile: true,
  hasTouch: true,
});

test("home page works on a mobile viewport", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { name: /latest posts/i })).toBeVisible();
  await expect(page.locator("select")).toBeVisible();
  await expect(page.locator('article a[href^="/posts/"]')).not.toHaveCount(0);
});

test("category filtering still works on mobile", async ({ page }) => {
  await page.goto("/");

  await page.locator("select").selectOption("Typography");

  await expect(page.locator('article a[href^="/posts/"]')).toHaveCount(2);
  await expect(page.getByRole("link", { name: /Mastering Markdown Features/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Custom Fonts in HopLog/i })).toBeVisible();
});

test("post content stays usable on mobile", async ({ page }) => {
  await page.goto("/posts/tutorial/getting-started");

  await expect(page.getByRole("article")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Getting Started with HopLog/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Welcome to HopLog/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /copy code/i }).first()).toBeVisible();
});
