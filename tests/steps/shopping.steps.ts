import { expect } from '@playwright/test';
import { When, Then } from '../fixtures/fixtures'; // Nhớ import từ custom fixtures

When('I add {string} to cart', async ({ inventoryPage }, productName) => {
  await inventoryPage.addItemToCart(productName);
});

Then('the cart badge should display {string}', async ({ inventoryPage }, count) => {
  // Playwright tự động đợi (Auto-wait) cho đến khi element xuất hiện
  await expect(inventoryPage.cartBadge).toHaveText(count);
});
