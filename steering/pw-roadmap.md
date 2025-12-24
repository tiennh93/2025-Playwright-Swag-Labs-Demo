# 🗺️ Playwright Mastery Roadmap (Seminar Preparation)

This is a fast-track roadmap, focusing on the most essential skills for successful **Live Coding**.

## Phase 1: Foundation (Core)

_Goal: Understand how Playwright and Playwright-BDD work together._

1.  **TypeScript Basic:**
    - Understand `async/await` (Required as Playwright is asynchronous).
    - Arrow Function `() => {}`.
    - Class & Constructor (Used for Page Object).
2.  **Playwright Core:**
    - **Locators:** `getByTestId`, `getByRole`, `getByText`. (Minimize XPath/CSS).
    - **Actions:** `click()`, `fill()`.
    - **Assertions:** `expect(locator).toBeVisible()`, `expect(locator).toHaveText()`.
3.  **Playwright-BDD Integration:**
    - Configure `playwright-bdd` in `playwright.config.ts`.
    - Understand execution flow: `Feature` -> `Step Definition` -> `Page Object`.
    - Use Gherkin syntax directly within Playwright Test Runner.

## Phase 2: Architecture (Framework Architecture)

_Goal: Build an enterprise-standard framework._

1.  **Fixtures & Context:** Understand how to use Playwright fixtures to manage `page`, `context`, and dependencies.
2.  **Hooks:** Setup and teardown using `BeforeAll`, `AfterAll`, `Before`, `After` hooks from Playwright.
3.  **Page Object Model (POM):**
    - Principle: "Page Object contains Locators/Actions, no Assertions".
    - Clean Page class organization.

## Phase 3: Advanced & CI/CD (Seminar Highlight)

_Goal: Showcase "killer features" of Playwright._

1.  **Allure Reporting:**
    - Integrate `allure-playwright` for beautiful and detailed reports.
    - Know how to view reports with `allure serve` and details: steps, screenshots, video, attachments.
2.  **Trace Viewer (Deep Debugging):**
    - Understand its complementary role to Allure: Allure for reporting, Trace Viewer for deep debugging.
    - Know how to open `trace.zip` (can be attached in Allure).
    - Know how to analyze timeline, DOM snapshots, network requests.
3.  **Visual Regression Testing (New):**
    - Snapshot testing implementation.
    - Comparing screenshots with baselines.
4.  **GitHub Actions:**
    - Understand `.yml` files.
    - Demo automated testing on code push.
5.  **AI Coding (Optional):**
    - Use GitHub Copilot or ChatGPT to generate Step Definitions from Feature files instantly.

## Phase 4: Soft Skills (Presentation)

1.  **Live Coding Flow:** Practice coding without documentation for basic parts.
2.  **Q&A Handling:** Prepare for comparison questions (vs Selenium, vs Cypress).

## Giai đoạn 4: Soft Skills (Thuyết trình)

1.  **Live Coding Flow:** Tập luyện code không nhìn tài liệu cho các phần cơ bản.
2.  **Q&A Handling:** Chuẩn bị tâm lý trả lời các câu hỏi so sánh (vs Selenium, vs Cypress).
