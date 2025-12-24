@authentication
Feature: User Authentication

  @smoke
  Scenario: Login successfully with standard user
    Given I am on the login page
    When I login with valid credentials
    Then I should be redirected to the inventory page

  @negative
  Scenario: Login failed with locked out user
    Given I am on the login page
    When I login with "locked_out_user" and "secret_sauce"
    Then I should see the error message "Epic sadface: Sorry, this user has been locked out."

  @data-driven
  Scenario Outline: Login with different user types
    Given I am on the login page
    When I login with "<username>" and "<password>"
    Then I should be redirected to the inventory page

    Examples:
      | username                | password     |
      | standard_user           | secret_sauce |
      | problem_user            | secret_sauce |
      | performance_glitch_user | secret_sauce |


# Playwright will run this scenario 3 times corresponding to the 3 data rows