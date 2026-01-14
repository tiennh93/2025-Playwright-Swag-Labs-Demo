# 🛠️ Practice Guide: Build Framework from Scratch

Follow this exact sequence to have a complete demo project.

## ✅ Part 1: Initialization & Configuration (Setup)

1.  **Init Project:**
    ```bash
    mkdir SwagLabs.E2E
    cd SwagLabs.E2E
    npm init -y
    npm install -D @playwright/test playwright-bdd allure-playwright typescript
    ```
2.  **Config Files:**
    - Create `tsconfig.json`, `playwright.config.ts`.
    - **Important:** In `playwright.config.ts`:
      - Add `reporter: [['html'], ['allure-playwright']]` to use Allure reporting.
      - In `use` section, update:
      ```typescript
      use: {
        trace: 'on-first-retry',
        // ...
      }
      ```
3.  **VS Code Settings (Optional):**
    - Create `.vscode/settings.json` to configure Cucumber & Prettier:
    ```json
    {
      "cucumber.glue": ["tests/steps/**/*.ts"],
      "cucumber.features": ["tests/features/**/*.feature"],
      "editor.quickSuggestions": {
        "comments": false,
        "strings": true,
        "other": true
      },
      "editor.formatOnSave": true,
      "[cucumber]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.tabSize": 2
      }
    }
    ```
4.  **Generate Test Files from Features:**
    ```bash
    npx bddgen  # Generate step definitions and test files from .feature files
    ```

## ✅ Part 2: Core Framework (Fixtures & Hooks)

1.  **Fixtures (`tests/fixtures/index.ts`):**
    - Use Playwright's built-in fixtures: `page`, `context`, `browser`.
    - Create custom fixtures if needed (e.g., `loginPage`, `inventoryPage`).
    - playwright-bdd automatically injects fixtures into step definitions.
2.  **Hooks (`tests/hooks/index.ts`):**
    - Import `BeforeAll`, `AfterAll`, `Before`, `After` from `playwright-bdd`.
    - `Before`: Setup for each scenario (if needed).
    - `After`: Cleanup and attach screenshots/videos to Allure report.

## ✅ Part 3: Login Feature (POM + Steps)

1.  **Page Object (`tests/pages/LoginPage.ts`):**

    ```typescript
    export class LoginPage {
      readonly page: Page;
      readonly usernameInput: Locator;
      readonly passwordInput: Locator;
      readonly loginButton: Locator;

      constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
      }

      // Actions
      async login(user: string, pass: string) {
        await this.usernameInput.fill(user);
        await this.passwordInput.fill(pass);
        await this.loginButton.click();
      }
    }
    ```

2.  **Feature (`tests/features/login.feature`):**
    - Write Successful Login Scenario.
3.  **Steps (`tests/steps/login.steps.ts`):**
    - Import `Given`, `When`, `Then` from `playwright-bdd`.
    - Use automatically injected fixtures: `{ page }` or custom fixtures.
    - Map Gherkin steps with `LoginPage` actions.

## ✅ Part 4: Shopping Feature (Advanced)

1.  **Feature:**
    ```gherkin
    Scenario: Add item to cart
        When I add "Sauce Labs Backpack" to cart
        Then cart badge should show "1"
    ```
2.  **Inventory Page (`tests/pages/InventoryPage.ts`):**
    - Demo **Locator Filter** technique:
      ```typescript
      async addItemToCart(itemName: string) {
          // Find item containing product name text, then find "Add to cart" button within it
          await this.page.locator('.inventory_item')
              .filter({ hasText: itemName })
              .getByRole('button', { name: 'Add to cart' })
              .click();
      }
      ```
    - _This is a technical highlight showing Playwright's superiority._

## ✅ Part 5: Reporting & CI/CD

1.  **Allure Report:**
    - Run tests: `npx playwright test`
    - Generate report: `npx allure generate -o allure-report allure-results`
    - View report: `npx allure serve allure-results`
2.  **CI/CD:**
    - Create `.github/workflows/e2e.yml`.
    - Configure to upload Allure results and generate report.
    - Push code to GitHub and watch pipeline run on "Actions" tab.

## ✅ Part 6: Advanced Enterprise Features

1.  **Test Data Factories:**

    ```typescript
    // tests/factories/user-factory.ts
    export class UserFactory {
      static standardUser(): User {
        return { username: 'standard_user', password: 'secret_sauce' };
      }
      static randomCheckoutInfo(): CheckoutInfo {
        return {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          zipCode: faker.location.zipCode(),
        };
      }
    }
    ```

2.  **Accessibility Testing:**

    ```bash
    npm install -D @axe-core/playwright
    npm run test:a11y
    ```

    - Use `AxeBuilder` to scan pages for WCAG violations.
    - Filter by `critical` and `serious` impact levels.

3.  **Security Testing:**
    - Create `security.feature` with XSS, SQL injection scenarios.
    - Use `UserFactory.xssUser()` and `UserFactory.sqlInjectionUser()`.

4.  **Performance Testing:**

    ```bash
    npm run test:perf
    ```

    - Measure Core Web Vitals using Navigation Timing API.
    - Integrate Lighthouse for comprehensive audits.

5.  **Custom Reporters:**
    - Slack notifications via `tests/reporters/slack-reporter.ts`.
    - Metrics dashboard via `scripts/generate-dashboard.ps1`.
    - Conditional reporters in `playwright.config.ts`.

6.  **PowerShell Scripts:**

    ```powershell
    # Run all tests with Allure report
    .\scripts\run-tests.ps1

    # Generate metrics dashboard
    .\scripts\generate-dashboard.ps1

    # Detect flaky tests
    .\scripts\flaky-test.ps1 -Runs 5
    ```
