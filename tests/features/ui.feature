@visual
Feature: Kiểm thử giao diện (Visual Regression)

  Scenario: Giao diện trang Login phải đúng chuẩn thiết kế
    Given I am on the login page
    # Snapshot testing: Chụp ảnh màn hình và so sánh với ảnh gốc
    Then the login page should look exactly like the design
