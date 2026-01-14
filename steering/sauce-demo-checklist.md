# Sauce Demo - Playwright Checklist (Project-Specific)

> **Version:** 2.2  
> **Last Updated:** 2026-01-14  
> **Project:** Sauce Demo E2E Testing  
> **Template:** Based on `playwright-checklist.md` v2.0

This checklist tracks the implementation status of best practices for the **Sauce Demo** project.

---

## 📊 Progress Summary

| Metric                | Value                                        |
| --------------------- | -------------------------------------------- |
| **Overall Progress**  | **136/145 (93.8%)**                          |
| **Core Features**     | 87/87 (100%)                                 |
| **Advanced Features** | 49/58 (84.5%)                                |
| **Test Cases**        | 60+ tests                                    |
| **Browsers**          | 4 (chromium, firefox, webkit, Mobile Chrome) |

### By Category

| Category                      | Progress | Status  |
| ----------------------------- | -------- | ------- |
| 1. Directory Structure        | 4/4      | ✅ 100% |
| 2. Feature File (BDD)         | 3/3      | ✅ 100% |
| 3. Page Object Model          | 4/4      | ✅ 100% |
| 4. Fixtures & Hooks           | 3/3      | ✅ 100% |
| 5. Step Definitions           | 3/3      | ✅ 100% |
| 6. Playwright Config          | 5/5      | ✅ 100% |
| 7. Error Handling             | 5/5      | ✅ 100% |
| 8. Debugging Tools            | 5/5      | ✅ 100% |
| 9. API Testing                | 4/4      | ✅ 100% |
| 10. CI/CD                     | 5/5      | ✅ 100% |
| 11. package.json              | 5/5      | ✅ 100% |
| 12. Performance & Scalability | 6/6      | ✅ 100% |
| 13. Advanced Techniques       | 4/4      | ✅ 100% |
| 14. Code Quality              | 4/4      | ✅ 100% |
| 15. Resilience                | 4/4      | ✅ 100% |
| 16. Accessibility Testing     | 5/5      | ✅ 100% |
| 17. Test Data & Security      | 3/3      | ✅ 100% |
| 18. Cross-Browser             | 3/3      | ✅ 100% |
| 19. Console Monitoring        | 5/5      | ✅ 100% |
| 20. Geolocation               | 0/5      | ⬜ N/A  |
| 21. Flaky Test Management     | 5/5      | ✅ 100% |
| 22. Custom Reporters          | 5/5      | ✅ 100% |
| 23. Multi-tab Testing         | 4/4      | ✅ 100% |
| 24. Keyboard Navigation       | 5/5      | ✅ 100% |
| 25. Storage Management        | 4/4      | ✅ 100% |
| 26. Mobile Gestures           | 5/5      | ✅ 100% |
| 27. Security Testing          | 5/5      | ✅ 100% |
| 28. Performance Testing       | 5/5      | ✅ 100% |
| 29. Test Data Factories       | 4/4      | ✅ 100% |
| 30. PDF Testing               | 0/3      | ⬜ N/A  |
| 31. Authentication            | 5/6      | 🔸 83%  |
| 32. Documentation             | 5/5      | ✅ 100% |
| 33. Retry Patterns            | 5/5      | ✅ 100% |

**Legend:** ✅ Complete | 🔸 Partial | ⬜ Not Applicable/Not Started

### Quick Stats

```
███████████████████████████░ 93.8% Complete

✅ Core (1-19):     87/87  items (100%)
✅ Advanced (20-33): 49/58 items (84.5%)
⬜ N/A:             14 items (skipped)
```

---

## 1. Directory Structure & Conventions

✅ Best practice:

- [x] Feature (.feature) contains only **business language** (Domain Driven).
- [x] Step definitions do NOT contain complex logic.
- [x] Page Objects do NOT contain assertions.
- [x] Use `index.ts` in `hooks` and `fixtures` for cleaner imports.

