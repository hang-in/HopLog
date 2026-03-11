import { expect, test } from "@playwright/test";

const paletteShortcut = process.platform === "darwin" ? "Meta+Shift+P" : "Control+Shift+P";

test("theme toggle persists after reload", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  const html = page.locator("html");

  await page.getByRole("button", { name: /toggle theme/i }).click();
  await expect(html).toHaveClass(/dark/);

  await page.reload();
  await expect(html).toHaveClass(/dark/);
});

test("locale selection persists after reload", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /language menu/i }).click();
  await page.getByRole("button", { name: /한국어/i }).click();

  await expect(page.locator("html")).toHaveAttribute("lang", "ko");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
});

test("wide mode toggle persists after reload", async ({ page }) => {
  await page.goto("/");

  const html = page.locator("html");

  await page.getByRole("button", { name: /toggle wide mode/i }).click();
  await expect(html).toHaveAttribute("data-wide", "false");

  await page.reload();
  await expect(html).toHaveAttribute("data-wide", "false");
});

test("command palette can open and navigate to a post", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press(paletteShortcut);

  const input = page.getByPlaceholder(/search commands or posts/i).last();
  await expect(input).toBeVisible();

  await input.fill("centralized");
  await page.getByText(/Centralized Site Configuration/i).last().click();

  await expect(page).toHaveURL(/\/posts\/tutorial\/site-configuration$/);
  await expect(page.getByRole("heading", { name: /Centralized Site Configuration/i })).toBeVisible();
});
