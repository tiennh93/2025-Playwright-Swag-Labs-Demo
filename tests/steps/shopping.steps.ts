import { expect } from '@playwright/test';

import { DataTable } from 'playwright-bdd';
import { Then, When } from '../fixtures';

When('I sort products by {string}', async ({ inventoryPage }, option: string) => {
  await inventoryPage.sortProductsBy(option);
});

Then('the product prices should be sorted in ascending order', async ({ inventoryPage }) => {
  const prices = await inventoryPage.getAllProductPrices();

  const sortedPrices = [...prices].sort((a, b) => a - b);

  expect(prices).toEqual(sortedPrices);
});

When('I add {string} to cart', async ({ inventoryPage, page }, itemName: string) => {
  await inventoryPage.addItemToCart(itemName);

  // Track added items for cleanup
  interface TestData {
    createdItems: string[];
    addedToCart: string[];
  }
  const testData = (page as { testData?: TestData }).testData;
  if (testData) {
    testData.addedToCart.push(itemName);
  }
});

When('I go to cart page', async ({ inventoryPage }) => {
  await inventoryPage.goToCart();
});

When('I proceed to checkout', async ({ checkoutPage }) => {
  await checkoutPage.proceedToCheckout();
});

// Support both static data from DataTable and dynamic data generation
When('I fill checkout information with:', async ({ checkoutPage }, dataTable: DataTable) => {
  const info = dataTable.hashes()[0];
  await checkoutPage.fillInformation(info.firstName, info.lastName, info.zipCode);
});

import { UserFactory } from '../factories/user-factory';

// New step: Use Faker to generate random checkout data
When('I fill checkout information with random data', async ({ checkoutPage }) => {
  const info = UserFactory.randomCheckoutInfo();

  console.log(
    `🎲 Generated random checkout data: ${info.firstName} ${info.lastName}, ${info.zipCode}`
  );

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

When('I remove {string} from the inventory', async ({ inventoryPage }, itemName: string) => {
  await inventoryPage.removeItemFromInventory(itemName);
});

Then('the cart badge should not be visible', async ({ page }) => {
  await expect(page.locator('.shopping_cart_badge')).toBeHidden();
});

Then('all product images should load correctly', async ({ inventoryPage }) => {
  const brokenSrcList = await inventoryPage.checkBrokenImages();

  expect(brokenSrcList, `Found broken images: ${brokenSrcList}`).toHaveLength(0);
});