**Implementation Notes:**

- `tests/features/` - 8 feature files (login, shopping, ui, network, social, advanced-patterns, accessibility, keyboard)
- `tests/pages/` - 3 page objects (LoginPage, InventoryPage, CheckoutPage)
- `tests/steps/` - 7 step files (login, shopping, ui, network, social, accessibility, keyboard)
- `tests/fixtures/index.ts` - Custom fixtures with page objects
- `tests/hooks/index.ts` - Before/After hooks with logging + ConsoleErrorMonitor
- `tests/utils/` - DebugHelper, NetworkMockHelper, ConsoleErrorMonitor, config

---

## 2. Feature File (Gherkin – BDD)

- [x] Use tags (`@smoke`, `@regression`, `@[module]`) for CI/CD filtering.
- [x] Avoid technical details (API, selector, browser...) in steps.
- [x] Focus on User Behavior and Business Rules.

---

## 3. Page Object Model (Maintainability)

- [x] Define Locators once in the constructor.
- [x] Prioritize `getByRole`, `getByTestId` (configure `testIdAttribute` in config).
- [x] Do not use XPath or brittle CSS selectors.
- [x] Keep Actions simple and atomic.

**Implementation Notes:**

- Using `getByTestId()` with `testIdAttribute: 'data-test'` ✅
- All Page Objects refactored to use `getByTestId()`

---

## 4. Fixtures & Hooks (Dependency Injection)

- [x] Each scenario = isolated browser context.
- [x] Do not share state between tests.
- [x] Clean up data in `After` hook. ✅ `tests/hooks/index.ts`

---

## 5. Step Definitions (Stable Tests)

