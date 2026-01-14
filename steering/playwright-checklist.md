# Playwright + TypeScript + Playwright-BDD Best Practices Checklist (Web – Enterprise)

> **Version:** 2.0  
> **Last Updated:** 2026-01-14  
> **Maintainer:** QA/Dev Team

This document serves as an **internal standard** for the QA/Dev team when building automation tests with **Playwright + TypeScript + Playwright-BDD** for web applications across different domains.

---

## 📖 How to Use This Template

This is a **reusable template** designed to be copied and customized for each project.

### Quick Start

1. **Copy this file** to your project's `steering/` or `docs/` directory
2. **Rename** to `[project-name]-checklist.md` (e.g., `sauce-demo-checklist.md`)
3. **Track progress** by checking items `[x]` as you implement them
4. **Add project-specific notes** where needed (file paths, custom implementations)
5. **Update version** and date when making significant changes

### Template Conventions

- `[ ]` = Not implemented / To do
- `[x]` = Implemented / Done
- `[PageName]`, `[domain]`, `[page-name]` = Replace with your actual names
- Code examples are **production-ready** and can be copied directly

---

## 1. Directory Structure & Conventions

### 📁 Proposed Standard Structure

```txt
.
├─ playwright.config.ts
├─ package.json
├─ .env.example
├─ tests
│  ├─ features
│  │  └─ [domain].feature
│  ├─ steps
│  │  └─ [domain].steps.ts
│  ├─ pages
│  │  └─ [page-name].ts
│  ├─ hooks
│  │  └─ index.ts
│  ├─ fixtures
│  │  └─ index.ts
│  ├─ utils
│  │  ├─ config.ts
│  │  ├─ helpers.ts
│  │  └─ api-helper.ts
│  └─ global-setup.ts
└─ allure-results
```

✅ Best practice:

- [ ] Feature (.feature) contains only **business language** (Domain Driven).
- [ ] Step definitions do NOT contain complex logic.
- [ ] Page Objects do NOT contain assertions.
- [ ] Use `index.ts` in `hooks` and `fixtures` for cleaner imports.

---

## 2. Feature File (Gherkin – BDD)

### 📄 `[feature-name].feature`

```gherkin
@smoke
@[module]
Feature: [Feature Name]

  Scenario: [Scenario Description]
    Given user is on the [page-name] page
    When user performs [action] with valid data
    Then the user should see [expected result]
```

✅ Best practice:

- [ ] Use tags (`@smoke`, `@regression`, `@[module]`) for CI/CD filtering.
- [ ] Avoid technical details (API, selector, browser...) in steps.
- [ ] Focus on User Behavior and Business Rules.

---

## 3. Page Object Model (Maintainability)

### 📄 `[PageName]Page.ts`

```ts
import { Page, Locator } from '@playwright/test';

export class [PageName]Page {
  readonly page: Page;
  readonly inputField: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Prioritize resilience selectors
    this.inputField = page.locator('[data-test="[input-name]"]');
    this.submitButton = page.getByRole('button', { name: '[Button Text]' });
  }

  async performAction(value: string) {
    await this.inputField.fill(value);
    await this.submitButton.click();
  }
}
```

✅ Best practice:

- [ ] Define Locators once in the constructor.
- [ ] Prioritize `getByRole`, `getByTestId` (configure `testIdAttribute` in config).
- [ ] Do not use XPath or brittle CSS selectors (avoid implementation details).
- [ ] Keep Actions simple and atomic.

---

## 4. Fixtures & Hooks (Dependency Injection)

### 📄 `fixtures/index.ts`

```ts
import { test as base, createBdd } from 'playwright-bdd';
import { [PageName]Page } from '../pages/[PageName]Page';

type MyFixtures = {
  [pageName]Page: [PageName]Page;
};

export const test = base.extend<MyFixtures>({
  [pageName]Page: async ({ page }, use) => {
    await use(new [PageName]Page(page));
  },
});

export const { Given, When, Then, Before, After } = createBdd(test);
```

---

### 📄 `hooks/index.ts`

```ts
import { After, Before } from '../fixtures';

Before(async ({ page }) => {
  console.log('🏁 Start Scenario...');
  // Setup code: authentication, data preparation, etc.
});

After(async ({ page, $testInfo }) => {
  console.log('✅ End Scenario');

  if ($testInfo.status === 'failed') {
    console.log(`⚠️ Scenario Failed: ${$testInfo.title}`);
  }
});
```

✅ Best practice:

- [ ] Each scenario = isolated browser context (ensure test independence).
- [ ] Do not share state (variables) between tests.
- [ ] Clean up data (if created) in `After` hook or via API.

---

## 5. Step Definitions (Stable Tests)

### 📄 `[domain].steps.ts`

```ts
import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

Given('user is on the [page-name] page', async ({ [pageName]Page }) => {
  await [pageName]Page.goto();
});

When('user performs [action] with valid data', async ({ [pageName]Page }) => {
  await [pageName]Page.performAction('valid-data');
});

Then('the user should see [expected result]', async ({ page }) => {
  await expect(page).toHaveURL(/[expected-url-pattern]/);
});
```

✅ Best practice:

- [ ] Steps only call Page Object methods (Abstraction Layer).
- [ ] No `waitForTimeout` (Use Playwright's auto-waiting).
- [ ] Use `{string}`, `{int}` parameters/Data Tables (`DataTable`) to make steps reusable.

---

## 6. Playwright Config

### 📄 `playwright.config.ts`

```ts
import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local or .env.[environment]
dotenv.config({ path: path.join(__dirname, '.env.local') });

const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: ['tests/steps/**/*.ts', 'tests/fixtures/**/*.ts'],
});

export default defineConfig({
  testDir,
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html'], ['allure-playwright']],
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry', // Optimize performance, only trace on retry
    testIdAttribute: 'data-test', // Customize for project convention
  },
});
```

✅ Best practice:

- [ ] Use environment variables for `baseURL` (different per environment).
- [ ] Set appropriate `timeout` for your application's performance.
- [ ] Enable `retries` in CI to handle flaky infrastructure.
- [ ] Configure `testIdAttribute` to match your project's data attributes.
- [ ] Use `trace: 'on-first-retry'` to balance debugging capability and performance.

---

## 7. Error Handling & Logging

### 📄 Custom Error Handling in Page Objects

```ts
import { Page, Locator, errors } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Safe click with detailed error message
   */
  async safeClick(locator: Locator, description: string) {
    try {
      await locator.click();
    } catch (error) {
      if (error instanceof errors.TimeoutError) {
        throw new Error(
          `❌ Timeout: Could not click "${description}" - Element not found or not clickable`
        );
      }
      throw error;
    }
  }

  /**
   * Wait for element with custom timeout and message
   */
  async waitForElement(
    locator: Locator,
    options?: { timeout?: number; state?: 'visible' | 'hidden' }
  ) {
    const timeout = options?.timeout ?? 30000;
    const state = options?.state ?? 'visible';

    await locator.waitFor({ state, timeout }).catch(() => {
      throw new Error(`❌ Element not ${state} after ${timeout}ms`);
    });
  }
}
```

### 📄 Logging Strategy in Hooks

```ts
import { After, Before } from '../fixtures';

// Custom logger utility
const log = {
  info: (msg: string) => console.log(`ℹ️  ${new Date().toISOString()} | ${msg}`),
  warn: (msg: string) => console.warn(`⚠️  ${new Date().toISOString()} | ${msg}`),
  error: (msg: string) => console.error(`❌ ${new Date().toISOString()} | ${msg}`),
  step: (msg: string) => console.log(`📍 ${new Date().toISOString()} | STEP: ${msg}`),
};

Before(async ({ page, $testInfo }) => {
  log.info(`Starting: ${$testInfo.title}`);
  log.info(`Tags: ${$testInfo.tags.join(', ')}`);
});

After(async ({ page, $testInfo }) => {
  if ($testInfo.status === 'failed') {
    log.error(`FAILED: ${$testInfo.title}`);
    log.error(`Error: ${$testInfo.error?.message}`);

    // Attach screenshot on failure (if not already done by config)
    await $testInfo.attach('failure-screenshot', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  } else {
    log.info(`PASSED: ${$testInfo.title}`);
  }
});
```

✅ Best practice:

- [ ] Create custom error messages with context (what action failed, where).
- [ ] Use structured logging with timestamps and severity levels.
- [ ] Attach screenshots/traces on failure for debugging.
- [ ] Wrap common actions in try-catch for graceful error handling.
- [ ] Log test metadata (title, tags) at start for traceability.

---

## 8. Debugging Tools & Techniques

### 🔍 Playwright Inspector (Interactive Debugging)

```bash
# Run tests with Playwright Inspector
PWDEBUG=1 npx playwright test

# Windows PowerShell
$env:PWDEBUG=1; npx playwright test
```

### 🔍 Trace Viewer (Post-mortem Debugging)

```ts
// playwright.config.ts - Enable trace
export default defineConfig({
  use: {
    trace: 'on-first-retry', // Options: 'on', 'off', 'on-first-retry', 'retain-on-failure'
  },
});
```

```bash
# View trace file after test failure
npx playwright show-trace ./test-results/[test-name]/trace.zip
```

### 🔍 Console Logging in Tests

```ts
// Add debug logging in step definitions
When('user performs complex action', async ({ page, [pageName]Page }) => {
  console.log('🔍 DEBUG: Starting complex action');
  console.log('🔍 DEBUG: Current URL:', page.url());

  await [pageName]Page.performAction('data');

  console.log('🔍 DEBUG: Action completed');
});
```

### 🔍 Pause Test Execution

```ts
// Pause test for manual inspection
Then('user verifies result', async ({ page }) => {
  await page.pause(); // Opens Playwright Inspector at this point
  // Continue with assertions after manual inspection
});
```

### 🔍 UI Mode (Visual Debugging)

```bash
# Run tests in UI mode for visual debugging
npx playwright test --ui
```

### 📄 Debug Helper Utility

```ts
// tests/utils/debug.ts
import { Page } from '@playwright/test';

export class DebugHelper {
  /**
   * Log all console messages from the page
   */
  static enableConsoleLogging(page: Page) {
    page.on('console', (msg) => {
      console.log(`📺 Browser Console [${msg.type()}]: ${msg.text()}`);
    });
  }

  /**
   * Log all network requests
   */
  static enableNetworkLogging(page: Page) {
    page.on('request', (req) => {
      console.log(`🌐 Request: ${req.method()} ${req.url()}`);
    });
    page.on('response', (res) => {
      console.log(`🌐 Response: ${res.status()} ${res.url()}`);
    });
  }

  /**
   * Take screenshot with timestamp
   */
  static async debugScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ path: `./debug-screenshots/${name}-${timestamp}.png` });
    console.log(`📸 Screenshot saved: ${name}-${timestamp}.png`);
  }

  /**
   * Log current page state
   */
  static async logPageState(page: Page) {
    console.log('📄 Current URL:', page.url());
    console.log('📄 Page Title:', await page.title());
    console.log('📄 Viewport:', page.viewportSize());
  }
}
```

✅ Best practice:

- [ ] Use `PWDEBUG=1` for step-by-step debugging.
- [ ] Enable Trace Viewer for failed tests to analyze step-by-step actions.
- [ ] Use `page.pause()` sparingly for manual inspection during development.
- [ ] Enable browser console/network logging when debugging complex scenarios.
- [ ] Use UI Mode (`--ui`) for visual test development and debugging.

---

## 9. API Testing Helper (Hybrid Testing)

### 📄 `tests/utils/api-helper.ts`

Use API calls to set up test preconditions faster than UI interactions.

```ts
import { APIRequestContext, request } from '@playwright/test';

export class APIHelper {
  private context: APIRequestContext | null = null;
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Initialize API context (call in Before hook or fixture)
   */
  async init(): Promise<void> {
    this.context = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Dispose API context (call in After hook)
   */
  async dispose(): Promise<void> {
    await this.context?.dispose();
  }

  /**
   * Create test data via API (faster than UI)
   */
  async createTestData<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    if (!this.context) throw new Error('APIHelper not initialized');

    const response = await this.context.post(endpoint, { data });

    if (!response.ok()) {
      throw new Error(`API Error: ${response.status()} - ${await response.text()}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Delete test data via API (cleanup)
   */
  async deleteTestData(endpoint: string, id: string): Promise<void> {
    if (!this.context) throw new Error('APIHelper not initialized');

    const response = await this.context.delete(`${endpoint}/${id}`);

    if (!response.ok() && response.status() !== 404) {
      console.warn(`⚠️ Cleanup warning: ${response.status()} for ${endpoint}/${id}`);
    }
  }

  /**
   * Login via API and return auth token/cookies
   */
  async loginViaAPI(credentials: { username: string; password: string }): Promise<string> {
    if (!this.context) throw new Error('APIHelper not initialized');

    const response = await this.context.post('/api/auth/login', {
      data: credentials,
    });

    if (!response.ok()) {
      throw new Error(`Login failed: ${response.status()}`);
    }

    const { token } = (await response.json()) as { token: string };
    return token;
  }

  /**
   * Health check - verify API is available
   */
  async healthCheck(): Promise<boolean> {
    if (!this.context) throw new Error('APIHelper not initialized');

    try {
      const response = await this.context.get('/api/health');
      return response.ok();
    } catch {
      return false;
    }
  }
}
```

### 📄 Using API Helper in Fixtures

```ts
// tests/fixtures/index.ts
import { test as base, createBdd } from 'playwright-bdd';
import { APIHelper } from '../utils/api-helper';

