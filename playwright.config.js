const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120_000,
  fullyParallel: true,
  workers: 4,
  expect: { timeout: 30_000 },
  use: {
    baseURL: process.env.SHIFTCARE_BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.spec\.js/i,
      use: { 
        ...devices['Desktop Chrome'], 
        headless: true,
      },
    },
    {
      name: 'chromium',
      testMatch: /^(?!.*auth\.setup\.spec\.js).*\.spec\.js$/i, // All .spec.js files except auth.setup.spec.js
      use: { 
        ...devices['Desktop Chrome'], 
        storageState: 'auth.json' 
      },
      dependencies: ['setup'],
    },
  ],
  reporter: [['html', { open: 'never' }]]
});
