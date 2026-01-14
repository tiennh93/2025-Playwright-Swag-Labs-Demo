# Sauce Demo - Playwright Checklist (Project-Specific)

> **Version:** 2.0  
> **Last Updated:** 2026-01-14  
> **Project:** Sauce Demo E2E Testing  
> **Template:** Based on `playwright-checklist.md` v2.0

This checklist tracks the implementation status of best practices for the **Sauce Demo** project.

---

## 1. Directory Structure & Conventions

✅ Best practice:

- [x] Feature (.feature) contains only **business language** (Domain Driven).
- [x] Step definitions do NOT contain complex logic.
- [x] Page Objects do NOT contain assertions.
- [x] Use `index.ts` in `hooks` and `fixtures` for cleaner imports.

**Implementation Notes:**

- `tests/features/` - 6 feature files (login, shopping, ui, network, social, advanced-patterns)
- `tests/pages/` - 3 page objects (LoginPage, InventoryPage, CheckoutPage)
- `tests/steps/` - 5 step files (login, shopping, ui, network, social)
- `tests/fixtures/index.ts` - Custom fixtures with page objects
- `tests/hooks/index.ts` - Before/After hooks with logging
- `tests/utils/` - DebugHelper, NetworkMockHelper, config

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

- Using `[data-test="..."]` selectors (SauceDemo convention)
- `testIdAttribute` should be added to config ⚠️

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
- [ ] Configure `testIdAttribute` to match `data-test`.
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
- [ ] Clean up test data via API.
- [x] Combine API setup with UI verification.
- [ ] Include health checks.

**Note:** SauceDemo is a static demo site without real API, but `NetworkMockHelper` is implemented.

---

## 10. CI/CD – GitHub Actions

- [x] GitHub Actions workflow configured. ✅ `.github/workflows/e2e.yml`
- [x] Cache node modules and Playwright browsers.
- [x] Upload Allure results.
- [x] Deploy reports to Vercel.
- [ ] Implement test sharding for large suites.

---

## 11. package.json Scripts

- [x] Include `bddgen` in test scripts.
- [x] Add `test:headed` script.
- [ ] Add `test:debug` script. ⚠️ Missing - should add `PWDEBUG=1`
- [x] Configure `husky` + `lint-staged`.
- [x] Include Allure report generation scripts.

---

## 12. Performance & Scalability

- [x] Tagging Strategy for test filtering.
- [x] Enable `workers` in config.
- [x] Use Headless mode in CI.
- [x] Capture artifacts only on failure.
- [x] Use Retry + Trace Viewer.
- [ ] Test Sharding (`--shard=1/4`).

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

- [ ] Install `@axe-core/playwright`.
- [ ] Run accessibility scans on critical pages.
- [ ] Include accessibility tests in CI/CD.
- [ ] Focus on critical/serious violations.
- [ ] Test individual components.

**Priority:** Medium - Good to have for demo project.

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
- [ ] Auto-fail on console errors (strict mode).
- [ ] Whitelist known errors.
- [x] Log errors for debugging.
- [ ] Track uncaught exceptions.

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
- [ ] Run tests multiple times to detect flaky tests.
- [ ] Quarantine flaky tests.
- [ ] Track flaky test rate.
- [ ] Fix root causes.

---

## 22. Custom Reporters

- [x] Allure Reporter configured.
- [x] HTML Reporter configured.
- [ ] Slack notification reporter.
- [ ] Create dashboards for metrics.
- [ ] Conditional reporters for CI.

**Priority:** Low - Nice to have.

---

## 23. Multi-tab & Multi-window Testing

- [ ] Handle new tabs with `context.waitForEvent('page')`.
- [ ] Handle popups with `page.waitForEvent('popup')`.
- [ ] Test cross-tab communication.
- [ ] Close popups after use.

**Note:** SauceDemo has social links that open new tabs - good candidate!

---

## 24. Keyboard Navigation & Accessibility

- [ ] Test complete flows using keyboard only.
- [ ] Verify logical tab order.
- [ ] Test keyboard shortcuts.
- [ ] Ensure focus indicators visible.
- [ ] Test ARIA labels.

**Priority:** Medium - Good for accessibility coverage.

---

## 25. Cookie & Storage Management

- [x] Storage state saved for auth. ✅ `global-setup.ts` / `state.json`
- [x] Clear storage in After hooks.
- [ ] Test storage persistence across reloads.
- [ ] Verify cookie attributes.

---

## 26. Mobile Gestures & Touch Testing

- [x] Mobile Chrome project configured.
- [ ] Enable `hasTouch: true`.
- [ ] Test swipe gestures on product carousel.
- [ ] Verify touch targets are large enough.
- [ ] Test landscape/portrait.

**Priority:** Low - Basic mobile viewport testing is done.

---

## 27. Security Testing Basics

- [ ] Test input sanitization (XSS).
- [ ] Verify security headers.
- [ ] Test for open redirects.
- [ ] Ensure sensitive data not in URLs.
- [ ] Test auth boundaries.

