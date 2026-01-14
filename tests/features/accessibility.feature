@accessibility
@a11y
Feature: Accessibility Testing
  As a user with disabilities
  I want the website to be accessible
  So that I can use all features with assistive technologies

  @critical
  Scenario: Login page should have no critical accessibility violations
    Given I am on the login page
    Then the login page should have no critical accessibility violations

  @critical
  Scenario: Inventory page should have no critical accessibility violations
    Then the inventory page should have no critical accessibility violations

  Scenario: Product cards should be accessible
    Then all product cards should have proper accessibility attributes

  Scenario: Form inputs should have proper labels
    Given I am on the login page
    Then all form inputs should have associated labels

  @aria
  Scenario: Interactive elements should have proper ARIA labels
    Given I am on the inventory page
    Then all buttons should have accessible names
    And the shopping cart should have an ARIA label
    And the menu button should have an ARIA label

  @aria
  Scenario: Navigation elements should have proper ARIA attributes
    Given I am on the inventory page
    Then the sidebar menu should have proper ARIA attributes
    And the product list should have proper ARIA attributes
