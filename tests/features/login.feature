Feature: User Authentication

  @smoke
  Scenario: Login successfully with standard user
    Given I am on the login page
    When I login with "standard_user" and "secret_sauce"
    Then I should be redirected to the inventory page
