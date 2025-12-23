# 🎭 SwagLabs.E2E - Playwright Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-Test-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Playwright-BDD](https://img.shields.io/badge/Playwright--BDD-Active-purple)
![Allure](https://img.shields.io/badge/Allure-Report-orange)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-blue)

Dự án Automation Testing mẫu cho buổi Seminar **"Playwright + Playwright-BDD: Modern E2E Testing"**.
Hệ thống được kiểm thử (SUT) là [SauceDemo (Swag Labs)](https://www.saucedemo.com/).

## 🎯 Mục tiêu Dự án (Seminar Goals)

Dự án này được xây dựng để minh họa:

1.  **Mô hình BDD (Behavior Driven Development):** Kết nối Gherkin (.feature) với TypeScript.
2.  **Page Object Model (POM):** Tách biệt logic test và UI locators.
3.  **Enterprise Standard:** Cấu trúc thư mục sạch, dễ mở rộng và tích hợp CI/CD.
4.  **Playwright Features:** Auto-waiting, Tracing, `getByTestId`.

## 🛠️ Tech Stack

- **Core Engine:** [Playwright](https://playwright.dev/)
- **Language:** TypeScript
- **BDD Integration:** [playwright-bdd](https://github.com/vitalets/playwright-bdd)
- **Assertion:** Playwright Expect
- **Reporting:** [Allure Playwright](https://github.com/allure-framework/allure-js/tree/master/packages/allure-playwright)
- **CI/CD:** GitHub Actions

## 🚀 Cài đặt (Installation)

Yêu cầu: **Node.js 18+**

1.  **Clone dự án:**

    ```bash
    git clone <your-repo-url>
    cd SwagLabs.E2E
    ```

2.  **Cài đặt dependencies:**

    ```bash
    npm install
    ```

3.  **Cài đặt Browsers cho Playwright:**

    ```bash
    npx playwright install --with-deps
    ```

4.  **VS Code Extensions (Khuyến nghị):**
    - **Cucumber (Gherkin) Full Support:** Cải thiện syntax highlighting cho `.feature` files
    - **Prettier:** Code formatter tự động

    **Cấu hình tự động** (nếu dùng `.vscode/settings.json`):

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

## 🏃‍♂️ Hướng dẫn chạy Test (Usage)

Các kịch bản test được định nghĩa trong script `package.json`.

### 1. Chạy toàn bộ Test

```bash
npm test
# Lệnh này tương đương: npx bddgen && npx playwright test
```

### 2. Chạy Smoke Test (Các luồng chính)

Chỉ chạy các scenario có tag `@smoke`.

```bash
npx bddgen && npx playwright test --grep "@smoke"
```

### 3. Debug Mode (Có giao diện UI)

Để chạy test với trình duyệt hiển thị (Headed mode) để debug:

```bash
npx bddgen && npx playwright test --headed
```

## 📂 Cấu trúc Dự án (Project Structure)

Cấu trúc tuân thủ Clean Code và tách biệt các lớp xử lý.

```ascii
SwagLabs.E2E
├── .features-gen       # [Generated] Code test sinh ra từ .feature (playwright-bdd)
├── .github/workflows   # CI/CD Pipelines
├── allure-results      # [Generated] Raw data cho Allure
├── allure-report       # [Generated] HTML Report
├── tests
│   ├── features        # File Gherkin (Kịch bản kiểm thử)
│   ├── steps           # Step Definitions (Code logic)
│   ├── pages           # Page Objects (Locators & Actions)
│   ├── hooks           # Setup & Teardown (Before/After)
│   ├── fixtures        # Dependency Injection (thay cho World)
│   └── utils           # Test Data & Helpers
└── playwright.config.ts # Cấu hình Playwright & BDD
```

## 🧪 Thông tin tài khoản Demo (SUT Credentials)

Trang web: `https://www.saucedemo.com/`

| Role              | Username          | Password       |
| :---------------- | :---------------- | :------------- |
| **Standard User** | `standard_user`   | `secret_sauce` |
| **Locked User**   | `locked_out_user` | `secret_sauce` |

## 📊 Báo cáo (Reporting)

Sau khi chạy test, report Allure sẽ được tạo.
Để xem trực tiếp trên local:

```bash
npx allure serve allure-results
```

Để generate HTML tĩnh:

```bash
npx allure generate -o allure-report allure-results
```

---

**Author:** Tien Nguyen Huu

**Event:** Tech Seminar 2026
