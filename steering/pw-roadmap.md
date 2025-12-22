# 🗺️ Lộ trình làm chủ Playwright (Seminar Preparation)

Đây là lộ trình đi tắt đón đầu, tập trung vào những kỹ năng cần thiết nhất để bạn **Live Coding** thành công.

## Giai đoạn 1: Foundation (Cốt lõi)

_Mục tiêu: Hiểu cách Playwright và Cucumber vận hành cùng nhau._

1.  **TypeScript Basic:**
    - Hiểu `async/await` (Bắt buộc vì Playwright là bất đồng bộ).
    - Arrow Function `() => {}`.
    - Class & Constructor (Dùng cho Page Object).
2.  **Playwright Core:**
    - **Locators:** `getByTestId`, `getByRole`, `getByText`. (Hạn chế tối đa XPath/CSS).
    - **Actions:** `click()`, `fill()`.
    - **Assertions:** `expect(locator).toBeVisible()`, `expect(locator).toHaveText()`.
3.  **Playwright-BDD Integration:**
    - Cấu hình `playwright-bdd` trong `playwright.config.ts`.
    - Hiểu luồng chạy: `Feature` -> `Step Definition` -> `Page Object`.
    - Sử dụng Gherkin syntax ngay trong Playwright Test Runner.

## Giai đoạn 2: Architecture (Kiến trúc Framework)

_Mục tiêu: Xây dựng framework chuẩn doanh nghiệp._

1.  **Fixtures & Context:** Hiểu cách sử dụng Playwright fixtures để quản lý `page`, `context` và các dependencies.
2.  **Hooks:** Setup và teardown sử dụng `BeforeAll`, `AfterAll`, `Before`, `After` hooks của playwright-bdd.
3.  **Page Object Model (POM):**
    - Nguyên tắc: "Page Object chứa Locators/Actions, không chứa Assertions".
    - Cách tổ chức class Page gọn gàng.

## Giai đoạn 3: Advanced & CI/CD (Điểm nhấn Seminar)

_Mục tiêu: Trình diễn các tính năng "ăn tiền" của Playwright._

1.  **Allure Reporting:**
    - Tích hợp `allure-playwright` để tạo báo cáo đẹp và chi tiết.
    - Biết cách xem report với `allure serve` và các thông tin: steps, screenshots, video, attachments.
2.  **Trace Viewer (Deep Debugging):**
    - Hiểu vai trò bổ trợ cho Allure: Allure để báo cáo, Trace Viewer để debug lỗi sâu.
    - Biết cách mở file trace.zip (có thể được đính kèm trong Allure).
    - Biết cách phân tích timeline, DOM snapshots, network requests.
3.  **GitHub Actions:**
    - Hiểu file `.yml`.
    - Demo việc test tự chạy khi push code.
4.  **AI Coding (Optional):**
    - Sử dụng GitHub Copilot hoặc ChatGPT để sinh Step Definitions từ Feature file cực nhanh.

## Giai đoạn 4: Soft Skills (Thuyết trình)

1.  **Live Coding Flow:** Tập luyện code không nhìn tài liệu cho các phần cơ bản.
2.  **Q&A Handling:** Chuẩn bị tâm lý trả lời các câu hỏi so sánh (vs Selenium, vs Cypress).
