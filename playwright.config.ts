import { defineConfig, devices } from "@playwright/test";

const PORT = 8787;
const BASE = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: BASE,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npx wrangler dev --ip 127.0.0.1 --port ${PORT} --var TEST_MAIL:1`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      TEST_MAIL: "1",
      SITE_ADMIN_EMAIL: "lonny@lonnylot.com",
      AUTH_FROM: "auth@event-model.lonnylot.com",
    },
  },
});
