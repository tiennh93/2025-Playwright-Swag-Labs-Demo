# Playwright + TypeScript + Playwright-BDD Best Practices Checklist (Web – Enterprise)

> **Version:** 1.0  
> **Last Updated:** 2025-12-25  
> **Maintainer:** QA/Dev Team

This document serves as an **internal standard** for the QA/Dev team when building automation tests with **Playwright + TypeScript + Playwright-BDD** for web applications across different domains.

---

## 1️⃣ Directory Structure & Conventions

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
│  │  └─ config.ts
│  └─ global-setup.ts
└─ allure-results
```

✅ Best practice:

- [x] Feature (.feature) contains only **business language** (Domain Driven).
- [x] Step definitions do NOT contain complex logic.
- [x] Page Objects do NOT contain assertions.
- [x] Use `index.ts` in `hooks` and `fixtures` for cleaner imports.

---

## 2️⃣ Feature file (Gherkin – BDD)

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

- [x] Use tags (`@smoke`, `@regression`, `@[module]`) for CI/CD filtering.
- [x] Avoid technical details (API, selector, browser...) in steps.
- [x] Focus on User Behavior and Business Rules.

---

## 3️⃣ Page Object Model (Maintainability)

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

- [x] Define Locators once in the constructor.
- [x] Prioritize `getByRole`, `getByTestId` (configure `testIdAttribute` in config).
- [x] Do not use XPath or brittle CSS selectors (avoid implementation details).
- [x] Keep Actions simple and atomic.

---

## 4️⃣ Fixtures & Hooks (Dependency Injection)

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

- [x] Each scenario = isolated browser context (ensure test independence).
- [x] Do not share state (variables) between tests.
- [x] Clean up data (if created) in `After` hook or via API.

---

## 5️⃣ Step Definitions (Stable Tests)

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

- [x] Steps only call Page Object methods (Abstraction Layer).
- [x] No `waitForTimeout` (Use Playwright's auto-waiting).
- [x] Use `{string}`, `{int}` parameters/Data Tables (`DataTable`) to make steps reusable.

---

## 6️⃣ Playwright Config

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
  reporter: [['html'], ['allure-playwright']],
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry', // Optimize performance, only trace on query
    testIdAttribute: 'data-test', // Customize for project convention
  },
});
```

---

## 7️⃣ Error Handling & Logging

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

- [x] Create custom error messages with context (what action failed, where).
- [x] Use structured logging with timestamps and severity levels.
- [x] Attach screenshots/traces on failure for debugging.
- [x] Wrap common actions in try-catch for graceful error handling.
- [x] Log test metadata (title, tags) at start for traceability.

---

## 8️⃣ Debugging Tools & Techniques

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

- [x] Use `PWDEBUG=1` for step-by-step debugging.
- [x] Enable Trace Viewer for failed tests to analyze step-by-step actions.
- [x] Use `page.pause()` sparingly for manual inspection during development.
- [x] Enable browser console/network logging when debugging complex scenarios.
- [x] Use UI Mode (`--ui`) for visual test development and debugging.

---

## 9️⃣ CI/CD – GitHub Actions

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

      # Run specific suite based on input or logic
      - run: npm run test

      # Upload Allure Results for report generation
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-results
          path: allure-results
