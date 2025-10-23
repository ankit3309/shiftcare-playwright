const { expect } = require('@playwright/test');

class ShiftsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.addShiftBtn = page.locator('[data-test-id="shiftAddButton"]');
    this.saveShiftBtn = page.locator('[data-test-id="shiftSaveButton"]');
    this.toolBarDate = page.locator('[data-test-id="schedulerToolbarDate"]');
    this.clientListDropdown = page.getByRole('textbox', { name: 'Type to search clients by' });
    this.selectClientFromList = page.locator('[data-test-id="shiftClientSelectOption"]');
    this.additionalShiftTypeDropdown = page.getByRole('textbox').nth(5);
    this.selectAdditionalShiftTypeFromList = page.locator('[data-test-id="additionalShiftTypeOptions-Personal Care"]');
    this.allowanceInput = page.locator('[data-test-id="allowanceSelector"] > div:nth-child(1) input');
    this.selectAllowanceFromList = page.locator('[data-test-id="allowanceOptions-Expense"]');
    this.facilityDropdown = page.getByRole('textbox', { name: 'Select' }).nth(3);
    this.selectFacilityFromList = page.locator('[data-test-id="facility-select-option-group"]');
    this.carerDropdown = page.locator('[data-test-id="shiftStaffSelect"]').getByRole('textbox', { name: 'Select', exact: true });
    this.selectCarerFromList = page.locator('[data-test-id="shiftStaffSelectOption"]');
    this.successToastMessage = page.locator('[class="el-notification__title"]');
    this.faciltyWarningModalYesBtn = page.getByRole('button', { name: 'Yes' });
    this.shiftListInCalendar = page.locator('[data-test-id="shiftCellName"], [data-test-id="stackedUserName"]');
    this.editShiftBtn = page.locator('[data-test-id="shiftEditButton"]');
    this.shiftStartTimeInput = page.locator('[data-test-id="shiftStartSelect"]');
    this.shiftEndTimeInput = page.locator('[data-test-id="shiftEndSelect"]');
    this.selectShiftStartTimeFromList = page.getByRole('button', { name: '10' });
    this.saveShiftStartTimeBtn = page.locator('.datepicker-button').first();
    this.selectShiftEndTimeFromList = page.getByRole('button', { name: '11' }).nth(1);
    this.updateShiftSaveBtn = page.locator('[data-test-id="updateIcon"]');
    this.shiftDateInput = page.locator('[data-test-id="shiftDateSelect"]');
    this.shiftDetailsViewShiftTime = page.locator('[data-test-id="shiftTime"]')
    this.shiftDetailsCloseBtn = page.locator('[data-test-id="shiftCloseButton"]');
    this.shiftActionMenu = page.locator('[data-test-id="shiftActionMenu"]');
    this.deleteShiftBtn = page.locator('[data-test-id="shiftDelAction"]');
    this.shiftConfirmDeleteBtn = page.locator('[data-test-id="shiftConfDel"]');
    this.shiftConfimrDeleteSecondBtn = page.locator('[data-test-id="shiftDeleteConfirm"]');
  }

  async gotoHomePage() {
    await this.page.goto('/users/areas');
    await expect(this.addShiftBtn).toBeVisible();
    await expect(this.toolBarDate).toBeVisible();
  }

  async clickCreateShiftBtn() {
    await expect(this.addShiftBtn).toBeVisible();
    await this.addShiftBtn.click();
  }

  async enterShiftDetails() {
    await expect(this.saveShiftBtn).toBeVisible();
    await expect(this.page.locator('[class="drawer-card-title capitalize"]')).toBeVisible();
    await expect(this.clientListDropdown).toBeVisible();
    await this.clientListDropdown.click();
    await expect(this.selectClientFromList.first()).toBeVisible();
    await this.selectClientFromList.first().click();
    await expect(this.additionalShiftTypeDropdown).toBeVisible();
    await this.additionalShiftTypeDropdown.click();
    await expect(this.selectAdditionalShiftTypeFromList).toBeVisible();
    await this.selectAdditionalShiftTypeFromList.click();
    await this.additionalShiftTypeDropdown.click();
    await expect(this.allowanceInput).toBeVisible();
    await this.allowanceInput.click();
    await expect(this.selectAllowanceFromList).toBeVisible();
    await this.selectAllowanceFromList.click();
    await this.allowanceInput.click();
    await expect(this.facilityDropdown).toBeVisible();
    await this.facilityDropdown.click();
    await expect(this.selectFacilityFromList).toBeVisible();
    await this.selectFacilityFromList.click();
    await expect(this.faciltyWarningModalYesBtn).toBeVisible();
    await this.faciltyWarningModalYesBtn.click();
    await expect(this.shiftDateInput).toBeVisible();
    await this.shiftDateInput.click();
    const today = new Date().getDate();
    await this.page.locator(`.el-date-table td.available >> text=${today}`).click();
    await expect(this.carerDropdown).toBeVisible();
    await this.carerDropdown.click();
    await expect(this.selectCarerFromList.last()).toBeVisible();
    await this.selectCarerFromList.last().click();
    await expect(this.saveShiftBtn).toBeVisible();
    
    // Wait for API response before clicking save
    const responsePromise = this.page.waitForResponse(
      (resp) => resp.url().includes("/api/v1/programs?web_update") && resp.status() === 200,
      { timeout: 20000 }
    );
    
    await this.saveShiftBtn.click();
    
    // Wait for the response
    const response = await responsePromise;
    expect(response?.status()).toBe(200);
  }

  async verifyCreatedShift() {
    await expect(this.successToastMessage).toBeVisible();
    await expect(this.successToastMessage).toHaveText('Shift Created');
    await this.successToastMessage.click();
    await expect(this.shiftDetailsViewShiftTime.first()).toBeVisible();
    await expect(this.shiftDetailsViewShiftTime.first()).toHaveText('09:00 am to 10:00 am');
  }

  async closeShiftDetails() {
    await expect(this.shiftDetailsCloseBtn).toBeVisible();
    await this.shiftDetailsCloseBtn.click();
  }


  async editShift() {
        await expect(this.editShiftBtn).toBeVisible();
        await this.editShiftBtn.click();
        await expect(this.saveShiftBtn.first()).toBeVisible();
        await expect(this.page.locator('[class="drawer-card-title capitalize"]').first()).toBeVisible();
        await this.shiftStartTimeInput.scrollIntoViewIfNeeded();
        await this.shiftStartTimeInput.click();
        await expect(this.selectShiftStartTimeFromList).toBeVisible();
        await this.selectShiftStartTimeFromList.click();
        await expect(this.saveShiftStartTimeBtn).toBeVisible();
        await this.saveShiftStartTimeBtn.click();
        await expect(this.shiftEndTimeInput).toBeVisible();
        await this.shiftEndTimeInput.click();
        await expect(this.selectShiftEndTimeFromList.first()).toBeVisible();
        await this.selectShiftEndTimeFromList.first().click();
        await expect(this.updateShiftSaveBtn.first()).toBeVisible();
        await this.updateShiftSaveBtn.first().click();   
  }

  async verifyEditedShift() {
    await expect(this.successToastMessage.last()).toBeVisible();
    await expect(this.successToastMessage.last()).toHaveText('Shift Updated Successfully');
    await this.successToastMessage.last().click();
    await expect(this.shiftDetailsViewShiftTime.first()).toBeVisible();
    await expect(this.shiftDetailsViewShiftTime.first()).toHaveText('10:00 am to 11:00 am');
  }

  async verifyCreatedShiftIsVisibleInCarerHomePage() {
    await expect(this.toolBarDate).toBeVisible();
  
    // Build YYYY-MM-DD in local time
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const id = `${yyyy}-${mm}-${dd}-holiday`;
  
    const holiday = this.page.locator(`[id="${id}"]`);
    await expect(holiday).toBeVisible();
    await expect(holiday).toContainText('9am - 10am');
    await expect(holiday).toContainText('Eluiza S Barwal');
  }

  async verifyUpdatedShiftIsVisibleInCarerHomePage() {
    await expect(this.toolBarDate).toBeVisible();
  
    // Build YYYY-MM-DD in local time
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const id = `${yyyy}-${mm}-${dd}-holiday`;
  
    const holiday = this.page.locator(`[id="${id}"]`);
    await expect(holiday).toBeVisible();
    await expect(holiday).toContainText('10am - 11am');
    await expect(holiday).toContainText('Eluiza S Barwal');
  }

  async deleteShift() {
    await expect(this.shiftActionMenu).toBeVisible();
    await this.shiftActionMenu.click();
    await expect(this.deleteShiftBtn).toBeVisible();
    await this.deleteShiftBtn.click();
    await expect(this.shiftConfirmDeleteBtn).toBeVisible();
    await this.shiftConfirmDeleteBtn.click();
    await expect(this.shiftConfimrDeleteSecondBtn).toBeVisible();
    await this.shiftConfimrDeleteSecondBtn.click();
    await expect(this.successToastMessage.last()).toBeVisible();
    await expect(this.successToastMessage.last()).toHaveText('Shift Deleted Successfully');
}
}

module.exports = { ShiftsPage };