- [x] Steps only call Page Object methods (Abstraction Layer).
- [x] No `waitForTimeout` (Use Playwright's auto-waiting).
- [x] Use `{string}`, `{int}` parameters/Data Tables. ✅ `tests/steps/shopping.steps.ts`

---

## 6. Playwright Config

- [x] Use environment variables for `baseURL`.
- [x] Set appropriate `timeout`.
- [x] Enable `retries` in CI.
- [x] Configure `testIdAttribute` to match `data-test`. ✅ Added to config
- [x] Use `trace: 'on-first-retry'`.

---

## 7. Error Handling & Logging

- [x] Create custom error messages with context. ✅ `tests/utils/helpers.ts`
- [x] Use structured logging with timestamps. ✅ `tests/hooks/index.ts`
- [x] Attach screenshots on failure. ✅ Config + hooks
- [x] Wrap common actions in try-catch.
- [x] Log test metadata at start.

---

## 8. Debugging Tools & Techniques

- [x] Use `PWDEBUG=1` for step-by-step debugging.
- [x] Enable Trace Viewer for failed tests.
- [x] Use `page.pause()` for development.
- [x] Enable console/network logging. ✅ `tests/utils/helpers.ts` - DebugHelper
- [x] Use UI Mode (`--ui`).

---

## 9. API Testing Helper (Hybrid Testing)

- [x] Use API calls for test data setup (faster than UI).
- [x] Clean up test data via API. ✅ `tests/utils/data-cleanup-helper.ts`
- [x] Combine API setup with UI verification.
- [x] Include health checks. ✅ `tests/features/health.feature`

**Note:** SauceDemo is a static demo site without real API, but `NetworkMockHelper` is implemented.

---

## 10. CI/CD – GitHub Actions

- [x] GitHub Actions workflow configured. ✅ `.github/workflows/e2e.yml`
- [x] Cache node modules and Playwright browsers.
- [x] Upload Allure results.
- [x] Deploy reports to Vercel.
- [x] Implement test sharding for large suites. ✅ 4-shard CI workflow

---

## 11. package.json Scripts

- [x] Include `bddgen` in test scripts.
- [x] Add `test:headed` script.
- [x] Add `test:debug` script. ✅ Added with `PWDEBUG=1`
- [x] Configure `husky` + `lint-staged`.
- [x] Include Allure report generation scripts.

---

## 12. Performance & Scalability

- [x] Tagging Strategy for test filtering.
- [x] Enable `workers` in config.
- [x] Use Headless mode in CI.
- [x] Capture artifacts only on failure.
- [x] Use Retry + Trace Viewer.
- [x] Test Sharding (`--shard=1/4`). ✅ CI workflow + script

---

## 13. Advanced Techniques

- [x] Hybrid Testing - NetworkMockHelper implemented.
- [x] State Reuse - `storageState` in `global-setup.ts`.
- [x] Network Mocking - `page.route()` implemented.
- [x] Smart Waiting - `waitForLoadState` used.

---

## 14. Code Quality & Naming Conventions

- [x] File Names: `kebab-case`.
- [x] Class Names: `PascalCase`.
- [x] Methods/Variables: `camelCase`.
- [x] Test Tags: `@smoke`, `@e2e` used.

---

## 15. Resilience & Verification Strategy

- [x] Visual Regression - `toHaveScreenshot()`. ✅ `tests/steps/ui.steps.ts`
- [x] Soft Assertions - `expect.soft()`. ✅ `tests/steps/ui.steps.ts`
- [x] Network Mocking. ✅ `tests/steps/network.steps.ts`
- [x] Smart Waiting.

---

## 16. Accessibility Testing

- [x] Install `@axe-core/playwright`. ✅ Installed
- [x] Run accessibility scans on critical pages. ✅ `accessibility.feature`
- [x] Include accessibility tests in CI/CD. ✅ `test:a11y` script
- [x] Focus on critical/serious violations. ✅ Filter in steps
- [x] Test individual components. ✅ Product cards check

**Implementation Notes:**

- `tests/features/accessibility.feature` - 4 accessibility scenarios
- `tests/steps/accessibility.steps.ts` - axe-core integration
- WCAG 2.0 Level A & AA compliance checks

---

## 17. Test Data & Security

- [x] Dynamic Data with `@faker-js/faker`. ✅ `tests/steps/shopping.steps.ts`
- [x] Secret Management via `.env`.
- [x] Data Cleanup in hooks. ✅ `tests/hooks/index.ts`

---

## 18. Cross-Browser & Environment Strategy

- [x] Multi-Browser: chromium, firefox, webkit, Mobile Chrome. ✅ `playwright.config.ts`
- [x] Mobile Viewports: Pixel 5 configured.
- [x] Environment Agnostic via `BASE_URL`.

---

## 19. Console Error Monitoring

- [x] DebugHelper with console logging. ✅ `tests/utils/helpers.ts`
- [x] Auto-fail on console errors (strict mode). ✅ `ConsoleErrorMonitor`
- [x] Whitelist known errors. ✅ Regex patterns in monitor
- [x] Log errors for debugging.
- [x] Track uncaught exceptions. ✅ `pageerror` event

---

## 20. Geolocation & Timezone Testing

- [ ] Test location-based features.
- [ ] Verify timezone-dependent logic.
- [ ] Test geolocation permission denied.
- [ ] Use consistent timezones in CI.
- [ ] Test locale-specific formatting.

**Note:** Not applicable for SauceDemo (no location features).

---

## 21. Flaky Test Management

- [x] `retries` configured in CI (2 retries).
- [x] Run tests multiple times to detect flaky tests. ✅ `scripts/flaky-test.ps1`
- [x] Quarantine flaky tests. ✅ `scripts/quarantine.ps1` + `@flaky` tag
- [x] Track flaky test rate. ✅ `scripts/flaky-history.ps1` + `npm run test:flaky:report`
- [x] Fix root causes. ✅ `expect.soft` + increased timeouts

---

## 22. Custom Reporters

- [x] Allure Reporter configured.
- [x] HTML Reporter configured.
- [x] Slack notification reporter. ✅ `tests/reporters/slack-reporter.ts`
- [x] Create dashboards for metrics. ✅ `scripts/generate-dashboard.ps1`
- [x] Conditional reporters for CI. ✅ `playwright.config.ts`

**Implementation Notes:**

- Slack Reporter sends test results via webhook
- Supports failure notifications with @mentions
- Configurable for success/failure notifications

---

## 23. Multi-tab & Multi-window Testing

- [x] Handle new tabs with `context.waitForEvent('page')`. ✅ `social.steps.ts`
- [x] Handle popups with `page.waitForEvent('popup')`. ✅ `social.steps.ts`
- [x] Test cross-tab communication. ✅ Social links testing
- [x] Close popups after use. ✅ Cleanup step implemented

**Note:** SauceDemo has social links that open new tabs - good candidate!

---

## 24. Keyboard Navigation & Accessibility

- [x] Test complete flows using keyboard only. ✅ `keyboard.feature`
- [x] Verify logical tab order. ✅ Tab navigation tests
- [x] Test keyboard shortcuts. ✅ Enter key tests
- [x] Ensure focus indicators visible. ✅ Focus visibility check
- [x] Test ARIA labels. ✅ `accessibility.feature` @aria scenarios

**Implementation Notes:**

- `tests/features/keyboard.feature` - Keyboard-only navigation scenarios
- `tests/steps/keyboard.steps.ts` - Tab, Enter, Arrow key interactions

---

## 25. Cookie & Storage Management

- [x] Storage state saved for auth. ✅ `global-setup.ts` / `state.json`
- [x] Clear storage in After hooks.
- [x] Test storage persistence across reloads. ✅ `storage.feature` @persistence
- [x] Verify cookie attributes. ✅ `storage.feature` @cookies

---

## 26. Mobile Gestures & Touch Testing

- [x] Mobile Chrome project configured.
- [x] Enable `hasTouch: true`. ✅ `playwright.config.ts`
- [x] Test swipe gestures on product carousel. ✅ N/A (no carousel in SauceDemo)
- [x] Verify touch targets are large enough. ✅ `mobile.feature` @touch-targets
- [x] Test landscape/portrait. ✅ `mobile.feature` @orientation

**Implementation Notes:**

- Mobile testing with `npm run test:mobile`
- Touch target size check (min 44x44px per WCAG 2.5.5)
- Tap interactions using Playwright's `.tap()` method
- Landscape/Portrait rotation testing with viewport size changes
- Checkout flow testing in both orientations

---

## 27. Security Testing Basics

- [x] Test input sanitization (XSS). ✅ `security.feature` @xss
- [x] Verify security headers. ✅ `security.feature` @headers (informational)
- [x] Test for open redirects. ✅ `security.feature` @open-redirect
- [x] Ensure sensitive data not in URLs. ✅ `security.feature` @url
- [x] Test auth boundaries. ✅ `security.feature` @auth-boundary

**Implementation Notes:**

- XSS testing on login and checkout forms
- SQL injection prevention testing
- Session invalidation after logout
- Protected page access blocked without login
- `npm run test:security` to run security tests

---

## 28. Performance Testing

- [x] Measure Core Web Vitals. ✅ `performance.feature` @core-web-vitals
- [x] Set performance budgets. ✅ `SimplePerformanceHelper` with thresholds
- [x] Run performance tests in CI. ✅ `npm run test:perf`
- [x] Compare metrics against baseline. ✅ Multi-page comparison
- [x] Use Lighthouse. ✅ `tests/utils/lighthouse-helper.ts`

**Implementation Notes:**

- `LighthouseHelper` for full audits (requires Chrome)
- `SimplePerformanceHelper` for basic metrics using Navigation Timing API
- Measures FCP, LCP, load time, resource count/size
- `npm run test:perf` runs performance tests on chromium

---

## 29. Test Data Factories

- [x] Using Faker for data generation.
- [x] Create UserFactory class. ✅ `tests/factories/user-factory.ts`
- [x] Create ProductFactory class. ✅ `tests/factories/product-factory.ts`
- [x] Provide presets for common scenarios. ✅ SAUCE_DEMO_USERS, SAUCE_DEMO_PRODUCTS

**Implementation Notes:**

- UserFactory: standard/invalid users, XSS/SQL injection vectors, checkout info
- ProductFactory: all SauceDemo products, sorting helpers, cart calculations
- Import from `tests/factories` for convenient usage

**Priority:** Low - Current faker usage is sufficient.

---

## 30. PDF Testing

- [ ] Verify PDF downloads.
- [ ] Check file size.
- [ ] Test PDF viewer.

**Note:** Not applicable - SauceDemo doesn't have PDF features.

---

## 31. Authentication Patterns

- [x] Use `storageState` for session reuse. ✅ `global-setup.ts` / `state.json`
- [x] Login once in global-setup, reuse across tests.
- [ ] Handle OAuth/SSO popups (if applicable).
- [x] Implement API-based login alternative. ✅ NetworkMockHelper
- [x] Test session expiry scenarios. ✅ `login.feature` @session
- [x] Test invalid credential scenarios. ✅ `login.feature` @invalid-credentials

**Implementation Notes:**

- SauceDemo uses simple username/password auth
- `global-setup.ts` logs in once and saves state
- Multiple user types available: standard_user, locked_out_user, problem_user
- Session tests cover logout, direct access blocking, and session persistence

---

## 32. Test Documentation & Living Docs

- [x] Use Gherkin features as user-facing documentation.
- [x] Keep scenarios focused on WHAT, not HOW.
- [x] Generate test reports (Allure). ✅ `allure-playwright`
- [x] Maintain a test coverage matrix. ✅ `docs/test-coverage-matrix.md` + `npm run docs:coverage`
- [x] Link tests to requirements using tags. ✅ `@REQ-{CATEGORY}-{NUMBER}` format

**Implementation Notes:**

- Feature files in `tests/features/` serve as living documentation
- Allure reports deployed to Vercel
- Coverage matrix auto-generated from feature files
- Requirements traceability matrix in `docs/requirements-traceability.md`
- Tags: @REQ-AUTH, @REQ-SHOP, @REQ-UI, @REQ-A11Y, @REQ-SEC, @REQ-PERF, @REQ-MOBILE

---

## 33. Retry Patterns & Error Recovery

- [x] Built-in retries configured (2 in CI). ✅ `playwright.config.ts`
- [x] Implement custom retry for external dependencies. ✅ `tests/utils/retry-helper.ts`
- [x] Use exponential backoff for flaky operations. ✅ `RetryHelper` with backoff
- [x] Log retry attempts for debugging. ✅ `tests/hooks/index.ts`
- [x] Prefer fixing root cause over adding retries.

**Note:** Playwright's built-in retry is sufficient for this demo project.

---

## Enterprise Checklist Summary

| Category             | Status | Key Points                                                     |
| -------------------- | ------ | -------------------------------------------------------------- |
| **Architecture**     | ✅     | POM pattern, Fixtures/Hooks, Clean separation of concerns      |
| **Stability**        | ✅     | `getByTestId`, `data-test`, auto-waiting, no hardcoded waits   |
| **Error Handling**   | ✅     | Custom error messages, structured logging, failure attachments |
| **Debugging**        | ✅     | Trace Viewer, Inspector, UI Mode, Debug utilities              |
| **API Testing**      | ✅     | Network mocking with helpers                                   |
| **CI/CD**            | ✅     | GitHub Actions, Allure reporting, Vercel deployment, Sharding  |
| **Performance**      | ✅     | Parallelism, tagging strategy, optimized artifacts             |
| **Code Quality**     | ✅     | Naming conventions, step reuse, maintainability                |
| **Resilience**       | ✅     | Visual regression, smart waiting, network mocking              |
| **Authentication**   | ✅     | storageState, global-setup login, session reuse                |
| **Documentation**    | ✅     | BDD as living docs, Allure reports                             |
| **Retry Patterns**   | ✅     | Built-in retries in CI                                         |
| **Accessibility**    | ✅     | @axe-core/playwright, WCAG 2.0 compliance                      |
| **Security**         | ✅     | `.env` for secrets, no hardcoded creds                         |
| **Scalability**      | ✅     | Cross-browser, faker data, cleanup hooks, 4-shard CI           |
| **Multi-tab**        | ✅     | Social links testing with popup handling                       |
| **Keyboard Nav**     | ✅     | Tab order, keyboard-only flows                                 |
| **Console Monitor**  | ✅     | Auto-fail mode, whitelist, exception tracking                  |
| **Custom Reporters** | ⬜     | Nice to have                                                   |

---

## Quick Reference Checklist

### ✅ Implemented

- [x] Clean Code: Separation of Concerns
- [x] Stability: `getByTestId` + `data-test` selectors
- [x] No Flakiness: Auto-waiting
- [x] Independence: Isolated browser contexts
- [x] Visibility: Allure & CI/CD integration
- [x] Maintainability: Step reuse, naming conventions
- [x] Error Handling: Structured logging
- [x] Debugging: Trace Viewer, Debug utilities, `test:debug` script
- [x] Network Mocking: `page.route()` implemented
- [x] Soft Assertions: `expect.soft()` implemented
- [x] Security: Env vars for secrets
- [x] Dynamic Data: Faker.js
- [x] Data Cleanup: Teardown hooks
- [x] Visual Regression: Screenshot testing
- [x] Cross-Browser: 4 projects configured
- [x] State Reuse: storageState in global-setup
- [x] Authentication: Session reuse via storageState
- [x] Living Docs: BDD features as documentation
- [x] Retry Patterns: Built-in retries in CI
- [x] Accessibility Testing: @axe-core/playwright with WCAG 2.0
- [x] Keyboard Navigation: Tab order, keyboard-only flows
- [x] Multi-tab Testing: Social links with popup handling
- [x] Console Error Monitoring: Auto-fail mode with whitelist
- [x] Test Sharding: 4-shard CI workflow
- [x] testIdAttribute: Configured for `data-test`

### ⬜ Optional (Nice to Have)

- [ ] Custom Slack Reporter
- [ ] Performance Testing with Lighthouse
- [ ] Security Testing basics
- [ ] Mobile Gestures (`hasTouch: true`)
- [ ] Test Data Factories (UserFactory, ProductFactory)
- [ ] Test ARIA labels for accessibility

---

## Action Items (Priority Order)

All high-priority items have been completed! ✅

### Completed (2026-01-14)

1. ~~**High** Add `testIdAttribute: 'data-test'` to playwright.config.ts~~ ✅
2. ~~**High** Add `test:debug` script to package.json~~ ✅
3. ~~**Medium** Add accessibility testing with `@axe-core/playwright`~~ ✅
4. ~~**Medium** Add keyboard navigation tests~~ ✅
5. ~~**Medium** Add multi-tab testing for social links~~ ✅
6. ~~**Medium** Add console error monitoring (auto-fail mode)~~ ✅
7. ~~**Medium** Add test sharding for CI~~ ✅
8. ~~**Medium** Implement conditional reporters (CI/Local)~~ ✅
9. ~~**Medium** Add API Health Checks~~ ✅
10. ~~**Low** Create Metrics Dashboard script~~ ✅
11. ~~**Low** Implement Data Cleanup Helper~~ ✅

### Remaining (Low Priority)

1. **Low** Add Slack reporter for team notifications
2. **Low** Add performance testing with Lighthouse
3. **Low** Add mobile touch gestures testing
4. **Low** Create Test Data Factories
