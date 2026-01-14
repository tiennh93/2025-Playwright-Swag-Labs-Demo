# Test Coverage Matrix

> **Generated:** 2026-01-14 13:20:02  
> **Total Features:** 9  
> **Total Scenarios:** 34

This document provides a comprehensive view of all test scenarios in the Sauce Demo project.

---

## 投 Summary

### By Feature

| Feature                                | Scenarios | Tags                                                                                                   |
| -------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| Social Media Links - Multi-Tab Testing | 2         | @multi-tab@smoke @multi-tab                                                                            |
| Shopping and Checkout Functionality    | 4         | @shopping@shopping @shopping @shopping @broken-images                                                  |
| Visual Regression Testing              | 1         | @visual@visual                                                                                         |
| Storage Management                     | 4         | @regression@persistence @persistence @session @cookies                                                 |
| Network Error Handling                 | 2         | @network-mocking@blocked-images @slow-network                                                          |
| Advanced Testing Patterns              | 3         | @dynamic-data@faker @soft-assertions @data-cleanup                                                     |
| Accessibility Testing                  | 6         | @a11y@critical @critical @a11y @a11y @aria @aria                                                       |
| User Authentication                    | 8         | @authentication@smoke @negative @data-driven @invalid-credentials @negative @session @session @session |
| Keyboard Navigation Testing            | 4         | @keyboard@smoke @keyboard @keyboard @keyboard                                                          |

### By Tag

| Tag                  | Count | Percentage |
| -------------------- | ----- | ---------- |
| @smoke               | 4     | 11.8%      |
| @session             | 4     | 11.8%      |
| @negative            | 4     | 11.8%      |
| @persistence         | 2     | 5.9%       |
| @regression          | 2     | 5.9%       |
| @aria                | 2     | 5.9%       |
| @critical            | 2     | 5.9%       |
| @accessibility       | 2     | 5.9%       |
| @cookies             | 1     | 2.9%       |
| @slow-network        | 1     | 2.9%       |
| @faker               | 1     | 2.9%       |
| @shopping            | 1     | 2.9%       |
| @dynamic-data        | 1     | 2.9%       |
| @blocked-images      | 1     | 2.9%       |
| @soft-assertions     | 1     | 2.9%       |
| @multi-tab           | 1     | 2.9%       |
| @data-driven         | 1     | 2.9%       |
| @data-cleanup        | 1     | 2.9%       |
| @storage             | 1     | 2.9%       |
| @invalid-credentials | 1     | 2.9%       |
| @visual              | 1     | 2.9%       |
| @keyboard            | 1     | 2.9%       |
| @network-mocking     | 1     | 2.9%       |
| @broken-images       | 1     | 2.9%       |
| @social              | 1     | 2.9%       |
| @authentication      | 1     | 2.9%       |
| @a11y                | 1     | 2.9%       |

---

## 搭 Detailed Coverage

### Social Media Links - Multi-Tab Testing

**File:** `social.feature`  
**Feature Tags:** @multi-tab  
**Scenarios:** 2

| #   | Scenario                                           | Type     | Tags       | Line |
| --- | -------------------------------------------------- | -------- | ---------- | ---- |
| 1   | Open LinkedIn link in a new tab                    | Scenario | @smoke     | 9    |
| 2   | Verify all social links have valid href attributes | Scenario | @multi-tab | 14   |

### Shopping and Checkout Functionality

**File:** `shopping.feature`  
**Feature Tags:** @shopping  
**Scenarios:** 4

| #   | Scenario                                 | Type     | Tags           | Line |
| --- | ---------------------------------------- | -------- | -------------- | ---- |
| 1   | Sort products by price low to high       | Scenario | @shopping      | 8    |
| 2   | Successful checkout process (End-to-End) | Scenario | @shopping      | 12   |
| 3   | Remove product from cart on homepage     | Scenario | @shopping      | 22   |
| 4   | Verify product images are not broken     | Scenario | @broken-images | 28   |

### Visual Regression Testing

**File:** `ui.feature`  
**Feature Tags:** @visual  
**Scenarios:** 1

| #   | Scenario                     | Type     | Tags    | Line |
| --- | ---------------------------- | -------- | ------- | ---- |
| 1   | Login page UI matches design | Scenario | @visual | 4    |

### Storage Management

**File:** `storage.feature`  
**Feature Tags:** @regression  
**Scenarios:** 4

| #   | Scenario                                             | Type     | Tags         | Line |
| --- | ---------------------------------------------------- | -------- | ------------ | ---- |
| 1   | Cart items should persist after page reload          | Scenario | @persistence | 9    |
| 2   | Multiple cart items should persist after page reload | Scenario | @persistence | 16   |
| 3   | Cart should be empty after clearing session storage  | Scenario | @session     | 26   |
| 4   | Verify session cookies are set correctly             | Scenario | @cookies     | 33   |

