@security
Feature: Security Testing
  As a security-conscious developer
  I want to test basic security aspects of the application
  So that I can ensure user data is protected

  # ============================================
  # Input Sanitization Tests
  # ============================================
  @security
  @xss
  Scenario: Login form should handle XSS attempts safely
    Given I am on the login page
    When I login with "<script>alert('XSS')</script>" and "password"
    Then the XSS script should not execute
    And I should see an error message

  @security
  @xss
  Scenario: Checkout form should sanitize XSS input
    Given I am logged in as a standard user
    And I have added a product to the cart
    When I navigate to checkout page
    And I fill checkout with XSS payload:
      | field     | value                            |
      | firstName | <script>alert('xss')</script>    |
      | lastName  | <img src=x onerror=alert('xss')> |
      | zipCode   | "><script>alert('xss')</script>  |
    Then the form should handle the input safely
    And no script should be executed

  @security
  @sql-injection
  Scenario: Login form should handle SQL injection attempts
    Given I am on the login page
    When I login with "' OR '1'='1" and "' OR '1'='1"
    Then I should see an error message
    And I should not be logged in

  # ============================================
  # Authentication Boundary Tests
  # ============================================
  @security
  @auth-boundary
  Scenario: Unauthorized access to protected pages should be blocked
    Given I am not logged in
    When I try to access the protected pages:
      | page      | url                     |
      | inventory | /inventory.html         |
      | cart      | /cart.html              |
      | checkout  | /checkout-step-one.html |
    Then I should be redirected to the login page for each attempt

  @security
  @session
  Scenario: Session should be invalidated after logout
    Given I am logged in as a standard user
    When I logout from the application
    And I try to access the inventory page directly
    Then I should be redirected to the login page
    And I should see a session error message

  # ============================================
  # Security Headers Tests
  # ============================================
  @security
  @headers
  @skip
  Scenario: Response should include security headers
    When I navigate to the home page
    Then the page should have security-related headers
    And sensitive data should not be cached

  # ============================================
  # URL Security Tests
  # ============================================
  @security
  @url
  Scenario: Sensitive data should not appear in URL
    Given I am logged in as a standard user
    When I complete a purchase with test data
    Then the confirmation URL should not contain sensitive information
    And the URL should not include any personal data

  @security
  @open-redirect
  Scenario: Application should prevent open redirects
    Given I am on the login page
    When I try to access a malicious redirect URL
    Then I should not be redirected to an external site
