const { expect } = require("@playwright/test");

class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('[id="user_email"]');
    this.passwordInput = page.locator('[id="user_password"]');
    this.submitBtn = page.locator('[data-test-id="submit-button"]');
    this.userProfileBtn = page.locator('[data-test-id="user-menu"]');
    this.signOutBtn = page.locator('[id="sign-out-shiftcare"]');
    this.invalidCredentialsMessage = page.locator('[id="flash-header"]');
  }

  async gotoLoginPage() {
    await this.page.goto("", {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
  }

  async login(email, password) {
    // Wait for reCAPTCHA to be visible before filling the form
    await this.waitForRecaptchaAndReloadIfNeeded();

    // Now fill the form
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    // Wait a moment for the form to settle
    await this.page.waitForTimeout(2000);

    // Handle reCAPTCHA
    await this.handleRecaptcha();

    // Wait for the form to be ready and click submit
    await this.submitBtn.click();

    // Wait for navigation to complete with a longer timeout
    // Accept both admin (/users/areas) and carer (/users/staff/ID) redirects
    await expect(this.page).toHaveURL(/.*\/users\/(areas|staff\/\d+)/, {
      timeout: 30000,
    });
  }

  async waitForRecaptchaAndReloadIfNeeded() {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        console.log(
          `Checking for reCAPTCHA (attempt ${retryCount + 1}/${maxRetries})`
        );

        // Wait for reCAPTCHA iframe to appear
        await this.page.waitForSelector('iframe[src*="recaptcha"]', {
          timeout: 20000,
        });

        const frame = this.page.frameLocator('iframe[title^="reCAPTCHA"]');

        // Wait until the checkbox border is visible inside the iframe
        await expect(frame.locator(".recaptcha-checkbox-border")).toBeVisible();

        // Verify the iframe is actually visible and loaded (use first() to avoid strict mode violation)
        const recaptchaVisible = await this.page
          .locator('iframe[src*="recaptcha"]')
          .first()
          .isVisible();

        if (recaptchaVisible) {
          console.log("reCAPTCHA is visible and ready");
          return; // Success! reCAPTCHA is visible
        } else {
          throw new Error("reCAPTCHA iframe found but not visible");
        }
      } catch (error) {
        retryCount++;
        console.log(
          `reCAPTCHA not visible (attempt ${retryCount}/${maxRetries}): ${error.message}`
        );

        if (retryCount < maxRetries) {
          console.log("Reloading page to retry...");
          await this.page.reload({
            waitUntil: "domcontentloaded",
            timeout: 30000,
          });
          await this.page.waitForTimeout(2000); // Wait for page to settle
        } else {
          console.log(
            "Max retries reached. Proceeding without reCAPTCHA visibility check."
          );
          break;
        }
      }
    }
  }

  async handleRecaptcha() {
    try {
      console.log("Clicking reCAPTCHA checkbox");

      // Click on the reCAPTCHA checkbox by coordinates
      const iframe = await this.page
        .locator('iframe[name*="a-"]')
        .first()
        .boundingBox();
      if (iframe) {
        await this.page.mouse.click(
          iframe.x + iframe.width / 2,
          iframe.y + iframe.height / 2
        );
        console.log("reCAPTCHA checkbox clicked successfully");

        // Wait for reCAPTCHA to process
        await this.page.waitForTimeout(3000);
      } else {
        console.log("reCAPTCHA iframe not found");
      }
    } catch (error) {
      console.log("reCAPTCHA handling failed:", error.message);
    }
  }

  async logOutFromApplication() {
    await expect(this.userProfileBtn.last()).toBeVisible();
    await this.userProfileBtn.last().click();
    await expect(this.signOutBtn.last()).toBeVisible();
    await this.signOutBtn.last().click();
    await expect(this.page).toHaveURL("");
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitBtn).toBeVisible();
  }

  async invalidLogin(email, password) {
    await this.waitForRecaptchaAndReloadIfNeeded();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    // Wait a moment for the form to settle
    await this.page.waitForTimeout(2000);

    // Handle reCAPTCHA
    await this.handleRecaptcha();
    await this.submitBtn.click();
  }

  async verifyInvalidCredentialsMessage() {
    await expect(this.invalidCredentialsMessage).toBeVisible();
    await expect(this.invalidCredentialsMessage).toContainText(
      "Invalid email or password"
    );
  }
}

module.exports = { LoginPage };
