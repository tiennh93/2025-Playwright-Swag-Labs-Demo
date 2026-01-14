import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly checkoutBtn: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueBtn: Locator;
  readonly finishBtn: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    // Using getByTestId() with testIdAttribute: 'data-test' from config
    this.checkoutBtn = page.getByTestId('checkout');
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueBtn = page.getByTestId('continue');
    this.finishBtn = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
  }

  async fillInformation(fName: string, lName: string, zip: string) {
    await this.firstNameInput.fill(fName);
    await this.lastNameInput.fill(lName);
    await this.postalCodeInput.fill(zip);
    await this.continueBtn.click();
  }

  async finishOrder() {
    await this.finishBtn.click();
  }
}
