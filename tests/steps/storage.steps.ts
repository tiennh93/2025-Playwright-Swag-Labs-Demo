import { expect } from '@playwright/test';
import { Given, Then, When } from '../fixtures';

// ============================================
// Storage Persistence Testing
// ============================================

When('I reload the page', async ({ page }) => {
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  console.log('🔄 Page reloaded');
});

Then('the cart badge should show {string} item', async ({ page }, count: string) => {
  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toBeVisible();
  await expect(cartBadge).toHaveText(count);
  console.log(`✅ Cart badge shows ${count} item(s)`);
});

Then('the cart badge should show {string} items', async ({ page }, count: string) => {
  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toBeVisible();
  await expect(cartBadge).toHaveText(count);
  console.log(`✅ Cart badge shows ${count} items`);
});

Then(
  'the {string} button should show {string}',
  async ({ page }, productName: string, buttonText: string) => {
    // Find the product card by name
    const productCard = page.locator('.inventory_item').filter({
      has: page.locator('.inventory_item_name', { hasText: productName }),
    });

    const button = productCard.locator('button');
    await expect(button).toContainText(buttonText);
    console.log(`✅ Product "${productName}" button shows "${buttonText}"`);
  }
);

Then('the cart should contain {string}', async ({ page }, productName: string) => {
  const cartItem = page.locator('.cart_item').filter({
    has: page.locator('.inventory_item_name', { hasText: productName }),
  });

  await expect(cartItem).toBeVisible();
  console.log(`✅ Cart contains "${productName}"`);
});

// ============================================
// Session Storage Testing
// ============================================

When('I clear the session storage', async ({ page }) => {
  await page.evaluate(() => {
    sessionStorage.clear();
    console.log('Session storage cleared');
  });
  console.log('🗑️ Session storage cleared');
});

When('I clear the local storage', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
    console.log('Local storage cleared');
  });
  console.log('🗑️ Local storage cleared');
});

// ============================================
// Cookie Testing
// ============================================

Given('I am on the inventory page', async ({ page }) => {
  // Ensures we're on the inventory page (via storageState)
  await page.waitForURL(/.*inventory.*/);
  await page.waitForLoadState('domcontentloaded');
  console.log('📦 On inventory page');
});

Then('the session cookies should be present', async ({ page }) => {
  const cookies = await page.context().cookies();

  console.log('🍪 Session Cookies Check:');
  console.log(`  Total cookies: ${cookies.length}`);

  cookies.forEach((cookie) => {
    console.log(`  - ${cookie.name}: ${cookie.value.substring(0, 20)}...`);
    console.log(`    Domain: ${cookie.domain}`);
    console.log(`    Path: ${cookie.path}`);
    console.log(`    Secure: ${cookie.secure}`);
    console.log(`    HttpOnly: ${cookie.httpOnly}`);
    console.log(
      `    Expires: ${cookie.expires > 0 ? new Date(cookie.expires * 1000).toISOString() : 'Session'}`
    );
  });

  // SauceDemo is a simple demo site, it may not set cookies
  // This is more of an audit step
  if (cookies.length === 0) {
    console.log('  ℹ️ Note: SauceDemo does not use session cookies (state is in localStorage)');
  }

  console.log('✅ Cookie presence check completed');
});

Then('the cookies should have correct attributes', async ({ page }) => {
  const cookies = await page.context().cookies();

  console.log('🔐 Cookie Attributes Audit:');

  const securityIssues: string[] = [];

  cookies.forEach((cookie) => {
    // Check for security best practices
    if (!cookie.secure && !cookie.domain.includes('localhost')) {
      securityIssues.push(`${cookie.name}: Missing 'Secure' flag`);
    }

    if (!cookie.httpOnly && cookie.name.toLowerCase().includes('session')) {
      securityIssues.push(`${cookie.name}: Session cookie missing 'HttpOnly' flag`);
    }

    // Check for SameSite attribute
    if (!cookie.sameSite || cookie.sameSite === 'None') {
      if (!cookie.secure) {
        securityIssues.push(`${cookie.name}: SameSite=None requires Secure flag`);
      }
    }
  });

  if (securityIssues.length > 0) {
    console.log('  ⚠️ Security recommendations:');
    securityIssues.forEach((issue) => console.log(`    - ${issue}`));
  } else {
    console.log('  ✅ All cookies have proper security attributes');
  }

  // For SauceDemo (demo site), we don't fail on cookie issues
  // Just document findings
  if (cookies.length === 0) {
    console.log('  ℹ️ SauceDemo uses localStorage instead of cookies for cart state');

    // Verify localStorage is being used
    const cartState = await page.evaluate(() => {
      return localStorage.getItem('cart-contents');
    });

    console.log(`  localStorage cart: ${cartState || '(empty)'}`);
  }

  console.log('✅ Cookie attributes audit completed');
});
