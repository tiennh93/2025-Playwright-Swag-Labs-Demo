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

5.  **Accessibility Testing (WCAG 2.0):**
    - Automated accessibility audits using axe-core.
    - Keyboard-only navigation testing.
    - **Tags:** `@accessibility`, `@a11y`, `@keyboard`
    - **Features:** `accessibility.feature`, `keyboard.feature`
    - _Demo Technique:_ `@axe-core/playwright`, WCAG 2.0 Level A & AA.

6.  **Security Testing:**
    - XSS input sanitization testing.
    - SQL injection prevention.
    - Auth boundary testing.
    - **Tags:** `@security`, `@xss`, `@auth-boundary`
    - **Feature:** `security.feature`
    - _Demo Technique:_ Security payloads via `UserFactory`.

7.  **Performance Testing:**
    - Core Web Vitals measurement (FCP, LCP).
    - Performance budgets.
    - **Tags:** `@performance`, `@core-web-vitals`
    - **Feature:** `performance.feature`
    - _Demo Technique:_ Navigation Timing API + Lighthouse.

8.  **Mobile Testing:**
    - Touch gesture testing with `hasTouch: true`.
    - Orientation testing (landscape/portrait).
    - Touch target size validation (44x44px).
    - **Tags:** `@mobile`, `@touch`, `@orientation`
    - **Feature:** `mobile.feature`
    - _Demo Technique:_ Mobile Chrome project, `.tap()` method.

9.  **Health Checks:**
    - Application availability verification.
    - Page load performance baseline.
    - **Tags:** `@health`, `@smoke`
    - **Feature:** `health.feature`
    - _Demo Technique:_ API health endpoint check in global-setup.

10. **Test Data Factories:**
    - Type-safe user generation (valid/invalid/XSS/SQL).
    - Product helpers with cart calculations.
    - **Location:** `tests/factories/`
    - _Demo Technique:_ Factory Pattern for reusable test data.

## ⚙️ 5. Technical Mapping (Playwright Strategy)

- **Selector Strategy:**
  - Swag Labs uses `data-test` attributes very consistently.
  - **Configuration:** In `playwright.config.ts`, set `testIdAttribute: 'data-test'`.
  - **Benefit:** Code uses `page.getByTestId('username')` instead of verbose CSS Selectors -> Clean code, easy maintenance.
- **State Management:**
  - Each Scenario is a completely new Context (Incognito) to ensure independence.
- **Reporting:**
  - Allure, HTML, JSON reporters with conditional CI/Local configuration.
  - Slack notifications for team alerts.
  - Metrics dashboard via `scripts/generate-dashboard.ps1`.
