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
    this.companyLogo = page.locator('[class="logo"]');
  }

  async gotoProfilePage() {
    await this.page.goto('/users/profile.904788');
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

  async revertProfileName() {
    await this.gotoProfilePage();
    await this.editProfileName("Ankit Barwal Staging");
    await this.verifyUpdatedProfileName("Ankit Barwal Staging");
  }
}

module.exports = { ProfilePage };