type MyFixtures = {
  apiHelper: APIHelper;
};

export const test = base.extend<MyFixtures>({
  apiHelper: async ({}, use) => {
    const helper = new APIHelper(process.env.API_BASE_URL || 'http://localhost:3000');
    await helper.init();
    await use(helper);
    await helper.dispose();
  },
});
```

### 📄 Using API Helper in Steps

```ts
import { expect } from '@playwright/test';
import { Given, Then } from '../fixtures';

// Define type for API response
interface Product {
  id: string;
  name: string;
  price: number;
}

// Hybrid Testing: API setup + UI verification
Given('a product exists in the system', async ({ apiHelper }) => {
  // Create test data via API (fast)
  const product = await apiHelper.createTestData<Product>('/api/products', {
    name: 'Test Product',
    price: 29.99,
  });
  console.log(`✅ Created product via API: ${product.id}`);
});

Then('I should see the product in the UI', async ({ page }) => {
  // Verify via UI (user perspective)
  await expect(page.getByText('Test Product')).toBeVisible();
});
```

✅ Best practice:

- [ ] Use API calls for test data setup (faster than UI clicks).
- [ ] Clean up test data via API in After hooks.
- [ ] Combine API setup with UI verification for realistic E2E tests.
- [ ] Include health checks before running tests.

---

## 10. CI/CD – GitHub Actions

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

      - name: Cache node modules
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

      - name: Cache Playwright browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: ${{ runner.os }}-playwright-${{ hashFiles('**/package-lock.json') }}

      - run: npm ci
      - run: npx playwright install --with-deps

      # Run specific suite based on input or logic
      - run: npm run test

      # Upload Allure Results for report generation
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-results
          path: allure-results
```

### 📄 Test Sharding for Large Test Suites

```yml
# Parallel execution across multiple machines
jobs:
  e2e:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      # ... setup steps ...
      - run: npx playwright test --shard=${{ matrix.shard }}/4
```

---

## 11. package.json Scripts

```json
{
  "scripts": {
    "test": "npx bddgen && npx playwright test",
    "test:ui": "npx bddgen && npx playwright test --ui",
    "test:headed": "npx bddgen && npx playwright test --headed",
    "test:debug": "npx bddgen && PWDEBUG=1 npx playwright test",
    "test:report": "npx allure generate -o ./allure-report ./allure-results",
    "test:report:open": "npm run test:report && npx allure open ./allure-report",
    "prepare": "husky install",
    "format": "prettier --write \"**/*.{js,ts,json,feature,md}\""
  }
}
```

✅ Best practice:

- [ ] Include `bddgen` in test scripts to auto-generate step files.
- [ ] Add `test:headed` script for local debugging.
- [ ] Add `test:debug` script with `PWDEBUG=1` for interactive debugging.
- [ ] Configure `husky` + `lint-staged` for pre-commit formatting.
- [ ] Include Allure report generation scripts.

---

## 12. Performance & Scalability Checklist

- [ ] **Tagging Strategy:** Organize tests by module (`@[module]`, `@[feature]`) and priority (`@smoke`, `@critical`, `@regression`).
- [ ] **Parallelism:** Enable `workers` in config to speed up execution.
- [ ] **CI Optimization:** Use Headless mode and cache dependencies.
- [ ] **Artifacts:** Capture Screenshot / Video only on failure to save storage.
- [ ] **Flakiness:** Use Retry + Trace Viewer ensuring stable results.
- [ ] **Test Sharding:** Distribute tests across multiple CI machines (`--shard=1/4`) for large suites.

---

## 13. Advanced Techniques (Speed & Stability)

- [ ] **Hybrid Testing (API + UI):** Use API RequestContext (`request`) to create pre-conditions instead of slow UI interactions. See Section 9 for implementation.
- [ ] **State Reuse:** Save authentication state (`storageState`) in `global-setup` to avoid repeated logins.
- [ ] **Network Mocking:** Use `page.route()` to simulate backend errors or test edge cases.
- [ ] **Smart Waiting:** Prefer `page.waitForResponse()` to verify backend processes complete.

### 📄 Global Setup with State Reuse

```ts
// tests/global-setup.ts
import { chromium } from '@playwright/test';
import path from 'path';

async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(process.env.BASE_URL || 'http://localhost:3000');

    // Perform login once
    await page.fill('[data-test="username"]', process.env.USERNAME || 'user');
    await page.fill('[data-test="password"]', process.env.PASSWORD || 'pass');
    await page.click('[data-test="login-button"]');

    await page.waitForURL('**/dashboard');

    // Save authentication state
    const statePath = path.join(process.cwd(), 'state.json');
    await context.storageState({ path: statePath });

    console.log('✅ Global setup: Login successful and state saved');
  } finally {
    await browser.close();
  }
}

export default globalSetup;
```

---

## 14. Code Quality & Naming Conventions

- [ ] **File Names:** `kebab-case` (e.g., `[page-name].ts`, `[feature-name].feature`).
- [ ] **Class Names:** `PascalCase` (e.g., `[PageName]Page`, `[Module]API`).
- [ ] **Methods/Variables:** `camelCase` (e.g., `submitForm`, `isValid`).
- [ ] **Test Tags:** Use distinct tags like `@smoke`, `@e2e`, `@[ticket-id]` for easy filtering.

---

## 15. Resilience & Verification Strategy

- [ ] **Visual Regression:** Implement `expect(page).toHaveScreenshot()` to catch UI regressions.
- [ ] **Soft Assertions:** Use `expect.soft()` to verify multiple conditions without stopping on first failure.
- [ ] **Network Mocking:** Use `page.route()` to simulate backend errors or edge cases.
- [ ] **Smart Waiting:** Prefer `page.waitForResponse()` over element-only waits.

