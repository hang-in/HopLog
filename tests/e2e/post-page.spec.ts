import { expect, test } from "@playwright/test";

test("post pages render article content and markdown headings", async ({ page }) => {
  await page.goto("/posts/tutorial/getting-started");

  await expect(page.getByRole("article")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Getting Started with HopLog/i })).toBeVisible();
  await expect(page.locator("time")).toContainText("2026.03.11");
  await expect(page.getByText("Guide", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("article").getByText("HopLog", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Welcome to HopLog/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Project Philosophy/i })).toBeVisible();
});

test("post pages expose table of contents and copy code controls", async ({ page }) => {
  await page.goto("/posts/tutorial/getting-started");

  await expect(page.getByText(/On this page/i)).toBeVisible();
  await expect(page.locator('a[href="#welcome-to-hoplog"]')).toBeVisible();
  await expect(page.locator('a[href="#1-project-philosophy"]')).toBeVisible();
  await expect(page.getByRole("button", { name: /copy code/i }).first()).toBeVisible();
});

test("post links from home open the matching article page", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /Centralized Site Configuration/i }).click();

  await expect(page).toHaveURL(/\/posts\/tutorial\/site-configuration$/);
  await expect(page.getByRole("heading", { name: /Centralized Site Configuration/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Site Configuration Guide/i })).toBeVisible();
});