```

---

## 🔟 package.json scripts

```json
{
  "scripts": {
    "test": "npx bddgen && npx playwright test",
    "test:ui": "npx bddgen && npx playwright test --ui",
    "test:report": "npx allure generate -o ./allure-report ./allure-results",
    "prepare": "husky install",
    "format": "prettier --write \"**/*.{js,ts,json,feature,md}\""
  }
}
```

---

## 1️⃣1️⃣ Performance & Scalability Checklist

- [x] **Tagging Strategy:** Organize tests by module (`@[module]`, `@[feature]`) and priority (`@smoke`, `@critical`, `@regression`).
- [x] **Parallelism:** Enable `workers` in config to speed up execution.
- [x] **CI Optimization:** Use Headless mode and cache dependencies.
- [x] **Artifacts:** Capture Screenshot / Video only on failure to save storage.
- [x] **Flakiness:** Use Retry + Trace Viewer ensuring stable results.

---

## 1️⃣2️⃣ Advanced Techniques (Speed & Stability)

- [x] **Hybrid Testing (API + UI):** Use API RequestContext (`request`) to create pre-conditions (e.g., create test data, set up state) instead of slow UI interactions. Implementation ready via `tests/utils/helpers.ts`.
- [x] **State Reuse:** Save authentication state (`storageState`) in `global-setup` to avoid repeated logins.
- [ ] **Test Sharding:** Distribute tests across multiple CI machines (`--shard=1/4`) to reduce total build time. (CI/CD configuration only)

## 1️⃣3️⃣ Code Quality & Naming Conventions

- [x] **File Names:** `kebab-case` (e.g., `[page-name].ts`, `[feature-name].feature`).
- [x] **Class Names:** `PascalCase` (e.g., `[PageName]Page`, `[Module]API`).
- [x] **Methods/Variables:** `camelCase` (e.g., `submitForm`, `isValid`).
- [x] **Test Tags:** Use distinct tags like `@smoke`, `@e2e`, `@[ticket-id]` for easy filtering.

---

## 1️⃣4️⃣ Resilience & Verification Strategy

- [x] **Visual Regression:** Implement `expect(page).toHaveScreenshot()` to catch UI regressions that functional tests miss.
- [x] **Soft Assertions:** Use `expect.soft()` to verify multiple fields/conditions without stopping the test execution on the first failure. ✅ Implemented in `tests/steps/ui.steps.ts`.
- [x] **Network Mocking:** Use `page.route()` to simulate backend errors (e.g., 500 Server Error) or test edge cases without relying on real backend state. ✅ Implemented in `tests/steps/network.steps.ts` + `tests/utils/helpers.ts`.
- [x] **Smart Waiting:** Prefer `page.waitForResponse()` to verify backend processes are complete instead of relying solely on UI element appearance.

---

## 1️⃣5️⃣ Test Data & Security (Data Strategy)

- [x] **Dynamic Data:** Avoid hardcoded values. Use libraries like `@faker-js/faker` to generate unique emails/names to prevent data collisions. ✅ Implemented in `tests/steps/shopping.steps.ts`.
- [x] **Secret Management:** NEVER commit passwords or keys. Use `.env` file and `process.env`. Ensure CI/CD secrets are injected securely.
- [x] **Data Cleanup:** Implement "Teardown" hooks or API calls to delete test data after execution, keeping the environment clean. ✅ Implemented in `tests/hooks/index.ts`.

---

## 1️⃣6️⃣ Cross-Browser & Environment Strategy

- [x] **Multi-Browser:** Configure projects in `playwright.config.ts` for `chromium`, `firefox`, and `webkit` to ensure compatibility.
- [x] **Mobile Viewports:** Add projects using `devices` (e.g., 'iPhone 12', 'Pixel 5') to smoke test responsive designs.
- [x] **Environment Agnostic:** Tests should run on any environment (Local, Dev, Staging, Prod) simply by changing the `BASE_URL` environment variable.

---

## 1️⃣7️⃣ Enterprise Checklist Summary

| Category           | Status | Key Points                                                     |
| ------------------ | ------ | -------------------------------------------------------------- |
| **Architecture**   | ✅     | POM pattern, Fixtures/Hooks, Clean separation of concerns      |
| **Stability**      | ✅     | `getByRole`, `data-testid`, auto-waiting, no hardcoded waits   |
| **Error Handling** | ✅     | Custom error messages, structured logging, failure attachments |
| **Debugging**      | ✅     | Trace Viewer, Inspector, UI Mode, Debug utilities              |
| **CI/CD**          | ✅     | GitHub Actions, Allure reporting, artifact management          |
| **Performance**    | ✅     | Parallelism, tagging strategy, optimized artifacts             |
| **Code Quality**   | ✅     | Naming conventions, step reuse, maintainability                |
| **Resilience**     | ✅     | Visual regression, smart waiting, network mocking              |
| **Security**       | ✅     | `.env` for secrets, CI/CD secret injection, no hardcoded creds |
| **Scalability**    | ✅     | Cross-browser config, faker data generation, cleanup hooks     |

### ✅ Checklist Items Summary

- [x] **Clean Code:** Separation of Concerns (Feature vs Step vs Page).
- [x] **Stability:** Prefer `getByRole`, `data-testid` (Test IDs).
- [x] **No Flakiness:** Avoid hard-coded waits (`waitForTimeout`).
- [x] **Independence:** Tests run concurrently without shared state.
- [x] **Visibility:** Automated Reporting (Allure) & CI/CD integration.
- [x] **Maintainability:** Step reuse and clear naming conventions.
- [x] **Error Handling:** Custom error messages and structured logging.
- [x] **Debugging:** Trace Viewer, Inspector, and Debug utilities available.
- [x] **Resilience:** Visual checks and smart waiting implemented.
- [x] **Network Mocking:** `page.route()` implemented in `tests/steps/network.steps.ts` + utilities in `tests/utils/helpers.ts`.
- [x] **Soft Assertions:** `expect.soft()` implemented in `tests/steps/ui.steps.ts`.
- [x] **Security:** Secrets managed via env vars, no hardcoded sensitive data.
- [x] **Scalability:** Dynamic data generation with `@faker-js/faker` (`tests/steps/shopping.steps.ts`).
- [x] **Data Cleanup:** Teardown hooks implemented in `tests/hooks/index.ts`.
- [ ] **Test Sharding:** CI/CD configuration for distributed test execution (documentation only).