### 📄 Network Mocking Helper

```ts
// tests/utils/network-helper.ts
import { Page } from '@playwright/test';

export class NetworkMockHelper {
  /**
   * Mock API endpoint with custom response
   */
  static async mockApiEndpoint(
    page: Page,
    urlPattern: string | RegExp,
    responseData: Record<string, unknown>,
    status: number = 200
  ): Promise<void> {
    await page.route(urlPattern, (route) => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(responseData),
      });
    });
  }

  /**
   * Simulate server error
   */
  static async mockServerError(page: Page, urlPattern: string | RegExp): Promise<void> {
    await page.route(urlPattern, (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });
  }

  /**
   * Simulate slow network
   */
  static async simulateSlowNetwork(page: Page, delayMs: number = 2000): Promise<void> {
    await page.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      await route.continue();
    });
  }
}
```

---

## 16. Accessibility Testing

Integrate accessibility testing to ensure your application is usable by everyone.

### 📦 Installation

```bash
npm install --save-dev @axe-core/playwright
```

### 📄 Accessibility Helper

```ts
// tests/utils/accessibility-helper.ts
import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export class AccessibilityHelper {
  /**
   * Run full accessibility scan on current page
   */
  static async scanPage(page: Page): Promise<{
    violations: Array<{
      id: string;
      impact: string;
      description: string;
      nodes: number;
    }>;
    passes: number;
  }> {
    const results = await new AxeBuilder({ page }).analyze();

    const violations = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact || 'unknown',
      description: v.description,
      nodes: v.nodes.length,
    }));

    return {
      violations,
      passes: results.passes.length,
    };
  }

  /**
   * Run accessibility scan with specific rules
   */
  static async scanWithRules(
    page: Page,
    rules: string[] // e.g., ['color-contrast', 'label']
  ): Promise<number> {
    const results = await new AxeBuilder({ page }).withRules(rules).analyze();

    return results.violations.length;
  }

  /**
   * Run accessibility scan excluding specific rules
   */
  static async scanExcludingRules(
    page: Page,
    excludeRules: string[] // e.g., ['color-contrast']
  ): Promise<number> {
    const results = await new AxeBuilder({ page }).disableRules(excludeRules).analyze();

    return results.violations.length;
  }

  /**
   * Scan specific element/component
   */
  static async scanComponent(page: Page, selector: string): Promise<number> {
    const results = await new AxeBuilder({ page }).include(selector).analyze();

    return results.violations.length;
  }
}
```

### 📄 Accessibility Step Definitions

```ts
// tests/steps/accessibility.steps.ts
import { expect } from '@playwright/test';
import { Then } from '../fixtures';
import { AccessibilityHelper } from '../utils/accessibility-helper';

Then('the page should have no accessibility violations', async ({ page }) => {
  const { violations } = await AccessibilityHelper.scanPage(page);

  if (violations.length > 0) {
    console.log('❌ Accessibility Violations Found:');
    violations.forEach((v) => {
      console.log(
        `  - [${v.impact.toUpperCase()}] ${v.id}: ${v.description} (${v.nodes} elements)`
      );
    });
  }

  expect(violations.length, `Found ${violations.length} accessibility violations`).toBe(0);
});

Then('the {string} component should be accessible', async ({ page }, selector: string) => {
  const violationCount = await AccessibilityHelper.scanComponent(page, selector);
  expect(violationCount).toBe(0);
});
```

### 📄 Feature File Example

```gherkin
@accessibility
Feature: Accessibility Compliance

  Scenario: Login page meets WCAG standards
    Given user is on the login page
    Then the page should have no accessibility violations

  Scenario: Form components are accessible
    Given user is on the registration page
    Then the "form" component should be accessible
```

✅ Best practice:

- [ ] Run accessibility scans on all critical pages.
- [ ] Include accessibility tests in CI/CD pipeline.
- [ ] Focus on critical/serious violations first.
- [ ] Test individual components for modular accessibility.
- [ ] Document known exceptions with justification.

---

## 17. Test Data & Security (Data Strategy)

- [ ] **Dynamic Data:** Avoid hardcoded values. Use `@faker-js/faker` for unique emails/names.
- [ ] **Secret Management:** NEVER commit passwords. Use `.env` and `process.env`.
- [ ] **Data Cleanup:** Implement teardown hooks or API calls to delete test data.

### 📄 Dynamic Data with Faker

```ts
import { faker } from '@faker-js/faker';

// Generate unique test data
const testUser = {
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress(),
  zipCode: faker.location.zipCode(),
};

console.log(`🎲 Generated: ${testUser.firstName} ${testUser.lastName}`);
```

---

## 18. Cross-Browser & Environment Strategy

- [ ] **Multi-Browser:** Configure projects for `chromium`, `firefox`, and `webkit`.
- [ ] **Mobile Viewports:** Add projects using `devices` (e.g., 'iPhone 12', 'Pixel 5').
- [ ] **Environment Agnostic:** Tests run on any environment by changing `BASE_URL`.

### 📄 Multi-Browser Configuration

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

---

## 19. Enterprise Checklist Summary

| Category             | Status | Key Points                                                     |
| -------------------- | ------ | -------------------------------------------------------------- |
| **Architecture**     | ⬜     | POM pattern, Fixtures/Hooks, Clean separation of concerns      |
| **Stability**        | ⬜     | `getByRole`, `data-testid`, auto-waiting, no hardcoded waits   |
| **Error Handling**   | ⬜     | Custom error messages, structured logging, failure attachments |
| **Debugging**        | ⬜     | Trace Viewer, Inspector, UI Mode, Debug utilities              |
| **API Testing**      | ⬜     | Hybrid testing, API helpers, fast precondition setup           |
| **CI/CD**            | ⬜     | GitHub Actions, Allure reporting, artifact management          |
| **Performance**      | ⬜     | Core Web Vitals, Lighthouse, performance budgets               |
| **Code Quality**     | ⬜     | Naming conventions, step reuse, maintainability                |
| **Resilience**       | ⬜     | Visual regression, smart waiting, network mocking              |
| **Accessibility**    | ⬜     | WCAG compliance, axe-core, keyboard navigation                 |
| **Security**         | ⬜     | XSS testing, security headers, open redirect prevention        |
| **Scalability**      | ⬜     | Cross-browser, faker data generation, cleanup hooks            |
| **Authentication**   | ⬜     | OAuth/SSO, session management, storageState reuse              |
| **File Handling**    | ⬜     | Upload, download, drag-and-drop, PDF testing                   |
| **Email Testing**    | ⬜     | Mailhog/Mailtrap, verification flows                           |
| **Flaky Management** | ⬜     | Detection, quarantine, retry strategies                        |
| **Documentation**    | ⬜     | Living docs, coverage matrix, BDD as specs                     |
| **Multi-tab/Window** | ⬜     | Popups, new tabs, cross-tab communication                      |
| **Storage**          | ⬜     | Cookie, localStorage, sessionStorage management                |
| **Database**         | ⬜     | Seeding, reset, test-specific API endpoints                    |
| **Mobile**           | ⬜     | Touch gestures, swipe, orientation testing                     |
| **WebSocket**        | ⬜     | Real-time testing, message interception                        |
| **GraphQL**          | ⬜     | Query mocking, mutation testing                                |
| **Component**        | ⬜     | Playwright CT, isolated component testing                      |
| **Data Factories**   | ⬜     | Factory pattern, test data generation                          |

---

## 20. Quick Reference Checklist

### Core Implementation

- [ ] **Clean Code:** Separation of Concerns (Feature vs Step vs Page).
- [ ] **Stability:** Prefer `getByRole`, `data-testid` (Test IDs).
- [ ] **No Flakiness:** Avoid hard-coded waits (`waitForTimeout`).
- [ ] **Independence:** Tests run concurrently without shared state.
- [ ] **Visibility:** Automated Reporting (Allure) & CI/CD integration.
- [ ] **Maintainability:** Step reuse and clear naming conventions.

### Advanced Features

- [ ] **Error Handling:** Custom error messages and structured logging.
- [ ] **Debugging:** Trace Viewer, Inspector, and Debug utilities.
- [ ] **API Testing:** Hybrid testing with API helpers.
- [ ] **Resilience:** Visual regression and smart waiting.
- [ ] **Network Mocking:** `page.route()` for backend simulation.
- [ ] **Soft Assertions:** `expect.soft()` for multiple verifications.
- [ ] **Console Monitoring:** Detect JS errors automatically.

### Enterprise Requirements

- [ ] **Accessibility:** WCAG compliance, keyboard navigation.
- [ ] **Security:** XSS testing, security headers verification.
- [ ] **Scalability:** Dynamic data with `@faker-js/faker`.
- [ ] **Data Cleanup:** Teardown hooks for test isolation.
- [ ] **Test Sharding:** Distributed execution for large suites.
- [ ] **Cross-Browser:** Multi-browser and mobile viewport testing.
- [ ] **Performance:** Core Web Vitals, Lighthouse audits.

### Advanced Scenarios

- [ ] **Authentication:** OAuth/SSO, session reuse, MFA testing.
- [ ] **File Handling:** Upload, download, drag-and-drop, PDF.
- [ ] **iFrame/Shadow DOM:** Third-party widgets, web components.
- [ ] **Email Testing:** Verification flows with Mailhog/Mailtrap.
- [ ] **Geolocation:** Location-based features, timezone testing.
- [ ] **Flaky Management:** Detection, quarantine, retry strategies.
- [ ] **Custom Reporters:** Slack/Teams notifications.
- [ ] **Living Documentation:** BDD as specs, coverage matrix.

