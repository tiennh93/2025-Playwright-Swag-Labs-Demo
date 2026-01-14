/**
 * Test Data Factories
 *
 * Central export for all factory classes and convenience functions.
 *
 * Usage:
 * ```typescript
 * import { UserFactory, ProductFactory } from '../factories';
 *
 * // Get a standard user
 * const user = UserFactory.standardUser();
 *
 * // Get random checkout info
 * const checkout = UserFactory.randomCheckoutInfo();
 *
 * // Get random products
 * const products = ProductFactory.randomProducts(3);
 * ```
 */

export {
  UserFactory,
  SAUCE_DEMO_USERS,
  standardUser,
  invalidUser,
  randomCheckoutInfo,
} from './user-factory';

export type { User, CheckoutInfo, SauceDemoUserType } from './user-factory';

export {
  ProductFactory,
  SAUCE_DEMO_PRODUCTS,
  defaultProduct,
  randomProduct,
  allProducts,
} from './product-factory';

export type { Product, CartItem, SauceDemoProductType } from './product-factory';
