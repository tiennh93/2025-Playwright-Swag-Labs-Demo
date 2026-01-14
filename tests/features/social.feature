@social
@multi-tab
Feature: Social Media Links - Multi-Tab Testing
  As a user
  I want to verify social media links work correctly
  So that I can connect with the company on social platforms

  @smoke
  Scenario: Open LinkedIn link in a new tab
    When I click on the LinkedIn link
    Then a new tab should open with URL containing "linkedin.com"
    And the new tab should be closed after verification

  Scenario: Verify all social links have valid href attributes
    Then all social media links should have valid URLs