### Specialized Testing

- [ ] **Multi-tab/Window:** Popups, new tabs, cross-tab communication.
- [ ] **Keyboard Navigation:** Tab order, shortcuts, focus management.
- [ ] **Storage Management:** Cookie, localStorage, sessionStorage.
- [ ] **Database Seeding:** API-based seeding, reset between tests.
- [ ] **Mobile Gestures:** Touch, swipe, long-press, orientation.
- [ ] **WebSocket:** Real-time testing, message interception.
- [ ] **GraphQL:** Query/mutation mocking, error handling.
- [ ] **Component Testing:** Playwright CT for isolated components.
- [ ] **Data Factories:** Factory pattern for test data generation.
- [ ] **Retry Patterns:** Exponential backoff, error recovery.

---

## 21. Performance Testing

Measure and validate application performance metrics.

### 📦 Installation

```bash
npm install --save-dev playwright-lighthouse
```

### 📄 Performance Helper

```ts
// tests/utils/performance-helper.ts
import { Page } from '@playwright/test';

export class PerformanceHelper {
  /**
   * Get Core Web Vitals metrics
   */
  static async getCoreWebVitals(page: Page): Promise<{
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  }> {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        let lcp = 0,
          fid = 0,
          cls = 0;

        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          lcp = entries[entries.length - 1].startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          fid = entries[0].processingStart - entries[0].startTime;
        }).observe({ type: 'first-input', buffered: true });

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => resolve({ lcp, fid, cls }), 3000);
      });
    });
  }

  /**
   * Get page load timing
   */
  static async getPageLoadTiming(page: Page): Promise<{
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
  }> {
    return await page.evaluate(() => {
      const timing = performance.timing;
      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find((e) => e.name === 'first-paint');

      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        firstPaint: firstPaint?.startTime || 0,
      };
    });
  }
}
```

✅ Best practice:

- [ ] Measure Core Web Vitals (LCP, FID, CLS) on critical pages.
- [ ] Set performance budgets and fail tests if exceeded.
- [ ] Run performance tests in CI on dedicated, consistent infrastructure.
- [ ] Compare metrics against baseline to detect regressions.
- [ ] Use Lighthouse for comprehensive audits.

---

## 22. Authentication Patterns

Handle various authentication scenarios.

### 📄 OAuth/SSO Helper

```ts
// tests/utils/auth-helper.ts
import { Page, BrowserContext } from '@playwright/test';

export class AuthHelper {
  /**
   * Handle OAuth popup flow
   */
  static async handleOAuthPopup(
    page: Page,
    triggerSelector: string,
    credentials: { email: string; password: string }
  ): Promise<void> {
    const [popup] = await Promise.all([page.waitForEvent('popup'), page.click(triggerSelector)]);

    await popup.waitForLoadState();
    await popup.fill('input[type="email"]', credentials.email);
    await popup.click('button[type="submit"]');
    await popup.fill('input[type="password"]', credentials.password);
    await popup.click('button[type="submit"]');

    // Popup closes automatically, wait for main page redirect
    await page.waitForURL('**/dashboard');
  }

  /**
   * Set authentication cookies directly
   */
  static async setAuthCookies(
    context: BrowserContext,
    cookies: Array<{ name: string; value: string; domain: string }>
  ): Promise<void> {
    await context.addCookies(cookies);
  }

  /**
   * Set JWT token in localStorage
   */
  static async setJwtToken(page: Page, token: string): Promise<void> {
    await page.evaluate((t) => {
      localStorage.setItem('authToken', t);
    }, token);
  }

  /**
   * Clear all authentication state
   */
  static async clearAuth(context: BrowserContext): Promise<void> {
    await context.clearCookies();
  }
}
```

✅ Best practice:

- [ ] Use `storageState` for session reuse across tests.
- [ ] Handle OAuth/SSO popups with `page.waitForEvent('popup')`.
- [ ] Implement API-based login for faster test setup.
- [ ] Test session expiry and token refresh scenarios.
- [ ] Separate auth tests from feature tests (test auth once, reuse state).

---

## 23. File Upload & Download Testing

### 📄 File Handling Examples

```ts
import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';
import path from 'path';
import fs from 'fs';

// File Upload
When('I upload a file {string}', async ({ page }, fileName: string) => {
  const filePath = path.join(__dirname, '../test-data/', fileName);
  await page.setInputFiles('input[type="file"]', filePath);
});

// Multiple File Upload
When('I upload multiple files', async ({ page }) => {
  const files = ['file1.pdf', 'file2.pdf'].map((f) => path.join(__dirname, '../test-data/', f));
  await page.setInputFiles('input[type="file"]', files);
});

// File Download
Then('I can download the report', async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button#download-report'),
  ]);

  const filePath = await download.path();
  expect(filePath).toBeTruthy();

  // Verify file content
  const content = fs.readFileSync(filePath!, 'utf-8');
  expect(content).toContain('Report Data');
});

// Drag and Drop Upload
When('I drag and drop a file', async ({ page }) => {
  const filePath = path.join(__dirname, '../test-data/image.png');
  const buffer = fs.readFileSync(filePath);

  const dataTransfer = await page.evaluateHandle(
    (data) => {
      const dt = new DataTransfer();
      const file = new File([new Uint8Array(data)], 'image.png', { type: 'image/png' });
      dt.items.add(file);
      return dt;
    },
    [...buffer]
  );

  await page.dispatchEvent('.dropzone', 'drop', { dataTransfer });
});
```

✅ Best practice:

- [ ] Store test files in `tests/test-data/` directory.
- [ ] Clean up downloaded files after tests.
- [ ] Test file size limits and invalid file types.
- [ ] Handle drag-and-drop uploads separately.
- [ ] Verify file content, not just successful upload status.

---

## 24. iFrame & Shadow DOM Handling

### 📄 iFrame Helper

```ts
import { Page, FrameLocator } from '@playwright/test';

export class IFrameHelper {
  /**
   * Get frame by various selectors
   */
  static getFrame(page: Page, selector: string): FrameLocator {
    return page.frameLocator(selector);
  }

  /**
   * Interact with nested iframes
   */
  static getNestedFrame(page: Page, selectors: string[]): FrameLocator {
    let frame = page.frameLocator(selectors[0]);
    for (let i = 1; i < selectors.length; i++) {
      frame = frame.frameLocator(selectors[i]);
    }
    return frame;
  }

  /**
   * Example: Stripe payment iframe
   */
  static async fillStripeCard(page: Page, cardNumber: string): Promise<void> {
    const stripeFrame = page.frameLocator('iframe[name*="stripe"]');
    await stripeFrame.locator('[name="cardnumber"]').fill(cardNumber);
  }
}
```

### 📄 Shadow DOM Examples

```ts
// Access shadow DOM elements
Then('I can interact with shadow DOM', async ({ page }) => {
  // Method 1: Direct piercing (>> operator)
  await page.locator('my-component >> button.inner-btn').click();

  // Method 2: Evaluate inside shadow root
  await page.evaluate(() => {
    const host = document.querySelector('my-component');
    const shadowBtn = host?.shadowRoot?.querySelector('button');
    shadowBtn?.click();
  });

  // Method 3: Using locator with shadow piercing
  await page.locator('my-component').locator('button.inner-btn').click();
});
```

✅ Best practice:

- [ ] Use `frameLocator()` for iframes, never `frame()` for new code.
- [ ] Handle third-party iframes (Stripe, reCAPTCHA) with dedicated helpers.
- [ ] Use `>>` pierce selector for shadow DOM.
- [ ] Wait for iframe content to load before interacting.
- [ ] Test iframe communication (postMessage) scenarios.

---

## 25. Email Testing Integration

### 📄 Mailhog/Mailtrap Helper

```ts
// tests/utils/email-helper.ts
import { request } from '@playwright/test';

interface Email {
  id: string;
  to: string;
  subject: string;
  body: string;
  html: string;
}

export class EmailHelper {
  private baseUrl: string;

  constructor(mailhogUrl: string = 'http://localhost:8025') {
    this.baseUrl = mailhogUrl;
  }

  /**
   * Get all emails for a recipient
   */
  async getEmailsFor(recipient: string): Promise<Email[]> {
    const context = await request.newContext();
    const response = await context.get(`${this.baseUrl}/api/v2/search?kind=to&query=${recipient}`);
    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.ID,
      to: item.To[0].Mailbox + '@' + item.To[0].Domain,
      subject: item.Content.Headers.Subject[0],
      body: item.Content.Body,
      html: item.MIME?.Parts?.[1]?.Body || '',
    }));
  }

  /**
   * Wait for email to arrive
   */
  async waitForEmail(
    recipient: string,
    subject: string,
    timeoutMs: number = 30000
  ): Promise<Email> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const emails = await this.getEmailsFor(recipient);
      const found = emails.find((e) => e.subject.includes(subject));
      if (found) return found;
      await new Promise((r) => setTimeout(r, 1000));
    }

    throw new Error(`Email with subject "${subject}" not received within ${timeoutMs}ms`);
  }

  /**
   * Extract verification link from email
   */
  extractLink(emailBody: string, pattern: RegExp = /https?:\/\/[^\s"]+/): string | null {
    const match = emailBody.match(pattern);
    return match ? match[0] : null;
  }

  /**
   * Delete all emails (cleanup)
   */
  async deleteAll(): Promise<void> {
    const context = await request.newContext();
    await context.delete(`${this.baseUrl}/api/v1/messages`);
  }
}
```

