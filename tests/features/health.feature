@health
@smoke
Feature: Application Health Check
  As a system administrator
  I want to verify that the application is up and running
  So that I can ensure system availability

  Scenario: Verify application availability
    Given I check the application health status
    Then the application should respond with status code 200
    And the loading performance should be acceptable
