const { test, expect } = require('@playwright/test');
const { ProfilePage } = require('../pages/ProfilePage');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Profile Update', () => {
  test('01 - should allow admin to update profile name', async ({ browser }) => {
    // Create separate browser context for this test
    const context = await browser.newContext({ storageState: 'auth.json' });
    const page = await context.newPage();
    const profile = new ProfilePage(page);

    // Navigate to profile page and handle new tab
    await profile.gotoProfilePage();
    
    // Wait for new tab to open and switch to it
    const newPagePromise = context.waitForEvent('page');
    await profile.clickProfileButton();
    const newPage = await newPagePromise;
    
    // Create ProfilePage instance for the new tab
    const profileNewTab = new ProfilePage(newPage);
    
    // Wait for the new page to load
    await newPage.waitForLoadState('domcontentloaded');
    
    // Perform profile update operations on the new tab
    await profileNewTab.editProfileName("Automation User Update");
    await profileNewTab.verifyUpdatedProfileName("Automation User Update");
    await profileNewTab.revertProfileName("Automation User");
    
    // Close the new tab and context
    await newPage.close();
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