**Note:** SauceDemo is a demo site, but good practice to include.

---

## 28. Performance Testing

- [ ] Measure Core Web Vitals.
- [ ] Set performance budgets.
- [ ] Run performance tests in CI.
- [ ] Compare metrics against baseline.
- [ ] Use Lighthouse.

**Priority:** Low - Not critical for demo project.

---

## 29. Test Data Factories

- [x] Using Faker for data generation.
- [ ] Create UserFactory class.
- [ ] Create ProductFactory class.
- [ ] Provide presets for common scenarios.

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
- [ ] Test session expiry scenarios.
- [ ] Test invalid credential scenarios. ✅ Partially in `login.feature`

**Implementation Notes:**

- SauceDemo uses simple username/password auth
- `global-setup.ts` logs in once and saves state
- Multiple user types available: standard_user, locked_out_user, problem_user

---

## 32. Test Documentation & Living Docs

- [x] Use Gherkin features as user-facing documentation.
- [x] Keep scenarios focused on WHAT, not HOW.
- [x] Generate test reports (Allure). ✅ `allure-playwright`
- [ ] Maintain a test coverage matrix.
- [ ] Link tests to requirements using tags (e.g., `@JIRA-123`).

**Implementation Notes:**

- Feature files in `tests/features/` serve as living documentation
- Allure reports deployed to Vercel

---

## 33. Retry Patterns & Error Recovery

- [x] Built-in retries configured (2 in CI). ✅ `playwright.config.ts`
- [ ] Implement custom retry for external dependencies.
- [ ] Use exponential backoff for flaky operations.
- [ ] Log retry attempts for debugging.
- [x] Prefer fixing root cause over adding retries.

**Note:** Playwright's built-in retry is sufficient for this demo project.

---

## Enterprise Checklist Summary

| Category             | Status | Key Points                                                     |
| -------------------- | ------ | -------------------------------------------------------------- |
| **Architecture**     | ✅     | POM pattern, Fixtures/Hooks, Clean separation of concerns      |
| **Stability**        | ✅     | `getByRole`, `data-testid`, auto-waiting, no hardcoded waits   |
| **Error Handling**   | ✅     | Custom error messages, structured logging, failure attachments |
| **Debugging**        | ✅     | Trace Viewer, Inspector, UI Mode, Debug utilities              |
| **API Testing**      | ✅     | Network mocking with helpers                                   |
| **CI/CD**            | ✅     | GitHub Actions, Allure reporting, Vercel deployment            |
| **Performance**      | ✅     | Parallelism, tagging strategy, optimized artifacts             |
| **Code Quality**     | ✅     | Naming conventions, step reuse, maintainability                |
| **Resilience**       | ✅     | Visual regression, smart waiting, network mocking              |
| **Authentication**   | ✅     | storageState, global-setup login, session reuse                |
| **Documentation**    | ✅     | BDD as living docs, Allure reports                             |
| **Retry Patterns**   | ✅     | Built-in retries in CI                                         |
| **Accessibility**    | ⬜     | Not yet implemented - good candidate                           |
| **Security**         | ✅     | `.env` for secrets, no hardcoded creds                         |
| **Scalability**      | ✅     | Cross-browser, faker data, cleanup hooks                       |
| **Multi-tab**        | ⬜     | Social links open new tabs - candidate for testing             |
| **Keyboard Nav**     | ⬜     | Good for accessibility coverage                                |
| **Custom Reporters** | ⬜     | Nice to have                                                   |

---

## Quick Reference Checklist

### ✅ Implemented

- [x] Clean Code: Separation of Concerns
- [x] Stability: `data-test` selectors
- [x] No Flakiness: Auto-waiting
- [x] Independence: Isolated browser contexts
- [x] Visibility: Allure & CI/CD integration
- [x] Maintainability: Step reuse, naming conventions
- [x] Error Handling: Structured logging
- [x] Debugging: Trace Viewer, Debug utilities
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

### ⬜ To Do (Recommended)

- [ ] **testIdAttribute** - Add to playwright.config.ts
- [ ] **Accessibility Testing** - Add axe-core
- [ ] **Keyboard Navigation** - Test tab order
- [ ] **Multi-tab Testing** - Social links
- [ ] **Console Error Monitoring** - Auto-fail mode
- [ ] **Test Sharding** - For larger suites

### ⬜ Optional (Nice to Have)

- [ ] Custom Slack Reporter
- [ ] Performance Testing with Lighthouse
- [ ] Security Testing basics
- [ ] Mobile Gestures
- [ ] Test Data Factories

---

## Action Items (Priority Order)

1. **High** ⚠️ Add `testIdAttribute: 'data-test'` to playwright.config.ts
2. **High** ⚠️ Add `test:debug` script to package.json
3. **Medium** Add accessibility testing with `@axe-core/playwright`
4. **Medium** Add keyboard navigation tests
5. **Medium** Add multi-tab testing for social links
6. **Low** Add console error monitoring (auto-fail mode)
7. **Low** Consider Slack reporter for team notifications
