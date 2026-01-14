import { faker } from '@faker-js/faker';

/**
 * Product Factory
 *
 * Provides factory methods for product-related test data.
 * SauceDemo has fixed products, but this factory helps with test organization.
 */

// SauceDemo available products
export const SAUCE_DEMO_PRODUCTS = {
  BACKPACK: {
    name: 'Sauce Labs Backpack',
    price: 29.99,
    testId: 'add-to-cart-sauce-labs-backpack',
  },
  BIKE_LIGHT: {
    name: 'Sauce Labs Bike Light',
    price: 9.99,
    testId: 'add-to-cart-sauce-labs-bike-light',
  },
  BOLT_SHIRT: {
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
    testId: 'add-to-cart-sauce-labs-bolt-t-shirt',
  },
  FLEECE_JACKET: {
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
    testId: 'add-to-cart-sauce-labs-fleece-jacket',
  },
  ONESIE: {
    name: 'Sauce Labs Onesie',
    price: 7.99,
    testId: 'add-to-cart-sauce-labs-onesie',
  },
  RED_SHIRT: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
    testId: 'add-to-cart-test.allthethings()-t-shirt-(red)',
  },
} as const;

export type SauceDemoProductType = keyof typeof SAUCE_DEMO_PRODUCTS;

export interface Product {
  name: string;
  price: number;
  testId: string;
}

export interface CartItem extends Product {
  quantity: number;
}

/**
 * ProductFactory class for product test data
 */
export class ProductFactory {
  /**
   * Get a specific SauceDemo product
   */
  static getProduct(type: SauceDemoProductType): Product {
    return { ...SAUCE_DEMO_PRODUCTS[type] };
  }

  /**
   * Get the most common product for testing (Backpack)
   */
  static defaultProduct(): Product {
    return this.getProduct('BACKPACK');
  }

  /**
   * Get the cheapest product
   */
  static cheapestProduct(): Product {
    return this.getProduct('ONESIE');
  }

  /**
   * Get the most expensive product
   */
  static mostExpensiveProduct(): Product {
    return this.getProduct('FLEECE_JACKET');
  }

  /**
   * Get all products
   */
  static allProducts(): Product[] {
    return Object.values(SAUCE_DEMO_PRODUCTS).map((p) => ({ ...p }));
  }

  /**
   * Get random product
   */
  static randomProduct(): Product {
    const products = Object.values(SAUCE_DEMO_PRODUCTS);
    const randomIndex = faker.number.int({ min: 0, max: products.length - 1 });
    return { ...products[randomIndex] };
  }

  /**
   * Get random products (multiple)
   */
  static randomProducts(count: number): Product[] {
    const products = Object.values(SAUCE_DEMO_PRODUCTS);
    const shuffled = faker.helpers.shuffle([...products]);
    return shuffled.slice(0, Math.min(count, products.length)).map((p) => ({ ...p }));
  }

  /**
   * Get products for price sorting test (low to high)
   */
  static productsForLowToHighSort(): Product[] {
    return Object.values(SAUCE_DEMO_PRODUCTS)
      .map((p) => ({ ...p }))
      .sort((a, b) => a.price - b.price);
  }

  /**
   * Get products for price sorting test (high to low)
   */
  static productsForHighToLowSort(): Product[] {
    return Object.values(SAUCE_DEMO_PRODUCTS)
      .map((p) => ({ ...p }))
      .sort((a, b) => b.price - a.price);
  }

  /**
   * Get products for name sorting test (A-Z)
   */
  static productsForAtoZSort(): Product[] {
    return Object.values(SAUCE_DEMO_PRODUCTS)
      .map((p) => ({ ...p }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Create a cart item from a product
   */
  static cartItem(product: Product, quantity: number = 1): CartItem {
    return {
      ...product,
      quantity,
    };
  }

  /**
   * Calculate cart total
   */
  static calculateCartTotal(items: CartItem[]): number {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return Math.round(subtotal * 100) / 100;
  }

  /**
   * Generate a test scenario for checkout with specific products
   */
  static checkoutScenario(productCount: number = 2): {
    products: Product[];
    expectedSubtotal: number;
  } {
    const products = this.randomProducts(productCount);
    const expectedSubtotal = this.calculateCartTotal(products.map((p) => this.cartItem(p, 1)));
    return { products, expectedSubtotal };
  }
}

// Convenience exports
export const defaultProduct = () => ProductFactory.defaultProduct();
export const randomProduct = () => ProductFactory.randomProduct();
export const allProducts = () => ProductFactory.allProducts();
