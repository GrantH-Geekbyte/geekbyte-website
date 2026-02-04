// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration for GeekByte website testing
 *
 * Two testing modes:
 * - local: Full test suite against localhost (default)
 * - live: Read-only smoke tests against https://geekbyte.biz
 *
 * Usage:
 *   npm test              # Run all tests against localhost (default)
 *   npm run test:local    # Explicitly run against localhost
 *   npm run test:live     # Run smoke tests against live site
 */
module.exports = defineConfig({
  testDir: './tests/e2e',

  // Maximum time one test can run (30 seconds)
  timeout: 30 * 1000,

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Number of workers - use half of available CPUs locally
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],

  // Shared settings for all projects
  use: {
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'local',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
    },

    {
      name: 'live',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://geekbyte.biz',
      },
      // Only run smoke tests against live site (pages and navigation)
      testMatch: /.*\/(pages|navigation)\.spec\.js/,
    },
  ],

  // Run your local dev server before starting the tests
  // Note: For manual testing, run `npm run serve` in a separate terminal
  // webServer: {
  //   command: 'npm run serve',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
