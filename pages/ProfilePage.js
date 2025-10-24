const { expect } = require('@playwright/test');

class ProfilePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.editProfileBtn = page.getByText("Edit Profile");
    this.userProfleName = page.locator('[id="user_name"]');
    this.saveProfileBtn = page.locator('[name="commit"]');
    this.profileNameHeader = page.locator('[class="legend-container"]');
    this.profileNameBody = page.locator('[data-test-id="demographic-wrapper"]');
    this.companyLogo = page.getByRole('banner').getByRole('link', { name: 'ShiftCare' });
    this.userProfileBtn = page.locator('[data-test-id="user-menu"]');
    this.profileBtn = page.getByRole('link', { name: 'Profile' });
    this.profileDetailsEditBtn = page.locator('[data-test-id="staffDetailEdit"]');
    this.profileDisplayNameInput = page.locator('[data-test-id="enterDisplayName"]');
    this.updateProfileBtn = page.locator('[data-test-id="updateStaffSetting"]');
    this.userProfileFirstName = page.locator('[data-test-id="enterFirstName"]');
    this.userProfileLastName = page.locator('[data-test-id="enterFamilyName"]');

  }

  async gotoProfilePage() {
    await this.page.goto('/users/areas');
    await expect(this.userProfileBtn.last()).toBeVisible();
    await this.userProfileBtn.last().click();
    await expect(this.profileBtn).toBeVisible();
  }

  async clickProfileButton() {
    await this.profileBtn.click();
  }

  async editProfileName(ProfileName) {
    await expect(this.editProfileBtn).toBeVisible();
    await this.editProfileBtn.click();
    await expect(this.userProfleName).toBeVisible();
    await this.userProfleName.clear();
    await this.userProfleName.fill(ProfileName);
    await expect(this.saveProfileBtn).toBeVisible();
    await this.saveProfileBtn.click();
  }

  async verifyUpdatedProfileName(ProfileName) {
    await expect(this.profileNameHeader).toBeVisible();
    await expect(this.profileNameHeader).toContainText(ProfileName);
    await expect(this.profileNameBody).toBeVisible();
    await expect(this.profileNameBody).toContainText(ProfileName);
  }

  async revertProfileName(ProfileName) {
    await expect(this.profileDetailsEditBtn).toBeVisible();
    await this.profileDetailsEditBtn.click();
    await expect(this.profileDisplayNameInput).toBeVisible();
    await this.profileDisplayNameInput.clear();
    await this.profileDisplayNameInput.fill(ProfileName);
    await expect(this.userProfileFirstName).toBeVisible();
    await this.userProfileFirstName.clear();
    await this.userProfileFirstName.fill("Automation");
    await expect(this.userProfileLastName).toBeVisible();
    await this.userProfileLastName.clear();
    await this.userProfileLastName.fill("User");
    await expect(this.updateProfileBtn).toBeVisible();
    await this.updateProfileBtn.click({force: true});
    await this.page.waitForTimeout(2000);
    await expect(this.profileNameHeader).toBeVisible();
    await expect(this.profileNameHeader).toContainText(ProfileName);
  }
}

module.exports = { ProfilePage };
