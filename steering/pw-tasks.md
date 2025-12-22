# 🛠️ Hướng dẫn thực hành: Build Framework từ số 0

Làm theo đúng trình tự này, bạn sẽ có một project hoàn chỉnh để demo.

## ✅ Phần 1: Khởi tạo & Cấu hình (Setup)

1.  **Init Project:**
    ```bash
    mkdir SwagLabs.E2E
    cd SwagLabs.E2E
    npm init -y
    npm install -D @playwright/test playwright-bdd allure-playwright typescript
    ```
2.  **Config Files:**
    - Tạo `tsconfig.json`, `playwright.config.ts` (Copy từ checklist).
    - **Quan trọng:** Trong `playwright.config.ts`:
      - Thêm `reporter: [['html'], ['allure-playwright']]` để sử dụng Allure reporting.
      - Trong section `use`, sửa:
      ```typescript
      use: {
        testIdAttribute: 'data-test', // Config để ăn khớp với Swag Labs
        trace: 'on-first-retry',
        // ...
      }
      ```
3.  **Generate Test Files từ Features:**
    ```bash
    npx bddgen  # Generate step definitions và test files từ .feature files
    ```

## ✅ Phần 2: Core Framework (Fixtures & Hooks)

1.  **Fixtures (`tests/fixtures.ts`):**
    - Sử dụng Playwright's built-in fixtures: `page`, `context`, `browser`.
    - Tạo custom fixtures nếu cần (ví dụ: `loginPage`, `inventoryPage`).
    - playwright-bdd tự động inject fixtures vào step definitions.
2.  **Hooks (`tests/hooks.ts`):**
    - Import `BeforeAll`, `AfterAll`, `Before`, `After` từ `playwright-bdd`.
    - `Before`: Setup cho mỗi scenario (nếu cần).
    - `After`: Cleanup và attach screenshots/videos vào Allure report.

## ✅ Phần 3: Login Feature (POM + Steps)

1.  **Page Object (`tests/pages/LoginPage.ts`):**

    ```typescript
    export class LoginPage {
      constructor(private page: Page) {}
      // Selectors
      username = () => this.page.getByTestId('username');
      password = () => this.page.getByTestId('password');
      loginBtn = () => this.page.getByTestId('login-button');

      // Actions
      async login(user: string, pass: string) {
        await this.username().fill(user);
        await this.password().fill(pass);
        await this.loginBtn().click();
      }
    }
    ```

2.  **Feature (`tests/features/login.feature`):**
    - Viết Scenario Login thành công.
3.  **Steps (`tests/steps/login.steps.ts`):**
    - Import `Given`, `When`, `Then` từ `playwright-bdd`.
    - Sử dụng fixtures được inject tự động: `{ page }` hoặc custom fixtures.
    - Map Gherkin steps với `LoginPage` actions.

## ✅ Phần 4: Shopping Feature (Nâng cao)

1.  **Feature:**
    ```gherkin
    Scenario: Add item to cart
        When I add "Sauce Labs Backpack" to cart
        Then cart badge should show "1"
    ```
2.  **Inventory Page (`tests/pages/InventoryPage.ts`):**
    - Demo kỹ thuật **Locator Filter**:
      ```typescript
      async addItemToCart(itemName: string) {
          // Tìm item có chứa text tên sản phẩm, sau đó tìm nút "Add to cart" bên trong nó
          await this.page.locator('.inventory_item')
              .filter({ hasText: itemName })
              .getByRole('button', { name: 'Add to cart' })
              .click();
      }
      ```
    - _Đây là điểm nhấn kỹ thuật cho thấy sự ưu việt của Playwright._

## ✅ Phần 5: Reporting & CI/CD

1.  **Allure Report:**
    - Chạy tests: `npx playwright test`
    - Generate report: `npx allure generate allure-results --clean`
    - Xem report: `npx allure serve allure-results`
2.  **CI/CD:**
    - Tạo `.github/workflows/e2e.yml`.
    - Cấu hình để upload Allure results và generate report.
    - Push code lên GitHub và xem pipeline chạy trên tab "Actions".
