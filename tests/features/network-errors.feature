@negative
@network-mocking
Feature: Network Error Handling

  Background:
    Given I am on the login page
    When I login with valid credentials

  @blocked-images
  Scenario: Application works even when images fail to load
    Given the product images fail to load
    Then the page should still be functional without images

  @slow-network
  Scenario: Application handles slow network gracefully
    Given I simulate slow network conditions
    When I sort products by "Price (low to high)"
    Then the application should handle slow network gracefully
