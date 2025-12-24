@smoke
@dynamic-data
Feature: Advanced Testing Patterns

  Background:
    Given I am on the login page
    When I login with valid credentials

  @faker
  Scenario: Checkout with dynamically generated user data
    When I add "Sauce Labs Backpack" to cart
    And I go to cart page
    And I proceed to checkout
    And I fill checkout information with random data
    And I finish the checkout
    Then I should see the order confirmation message "Thank you for your order!"

  @soft-assertions
  Scenario: Verify all UI elements using soft assertions
    Then I verify the header contains all required elements
    And I verify all product card details are displayed correctly

  @data-cleanup
  Scenario: Cart cleanup after adding multiple items
    When I add "Sauce Labs Backpack" to cart
    And I add "Sauce Labs Bike Light" to cart
    And I add "Sauce Labs Bolt T-Shirt" to cart


# Items will be automatically cleaned up in After hook