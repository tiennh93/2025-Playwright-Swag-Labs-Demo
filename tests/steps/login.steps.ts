import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/fixtures'; // Import từ Custom Fixture

Given('I am on the login page', async ({ loginPage }) => {
  // loginPage đã được khởi tạo tự động nhờ Fixture
  await loginPage.goto();
});

When('I login with {string} and {string}', async ({ loginPage }, username, password) => {
  await loginPage.login(username, password);
});

Then('I should be redirected to the inventory page', async ({ page }) => {
  // Assertion nằm ở đây!
  // Kiểm tra URL
  await expect(page).toHaveURL(/.*inventory.html/);

  // Kiểm tra tiêu đề trang "Products" có hiển thị không
  await expect(page.locator('.title')).toHaveText('Products');
});

Then('I should see the error message {string}', async ({ loginPage }, message: string) => {
  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toHaveText(message);
});
