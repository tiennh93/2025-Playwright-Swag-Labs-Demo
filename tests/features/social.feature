@social
Feature: Social Media and Multitasking (Multiple Tabs)

  # Background:
  #   Given I am on the login page
  #   And I login with "standard_user" and "secret_sauce"
  Scenario: Open Linkedin link in a new tab
    When I click on the Linkedin link
    Then a new tab should open with URL containing "linkedin.com"
