import { defineConfig, devices } from "@playwright/test";

const host = process.env.PLAYWRIGHT_HOST ?? "127.0.0.1";
const port = Number.parseInt(process.env.PLAYWRIGHT_PORT ?? "3100", 10);
const baseURL = `http://${host}:${port}`;
const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1";
const reuseExistingServer = !process.env.CI;
const webServerCommand =
  process.env.PLAYWRIGHT_WEBSERVER_COMMAND ??
  `sh -c "[ -f .next/BUILD_ID ] || { echo 'Missing Next build. Run bun run build first.' >&2; exit 1; }; bunx next start -H ${host} -p ${port}"`;

export default defineConfig({
  testDir: "./tests/e2e",
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: skipWebServer
    ? undefined
    : {
        command: webServerCommand,
        url: baseURL,
        reuseExistingServer,
        timeout: 120 * 1000,
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testIgnore: /.*mobile\.spec\.ts/,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
