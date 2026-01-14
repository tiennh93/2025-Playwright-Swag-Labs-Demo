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

  # -----------------------------------
  # Invalid Credentials Testing
  # -----------------------------------
  @negative
  @invalid-credentials
  Scenario Outline: Login with invalid credentials
    Given I am on the login page
    When I login with "<username>" and "<password>"
    Then I should see the error message "<error_message>"

    Examples:
      | username      | password     | error_message                                                             |
      | wrong_user    | secret_sauce | Epic sadface: Username and password do not match any user in this service |
      | standard_user | wrong_pass   | Epic sadface: Username and password do not match any user in this service |
      |               | secret_sauce | Epic sadface: Username is required                                        |
      | standard_user |              | Epic sadface: Password is required                                        |
      |               |              | Epic sadface: Username is required                                        |

  @negative
  Scenario: Login with special characters in username
    Given I am on the login page
    When I login with "user<script>alert('xss')</script>" and "password"
    Then I should see the error message "Epic sadface: Username and password do not match any user in this service"

  # -----------------------------------
  # Session Testing
  # -----------------------------------
  @session
  Scenario: Direct access to inventory without login should redirect to login
    Given I directly navigate to the inventory page
    Then I should be on the login page
    And I should see the error message "Epic sadface: You can only access '/inventory.html' when you are logged in."

  @session
  Scenario: Logout should clear session and redirect to login
    Given I am logged in as "standard_user"
    When I click the logout button
    Then I should be on the login page
    And I should not be able to access the inventory page directly

  @session
  Scenario: Session should persist after page refresh
    Given I am logged in as "standard_user"
    When I reload the page
    Then I should still be on the inventory page
