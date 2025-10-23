const { test, expect } = require('@playwright/test');
const { ShiftsPage } = require('../pages/ShiftPage.js')
const { LoginPage } = require('../pages/LoginPage');

test.describe('Shift Operations', () => {
  test('01 - should allow admin to create a new shift and verify it in admin and carer home page', async ({ browser }) => {
    // Create separate contexts for admin and carer operations
    const adminContext = await browser.newContext({ storageState: 'auth.json' });
    const adminPage = await adminContext.newPage();
    const adminShifts = new ShiftsPage(adminPage);

    // Admin operations
    await adminShifts.gotoHomePage();
    await adminShifts.clickCreateShiftBtn();
    await adminShifts.enterShiftDetails();
    await adminShifts.verifyCreatedShift();
    await adminShifts.closeShiftDetails();
    
    // Close admin context (preserves auth.json state)
    await adminContext.close();
    
    // Create fresh context for carer operations (completely isolated)
    const carerContext = await browser.newContext({
      storageState: undefined,
      clearCookies: true
    });
    const carerPage = await carerContext.newPage();
    const carerLogin = new LoginPage(carerPage);
    const carerShifts = new ShiftsPage(carerPage);
    
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
    await carerLogin.login(process.env.SHIFTCARE_CARER_EMAIL, process.env.SHIFTCARE_PASSWORD);
    await carerShifts.verifyCreatedShiftIsVisibleInCarerHomePage();
    
    // Close carer context
    await carerContext.close();
  });

  test('02 - should allow admin to edit a shift and verify it in admin and carer home page', async ({ browser }) => {
    // Create separate contexts for admin and carer operations
    const adminContext = await browser.newContext({ storageState: 'auth.json' });
    const adminPage = await adminContext.newPage();
    const adminShifts = new ShiftsPage(adminPage);

    // Admin operations
    await adminShifts.gotoHomePage();
    await adminShifts.clickCreateShiftBtn();
    await adminShifts.enterShiftDetails();
    await adminShifts.verifyCreatedShift();
    await adminShifts.editShift();
    await adminShifts.verifyEditedShift();
    await adminShifts.closeShiftDetails();
    
    // Close admin context (preserves auth.json state)
    await adminContext.close();
    
    // Create fresh context for carer operations (completely isolated)
    const carerContext = await browser.newContext({
      storageState: undefined,
      clearCookies: true
    });
    const carerPage = await carerContext.newPage();
    const carerLogin = new LoginPage(carerPage);
    const carerShifts = new ShiftsPage(carerPage);
    
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
    await carerLogin.login(process.env.SHIFTCARE_CARER_EMAIL, process.env.SHIFTCARE_PASSWORD);
    await carerShifts.verifyUpdatedShiftIsVisibleInCarerHomePage();
    
    // Close carer context
    await carerContext.close();
  });

  test('03 - should allow admin to create and delete a shift', async ({ browser }) => {
    // Create separate browser context for this test
    const context = await browser.newContext({ storageState: 'auth.json' });
    const page = await context.newPage();
    const shifts = new ShiftsPage(page);

    await shifts.gotoHomePage();
    await shifts.clickCreateShiftBtn();
    await shifts.enterShiftDetails();
    await shifts.verifyCreatedShift();
    await shifts.deleteShift();    
    // Close the context
    await context.close();
  });



});
