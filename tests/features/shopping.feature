@regression
@shopping
Feature: Shopping and Checkout Functionality

  # Background:
  #   Given I am on the login page
  #   And I login with "standard_user" and "secret_sauce"
  Scenario: Sort products by price low to high
    When I sort products by "Price (low to high)"
    Then the product prices should be sorted in ascending order

  Scenario: Successful checkout process (End-to-End)
    When I add "Sauce Labs Backpack" to cart
    And I go to cart page
    And I proceed to checkout
    And I fill checkout information with:
      | firstName | lastName | zipCode |
      | John      | Doe      | 12345   |
    And I finish the checkout
    Then I should see the order confirmation message "Thank you for your order!"

  Scenario: Remove product from cart on homepage
    Given I add "Sauce Labs Backpack" to cart
    When I remove "Sauce Labs Backpack" from the inventory
    Then the cart badge should not be visible

  @broken-images
  Scenario: Verify product images are not broken
    Given I am on the login page
    When I login with valid credentials
    Then all product images should load correctly
