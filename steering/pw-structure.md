# 📁 Cấu trúc Source Code (Standard Enterprise Framework)

Đây là mô hình tổ chức source code tối ưu cho khả năng mở rộng (Scalability) và bảo trì (Maintainability), được thiết kế để tách biệt rõ ràng giữa Business Logic (Gherkin) và Automation Logic (TypeScript).

```ascii
sauce-demo
├── README.md              # Project run instructions
├── package.json           # Dependency management & scripts
├── tsconfig.json          # TypeScript configuration
├── playwright.config.ts   # Playwright configuration (Browser, Retry, Video, Allure Reporter...)
├── .env.example           # Environment variables template
├── .env.local             # Local environment variables (not committed)
├── .eslintignore          # ESLint ignore patterns
├── .github
│   └── workflows
│       └── e2e.yml        # CI/CD Pipeline for GitHub Actions
│
├── steering               # 📚 Project Documentation & Best Practices
│   ├── playwright-checklist.md  # Enterprise best practices checklist
│   ├── pw-product.md            # Product specification & test scenarios
│   ├── pw-structure.md          # This file - Code structure documentation
│   ├── pw-roadmap.md            # Learning roadmap for Playwright mastery
│   └── pw-tasks.md              # Task list & implementation guides
│
├── tests                  # Directory containing all test source code
│   ├── features           # [Business Layer] Contains Gherkin files (.feature)
│   │   ├── login.feature
│   │   ├── shopping.feature
│   │   ├── social.feature
│   │   ├── ui.feature
│   │   ├── advanced-patterns.feature    # ✨ NEW: Dynamic data, Soft assertions, Data cleanup
│   │   └── network-errors.feature       # ✨ NEW: Network mocking scenarios
│   │
│   ├── steps              # [Glue Layer] Code connecting Gherkin with Page Objects
│   │   ├── login.steps.ts
│   │   ├── shopping.steps.ts            # ✨ Updated: Faker integration for dynamic data
│   │   ├── social.steps.ts
│   │   ├── ui.steps.ts                  # ✨ Updated: Soft assertions implementation
│   │   └── network.steps.ts             # ✨ NEW: Network mocking step definitions
│   │
│   ├── pages              # [UI Layer] Page Object Model (Locators & Actions)
│   │   ├── checkout-page.ts
│   │   ├── inventory-page.ts
│   │   └── login-page.ts
│   │
│   ├── hooks              # [Lifecycle Layer] Setup & Teardown
│   │   └── index.ts       # ✨ Updated: Structured logging + Data cleanup mechanism
│   │
│   ├── fixtures           # [Core Layer] Dependency Injection & Fixtures
│   │   └── index.ts       # Custom fixtures to inject Page Objects into steps
│   │
│   ├── utils              # [Support Layer] Helper utilities
│   │   ├── config.ts      # Configuration constants
│   │   └── helpers.ts     # ✨ NEW: DebugHelper + NetworkMockHelper utilities
│   │
│   └── global-setup.ts    # Global setup script (authentication state)
│
├── allure-results         # Test results for Allure (generated)
├── allure-report          # Allure HTML report (generated)
├── playwright-report      # Default Playwright report (generated)
└── test-results           # Test results, screenshots, videos (generated)
```