### 📄 Usage in Tests

```ts
Given('I register with email {string}', async ({ page }, email: string) => {
  await page.fill('[data-test="email"]', email);
  await page.click('[data-test="register"]');
});

Then('I receive a verification email', async ({}, email: string) => {
  const emailHelper = new EmailHelper();
  const receivedEmail = await emailHelper.waitForEmail(email, 'Verify your email');

  const verifyLink = emailHelper.extractLink(receivedEmail.html);
  expect(verifyLink).toBeTruthy();
});
```

✅ Best practice:

- [ ] Use Mailhog/Mailtrap for local email testing (not real SMTP).
- [ ] Clean up emails before/after each test.
- [ ] Set reasonable timeouts for email arrival.
- [ ] Extract and verify links, tokens from emails.
- [ ] Test email content (subject, body, attachments).

---

## 26. Console Error Monitoring

Automatically detect JavaScript errors during tests.

### 📄 Console Monitor Setup

```ts
// tests/utils/console-monitor.ts
import { Page } from '@playwright/test';

interface ConsoleError {
  type: string;
  message: string;
  url: string;
}

export class ConsoleMonitor {
  private errors: ConsoleError[] = [];
  private warnings: ConsoleError[] = [];

  /**
   * Start monitoring console
   */
  attach(page: Page): void {
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        this.errors.push({
          type: 'console.error',
          message: msg.text(),
          url: page.url(),
        });
      }
      if (msg.type() === 'warning') {
        this.warnings.push({
          type: 'console.warn',
          message: msg.text(),
          url: page.url(),
        });
      }
    });

    page.on('pageerror', (error) => {
      this.errors.push({
        type: 'uncaught',
        message: error.message,
        url: page.url(),
      });
    });
  }

  getErrors(): ConsoleError[] {
    return this.errors;
  }

  getWarnings(): ConsoleError[] {
    return this.warnings;
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  clear(): void {
    this.errors = [];
    this.warnings = [];
  }
}
```

### 📄 Integration with Hooks

```ts
// tests/hooks/index.ts
import { After, Before } from '../fixtures';
import { ConsoleMonitor } from '../utils/console-monitor';

let consoleMonitor: ConsoleMonitor;

Before(async ({ page }) => {
  consoleMonitor = new ConsoleMonitor();
  consoleMonitor.attach(page);
});

After(async ({ $testInfo }) => {
  if (consoleMonitor.hasErrors()) {
    const errors = consoleMonitor.getErrors();
    console.log('⚠️ Console errors detected:');
    errors.forEach((e) => console.log(`  - [${e.type}] ${e.message}`));

    // Optionally fail the test
    // throw new Error(`Test produced ${errors.length} console error(s)`);
  }
});
```

✅ Best practice:

- [ ] Monitor console errors in all tests.
- [ ] Decide whether to fail tests on console errors (strict mode).
- [ ] Whitelist known/acceptable errors.
- [ ] Log errors for debugging even if not failing.
- [ ] Track uncaught exceptions separately from console.error.

---

## 27. Geolocation & Timezone Testing

### 📄 Location Emulation

```ts
// playwright.config.ts - Set default geolocation
export default defineConfig({
  use: {
    geolocation: { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
    permissions: ['geolocation'],
    timezoneId: 'America/Los_Angeles',
    locale: 'en-US',
  },
});
```

### 📄 Dynamic Location Changes

```ts
Given('I am browsing from {string}', async ({ context }, location: string) => {
  const locations: Record<string, { lat: number; lon: number; tz: string }> = {
    Tokyo: { lat: 35.6762, lon: 139.6503, tz: 'Asia/Tokyo' },
    London: { lat: 51.5074, lon: -0.1278, tz: 'Europe/London' },
    'New York': { lat: 40.7128, lon: -74.006, tz: 'America/New_York' },
    Vietnam: { lat: 21.0285, lon: 105.8542, tz: 'Asia/Ho_Chi_Minh' },
  };

  const loc = locations[location];
  await context.setGeolocation({ latitude: loc.lat, longitude: loc.lon });
});

Then('I see prices in {string}', async ({ page }, currency: string) => {
  await expect(page.locator('.currency-symbol')).toHaveText(currency);
});
```

✅ Best practice:

- [ ] Test location-based features (currency, language, content).
- [ ] Verify timezone-dependent logic (scheduling, timestamps).
- [ ] Test geolocation permission denied scenarios.
- [ ] Use consistent timezones in CI to avoid flakiness.
- [ ] Test locale-specific formatting (dates, numbers).

---

## 28. Flaky Test Management

### 📄 Retry Configuration

```ts
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,

  // Per-project retry settings
  projects: [
    {
      name: 'stable',
      testMatch: /stable\/.*.spec.ts/,
      retries: 0,
    },
    {
      name: 'flaky-prone',
      testMatch: /integration\/.*.spec.ts/,
      retries: 3,
    },
  ],
});
```

### 📄 Flaky Test Detection Script

```ts
// scripts/detect-flaky.ts
import { execSync } from 'child_process';

const RUNS = 5;
const results: Map<string, { passed: number; failed: number }> = new Map();

for (let i = 0; i < RUNS; i++) {
  try {
    execSync('npx playwright test --reporter=json', { encoding: 'utf-8' });
  } catch (error: any) {
    const output = JSON.parse(error.stdout);
    output.suites.forEach((suite: any) => {
      suite.specs.forEach((spec: any) => {
        const key = `${suite.title} > ${spec.title}`;
        const current = results.get(key) || { passed: 0, failed: 0 };
        spec.ok ? current.passed++ : current.failed++;
        results.set(key, current);
      });
    });
  }
}

// Report flaky tests (passed and failed in same run series)
console.log('🔍 Flaky Test Report:');
results.forEach((stats, test) => {
  if (stats.passed > 0 && stats.failed > 0) {
    const flakyRate = ((stats.failed / RUNS) * 100).toFixed(1);
    console.log(`  ⚠️ ${test} - ${flakyRate}% flaky`);
  }
});
```

### 📄 Quarantine Pattern

```ts
// Mark flaky tests for skip in CI
test.describe('Feature tests', () => {
  // Quarantined: Intermittent failure due to timing - JIRA-123
  test.skip(process.env.CI === 'true', 'Quarantined in CI');

  test('flaky test being investigated', async ({ page }) => {
    // Test code
  });
});
```

✅ Best practice:

- [ ] Run tests multiple times to detect flaky tests before merging.
- [ ] Use `retries` strategically (more in CI, none locally).
- [ ] Quarantine flaky tests instead of deleting them.
- [ ] Track flaky test rate as a quality metric.
- [ ] Fix root causes: timing issues, test isolation, external dependencies.

---

## 29. Custom Reporters

### 📄 Slack Notification Reporter

