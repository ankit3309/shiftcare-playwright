const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test('Login Authenticate', async ({ browser }, testInfo) => {
  // Only run login logic in the setup project
  if (testInfo.project.name === 'setup') {
    const context = await browser.newContext();
    const page = await context.newPage();
    const login = new LoginPage(page);

    await login.gotoLoginPage();
    await login.login(process.env.SHIFTCARE_EMAIL, process.env.SHIFTCARE_PASSWORD);

    await context.storageState({ path: 'auth.json' }); // ✅ saves cookies/localStorage
    await context.close();
  }
});
