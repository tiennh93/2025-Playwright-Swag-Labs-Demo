import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly sortDropdown: Locator;
  readonly inventoryItemPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItemPrice = page.locator('.inventory_item_price');
  }

  // Demo: Handle Select Option (Dropdown)
  async sortProductsBy(optionLabel: string) {
    // Playwright chọn option thông minh qua label hoặc value
    await this.sortDropdown.selectOption({ label: optionLabel });
  }

  // Demo: Lấy danh sách text từ nhiều phần tử (List Handling)
  async getAllProductPrices(): Promise<number[]> {
    // allInnerTexts() lấy toàn bộ text của list locator trả về mảng string
    const priceTexts = await this.inventoryItemPrice.allInnerTexts();

    // Convert "$29.99" -> 29.99
    return priceTexts.map((price) => parseFloat(price.replace('$', '')));
  }

  // ... (Giữ nguyên code cũ add to cart) ...
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
}
