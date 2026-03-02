import { defineConfig, devices } from '@playwright/test';
import { Environment } from './src/utils/test-utils';

/**
 * See https://playwright.dev/docs/test-configuration.
 *
 * Projects sind nach Schema "<Browser> | <Environment>" benannt.
 * Die baseURL kommt direkt aus dem Environment-Enum – so ist die
 * Erweiterbarkeit (z. B. echte QA-URL vs. PROD-URL) sofort sichtbar.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    // ── QA ────────────────────────────────────────────────────────────
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome']},
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Mobile viewports (optional – uncomment to enable)
    {
      name: 'Mobile Chrome | QA',
      use: { ...devices['Pixel 5'], baseURL: Environment.QA },
    },
    {
      name: 'Mobile Safari | QA',
      use: { ...devices['iPhone 12'], baseURL: Environment.QA },
    },
    */
  ],
});
