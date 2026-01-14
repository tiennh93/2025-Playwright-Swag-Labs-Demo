# 🎭 SwagLabs.E2E - Playwright Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-Test-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Playwright-BDD](https://img.shields.io/badge/Playwright--BDD-Active-purple)
![Allure](https://img.shields.io/badge/Allure-Report-orange)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-blue)

Automation Testing Project for the Seminar **"Playwright + Playwright-BDD: Modern E2E Testing"**.
The System Under Test (SUT) is [SauceDemo (Swag Labs)](https://www.saucedemo.com/).

## 🎯 Project Goals

This project was built to illustrate:

1.  **BDD (Behavior Driven Development) Model:** Connecting Gherkin (.feature) with TypeScript.
2.  **Page Object Model (POM):** Separating test logic and UI locators.
3.  **Enterprise Standard:** Clean, scalable folder structure with CI/CD integration.
4.  **Playwright Features:** Auto-waiting, Tracing, `getByTestId`.

## 🛠️ Tech Stack

- **Core Engine:** [Playwright](https://playwright.dev/)
- **Language:** TypeScript
- **BDD Integration:** [playwright-bdd](https://github.com/vitalets/playwright-bdd)
- **Assertion:** Playwright Expect
- **Test Data:** [@faker-js/faker](https://fakerjs.dev/) + Custom Factories
- **Accessibility:** [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm)
- **Performance:** Lighthouse + Navigation Timing API
- **Reporting:** Allure, HTML, JSON, Slack Notifications
- **CI/CD:** GitHub Actions (4-shard parallel execution)

## 🚀 Installation

Requirement: **Node.js 18+**

1.  **Clone the project:**

    ```bash
    git clone <your-repo-url>
    cd SwagLabs.E2E
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Install Browsers for Playwright:**

    ```bash
    npx playwright install --with-deps
    ```

4.  **VS Code Extensions (Recommended):**
    - **Cucumber (Gherkin) Full Support:** Enhances syntax highlighting for `.feature` files
    - **Prettier:** Automatic code formatter

    **Auto-configuration** (if using `.vscode/settings.json`):

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

## 🏃‍♂️ Usage

Test scenarios are defined in `package.json` scripts.

### 1. Run All Tests

```bash
npm test
# This command is equivalent to: npx bddgen && npx playwright test
```

### 2. Run Smoke Tests (Main Flows)

Only runs scenarios with the `@smoke` tag.

```bash
npx bddgen && npx playwright test --grep "@smoke"
```

### 3. Debug Mode (Headed)

To run tests with the browser visible for debugging:

```bash
npx bddgen && npx playwright test --headed
```

## 📂 Project Structure

The structure follows Clean Code principles and separates concerns.

```ascii
sauce-demo
├── .features-gen       # [Generated] Test code generated from .feature (playwright-bdd)
├── .github/workflows   # CI/CD Pipelines (4-shard parallel execution)
├── allure-results      # [Generated] Raw data for Allure
├── allure-report       # [Generated] HTML Report
├── scripts             # PowerShell automation scripts
│   ├── run-tests.ps1            # Main test runner with Allure report
│   ├── generate-dashboard.ps1  # Metrics dashboard generator
│   ├── flaky-test.ps1           # Flaky test detection
│   └── quarantine.ps1           # Quarantine management
├── steering            # Project documentation & best practices
│   ├── playwright-checklist.md  # Enterprise best practices (94.5% complete)
│   ├── sauce-demo-checklist.md  # Project-specific checklist
│   └── pw-*.md                  # Product, structure, roadmap docs
├── tests
│   ├── features        # Gherkin Files (Test Scenarios)
│   │   ├── login.feature         # Authentication tests
│   │   ├── shopping.feature      # E-commerce flows
│   │   ├── accessibility.feature # WCAG 2.0 compliance (@axe-core)
│   │   ├── security.feature      # XSS, SQL injection, auth boundaries
│   │   ├── performance.feature   # Core Web Vitals, Lighthouse
│   │   ├── mobile.feature        # Touch gestures, orientation
│   │   ├── keyboard.feature      # Keyboard-only navigation
│   │   ├── health.feature        # Application health checks
│   │   └── ...                   # ui, network, social, storage
│   ├── steps           # Step Definitions
│   ├── pages           # Page Objects (POM)
│   ├── factories       # Test Data Factories
│   │   ├── user-factory.ts       # User generation (valid/invalid/XSS)
│   │   └── product-factory.ts    # Product helpers & cart calculations
│   ├── reporters       # Custom Reporters
│   │   └── slack-reporter.ts     # Slack webhook notifications
│   ├── hooks           # Before/After hooks with cleanup
│   ├── fixtures        # Dependency Injection
│   ├── utils           # Helpers (Debug, Network, Performance, etc.)
│   └── global-setup.ts # Global setup with health check
└── playwright.config.ts # Config with conditional reporters
```

## 🧪 Demo Credentials (SUT)

Website: `https://www.saucedemo.com/`

| Role              | Username          | Password       |
| :---------------- | :---------------- | :------------- |
| **Standard User** | `standard_user`   | `secret_sauce` |
| **Locked User**   | `locked_out_user` | `secret_sauce` |

## 🚀 Advanced Features

This project demonstrates enterprise-level best practices:

### 🎲 **Dynamic Test Data with Faker**

Generate unique test data for each run to avoid data collisions:

```bash
npx playwright test --grep "@faker"
```

- Uses `@faker-js/faker` to generate random names, emails, addresses
- Implemented in: `tests/steps/shopping.steps.ts`

### 🧪 **Soft Assertions**

Verify multiple conditions without stopping on first failure:

```bash
npx playwright test --grep "@soft-assertions"
```

- Uses `expect.soft()` for comprehensive UI validation
- Implemented in: `tests/steps/ui.steps.ts`

### 🌐 **Network Mocking**

Simulate network errors and edge cases:

```bash
npx playwright test --grep "@network-mocking"
```

- Mock image load failures
- Simulate slow network conditions
- Implemented in: `tests/steps/network.steps.ts` + `tests/utils/helpers.ts`

### 🧹 **Automatic Data Cleanup**

Track and cleanup test data after each scenario:

- Automatic cart cleanup
- Structured logging with timestamps
- Implemented in: `tests/hooks/index.ts`

### 🔧 **Debug Utilities**

Production-ready debugging helpers:

- `DebugHelper` - Console/Network logging, screenshots
- `NetworkMockHelper` - Mock APIs, slow network, block domains
- Implemented in: `tests/utils/helpers.ts`

### ♿ **Accessibility Testing (WCAG 2.0)**

Automated accessibility audits:

```bash
npm run test:a11y
```

- Uses `@axe-core/playwright` for WCAG 2.0 Level A & AA
- Scans critical pages for violations
- Keyboard navigation testing

### 🔒 **Security Testing**

Basic security validation:

```bash
npm run test:security
```

- XSS input sanitization
- SQL injection prevention
- Auth boundary testing
- Session invalidation

### 📊 **Performance Testing**

Core Web Vitals measurement:

```bash
npm run test:perf
```

- FCP, LCP, Load Time metrics
- Performance budgets
- Lighthouse integration

### 📱 **Mobile Testing**

Touch and orientation testing:

```bash
npm run test:mobile
```

- Touch target size validation (44x44px min)
- Landscape/Portrait orientation
- Mobile Chrome with `hasTouch: true`

### 🏭 **Test Data Factories**

Type-safe test data generation:

- `UserFactory` - Valid/invalid users, XSS/SQL injection vectors
- `ProductFactory` - Product helpers, cart calculations
- Import from `tests/factories`

### 📈 **Custom Reporters**

Multiple reporting options:

- **Allure** - Beautiful visual reports
- **HTML** - Built-in Playwright report
- **JSON** - Machine-readable results
- **Slack** - Team notifications via webhook
- **Dashboard** - `scripts/generate-dashboard.ps1`

---

## 📊 Reporting

After running tests, an Allure report will be created.
To view locally:

```bash
npx allure serve allure-results
```

To generate static HTML:

```bash
npx allure generate -o allure-report allure-results
```

---

**Author:** Tien Nguyen Huu

**Event:** Tech Seminar 2026
