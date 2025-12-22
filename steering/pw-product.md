# 🏷️ Dự án Demo: Swag Labs (SauceDemo)

## 📝 1. Tổng quan (Overview)

**Swag Labs** là một trang web thương mại điện tử mẫu (E-commerce sandbox), được thiết kế chuyên biệt để thực hành Automation Testing. Trang web này cực kỳ ổn định, tốc độ tải nhanh và có cấu trúc DOM rõ ràng.

- **URL:** `https://www.saucedemo.com/`
- **Mục tiêu Seminar:** Chứng minh khả năng viết test nhanh, ổn định và dễ đọc của Playwright + playwright-bdd với BDD approach, kết hợp Allure Reporting để tạo báo cáo chuyên nghiệp.

## 🔐 2. Tài khoản kiểm thử (Test Data)

- **Standard User:**
  - Username: `standard_user`
  - Password: `secret_sauce`
- **Locked User (Demo Fail/Negative case):**
  - Username: `locked_out_user`
  - Password: `secret_sauce`

## 🎯 3. Kịch bản Demo (Critical Scenarios)

Để buổi thuyết trình gãy gọn trong 30-45 phút, chúng ta tập trung vào 2 luồng chính:

1.  **Authentication (Đăng nhập):**
    - Đăng nhập thành công -> Chuyển hướng đến trang sản phẩm.
    - _Kỹ thuật demo:_ Page Object, `fill`, `click`, Assertions URL.
2.  **Shopping Flow (Mua sắm):**
    - Lọc sản phẩm (nếu kịp).
    - Thêm sản phẩm vào giỏ hàng (Add to cart).
    - Kiểm tra icon giỏ hàng cập nhật số lượng.
    - _Kỹ thuật demo:_ Locator Chaining, Filter, `getByRole`.

## ⚙️ 4. Mapping Kỹ thuật (Playwright Strategy)

- **Selector Strategy:**
  - Swag Labs sử dụng thuộc tính `data-test` rất nhất quán.
  - **Cấu hình:** Trong `playwright.config.ts`, ta sẽ set `testIdAttribute: 'data-test'`.
  - **Lợi ích:** Code sẽ dùng `page.getByTestId('username')` thay vì CSS Selector dài dòng -> Code sạch, dễ bảo trì.
- **State Management:**
  - Mỗi Scenario là một Context mới hoàn toàn (Incognito) để đảm bảo tính độc lập.
