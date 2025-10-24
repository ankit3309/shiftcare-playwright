const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

// Environment configuration
const environment = process.env.ENV || 'staging';
const config = {
  staging: {
    baseURL: process.env.SHIFTCARE_STAGING_BASE_URL,
    email: process.env.SHIFTCARE_STAGING_EMAIL,
    password: process.env.SHIFTCARE_STAGING_PASSWORD,
    carerEmail: process.env.SHIFTCARE_STAGING_CARER_EMAIL,
    carerPassword: process.env.SHIFTCARE_STAGING_CARER_PASSWORD,
  },
  production: {
    baseURL: process.env.SHIFTCARE_PRODUCTION_BASE_URL,
    email: process.env.SHIFTCARE_PRODUCTION_EMAIL,
    password: process.env.SHIFTCARE_PRODUCTION_PASSWORD,
    carerEmail: process.env.SHIFTCARE_PRODUCTION_CARER_EMAIL,
    carerPassword: process.env.SHIFTCARE_PRODUCTION_CARER_PASSWORD,
  }
};

const envConfig = config[environment] || config.staging;

// Set environment variables for tests
process.env.SHIFTCARE_BASE_URL = envConfig.baseURL;
process.env.SHIFTCARE_EMAIL = envConfig.email;
process.env.SHIFTCARE_PASSWORD = envConfig.password;
process.env.SHIFTCARE_CARER_EMAIL = envConfig.carerEmail;
process.env.SHIFTCARE_CARER_PASSWORD = envConfig.carerPassword;

console.log(`🚀 Running tests against: ${environment.toUpperCase()} environment`);
console.log(`📍 Base URL: ${envConfig.baseURL}`);

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120_000,
  fullyParallel: true,
  workers: 4,
  expect: { timeout: 30_000 },
  use: {
    baseURL: envConfig.baseURL,
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
