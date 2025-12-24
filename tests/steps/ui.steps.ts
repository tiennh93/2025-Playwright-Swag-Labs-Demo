import { expect } from '@playwright/test';
import { Then } from '../fixtures';

Then('the login page should look exactly like the design', async ({ page }) => {
  // Playwright will capture a screenshot and compare it with the original snapshot file
  // The first run will fail because there is no original image -> It automatically generates the original image.
  await expect(page).toHaveScreenshot('login-page-design.png', {
    maxDiffPixels: 100, // Allow a maximum deviation of 100 pixels
  });
});

// Soft assertions - verify multiple UI elements without stopping on first failure
Then('I verify all product card details are displayed correctly', async ({ page }) => {
  const firstProduct = page.locator('.inventory_item').first();

  // Use expect.soft() to continue verification even if one fails
  await expect.soft(firstProduct.locator('.inventory_item_name')).toBeVisible();
  await expect.soft(firstProduct.locator('.inventory_item_desc')).toBeVisible();
  await expect.soft(firstProduct.locator('.inventory_item_price')).toBeVisible();
  await expect.soft(firstProduct.locator('.btn_inventory')).toBeVisible();
  await expect.soft(firstProduct.locator('img')).toBeVisible();

  // This will still run even if above assertions fail
  console.log('✅ Completed all product card verifications');
});

Then('I verify the header contains all required elements', async ({ page }) => {
  // Verify multiple header elements with soft assertions
  await expect.soft(page.locator('.app_logo')).toBeVisible();
  await expect.soft(page.locator('.shopping_cart_link')).toBeVisible();
  await expect.soft(page.locator('#react-burger-menu-btn')).toBeVisible();

  // Check texts
  await expect.soft(page.locator('.app_logo')).toHaveText('Swag Labs');

  console.log('✅ Header verification completed');
});