### Network Error Handling

**File:** `network-errors.feature`  
**Feature Tags:** @network-mocking  
**Scenarios:** 2

| #   | Scenario                                        | Type     | Tags            | Line |
| --- | ----------------------------------------------- | -------- | --------------- | ---- |
| 1   | Application works even when images fail to load | Scenario | @blocked-images | 10   |
| 2   | Application handles slow network gracefully     | Scenario | @slow-network   | 15   |

### Advanced Testing Patterns

**File:** `advanced-patterns.feature`  
**Feature Tags:** @dynamic-data  
**Scenarios:** 3

| #   | Scenario                                      | Type     | Tags             | Line |
| --- | --------------------------------------------- | -------- | ---------------- | ---- |
| 1   | Checkout with dynamically generated user data | Scenario | @faker           | 10   |
| 2   | Verify all UI elements using soft assertions  | Scenario | @soft-assertions | 19   |
| 3   | Cart cleanup after adding multiple items      | Scenario | @data-cleanup    | 24   |

### Accessibility Testing

**File:** `accessibility.feature`  
**Feature Tags:** @a11y  
**Scenarios:** 6

| #   | Scenario                                                        | Type     | Tags      | Line |
| --- | --------------------------------------------------------------- | -------- | --------- | ---- |
| 1   | Login page should have no critical accessibility violations     | Scenario | @critical | 9    |
| 2   | Inventory page should have no critical accessibility violations | Scenario | @critical | 14   |
| 3   | Product cards should be accessible                              | Scenario | @a11y     | 17   |
| 4   | Form inputs should have proper labels                           | Scenario | @a11y     | 20   |
| 5   | Interactive elements should have proper ARIA labels             | Scenario | @aria     | 25   |
| 6   | Navigation elements should have proper ARIA attributes          | Scenario | @aria     | 31   |

### User Authentication

**File:** `login.feature`  
**Feature Tags:** @authentication  
**Scenarios:** 8

| #   | Scenario                                                          | Type     | Tags                 | Line |
| --- | ----------------------------------------------------------------- | -------- | -------------------- | ---- |
| 1   | Login successfully with standard user                             | Scenario | @smoke               | 5    |
| 2   | Login failed with locked out user                                 | Scenario | @negative            | 11   |
| 3   | Login with different user types                                   | Outline  | @data-driven         | 17   |
| 4   | Login with invalid credentials                                    | Outline  | @invalid-credentials | 33   |
| 5   | Login with special characters in username                         | Scenario | @negative            | 47   |
| 6   | Direct access to inventory without login should redirect to login | Scenario | @session             | 56   |
| 7   | Logout should clear session and redirect to login                 | Scenario | @session             | 62   |
| 8   | Session should persist after page refresh                         | Scenario | @session             | 69   |

### Keyboard Navigation Testing

**File:** `keyboard.feature`  
**Feature Tags:** @keyboard  
**Scenarios:** 4

| #   | Scenario                                     | Type     | Tags      | Line |
| --- | -------------------------------------------- | -------- | --------- | ---- |
| 1   | Complete login flow using keyboard only      | Scenario | @smoke    | 9    |
| 2   | Navigate through inventory page with Tab key | Scenario | @keyboard | 14   |
| 3   | Add item to cart using keyboard              | Scenario | @keyboard | 18   |
| 4   | Open menu using keyboard                     | Scenario | @keyboard | 23   |

---

## 捷・・Tag Reference

| Tag                        | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| `@smoke`                   | Critical path tests, run on every commit |
| `@regression`              | Full regression suite                    |
| `@accessibility` / `@a11y` | Accessibility testing with axe-core      |
| `@keyboard`                | Keyboard navigation tests                |
| `@authentication`          | Login/logout related tests               |
| `@shopping`                | Shopping cart and checkout flow          |
| `@storage`                 | Cookie and storage management            |
| `@session`                 | Session handling tests                   |
| `@negative`                | Negative/error case testing              |
| `@flaky`                   | Quarantined unstable tests               |
| `@critical`                | Critical business functionality          |
| `@aria`                    | ARIA labels and accessibility attributes |

---

## 嶋 Coverage Gaps

To identify potential coverage gaps, review:

1. **Features without @smoke tests** - Critical paths may be missing
2. **Low scenario count features** - May need more test cases
3. **Missing @negative tests** - Error handling coverage

---

_This matrix is auto-generated by `scripts/coverage-matrix.ps1`_
