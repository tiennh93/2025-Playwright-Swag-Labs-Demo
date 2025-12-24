@visual
Feature: Visual Regression Testing

  Scenario: Login page UI matches design
    Given I am on the login page
    # Snapshot testing: Capture screenshot and compare with baseline
    Then the login page should look exactly like the design
