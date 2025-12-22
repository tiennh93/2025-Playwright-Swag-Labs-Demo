# Checklist Best Practice Playwright + TypeScript + Playwright-BDD (Web – Doanh nghiệp)

Tài liệu này dùng làm **chuẩn nội bộ** cho team QA/Dev khi xây dựng automation test với **Playwright + TypeScript + Playwright-BDD** cho ứng dụng web.

---

## 1️⃣ Cấu trúc thư mục & Conventions

### 📁 Cấu trúc chuẩn đề xuất

```txt
.
├─ playwright.config.ts
├─ package.json
├─ .env
├─ tests
│  ├─ features
│  │  └─ login.feature
│  ├─ steps
│  │  └─ login.steps.ts
│  ├─ pages
│  │  └─ LoginPage.ts
│  ├─ hooks
│  │  └─ hooks.ts
│  ├─ fixtures
│  │  └─ fixtures.ts
│  └─ utils
│     └─ test-data.ts
└─ allure-results
```

✅ Best practice:

- Feature (.feature) chỉ chứa **business language**
- Step definitions KHÔNG chứa logic phức tạp
- Page Object KHÔNG chứa assertion

---

## 2️⃣ Feature file (Gherkin – BDD)

### 📄 `login.feature`

```gherkin
@smoke
@auth
Feature: Đăng nhập hệ thống

  Scenario: Người dùng đăng nhập thành công
    Given user is on login page
    When user login with username "admin" and password "123456"
    Then dashboard page should be displayed
```

✅ Best practice:

- Dùng tag (`@smoke`, `@regression`) cho CI/CD
- Không đề cập kỹ thuật (API, selector, browser…)

---

## 3️⃣ Page Object Model (Maintainability)

### 📄 `LoginPage.ts`

```ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async open() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyLoginSuccess() {
    await expect(this.page).toHaveURL(/dashboard/);
  }
}
```

✅ Best practice:

- Locator khai báo một lần
- Ưu tiên `getByRole`, `getByTestId`
- Không dùng XPath
- Assertion nằm trong Page (hoặc helper), không nằm trong Step

---

## 4️⃣ Fixtures & Hooks (Dependency Injection)

### 📄 `fixtures.ts`

```ts
import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/LoginPage';

type MyFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export const { Given, When, Then } = createBdd(test);
```

---

### 📄 `hooks.ts`

```ts
import { Before, After } from 'playwright-bdd';

// Setup common state if needed (tuy nhiên ưu tiên dùng fixtures)
Before(async ({ page }) => {
  console.log('Start scenario...');
});

After(async ({ page }) => {
  console.log('End scenario');
  // Screenshot/Video được Playwright handler tự động
});
```

✅ Best practice:

- Mỗi scenario = browser context riêng
- Không share state giữa test
- Tránh flaky test

---

## 5️⃣ Step Definitions (Viết test ổn định)

### 📄 `login.steps.ts`

```ts
import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/fixtures';

Given('user is on login page', async ({ loginPage }) => {
  await loginPage.open();
});

When(
  'user login with username {string} and password {string}',
  async ({ loginPage }, username: string, password: string) => {
    await loginPage.login(username, password);
  }
);

Then('dashboard page should be displayed', async ({ loginPage }) => {
  await loginPage.verifyLoginSuccess();
});
```

✅ Best practice:

- Step chỉ gọi action
- Không `waitForTimeout`
- Dùng `{string}` để tái sử dụng step

---

## 6️⃣ Playwright Config

### 📄 `playwright.config.ts`

```ts
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: 'tests/steps/**/*.ts',
});

export default defineConfig({
  testDir,
  reporter: [['html'], ['allure-playwright']],
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  workers: process.env.CI ? 2 : undefined,
});
```

---

## 7️⃣ CI/CD – GitHub Actions

### 📄 `.github/workflows/e2e.yml`

```yml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:smoke

      # Upload Allure Results để generate report sau (hoặc dùng action generate)
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-results
          path: allure-results
```

---

## 8️⃣ package.json scripts

```json
{
  "scripts": {
    "test": "npx bddgen && npx playwright test",
    "prepare": "husky install",
    "format": "prettier --write \"**/*.{js,ts,json,feature,md}\""
  }
}
```

---

## 9️⃣ Performance & Scalability Checklist

- [ ] Chạy test theo tag (`@smoke`, `@regression`)
- [ ] Bật parallel (`workers`)
- [ ] Headless trên CI
- [ ] Screenshot / video chỉ khi fail
- [ ] Retry + trace cho flaky test

---

## 🔟 Enterprise Checklist Tổng Hợp

- [ ] Feature file thuần business
- [ ] Page Object không chứa test logic
- [ ] Step definitions tái sử dụng
- [ ] Selector ổn định (`getByRole`, `data-testid`)
- [ ] Không dùng `waitForTimeout`
- [ ] Test độc lập, không share state
- [ ] CI/CD tự động + report
- [ ] Chạy selective test bằng tag
