import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly sortDropdown: Locator;
  readonly inventoryItemPrice: Locator;
  readonly linkedinLink: Locator;
  readonly productImages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItemPrice = page.locator('.inventory_item_price');
    this.linkedinLink = page.locator('a[href*="linkedin.com"]');
    this.productImages = page.locator('.inventory_item_img img');
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

  async removeItemFromInventory(itemName: string) {
    // Tìm item theo tên -> Tìm nút Remove bên trong nó
    await this.page
      .locator('.inventory_item')
      .filter({ hasText: itemName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async clickLinkedin() {
    // Chỉ click thôi, việc chờ tab mới sẽ xử lý ở Step Definition
    await this.linkedinLink.click();
  }

  async checkBrokenImages() {
    // EvaluateAll: Chạy code JS trên tất cả các element tìm được
    // Trả về mảng các src của ảnh bị lỗi (có độ rộng tự nhiên = 0)
    const brokenImages = await this.productImages.evaluateAll((imgs) => {
      return imgs
        .filter((img) => (img as HTMLImageElement).naturalWidth === 0)
        .map((img) => (img as HTMLImageElement).src);
    });
    return brokenImages;
  }
}
