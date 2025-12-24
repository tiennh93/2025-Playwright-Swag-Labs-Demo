@authentication
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

  @data-driven
  Scenario Outline: Đăng nhập với nhiều loại người dùng khác nhau
    Given I am on the login page
    When I login with "<username>" and "<password>"
    Then I should be redirected to the inventory page

    Examples:
      | username                | password     |
      | standard_user           | secret_sauce |
      | problem_user            | secret_sauce |
      | performance_glitch_user | secret_sauce |


# Playwright sẽ chạy scenario này 3 lần tương ứng với 3 dòng data