```ts
// tests/reporters/slack-reporter.ts
import type { Reporter, FullResult, TestCase, TestResult } from '@playwright/test/reporter';

class SlackReporter implements Reporter {
  private failed: string[] = [];
  private passed = 0;

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'failed') {
      this.failed.push(test.title);
    } else if (result.status === 'passed') {
      this.passed++;
    }
  }

  async onEnd(result: FullResult) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) return;

    const status = result.status === 'passed' ? '✅' : '❌';
    const message = {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${status} *E2E Test Results*\n• Passed: ${this.passed}\n• Failed: ${this.failed.length}`,
          },
        },
      ],
    };

    if (this.failed.length > 0) {
      message.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Failed Tests:*\n${this.failed.map((t) => `• ${t}`).join('\n')}`,
        },
      });
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  }
}

export default SlackReporter;
```

### 📄 Using Custom Reporter

```ts
// playwright.config.ts
export default defineConfig({
  reporter: [['html'], ['allure-playwright'], ['./tests/reporters/slack-reporter.ts']],
});
```

✅ Best practice:

- [ ] Send notifications only on failure to avoid noise.
- [ ] Include actionable information (failed test names, links).
- [ ] Integrate with team's communication tools (Slack, Teams, Discord).
- [ ] Create dashboards for test metrics over time.
- [ ] Use conditional reporters (only in CI, only on main branch).

---

## 30. Test Documentation & Living Docs

### 📄 BDD as Documentation

```gherkin
# Feature files serve as living documentation

@login
@security
Feature: User Authentication
  As a registered user
  I want to securely log into my account
  So that I can access my personalized dashboard

  Background:
    Given the login page is accessible
    And the user database is available

  @smoke
  @critical
  Scenario: Successful login with valid credentials
    Given I am a registered user with email "user@example.com"
    When I enter my email and password
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see my username in the header

  @security
  @negative
  Scenario: Account lockout after failed attempts
    Given I am a registered user
    When I enter wrong password 5 times
    Then my account should be temporarily locked
    And I should see a lockout message with remaining time
```

### 📄 Test Coverage Matrix

```markdown
<!-- tests/docs/COVERAGE.md -->

# Test Coverage Matrix

| Feature  | Unit | Integration | E2E | Visual | A11y |
| -------- | :--: | :---------: | :-: | :----: | :--: |
| Login    |  ✅  |     ✅      | ✅  |   ✅   |  ✅  |
| Cart     |  ✅  |     ✅      | ✅  |   ⬜   |  ✅  |
| Checkout |  ✅  |     ⬜      | ✅  |   ⬜   |  ⬜  |
| Profile  |  ✅  |     ✅      | ⬜  |   ⬜   |  ⬜  |

Last Updated: 2026-01-14
```

✅ Best practice:

- [ ] Use Gherkin features as user-facing documentation.
- [ ] Keep scenarios focused on WHAT, not HOW.
- [ ] Generate test reports that stakeholders can understand.
- [ ] Maintain a test coverage matrix for visibility.
- [ ] Link tests to requirements/tickets (using tags like `@JIRA-123`).

---

## 31. Multi-tab & Multi-window Testing

### 📄 Handling New Tabs/Windows

```ts
import { expect } from '@playwright/test';
import { When, Then } from '../fixtures';

// Handle new tab opened by click
When('I click link that opens new tab', async ({ page, context }) => {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click('a[target="_blank"]'),
  ]);

  await newPage.waitForLoadState();
  console.log('📄 New tab URL:', newPage.url());

  // Switch focus to new tab
  await newPage.bringToFront();
});

// Handle popup window
When('I click button that opens popup', async ({ page }) => {
  const [popup] = await Promise.all([page.waitForEvent('popup'), page.click('#open-popup')]);

  await popup.waitForLoadState();
  await popup.fill('#popup-input', 'data');
  await popup.close();
});

// Work with multiple pages
Then('I can switch between tabs', async ({ context }) => {
  const pages = context.pages();
  console.log(`📄 Open tabs: ${pages.length}`);

  // Switch to specific tab
  await pages[1].bringToFront();
  await expect(pages[1]).toHaveURL(/expected-url/);
});
```

✅ Best practice:

- [ ] Use `context.waitForEvent('page')` for new tabs.
- [ ] Use `page.waitForEvent('popup')` for popup windows.
- [ ] Always `waitForLoadState()` before interacting with new page.
- [ ] Close popups/tabs after use to prevent resource leaks.
- [ ] Test cross-tab communication scenarios.

---

## 32. Keyboard Navigation & Accessibility

### 📄 Keyboard Testing Helper

```ts
import { Page, expect } from '@playwright/test';

export class KeyboardHelper {
  /**
   * Navigate through focusable elements using Tab
   */
  static async tabThrough(page: Page, count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await page.keyboard.press('Tab');
    }
  }

  /**
   * Verify tab order matches expected elements
   */
  static async verifyTabOrder(page: Page, expectedSelectors: string[]): Promise<void> {
    for (const selector of expectedSelectors) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      await expect(focused).toHaveAttribute(
        'data-test',
        selector.replace('[data-test="', '').replace('"]', '')
      );
    }
  }

  /**
   * Common keyboard shortcuts
   */
  static async pressShortcut(page: Page, shortcut: string): Promise<void> {
    const shortcuts: Record<string, string[]> = {
      copy: ['Control', 'c'],
      paste: ['Control', 'v'],
      undo: ['Control', 'z'],
      save: ['Control', 's'],
      selectAll: ['Control', 'a'],
      escape: ['Escape'],
      enter: ['Enter'],
    };

    const keys = shortcuts[shortcut];
    if (keys.length === 1) {
      await page.keyboard.press(keys[0]);
    } else {
      await page.keyboard.press(`${keys[0]}+${keys[1]}`);
    }
  }
}
```

### 📄 Keyboard Navigation Steps

```ts
Then('I can navigate the form using keyboard only', async ({ page }) => {
  // Start from first focusable element
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('data-test', 'username');

  // Fill using keyboard
  await page.keyboard.type('testuser');
  await page.keyboard.press('Tab');
  await page.keyboard.type('password123');

  // Submit with Enter
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/dashboard/);
});

Then('dropdown is keyboard accessible', async ({ page }) => {
  await page.keyboard.press('Tab'); // Focus dropdown
  await page.keyboard.press('Space'); // Open dropdown
  await page.keyboard.press('ArrowDown'); // Navigate
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter'); // Select
});
```

✅ Best practice:

- [ ] Test complete flows using keyboard only (no mouse).
- [ ] Verify logical tab order on all pages.
- [ ] Test keyboard shortcuts if application supports them.
- [ ] Ensure focus indicators are visible.
- [ ] Test screen reader compatibility with ARIA labels.

---

## 33. Cookie & Storage Management

### 📄 Storage Helper

```ts
import { Page, BrowserContext } from '@playwright/test';

export class StorageHelper {
  /**
   * Set localStorage items
   */
  static async setLocalStorage(page: Page, items: Record<string, string>): Promise<void> {
    await page.evaluate((data) => {
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    }, items);
  }

  /**
   * Get localStorage item
   */
  static async getLocalStorage(page: Page, key: string): Promise<string | null> {
    return await page.evaluate((k) => localStorage.getItem(k), key);
  }

  /**
   * Clear all localStorage
   */
  static async clearLocalStorage(page: Page): Promise<void> {
    await page.evaluate(() => localStorage.clear());
  }

  /**
   * Set sessionStorage items
   */
  static async setSessionStorage(page: Page, items: Record<string, string>): Promise<void> {
    await page.evaluate((data) => {
      Object.entries(data).forEach(([key, value]) => {
        sessionStorage.setItem(key, value);
      });
    }, items);
  }

  /**
   * Set cookies
   */
  static async setCookies(
    context: BrowserContext,
    cookies: Array<{
      name: string;
      value: string;
      domain: string;
      path?: string;
      expires?: number;
      httpOnly?: boolean;
      secure?: boolean;
    }>
  ): Promise<void> {
    await context.addCookies(cookies);
  }

  /**
   * Get all cookies
   */
  static async getCookies(
    context: BrowserContext
  ): Promise<Array<{ name: string; value: string }>> {
    return await context.cookies();
  }

  /**
   * Clear all cookies
   */
  static async clearCookies(context: BrowserContext): Promise<void> {
    await context.clearCookies();
  }
}
```

### 📄 Usage Examples

```ts
Given('user has dark mode preference saved', async ({ page }) => {
  await StorageHelper.setLocalStorage(page, {
    theme: 'dark',
    language: 'vi',
  });
  await page.reload();
});

Given('user has valid session cookie', async ({ context }) => {
  await StorageHelper.setCookies(context, [
    {
      name: 'session_id',
      value: 'abc123',
      domain: 'example.com',
      httpOnly: true,
    },
  ]);
});

After(async ({ page, context }) => {
  // Cleanup
  await StorageHelper.clearLocalStorage(page);
  await StorageHelper.clearCookies(context);
});
```

✅ Best practice:

- [ ] Use storage to set up test preconditions quickly.
- [ ] Clear storage in After hooks for test isolation.
- [ ] Test storage persistence across page reloads.
- [ ] Verify cookie attributes (httpOnly, secure, expiry).
- [ ] Test storage quota exceeded scenarios.

---

## 34. Database Seeding & State Management

### 📄 Database Helper

```ts
// tests/utils/db-helper.ts
import { request } from '@playwright/test';

export class DatabaseHelper {
  private apiUrl: string;

  constructor(apiUrl: string = process.env.API_URL || 'http://localhost:3000') {
    this.apiUrl = apiUrl;
  }

  /**
   * Seed database with test data via API
   */
  async seedTestData(dataset: string): Promise<void> {
    const context = await request.newContext();
    const response = await context.post(`${this.apiUrl}/api/test/seed`, {
      data: { dataset },
      headers: { 'X-Test-Mode': 'true' },
    });

    if (!response.ok()) {
      throw new Error(`Failed to seed database: ${response.status()}`);
    }

    console.log(`✅ Database seeded with dataset: ${dataset}`);
    await context.dispose();
  }

  /**
   * Reset database to clean state
   */
  async resetDatabase(): Promise<void> {
    const context = await request.newContext();
    await context.post(`${this.apiUrl}/api/test/reset`, {
      headers: { 'X-Test-Mode': 'true' },
    });

    console.log('✅ Database reset to clean state');
    await context.dispose();
  }

  /**
   * Create specific test entities
   */
  async createUser(userData: {
    email: string;
    role: string;
  }): Promise<{ id: string; email: string }> {
    const context = await request.newContext();
    const response = await context.post(`${this.apiUrl}/api/test/users`, {
      data: userData,
    });

    const user = await response.json();
    await context.dispose();
    return user;
  }

  /**
   * Delete test user
   */
  async deleteUser(userId: string): Promise<void> {
    const context = await request.newContext();
    await context.delete(`${this.apiUrl}/api/test/users/${userId}`);
    await context.dispose();
  }
}
```

### 📄 Global Setup with Database

```ts
// tests/global-setup.ts
import { DatabaseHelper } from './utils/db-helper';

async function globalSetup() {
  const db = new DatabaseHelper();

  // Reset to known state before test run
  await db.resetDatabase();

  // Seed with base test data
  await db.seedTestData('base');

  console.log('✅ Global setup: Database prepared');
}

export default globalSetup;
```

✅ Best practice:

- [ ] Reset database before each test run (global-setup).
- [ ] Use API endpoints for seeding (not direct DB access).
- [ ] Create test-specific endpoints protected by X-Test-Mode header.
- [ ] Seed minimal data needed for tests.
- [ ] Use database transactions for faster cleanup.

---

## 35. Mobile Gestures & Touch Testing

### 📄 Mobile Gesture Helper

```ts
import { Page } from '@playwright/test';

export class MobileGestureHelper {
  /**
   * Perform swipe gesture
   */
  static async swipe(
    page: Page,
    direction: 'up' | 'down' | 'left' | 'right',
    distance: number = 200
  ): Promise<void> {
    const viewport = page.viewportSize();
    if (!viewport) return;

    const centerX = viewport.width / 2;
    const centerY = viewport.height / 2;

    const gestures: Record<string, { startX: number; startY: number; endX: number; endY: number }> =
      {
        up: {
          startX: centerX,
          startY: centerY + distance / 2,
          endX: centerX,
          endY: centerY - distance / 2,
        },
        down: {
          startX: centerX,
          startY: centerY - distance / 2,
          endX: centerX,
          endY: centerY + distance / 2,
        },
        left: {
          startX: centerX + distance / 2,
          startY: centerY,
          endX: centerX - distance / 2,
          endY: centerY,
        },
        right: {
          startX: centerX - distance / 2,
          startY: centerY,
          endX: centerX + distance / 2,
          endY: centerY,
        },
      };

    const { startX, startY, endX, endY } = gestures[direction];

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY, { steps: 10 });
    await page.mouse.up();
  }

  /**
   * Perform tap gesture
   */
  static async tap(page: Page, selector: string): Promise<void> {
    await page.tap(selector);
  }

  /**
   * Long press gesture
   */
  static async longPress(page: Page, selector: string, duration: number = 1000): Promise<void> {
    const element = page.locator(selector);
    const box = await element.boundingBox();
    if (!box) return;

    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.waitForTimeout(duration);
    await page.mouse.up();
  }

  /**
   * Pull to refresh
   */
  static async pullToRefresh(page: Page): Promise<void> {
    await this.swipe(page, 'down', 300);
  }
}
```

### 📄 Mobile-Specific Config

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        hasTouch: true,
        isMobile: true,
      },
    },
  ],
});
```

✅ Best practice:

- [ ] Enable `hasTouch: true` for mobile projects.
- [ ] Test common gestures (swipe, tap, long-press).
- [ ] Verify touch targets are large enough (44x44px min).
- [ ] Test pull-to-refresh functionality.
- [ ] Test landscape/portrait orientations.

---

## 36. Security Testing Basics

### 📄 Security Test Helper

```ts
import { Page, expect } from '@playwright/test';

