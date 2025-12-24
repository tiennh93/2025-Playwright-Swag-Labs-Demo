import { test as base, createBdd } from 'playwright-bdd';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { BASE_URL } from '../utils/config';

type MyFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<MyFixtures>({
  page: async ({ page }, use) => {
    await page.goto(`${BASE_URL}/inventory.html`);
    await page.waitForLoadState('networkidle');
    await use(page);
  },
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

export const { Given, When, Then, Before, After } = createBdd(test);
