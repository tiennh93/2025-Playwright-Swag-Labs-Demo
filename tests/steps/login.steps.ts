import { expect } from '@playwright/test';
import { Given, Then, When } from '../fixtures/fixtures';

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

When('I login with {string} and {string}', async ({ loginPage }, username, password) => {
  await loginPage.login(username, password);
});

Then('I should be redirected to the inventory page', async ({ page }) => {
  await expect(page).toHaveURL(/.*inventory.html/);

  await expect(page.locator('.title')).toHaveText('Products');
});

Then('I should see the error message {string}', async ({ loginPage }, message: string) => {
  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toHaveText(message);
});
