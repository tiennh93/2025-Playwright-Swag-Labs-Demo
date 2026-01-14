@performance
Feature: Performance Testing
  As a developer
  I want to measure page performance
  So that I can ensure a good user experience

  Background:
    Given the user is on the login page

  @smoke
  @performance
  Scenario: Login page should load quickly
    Then the page load time should be under 3000 milliseconds
    And the first contentful paint should be under 2000 milliseconds

  @performance
  @core-web-vitals
  Scenario: Inventory page should meet Core Web Vitals
    Given the user logs in with valid credentials
    When the user is on the inventory page
    Then the page load time should be under 3000 milliseconds
    And the first contentful paint should be under 2000 milliseconds
    And the largest contentful paint should be under 4000 milliseconds

  @performance
  @resources
  Scenario: Page resources should be optimized
    Given the user logs in with valid credentials
    When the user is on the inventory page
    Then the total resources should be under 50
    And the total resource size should be under 2000 KB

  @performance
  @lighthouse
  Scenario: Inventory page should pass Lighthouse audit
    Given the user logs in with valid credentials
    When the user is on the inventory page
    Then the Lighthouse performance score should be at least 50
    And the Lighthouse accessibility score should be at least 80

  @performance
  @comparison
  Scenario: Compare performance across pages
    Given the user logs in with valid credentials
    When the user measures performance on multiple pages
      | page      | url                                      |
      | inventory | https://www.saucedemo.com/inventory.html |
      | cart      | https://www.saucedemo.com/cart.html      |
    Then all pages should load under 3000 milliseconds
