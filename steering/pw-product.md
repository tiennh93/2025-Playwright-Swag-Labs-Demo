# 🏷️ Demo Project: Swag Labs (SauceDemo)

## 📝 1. Overview

**Swag Labs** is a sample e-commerce website (E-commerce sandbox), designed specifically for practicing Automation Testing. This website is extremely stable, loads fast, and has a clear DOM structure.

- **URL:** `https://www.saucedemo.com/`
- **Seminar Goal:** Demonstrate the ability to write fast, stable, and readable tests using Playwright + playwright-bdd with BDD approach, combined with Allure Reporting for professional reports.

## 🔐 2. Test Data

- **Standard User:**
  - Username: `standard_user`
  - Password: `secret_sauce`
- **Locked User (Demo Fail/Negative case):**
  - Username: `locked_out_user`
  - Password: `secret_sauce`

## 🎯 3. Demo Scenarios (Critical Scenarios)

To keep the presentation concise within 30-45 minutes, we focus on 2 main flows:

1.  **Authentication:**
    - Successful login -> Redirect to product page.
    - _Demo Technique:_ Page Object, `fill`, `click`, assertions using URL.
2.  **Shopping Flow:**
    - Sort products (Low to High).
    - Add product to cart (Sauce Labs Backpack).
    - Checkout process (End-to-End).
    - Remove product from cart.
    - _Demo Technique:_ Locator Chaining, Filter, `getByRole`.
3.  **Visual Regression:**
    - Compare login page with design snapshot.
    - _Demo Technique:_ `expect(page).toHaveScreenshot()`.

## 🚀 4. Advanced Scenarios (Enterprise Best Practices)

Các scenarios nâng cao để demo enterprise-level testing:

1.  **Dynamic Data with Faker:**
    - Generate random user data for checkout (firstName, lastName, zipCode).
    - **Tags:** `@faker`, `@dynamic-data`
    - **Feature:** `advanced-patterns.feature`
    - _Demo Technique:_ `@faker-js/faker` integration, avoid hardcoded data.

2.  **Soft Assertions:**
    - Verify multiple UI elements without stopping on first failure.
    - **Tags:** `@soft-assertions`
    - **Feature:** `advanced-patterns.feature`
    - _Demo Technique:_ `expect.soft()` for comprehensive validation.

3.  **Network Mocking:**
    - Test application behavior when images fail to load.
    - Simulate slow network conditions.
    - **Tags:** `@network-mocking`, `@blocked-images`, `@slow-network`
    - **Feature:** `network-errors.feature`
    - _Demo Technique:_ `page.route()` for mocking network responses.

4.  **Data Cleanup:**
    - Automatic cleanup of cart items after tests.
    - **Tags:** `@data-cleanup`
    - **Feature:** `advanced-patterns.feature`
    - _Demo Technique:_ Track test data, cleanup in `After` hooks.

## ⚙️ 5. Technical Mapping (Playwright Strategy)

- **Selector Strategy:**
  - Swag Labs uses `data-test` attributes very consistently.
  - **Configuration:** In `playwright.config.ts`, set `testIdAttribute: 'data-test'`.
  - **Benefit:** Code uses `page.getByTestId('username')` instead of verbose CSS Selectors -> Clean code, easy maintenance.
- **State Management:**
  - Each Scenario is a completely new Context (Incognito) to ensure independence.
