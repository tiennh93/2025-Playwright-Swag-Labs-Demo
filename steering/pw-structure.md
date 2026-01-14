# 📁 Cấu trúc Source Code (Standard Enterprise Framework)

Đây là mô hình tổ chức source code tối ưu cho khả năng mở rộng (Scalability) và bảo trì (Maintainability), được thiết kế để tách biệt rõ ràng giữa Business Logic (Gherkin) và Automation Logic (TypeScript).

> **Last Updated:** 2026-01-14  
> **Progress:** 94.5% Complete (137/145 items)

```ascii
sauce-demo
├── README.md              # Project run instructions
├── package.json           # Dependency management & scripts
├── tsconfig.json          # TypeScript configuration
├── playwright.config.ts   # Playwright config (Browsers, Retry, Reporters, Conditional CI/Local)
├── .env.example           # Environment variables template
├── .env.local             # Local environment variables (not committed)
├── .eslintignore          # ESLint ignore patterns
├── .prettierrc            # Prettier configuration
│
├── .github
│   └── workflows
│       └── e2e.yml        # CI/CD Pipeline (4-shard parallel execution)
│
├── scripts                # 🔧 PowerShell Automation Scripts
│   ├── run-tests.ps1            # Main test runner with Allure report
│   ├── generate-dashboard.ps1   # Metrics dashboard generator
│   ├── flaky-test.ps1           # Flaky test detection (run N times)
│   ├── flaky-history.ps1        # Flaky test history tracking
│   ├── quarantine.ps1           # Quarantine management (@flaky tag)
│   └── coverage-matrix.ps1      # Test coverage matrix generator
│
├── steering               # 📚 Project Documentation & Best Practices
│   ├── playwright-checklist.md  # Enterprise best practices template
│   ├── sauce-demo-checklist.md  # Project-specific checklist (94.5% complete)
│   ├── pw-product.md            # Product specification & test scenarios
│   ├── pw-structure.md          # This file - Code structure documentation
│   ├── pw-roadmap.md            # Learning roadmap for Playwright mastery
│   └── pw-tasks.md              # Task list & implementation guides
│
├── docs                   # 📄 Generated Documentation
│   ├── test-coverage-matrix.md  # Auto-generated coverage matrix
│   └── requirements-traceability.md # Requirements traceability
│
├── tests                  # 🧪 Test Source Code
│   ├── features           # [Business Layer] Gherkin files (.feature)
│   │   ├── login.feature            # Authentication tests
│   │   ├── shopping.feature         # E-commerce flows
│   │   ├── accessibility.feature    # WCAG 2.0 compliance (@axe-core)
│   │   ├── security.feature         # XSS, SQL injection, auth boundaries
│   │   ├── performance.feature      # Core Web Vitals, Lighthouse
│   │   ├── mobile.feature           # Touch gestures, orientation
│   │   ├── keyboard.feature         # Keyboard-only navigation
│   │   ├── health.feature           # Application health checks
│   │   ├── storage.feature          # Cookie & storage management
│   │   ├── social.feature           # Multi-tab testing
│   │   ├── ui.feature               # Visual regression, soft assertions
│   │   ├── network-errors.feature   # Network mocking scenarios
│   │   └── advanced-patterns.feature # Faker, data cleanup
│   │
│   ├── steps              # [Glue Layer] Step Definitions
│   │   ├── login.steps.ts           # Authentication steps
│   │   ├── shopping.steps.ts        # Shopping flow steps (UserFactory)
│   │   ├── accessibility.steps.ts   # @axe-core integration
│   │   ├── security.steps.ts        # Security testing steps
│   │   ├── performance.steps.ts     # Performance measurement steps
│   │   ├── mobile.steps.ts          # Mobile gesture steps
│   │   ├── keyboard.steps.ts        # Keyboard navigation steps
│   │   ├── health.steps.ts          # Health check steps
│   │   ├── storage.steps.ts         # Storage management steps
│   │   ├── social.steps.ts          # Multi-tab handling steps
│   │   ├── ui.steps.ts              # Visual regression, soft assertions
│   │   └── network.steps.ts         # Network mocking steps
│   │
│   ├── pages              # [UI Layer] Page Object Model
│   │   ├── login-page.ts            # Login page locators & actions
│   │   ├── inventory-page.ts        # Inventory page (products, cart)
│   │   └── checkout-page.ts         # Checkout flow page
│   │
│   ├── factories          # [Data Layer] Test Data Factories
│   │   ├── index.ts                 # Barrel export
│   │   ├── user-factory.ts          # User generation (valid/invalid/XSS/SQL)
│   │   └── product-factory.ts       # Product helpers & cart calculations
│   │
│   ├── reporters          # [Output Layer] Custom Reporters
│   │   └── slack-reporter.ts        # Slack webhook notifications
│   │
│   ├── hooks              # [Lifecycle Layer] Setup & Teardown
│   │   └── index.ts                 # Before/After hooks, logging, cleanup
│   │
│   ├── fixtures           # [Core Layer] Dependency Injection
│   │   └── index.ts                 # Custom fixtures (page objects)
│   │
│   ├── utils              # [Support Layer] Helper Utilities
│   │   ├── config.ts                # Configuration constants (BASE_URL)
│   │   ├── helpers.ts               # DebugHelper + NetworkMockHelper
│   │   ├── console-error-monitor.ts # Console error tracking
│   │   ├── retry-helper.ts          # Exponential backoff retry
│   │   ├── performance-helper.ts    # Simple performance metrics
│   │   ├── lighthouse-helper.ts     # Lighthouse audit integration
│   │   └── data-cleanup-helper.ts   # API data cleanup utility
│   │
│   └── global-setup.ts    # Global setup (auth state + health check)
│
├── allure-results         # [Generated] Raw Allure data
├── allure-report          # [Generated] Allure HTML report
├── playwright-report      # [Generated] Playwright HTML report
├── test-results           # [Generated] Screenshots, videos, traces
├── test-results.json      # [Generated] JSON report for dashboard
├── dashboard.html         # [Generated] Metrics dashboard
└── state.json             # [Generated] Auth storage state
```

## 📊 Layer Architecture

| Layer         | Responsibility                      | Files                    |
| ------------- | ----------------------------------- | ------------------------ |
| **Business**  | Test scenarios in business language | `features/*.feature`     |
| **Glue**      | Connect Gherkin to Page Objects     | `steps/*.steps.ts`       |
| **UI**        | Locators and page actions           | `pages/*-page.ts`        |
| **Data**      | Test data generation                | `factories/*-factory.ts` |
| **Output**    | Custom reporting                    | `reporters/*.ts`         |
| **Support**   | Utilities and helpers               | `utils/*.ts`             |
| **Lifecycle** | Setup/teardown hooks                | `hooks/index.ts`         |
| **Core**      | Dependency injection                | `fixtures/index.ts`      |

## 🏷️ Tag Strategy

| Tag              | Purpose             | Command                       |
| ---------------- | ------------------- | ----------------------------- |
| `@smoke`         | Critical path tests | `npm run test:smoke`          |
| `@accessibility` | WCAG compliance     | `npm run test:a11y`           |
| `@security`      | Security validation | `npm run test:security`       |
| `@performance`   | Performance metrics | `npm run test:perf`           |
| `@mobile`        | Mobile testing      | `npm run test:mobile`         |
| `@keyboard`      | Keyboard navigation | `npm run test:keyboard`       |
| `@flaky`         | Quarantined tests   | `npm run test:quarantine:run` |
