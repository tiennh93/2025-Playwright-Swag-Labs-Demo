# 📁 Cấu trúc Source Code (Standard Enterprise Framework)

Đây là mô hình tổ chức source code tối ưu cho khả năng mở rộng (Scalability) và bảo trì (Maintainability), được thiết kế để tách biệt rõ ràng giữa Business Logic (Gherkin) và Automation Logic (TypeScript).

```ascii
SwagLabs.E2E
├── README.md              # Hướng dẫn chạy dự án
├── package.json           # Quản lý dependencies & scripts
├── tsconfig.json          # Cấu hình TypeScript
├── playwright.config.ts   # Cấu hình Playwright (Browser, Retry, Video, Allure Reporter...)

├── .env                   # Biến môi trường (BASE_URL, USERNAME...)
├── .github
│   └── workflows
│       └── e2e.yml        # CI/CD Pipeline cho GitHub Actions
│
├── tests                  # Thư mục chứa toàn bộ mã nguồn test
│   ├── features           # [Business Layer] Chứa file Gherkin (.feature)
│   │   ├── login.feature
│   │   └── shopping.feature
│   │
│   ├── steps              # [Glue Layer] Code nối Gherkin với Page Objects
│   │   ├── login.steps.ts
│   │   └── shopping.steps.ts
│   │
│   ├── pages              # [UI Layer] Page Object Model (Locators & Actions)
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   └── CartPage.ts
│   │
│   ├── hooks              # [Lifecycle Layer] Setup & Teardown
│   │   └── hooks.ts       # Khởi tạo Browser, Context cho mỗi Scenario
│   │
│   ├── fixtures           # [Core Layer] Dependency Injection & Fixtures
│   │   └── fixtures.ts    # Custom fixtures để inject Page Objects vào steps
│   │
│   └── utils              # [Support Layer] Tiện ích bổ trợ
│       └── test-data.ts   # Dữ liệu test tĩnh (nếu cần)
│
├── allure-results         # Kết quả test cho Allure (generated)
├── allure-report          # Báo cáo HTML của Allure (generated)
├── playwright-report      # Báo cáo mặc định của Playwright (generated)
└── test-results           # Kết quả test, screenshots, videos (generated)
```
