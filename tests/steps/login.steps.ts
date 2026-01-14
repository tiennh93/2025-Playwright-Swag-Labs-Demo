import { expect } from '@playwright/test';
import { Given, Then, When } from '../fixtures';
import { BASE_URL } from '../utils/config';

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

When('I login with {string} and {string}', async ({ loginPage }, username, password) => {
  await loginPage.login(username, password);
});

When('I login with valid credentials', async ({ loginPage }) => {
  await loginPage.login(
    process.env.SAUCE_USERNAME || 'standard_user',
    process.env.SAUCE_PASSWORD || 'secret_sauce'
  );
});

Then('I should be redirected to the inventory page', async ({ page }) => {
  await expect(page).toHaveURL(/.*inventory.html/);

  await expect(page.locator('.title')).toHaveText('Products');
});

Then('I should see the error message {string}', async ({ loginPage }, message: string) => {
  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toHaveText(message);
});

// ============================================
// Session Testing Steps
// ============================================

Given('I directly navigate to the inventory page', async ({ page }) => {
  // Navigate directly without login (fresh context)
  await page.goto(`${BASE_URL}/inventory.html`);
});

Then('I should be on the login page', async ({ page }) => {
  await expect(page).toHaveURL(/.*\/$/);
  const loginButton = page.getByTestId('login-button');
  await expect(loginButton).toBeVisible();
  console.log('✅ User is on the login page');
});

Given('I am logged in as {string}', async ({ loginPage, page }, username: string) => {
  await loginPage.goto();
  await loginPage.login(username, 'secret_sauce');
  await expect(page).toHaveURL(/.*inventory.html/);
  console.log(`✅ Logged in as ${username}`);
});

When('I click the logout button', async ({ page }) => {
  // Open the burger menu
  const menuButton = page.locator('#react-burger-menu-btn');
  await menuButton.click();

  // Wait for menu to open
  await page.waitForSelector('.bm-menu', { state: 'visible' });

  // Click logout
  const logoutLink = page.locator('#logout_sidebar_link');
  await logoutLink.click();

  console.log('✅ Clicked logout button');
});

Then('I should not be able to access the inventory page directly', async ({ page }) => {
  // Try to navigate to inventory
  await page.goto(`${BASE_URL}/inventory.html`);

  // Should be redirected to login with error
  await expect(page).toHaveURL(/.*\/$/);

  // Verify error message
  const errorElement = page.getByTestId('error');
  await expect(errorElement).toContainText('You can only access');

  console.log('✅ Direct access to inventory blocked after logout');
});

Then('I should still be on the inventory page', async ({ page }) => {
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');
  console.log('✅ Session persisted after reload');
});
