@social
Feature: Mạng xã hội và Đa nhiệm (Multiple Tabs)

  # Background:
  #   Given I am on the login page
  #   And I login with "standard_user" and "secret_sauce"
  Scenario: Mở link Linkedin trong tab mới
    When I click on the Linkedin link
    Then a new tab should open with URL containing "linkedin.com"
