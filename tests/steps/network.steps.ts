import { Given, Then } from '../fixtures';
import { expect } from '@playwright/test';
import { NetworkMockHelper } from '../utils/helpers';

// Network Mocking: Block image loading to test graceful degradation
Given('the product images fail to load', async ({ page }) => {
  await NetworkMockHelper.mockImageLoadFailure(page);
});

Then('the page should still be functional without images', async ({ page }) => {
  // Verify page still works even without images
  await expect(page.locator('.inventory_item_name').first()).toBeVisible();
  await expect(page.locator('.inventory_item_price').first()).toBeVisible();
  await expect(page.locator('.btn_inventory').first()).toBeEnabled();

  console.log('✅ Page is functional even with broken images');
});

// Network Mocking: Slow network simulation
Given('I simulate slow network conditions', async ({ page }) => {
  await NetworkMockHelper.simulateSlowNetwork(page, 1000); // 1 second delay
});

Then('the application should handle slow network gracefully', async ({ page }) => {
  // Application should still load and be functional
  await expect(page.locator('.inventory_list')).toBeVisible({ timeout: 10000 });

  console.log('✅ Application loaded despite slow network');
});
