import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  /**
   * Kỹ thuật: Locator Chaining & Filter
   * Thay vì dùng XPath phức tạp kiểu //div[text()='...']/following-sibling::button
   * Ta dùng tư duy tự nhiên: Tìm list items -> Lọc item có text -> Tìm nút button trong item đó.
   */
  async addItemToCart(productName: string) {
    await this.page
      .locator('.inventory_item') // 1. Lấy tất cả thẻ chứa sản phẩm
      .filter({ hasText: productName }) // 2. Lọc lấy thẻ nào có chứa tên sản phẩm
      .getByRole('button', { name: 'Add to cart' }) // 3. Tìm nút Add to cart bên trong thẻ đó
      .click();
  }
}
