@accessibility
@keyboard
Feature: Keyboard Navigation Testing
  As a user who relies on keyboard navigation
  I want to navigate the website using only keyboard
  So that I can access all features without a mouse

  @smoke
  Scenario: Complete login flow using keyboard only
    Given I am on the login page
    When I fill the login form using keyboard only
    Then I should be able to submit the form with Enter key

  Scenario: Navigate through inventory page with Tab key
    Then I should be able to navigate all interactive elements with Tab
    And the focus should be visible on each element

  Scenario: Add item to cart using keyboard
    When I focus on the first product add button using Tab
    And I press Enter to add the item
    Then the item should be added to cart

  Scenario: Open menu using keyboard
    When I focus on the menu button using Tab
    And I press Enter to open the menu
    Then the menu should be visible
    And I can navigate menu items with arrow keys