export class SecurityTestHelper {
  /**
   * Test for XSS vulnerability
   */
  static async testXSS(page: Page, inputSelector: string): Promise<boolean> {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '"><img src=x onerror=alert("xss")>',
      "javascript:alert('xss')",
      '<svg onload=alert("xss")>',
    ];

    for (const payload of xssPayloads) {
      await page.fill(inputSelector, payload);
      await page.keyboard.press('Enter');

      // Check if script was executed (should not be)
      const alertTriggered = await page.evaluate(() => {
        return (window as any).__xss_triggered === true;
      });

      if (alertTriggered) {
        console.error(`❌ XSS vulnerability detected with payload: ${payload}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Verify security headers
   */
  static async verifySecurityHeaders(page: Page): Promise<{
    passed: boolean;
    missing: string[];
  }> {
    const response = await page.goto(page.url());
    const headers = response?.headers() || {};

    const requiredHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      'strict-transport-security',
      'content-security-policy',
    ];

    const missing = requiredHeaders.filter((h) => !headers[h]);

    return { passed: missing.length === 0, missing };
  }

  /**
   * Test for open redirects
   */
  static async testOpenRedirect(page: Page, url: string): Promise<boolean> {
    const maliciousUrls = ['//evil.com', 'https://evil.com', '/\\evil.com'];

    for (const malicious of maliciousUrls) {
      await page.goto(`${url}?redirect=${encodeURIComponent(malicious)}`);

      // Should not redirect to external domain
      const currentUrl = page.url();
      if (currentUrl.includes('evil.com')) {
        console.error(`❌ Open redirect vulnerability detected`);
        return false;
      }
    }

    return true;
  }

  /**
   * Verify sensitive data not in URL
   */
  static async verifySensitiveDataNotInUrl(page: Page): Promise<boolean> {
    const url = page.url();
    const sensitivePatterns = [/password=/i, /token=[a-zA-Z0-9]{20,}/i, /api_key=/i, /secret=/i];

    for (const pattern of sensitivePatterns) {
      if (pattern.test(url)) {
        console.error(`❌ Sensitive data found in URL: ${pattern}`);
        return false;
      }
    }

    return true;
  }
}
```

### 📄 Security Test Steps

```ts
Then('the application has proper security headers', async ({ page }) => {
  const { passed, missing } = await SecurityTestHelper.verifySecurityHeaders(page);

  if (!passed) {
    console.log('⚠️ Missing security headers:', missing.join(', '));
  }

  expect(passed).toBe(true);
});

Then('the input is protected against XSS', async ({ page }) => {
  const isSecure = await SecurityTestHelper.testXSS(page, '[data-test="search-input"]');
  expect(isSecure).toBe(true);
});
```

✅ Best practice:

- [ ] Test input sanitization (XSS prevention).
- [ ] Verify security headers are present.
- [ ] Test for open redirect vulnerabilities.
- [ ] Ensure sensitive data not exposed in URLs.
- [ ] Test authentication/authorization boundaries.

---

## 37. WebSocket Testing

### 📄 WebSocket Helper

```ts
import { Page } from '@playwright/test';

interface WebSocketMessage {
  type: string;
  data: unknown;
  timestamp: number;
}

export class WebSocketHelper {
  private messages: WebSocketMessage[] = [];

  /**
   * Start intercepting WebSocket messages
   */
  async intercept(page: Page): Promise<void> {
    await page.evaluate(() => {
      const originalWS = window.WebSocket;

      (window as any).__wsMessages = [];

      window.WebSocket = class extends originalWS {
        constructor(url: string, protocols?: string | string[]) {
          super(url, protocols);

          this.addEventListener('message', (event) => {
            (window as any).__wsMessages.push({
              type: 'received',
              data: event.data,
              timestamp: Date.now(),
            });
          });

          const originalSend = this.send.bind(this);
          this.send = (data: string | ArrayBuffer | Blob) => {
            (window as any).__wsMessages.push({
              type: 'sent',
              data,
              timestamp: Date.now(),
            });
            originalSend(data);
          };
        }
      };
    });
  }

  /**
   * Get all intercepted messages
   */
  async getMessages(page: Page): Promise<WebSocketMessage[]> {
    return await page.evaluate(() => (window as any).__wsMessages || []);
  }

  /**
   * Wait for specific WebSocket message
   */
  async waitForMessage(
    page: Page,
    predicate: (msg: WebSocketMessage) => boolean,
    timeout: number = 5000
  ): Promise<WebSocketMessage> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const messages = await this.getMessages(page);
      const found = messages.find(predicate);
      if (found) return found;
      await page.waitForTimeout(100);
    }

    throw new Error('WebSocket message not received within timeout');
  }
}
```

### 📄 WebSocket Test Examples

```ts
Given('I connect to the real-time chat', async ({ page }) => {
  const wsHelper = new WebSocketHelper();
  await wsHelper.intercept(page);

  await page.goto('/chat');
  await page.waitForSelector('[data-test="chat-connected"]');
});

Then('I receive real-time updates', async ({ page }) => {
  const wsHelper = new WebSocketHelper();

  const message = await wsHelper.waitForMessage(page, (msg) => {
    const data = JSON.parse(msg.data as string);
    return data.type === 'notification';
  });

  expect(message).toBeTruthy();
});
```

✅ Best practice:

- [ ] Intercept WebSocket messages for verification.
- [ ] Test connection/reconnection scenarios.
- [ ] Test message ordering and delivery.
- [ ] Mock WebSocket server for edge cases.
- [ ] Test connection timeout handling.

---

## 38. GraphQL Testing

### 📄 GraphQL Helper

```ts
import { Page } from '@playwright/test';

export class GraphQLHelper {
  /**
   * Mock GraphQL query response
   */
  static async mockQuery(
    page: Page,
    operationName: string,
    response: Record<string, unknown>
  ): Promise<void> {
    await page.route('**/graphql', async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      if (postData?.operationName === operationName) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: response }),
        });
      } else {
        await route.continue();
      }
    });
  }

  /**
   * Mock GraphQL error response
   */
  static async mockError(page: Page, operationName: string, errorMessage: string): Promise<void> {
    await page.route('**/graphql', async (route) => {
      const postData = route.request().postDataJSON();

      if (postData?.operationName === operationName) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: null,
            errors: [{ message: errorMessage }],
          }),
        });
      } else {
        await route.continue();
      }
    });
  }

  /**
   * Intercept and log all GraphQL operations
   */
  static async interceptAll(page: Page): Promise<void> {
    await page.route('**/graphql', async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      console.log(`📊 GraphQL ${postData?.operationName}: ${postData?.query?.slice(0, 50)}...`);

      await route.continue();
    });
  }
}
```

### 📄 GraphQL Test Examples

```ts
Given('the products query returns empty list', async ({ page }) => {
  await GraphQLHelper.mockQuery(page, 'GetProducts', {
    products: [],
  });
});

Given('the products query fails', async ({ page }) => {
  await GraphQLHelper.mockError(page, 'GetProducts', 'Failed to fetch products');
});

Then('I see the error message for failed query', async ({ page }) => {
  await expect(page.getByText('Failed to fetch products')).toBeVisible();
});
```

✅ Best practice:

- [ ] Mock GraphQL responses by operation name.
- [ ] Test error handling for failed queries.
- [ ] Test loading states during queries.
- [ ] Intercept mutations to verify sent data.
- [ ] Test optimistic updates if applicable.

---

## 39. Component Testing (Playwright CT)

### 📦 Installation

```bash
npm install --save-dev @playwright/experimental-ct-react
# or for Vue:
npm install --save-dev @playwright/experimental-ct-vue
```

### 📄 Component Test Example

```ts
// tests/components/Button.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from '../../src/components/Button';

test('renders button with correct text', async ({ mount }) => {
  const component = await mount(<Button>Click me</Button>);

  await expect(component).toContainText('Click me');
});

test('calls onClick when clicked', async ({ mount }) => {
  let clicked = false;

  const component = await mount(
    <Button onClick={() => { clicked = true; }}>Click me</Button>
  );

  await component.click();
  expect(clicked).toBe(true);
});

test('applies disabled state correctly', async ({ mount }) => {
  const component = await mount(<Button disabled>Disabled</Button>);

  await expect(component).toBeDisabled();
  await expect(component).toHaveCSS('opacity', '0.5');
});

test('renders different variants', async ({ mount }) => {
  const primary = await mount(<Button variant="primary">Primary</Button>);
  const secondary = await mount(<Button variant="secondary">Secondary</Button>);

  await expect(primary).toHaveClass(/btn-primary/);
  await expect(secondary).toHaveClass(/btn-secondary/);
});
```

### 📄 playwright-ct.config.ts

```ts
import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './tests/components',
  use: {
    ctPort: 3100,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

✅ Best practice:

- [ ] Test components in isolation.
- [ ] Test all component variants/states.
- [ ] Test component interactions (click, hover, focus).
- [ ] Test accessibility of individual components.
- [ ] Use component tests for design system validation.

---

## 40. Test Data Factories

### 📄 Factory Pattern

```ts
// tests/factories/user.factory.ts
import { faker } from '@faker-js/faker';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

export class UserFactory {
  private defaults: Partial<User> = {};

  /**
   * Create user with random data
   */
  build(overrides: Partial<User> = {}): User {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: 'user',
      createdAt: faker.date.past(),
      ...this.defaults,
      ...overrides,
    };
  }

  /**
   * Build multiple users
   */
  buildMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, () => this.build(overrides));
  }

  /**
   * Set default values for all builds
   */
  withDefaults(defaults: Partial<User>): UserFactory {
    this.defaults = { ...this.defaults, ...defaults };
    return this;
  }

  /**
   * Preset: Admin user
   */
  admin(overrides: Partial<User> = {}): User {
    return this.build({ role: 'admin', ...overrides });
  }

  /**
   * Preset: Guest user
   */
  guest(overrides: Partial<User> = {}): User {
    return this.build({ role: 'guest', ...overrides });
  }
}

// Usage
const userFactory = new UserFactory();
const user = userFactory.build();
const admin = userFactory.admin({ email: 'admin@test.com' });
const users = userFactory.buildMany(5, { role: 'user' });
```

### 📄 Product Factory Example

```ts
// tests/factories/product.factory.ts
import { faker } from '@faker-js/faker';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
}

