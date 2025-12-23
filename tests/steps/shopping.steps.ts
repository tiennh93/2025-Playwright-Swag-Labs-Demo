import { expect } from '@playwright/test';
import { When, Then } from '../fixtures/fixtures'; // Import từ Custom Fixture
import { DataTable } from 'playwright-bdd';

// --- Sorting Steps ---

When('I sort products by {string}', async ({ inventoryPage }, option: string) => {
  await inventoryPage.sortProductsBy(option);
});

Then('the product prices should be sorted in ascending order', async ({ inventoryPage }) => {
  // 1. Lấy danh sách giá từ UI
  const prices = await inventoryPage.getAllProductPrices();

  // 2. Clone mảng và sort bằng code JS để làm chuẩn so sánh
  const sortedPrices = [...prices].sort((a, b) => a - b);

  // 3. Assertion: So sánh mảng UI với mảng chuẩn
  expect(prices).toEqual(sortedPrices);
});

// --- Checkout E2E Steps ---

When('I add {string} to cart', async ({ inventoryPage }, itemName: string) => {
  await inventoryPage.addItemToCart(itemName);
});

When('I go to cart page', async ({ inventoryPage }) => {
  await inventoryPage.goToCart();
});

When('I proceed to checkout', async ({ checkoutPage }) => {
  await checkoutPage.proceedToCheckout();
});

When('I fill checkout information with:', async ({ checkoutPage }, dataTable: DataTable) => {
  // Lấy data từ bảng trong file feature (dòng đầu tiên chứa data)
  const info = dataTable.hashes()[0];
  await checkoutPage.fillInformation(info.firstName, info.lastName, info.zipCode);
});

When('I finish the checkout', async ({ checkoutPage }) => {
  await checkoutPage.finishOrder();
});

Then(
  'I should see the order confirmation message {string}',
  async ({ checkoutPage }, message: string) => {
    await expect(checkoutPage.completeHeader).toHaveText(message);
  }
);
