const { test, expect } = require('@playwright/test');
const { ProfilePage } = require('../pages/ProfilePage');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Profile Update', () => {
  test('01 - should allow admin to update profile name', async ({ browser }) => {
    // Create separate browser context for this test
    const context = await browser.newContext({ storageState: 'auth.json' });
    const page = await context.newPage();
    const profile = new ProfilePage(page);

    await profile.gotoProfilePage();
    await profile.editProfileName("Ankit Barwal Staging Update");
    await profile.verifyUpdatedProfileName("Ankit Barwal Staging Update");
    await profile.revertProfileName(); 
    // Close the context
    await context.close();
  });

  test('02 - should not be allowed to login with invalid credentials', async ({ browser }) => {
        // Create fresh context for carer operations (completely isolated)
    const carerContext = await browser.newContext({
      storageState: undefined,
      clearCookies: true
    });
    const carerPage = await carerContext.newPage();
    const carerLogin = new LoginPage(carerPage);
    
    // Carer operations
    await carerLogin.gotoLoginPage();
    
    // Clear any potential session/local storage after navigation
    try {
      await carerPage.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    } catch (error) {
      console.log('Storage clearing skipped (not available on this page):', error.message);
    }
    await carerLogin.invalidLogin(process.env.SHIFTCARE_CARER_EMAIL, "invalidpassword");
    await carerLogin.verifyInvalidCredentialsMessage();
    // Close carer context
    await carerContext.close();
  });
});