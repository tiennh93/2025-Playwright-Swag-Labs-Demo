@mobile
@touch
Feature: Mobile Touch Testing
  As a mobile user
  I want the website to be touch-friendly
  So that I can interact with it on my mobile device

  # Note: Run with: npm run test:mobile (uses Mobile Chrome project with hasTouch)
  @touch-targets
  Scenario: Touch targets should be large enough for mobile
    Given I am on the inventory page
    Then all buttons should have adequate touch target size
    And all links should have adequate touch target size

  @viewport
  Scenario: Page should be responsive on mobile viewport
    Given I am on the inventory page
    Then the page should be scrollable vertically
    And no horizontal scrollbar should appear

  @tap-interaction
  Scenario: Add to cart using touch interaction
    Given I am on the inventory page
    When I tap on the add to cart button for "Sauce Labs Backpack"
    Then the cart badge should show "1" item
    And the button should change to "Remove"

  @swipe
  Scenario: Navigate by swiping on product images
    Given I am on a product detail page
    Then I should be able to navigate back
