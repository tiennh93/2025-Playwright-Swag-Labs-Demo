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
- **Test Data:** [@faker-js/faker](https://fakerjs.dev/) - Dynamic test data generation
- **Reporting:** [Allure Playwright](https://github.com/allure-framework/allure-js/tree/master/packages/allure-playwright)
- **CI/CD:** GitHub Actions

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
├── .github/workflows   # CI/CD Pipelines
├── allure-results      # [Generated] Raw data for Allure
├── allure-report       # [Generated] HTML Report
├── steering            # Project documentation & best practices
│   ├── playwright-checklist.md  # Enterprise best practices checklist
│   ├── pw-product.md            # Product specification
│   ├── pw-structure.md          # Code structure documentation
│   ├── pw-roadmap.md            # Learning roadmap
│   └── pw-tasks.md              # Task list & guides
├── tests
│   ├── features        # Gherkin Files (Test Scenarios)
│   │   ├── login.feature
│   │   ├── shopping.feature
│   │   ├── social.feature
│   │   ├── ui.feature
│   │   ├── advanced-patterns.feature    # ✨ NEW: Faker, Soft Assertions, Cleanup
│   │   └── network-errors.feature       # ✨ NEW: Network Mocking
│   ├── steps           # Step Definitions (Logic Code)
│   │   ├── login.steps.ts
│   │   ├── shopping.steps.ts            # ✨ Updated: Faker integration
│   │   ├── social.steps.ts
│   │   ├── ui.steps.ts                  # ✨ Updated: Soft Assertions
│   │   └── network.steps.ts             # ✨ NEW: Network mocking steps
│   ├── pages           # Page Objects (Locators & Actions)
│   │   ├── login-page.ts
│   │   ├── inventory-page.ts
│   │   └── checkout-page.ts
│   ├── hooks           # Setup & Teardown (Before/After) - index.ts
│   │   └── index.ts                     # ✨ Updated: Logging + Data Cleanup
│   ├── fixtures        # Dependency Injection (replacing World) - index.ts
│   ├── utils           # Test Data & Helpers
│   │   ├── config.ts
│   │   └── helpers.ts                   # ✨ NEW: DebugHelper + NetworkMockHelper
│   └── global-setup.ts # Global One-time Setup
└── playwright.config.ts # Playwright & BDD Configuration
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
