Feature: Shopping Flow

  Background:
    Given I am on the login page
    When I login with "standard_user" and "secret_sauce"

  Scenario: Add item to cart successfully
    # Tái sử dụng step login ở trên
    When I add "Sauce Labs Backpack" to cart
    Then the cart badge should display "1"
