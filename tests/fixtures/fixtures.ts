import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/LoginPage';

// 1. Định nghĩa Type cho Custom Fixtures
type MyFixtures = {
  loginPage: LoginPage;
  // Sau này thêm inventoryPage, cartPage...
};

// 2. Extend base test
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

// 3. Export hooks từ chính test instance này
// Lưu ý: Phải export Before, After từ đây để nó hiểu được context của MyFixtures
export const { Given, When, Then, Before, After } = createBdd(test);
