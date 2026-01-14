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

  # ============================================
  # Orientation Testing (Landscape/Portrait)
  # ============================================
  @orientation
  @portrait
  Scenario: Page should display correctly in portrait mode
    Given I am on the inventory page in portrait orientation
    Then the page layout should be optimized for portrait
    And all products should be visible in a single column or grid
    And the menu button should be accessible

  @orientation
  @landscape
  Scenario: Page should display correctly in landscape mode
    Given I am on the inventory page in landscape orientation
    Then the page layout should adjust for landscape
    And more products should be visible horizontally
    And navigation elements should remain functional

  @orientation
  @rotate
  Scenario: Page should handle orientation change gracefully
    Given I am on the inventory page in portrait orientation
    When I rotate the device to landscape
    Then the page should re-render correctly
    And no content should be cut off
    When I rotate the device back to portrait
    Then the page should return to portrait layout

  @orientation
  @checkout
  Scenario: Checkout flow should work in both orientations
    Given I am on the inventory page in portrait orientation
    When I add a product to cart using touch
    And I navigate to checkout in portrait mode
    And I rotate the device to landscape
    Then the checkout form should be usable in landscape
    And I should be able to complete the purchase
