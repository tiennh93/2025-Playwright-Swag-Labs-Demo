import { test as base, createBdd } from 'playwright-bdd';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

// 1. Định nghĩa Type cho Custom Fixtures
type MyFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  checkoutPage: CheckoutPage;
};

// 2. Extend base test
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

// 3. Export hooks từ chính test instance này
// Lưu ý: Phải export Before, After từ đây để nó hiểu được context của MyFixtures
export const { Given, When, Then, Before, After } = createBdd(test);
