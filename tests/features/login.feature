Feature: User Authentication

  @smoke
  Scenario: Login successfully with standard user
    Given I am on the login page
    When I login with "standard_user" and "secret_sauce"
    Then I should be redirected to the inventory page

  @negative
  Scenario: Đăng nhập thất bại với User bị khóa
    Given I am on the login page
    When I login with "locked_out_user" and "secret_sauce"
    Then I should see the error message "Epic sadface: Sorry, this user has been locked out."
