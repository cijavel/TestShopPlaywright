import { defineConfig, devices } from '@playwright/test';
import { Environment } from './src/utils/test-utils';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. */
  use: {
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
  },

  /* Configure projects per Browser AND Environment */
  projects: [
    // --- QA ---
    {
      name: 'chromium | QA',
      use: { ...devices['Desktop Chrome'], baseURL: Environment.QA },
    },
    {
      name: 'firefox | QA',
      use: { ...devices['Desktop Firefox'], baseURL: Environment.QA },
    },
    {
      name: 'webkit | QA',
      use: { ...devices['Desktop Safari'], baseURL: Environment.QA },
    },

    // --- PROD ---
    {
      name: 'chromium | PROD',
      use: { ...devices['Desktop Chrome'], baseURL: Environment.PROD },
    },
    {
      name: 'firefox | PROD',
      use: { ...devices['Desktop Firefox'], baseURL: Environment.PROD },
    },
    {
      name: 'webkit | PROD',
      use: { ...devices['Desktop Safari'], baseURL: Environment.PROD },
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
