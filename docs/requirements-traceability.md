# Requirements Traceability Matrix

This document links test scenarios to requirements for traceability purposes.

## Requirement Tags Convention

Test scenarios are tagged with requirement IDs using the format: `@REQ-{CATEGORY}-{NUMBER}`

### Categories

| Category | Description                      |
| -------- | -------------------------------- |
| AUTH     | Authentication & Authorization   |
| SHOP     | Shopping & Cart functionality    |
| UI       | User Interface & Visual elements |
| A11Y     | Accessibility requirements       |
| PERF     | Performance requirements         |
| SEC      | Security requirements            |
| MOBILE   | Mobile-specific requirements     |

## Requirements Mapping

### Authentication (AUTH)

| Requirement ID | Description                            | Feature File  | Status    |
| -------------- | -------------------------------------- | ------------- | --------- |
| REQ-AUTH-001   | User can login with valid credentials  | login.feature | ✅ Tested |
| REQ-AUTH-002   | Locked out users should be blocked     | login.feature | ✅ Tested |
| REQ-AUTH-003   | Invalid credentials show error message | login.feature | ✅ Tested |
| REQ-AUTH-004   | Session persists after page refresh    | login.feature | ✅ Tested |
| REQ-AUTH-005   | Logout clears session                  | login.feature | ✅ Tested |

### Shopping (SHOP)

| Requirement ID | Description                        | Feature File     | Status    |
| -------------- | ---------------------------------- | ---------------- | --------- |
| REQ-SHOP-001   | Products should be sortable        | shopping.feature | ✅ Tested |
| REQ-SHOP-002   | User can complete checkout process | shopping.feature | ✅ Tested |
| REQ-SHOP-003   | User can remove items from cart    | shopping.feature | ✅ Tested |

### User Interface (UI)

| Requirement ID | Description                          | Feature File     | Status    |
| -------------- | ------------------------------------ | ---------------- | --------- |
| REQ-UI-001     | Product images should load correctly | shopping.feature | ✅ Tested |
| REQ-UI-002     | Visual regression baseline           | ui.feature       | ✅ Tested |

### Accessibility (A11Y)

| Requirement ID | Description                 | Feature File          | Status    |
| -------------- | --------------------------- | --------------------- | --------- |
| REQ-A11Y-001   | WCAG 2.0 Level A compliance | accessibility.feature | ✅ Tested |
| REQ-A11Y-002   | Keyboard navigation support | keyboard.feature      | ✅ Tested |

### Security (SEC)

| Requirement ID | Description               | Feature File     | Status    |
| -------------- | ------------------------- | ---------------- | --------- |
| REQ-SEC-001    | XSS input sanitization    | security.feature | ✅ Tested |
| REQ-SEC-002    | SQL injection prevention  | security.feature | ✅ Tested |
| REQ-SEC-003    | Auth boundary enforcement | security.feature | ✅ Tested |
| REQ-SEC-004    | Open redirect prevention  | security.feature | ✅ Tested |

### Performance (PERF)

| Requirement ID | Description                | Feature File        | Status    |
| -------------- | -------------------------- | ------------------- | --------- |
| REQ-PERF-001   | Page load under 3 seconds  | performance.feature | ✅ Tested |
| REQ-PERF-002   | Core Web Vitals compliance | performance.feature | ✅ Tested |

### Mobile (MOBILE)

| Requirement ID | Description                | Feature File   | Status    |
| -------------- | -------------------------- | -------------- | --------- |
| REQ-MOBILE-001 | Touch targets >= 44x44px   | mobile.feature | ✅ Tested |
| REQ-MOBILE-002 | Portrait/Landscape support | mobile.feature | ✅ Tested |
| REQ-MOBILE-003 | Mobile checkout flow       | mobile.feature | ✅ Tested |

## Running Tests by Requirement

```bash
# Run all tests for a specific requirement
npx playwright test --grep @REQ-AUTH-001

# Run all authentication tests
npx playwright test --grep @REQ-AUTH

# Run all shopping tests
npx playwright test --grep @REQ-SHOP
```

## Integration with Issue Trackers

For production projects, requirement tags can be linked to:

- **Jira**: Use format `@JIRA-PROJECT-123`
- **GitHub Issues**: Use format `@GH-123`
- **Azure DevOps**: Use format `@ADO-123`

## Updating This Document

When adding new tests:

1. Identify the requirement being tested
2. Add appropriate `@REQ-{CATEGORY}-{NUMBER}` tag to scenario
3. Update the mapping table above
4. Run `npm run docs:coverage` to verify coverage
