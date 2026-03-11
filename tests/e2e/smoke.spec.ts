import { expect, test } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading").first()).toBeVisible();
});

test("about page opens from header", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /about/i }).click();

  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading").first()).toBeVisible();
});
