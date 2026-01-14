@storage
@regression
Feature: Storage Management
  As a user
  I want my cart items to persist across page reloads
  So that I don't lose my shopping progress

  @persistence
  Scenario: Cart items should persist after page reload
    When I add "Sauce Labs Backpack" to cart
    And I reload the page
    Then the cart badge should show "1" item
    And the "Sauce Labs Backpack" button should show "Remove"

  @persistence
  Scenario: Multiple cart items should persist after page reload
    When I add "Sauce Labs Backpack" to cart
    And I add "Sauce Labs Bike Light" to cart
    And I reload the page
    Then the cart badge should show "2" items
    And I go to cart page
    Then the cart should contain "Sauce Labs Backpack"
    And the cart should contain "Sauce Labs Bike Light"

  @session
  Scenario: Cart should be empty after clearing session storage
    When I add "Sauce Labs Backpack" to cart
    And I clear the session storage
    And I reload the page
    Then the cart badge should not be visible

  @cookies
  Scenario: Verify session cookies are set correctly
    Given I am on the inventory page
    Then the session cookies should be present
    And the cookies should have correct attributes
