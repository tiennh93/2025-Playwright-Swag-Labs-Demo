import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly sortDropdown: Locator;
  readonly inventoryItemPrice: Locator;
  readonly linkedinLink: Locator;
  readonly productImages: Locator;

  constructor(page: Page) {
    this.page = page;
    // Using getByTestId() with testIdAttribute: 'data-test' from config
    this.sortDropdown = page.getByTestId('product-sort-container');
    // CSS selectors for elements without data-test attribute
    this.inventoryItemPrice = page.locator('.inventory_item_price');
    this.linkedinLink = page.locator('a[href*="linkedin.com"]');
    this.productImages = page.locator('.inventory_item_img img');
  }

  async sortProductsBy(optionLabel: string) {
    await this.sortDropdown.selectOption({ label: optionLabel });
  }

  async getAllProductPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryItemPrice.allInnerTexts();

    return priceTexts.map((price) => parseFloat(price.replace('$', '')));
  }

  async addItemToCart(itemName: string) {
    await this.page
      .locator('.inventory_item')
      .filter({ hasText: itemName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async goToCart() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async removeItemFromInventory(itemName: string) {
    await this.page
      .locator('.inventory_item')
      .filter({ hasText: itemName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async clickLinkedin() {
    await this.linkedinLink.click();
  }

  async checkBrokenImages() {
    // Wait for all images to be loaded
    await this.page.waitForFunction(() => {
      const imgs = Array.from(document.querySelectorAll('.inventory_item_img img'));
      return imgs.every((img) => (img as HTMLImageElement).complete);
    });

    const brokenImages = await this.productImages.evaluateAll((imgs) => {
      return imgs
        .filter((img) => (img as HTMLImageElement).naturalWidth === 0)
        .map((img) => (img as HTMLImageElement).src);
    });
    return brokenImages;
  }
}
