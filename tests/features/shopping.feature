@regression
@shopping
Feature: Chức năng Mua sắm và Thanh toán

  # Background:
  #   Given I am on the login page
  #   And I login with "standard_user" and "secret_sauce"
  Scenario: Sắp xếp sản phẩm theo giá từ thấp đến cao
    When I sort products by "Price (low to high)"
    Then the product prices should be sorted in ascending order

  Scenario: Quy trình thanh toán thành công (End-to-End)
    When I add "Sauce Labs Backpack" to cart
    And I go to cart page
    And I proceed to checkout
    And I fill checkout information with:
      | firstName | lastName | zipCode |
      | John      | Doe      | 12345   |
    And I finish the checkout
    Then I should see the order confirmation message "Thank you for your order!"

  Scenario: Xóa sản phẩm khỏi giỏ hàng ngay tại trang chủ
    Given I add "Sauce Labs Backpack" to cart
    When I remove "Sauce Labs Backpack" from the inventory
    Then the cart badge should not be visible

  @broken-images
  Scenario: Kiểm tra hình ảnh sản phẩm không bị lỗi
    Given I am on the login page
    When I login with "problem_user" and "secret_sauce"
    Then all product images should load correctly
