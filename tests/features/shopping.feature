@regression
@shopping
Feature: Shopping and Checkout Functionality

  # REQ-SHOP-001: Products should be sortable
  @REQ-SHOP-001
  Scenario: Sort products by price low to high
    When I sort products by "Price (low to high)"
    Then the product prices should be sorted in ascending order

  # REQ-SHOP-002: User can complete checkout process
  @e2e
  @REQ-SHOP-002
  Scenario: Successful checkout process (End-to-End)
    When I add "Sauce Labs Backpack" to cart
    And I go to cart page
    And I proceed to checkout
    And I fill checkout information with:
      | firstName | lastName | zipCode |
      | John      | Doe      | 12345   |
    And I finish the checkout
    Then I should see the order confirmation message "Thank you for your order!"

  # REQ-SHOP-003: User can remove items from cart
  @REQ-SHOP-003
  Scenario: Remove product from cart on homepage
    Given I add "Sauce Labs Backpack" to cart
    When I remove "Sauce Labs Backpack" from the inventory
    Then the cart badge should not be visible

  # REQ-UI-001: Product images should load correctly
  @broken-images
  @REQ-UI-001
  Scenario: Verify product images are not broken
    Given I am on the login page
    When I login with valid credentials
    Then all product images should load correctly