export class ProductFactory {
  build(overrides: Partial<Product> = {}): Product {
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      inStock: faker.datatype.boolean({ probability: 0.8 }),
      ...overrides,
    };
  }

  outOfStock(overrides: Partial<Product> = {}): Product {
    return this.build({ inStock: false, ...overrides });
  }

  expensive(overrides: Partial<Product> = {}): Product {
    return this.build({ price: faker.number.float({ min: 1000, max: 10000 }), ...overrides });
  }
}
```

✅ Best practice:

- [ ] Use factories instead of inline test data.
- [ ] Provide presets for common scenarios (admin, guest, etc.).
- [ ] Allow overrides for specific test needs.
- [ ] Keep factories close to the domain model.
- [ ] Use consistent naming conventions.

---

## 41. PDF Testing

### 📄 PDF Testing Helper

```ts
import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class PDFTestHelper {
  /**
   * Download PDF and get path
   */
  static async downloadPDF(page: Page, triggerSelector: string): Promise<string> {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click(triggerSelector),
    ]);

    const filePath = await download.path();
    return filePath!;
  }

  /**
   * Verify PDF was downloaded successfully
   */
  static async verifyPDFDownload(
    page: Page,
    triggerSelector: string
  ): Promise<{
    fileName: string;
    size: number;
  }> {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click(triggerSelector),
    ]);

    const fileName = download.suggestedFilename();
    const filePath = await download.path();
    const stats = fs.statSync(filePath!);

    return { fileName, size: stats.size };
  }

  /**
   * Save PDF to specific location
   */
  static async savePDF(page: Page, triggerSelector: string, savePath: string): Promise<void> {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click(triggerSelector),
    ]);

    await download.saveAs(savePath);
    console.log(`📄 PDF saved to: ${savePath}`);
  }

  /**
   * Verify PDF inline viewer
   */
  static async verifyPDFViewer(page: Page): Promise<boolean> {
    // Check if PDF is displayed in browser
    const pdfEmbed = page.locator('embed[type="application/pdf"]');
    const pdfObject = page.locator('object[type="application/pdf"]');
    const pdfIframe = page.frameLocator('iframe[src*=".pdf"]');

    const hasEmbed = (await pdfEmbed.count()) > 0;
    const hasObject = (await pdfObject.count()) > 0;
    const hasIframe = (await pdfIframe.locator('body').count()) > 0;

    return hasEmbed || hasObject || hasIframe;
  }
}
```

### 📄 PDF Test Examples

```ts
Then('I can download the invoice as PDF', async ({ page }) => {
  const { fileName, size } = await PDFTestHelper.verifyPDFDownload(
    page,
    '[data-test="download-invoice"]'
  );

  expect(fileName).toMatch(/invoice-\d+\.pdf/);
  expect(size).toBeGreaterThan(1000); // At least 1KB
});

Then('the PDF preview loads correctly', async ({ page }) => {
  await page.click('[data-test="preview-document"]');

  const isPDFVisible = await PDFTestHelper.verifyPDFViewer(page);
  expect(isPDFVisible).toBe(true);
});
```

✅ Best practice:

- [ ] Verify PDF downloads complete successfully.
- [ ] Check file size to ensure content is present.
- [ ] Test PDF viewer integration if applicable.
- [ ] Clean up downloaded PDFs after tests.
- [ ] For content verification, use PDF parsing libraries.

---

## 42. Retry Patterns & Error Recovery

### 📄 Custom Retry Helper

```ts
import { Page } from '@playwright/test';

export class RetryHelper {
  /**
   * Retry action with exponential backoff
   */
  static async withRetry<T>(
    action: () => Promise<T>,
    options: {
      maxRetries?: number;
      baseDelayMs?: number;
      maxDelayMs?: number;
      onRetry?: (attempt: number, error: Error) => void;
    } = {}
  ): Promise<T> {
    const { maxRetries = 3, baseDelayMs = 1000, maxDelayMs = 10000, onRetry } = options;

    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries) {
          const delay = Math.min(baseDelayMs * Math.pow(2, attempt - 1), maxDelayMs);
          onRetry?.(attempt, lastError);
          console.log(`⚠️ Attempt ${attempt} failed, retrying in ${delay}ms...`);
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }

    throw lastError!;
  }

  /**
   * Wait for condition with retry
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    options: { timeoutMs?: number; intervalMs?: number; message?: string } = {}
  ): Promise<void> {
    const { timeoutMs = 30000, intervalMs = 500, message = 'Condition not met' } = options;
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      if (await condition()) return;
      await new Promise((r) => setTimeout(r, intervalMs));
    }

    throw new Error(`${message} after ${timeoutMs}ms`);
  }

  /**
   * Retry with page refresh
   */
  static async withRefresh<T>(
    page: Page,
    action: () => Promise<T>,
    maxRetries: number = 2
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await action();
      } catch (error) {
        if (attempt < maxRetries) {
          console.log(`⚠️ Refreshing page and retrying...`);
          await page.reload();
          await page.waitForLoadState('networkidle');
        } else {
          throw error;
        }
      }
    }

    throw new Error('All retries exhausted');
  }
}
```

### 📄 Usage Examples

```ts
// Retry flaky API call
Given('the external service responds', async ({ page }) => {
  await RetryHelper.withRetry(
    async () => {
      const response = await page.request.get('/api/external-service');
      if (!response.ok()) throw new Error('Service unavailable');
    },
    {
      maxRetries: 3,
      baseDelayMs: 2000,
      onRetry: (attempt) => console.log(`Retry attempt ${attempt}`),
    }
  );
});

// Wait for async condition
Then('the order is processed', async ({ page }) => {
  await RetryHelper.waitForCondition(
    async () => {
      const status = await page.locator('[data-test="order-status"]').textContent();
      return status === 'Completed';
    },
    { timeoutMs: 60000, message: 'Order not processed' }
  );
});
```

✅ Best practice:

- [ ] Use retry for external/flaky dependencies.
- [ ] Implement exponential backoff to avoid overload.
- [ ] Log retry attempts for debugging.
- [ ] Set reasonable retry limits and timeouts.
- [ ] Prefer fixing root cause over adding retries.

---

## 📚 Resources

### Official Documentation

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright-BDD Documentation](https://vitalets.github.io/playwright-bdd/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)

### Reporting & Analysis

- [Allure Report](https://docs.qameta.io/allure/)
- [Playwright HTML Reporter](https://playwright.dev/docs/test-reporters#html-reporter)

### Testing Tools

- [Axe-core Playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) - Accessibility
- [Faker.js](https://fakerjs.dev/) - Test data generation
- [Mailhog](https://github.com/mailhog/MailHog) - Email testing
- [Playwright Lighthouse](https://github.com/nickolasfisher/playwright-lighthouse) - Performance

### Learning Resources

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [BDD with Cucumber](https://cucumber.io/docs/gherkin/)
- [Web Vitals](https://web.dev/vitals/) - Performance metrics
- [WCAG Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) - Accessibility
