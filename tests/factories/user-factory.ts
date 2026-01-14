import { faker } from '@faker-js/faker';

/**
 * User Factory
 *
 * Provides factory methods to generate test users with various profiles.
 * Uses Faker.js for dynamic data generation.
 */

// SauceDemo available users
export const SAUCE_DEMO_USERS = {
  STANDARD: { username: 'standard_user', password: 'secret_sauce' },
  LOCKED_OUT: { username: 'locked_out_user', password: 'secret_sauce' },
  PROBLEM: { username: 'problem_user', password: 'secret_sauce' },
  PERFORMANCE_GLITCH: { username: 'performance_glitch_user', password: 'secret_sauce' },
  ERROR: { username: 'error_user', password: 'secret_sauce' },
  VISUAL: { username: 'visual_user', password: 'secret_sauce' },
} as const;

export type SauceDemoUserType = keyof typeof SAUCE_DEMO_USERS;

export interface User {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

/**
 * UserFactory class for generating test users
 */
export class UserFactory {
  /**
   * Get a predefined SauceDemo user
   */
  static getSauceDemoUser(type: SauceDemoUserType = 'STANDARD'): User {
    return { ...SAUCE_DEMO_USERS[type] };
  }

  /**
   * Get the standard user (most common)
   */
  static standardUser(): User {
    return this.getSauceDemoUser('STANDARD');
  }

  /**
   * Get a locked out user (for negative testing)
   */
  static lockedOutUser(): User {
    return this.getSauceDemoUser('LOCKED_OUT');
  }

  /**
   * Get a problem user (for edge case testing)
   */
  static problemUser(): User {
    return this.getSauceDemoUser('PROBLEM');
  }

  /**
   * Generate a random invalid user
   */
  static invalidUser(): User {
    return {
      username: faker.internet.username(),
      password: faker.internet.password(),
    };
  }

  /**
   * Generate a user with empty username
   */
  static emptyUsername(): User {
    return {
      username: '',
      password: 'secret_sauce',
    };
  }

  /**
   * Generate a user with empty password
   */
  static emptyPassword(): User {
    return {
      username: 'standard_user',
      password: '',
    };
  }

  /**
   * Generate a user with XSS attack vector
   */
  static xssUser(): User {
    return {
      username: '<script>alert("xss")</script>',
      password: '<img onerror="alert(1)" src="x">',
    };
  }

  /**
   * Generate a user with SQL injection vector
   */
  static sqlInjectionUser(): User {
    return {
      username: "' OR '1'='1",
      password: "'; DROP TABLE users; --",
    };
  }

  /**
   * Generate random checkout information
   */
  static randomCheckoutInfo(): CheckoutInfo {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      zipCode: faker.location.zipCode(),
    };
  }

  /**
   * Generate checkout info with specific constraints
   */
  static checkoutInfo(overrides: Partial<CheckoutInfo> = {}): CheckoutInfo {
    return {
      firstName: overrides.firstName ?? faker.person.firstName(),
      lastName: overrides.lastName ?? faker.person.lastName(),
      zipCode: overrides.zipCode ?? faker.location.zipCode(),
    };
  }

  /**
   * Generate empty checkout info (for validation testing)
   */
  static emptyCheckoutInfo(): CheckoutInfo {
    return {
      firstName: '',
      lastName: '',
      zipCode: '',
    };
  }

  /**
   * Generate checkout info with only first name filled
   */
  static partialCheckoutInfo(): CheckoutInfo {
    return {
      firstName: faker.person.firstName(),
      lastName: '',
      zipCode: '',
    };
  }

  /**
   * Generate checkout info with very long values
   */
  static longCheckoutInfo(): CheckoutInfo {
    return {
      firstName: faker.string.alpha(100),
      lastName: faker.string.alpha(100),
      zipCode: faker.string.numeric(20),
    };
  }

  /**
   * Generate checkout info with special characters
   */
  static specialCharCheckoutInfo(): CheckoutInfo {
    return {
      firstName: "O'Connor-Smith",
      lastName: 'José María',
      zipCode: '12345-6789',
    };
  }
}

// Convenience exports for direct usage
export const standardUser = () => UserFactory.standardUser();
export const invalidUser = () => UserFactory.invalidUser();
export const randomCheckoutInfo = () => UserFactory.randomCheckoutInfo();
