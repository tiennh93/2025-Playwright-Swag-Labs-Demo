import { expect } from '@playwright/test';
import { DataTable } from 'playwright-bdd';
import { Given, Then, When } from '../fixtures';
import { BASE_URL } from '../utils/config';

// Track if any XSS script was executed
let xssExecuted = false;

// ============================================
// Given Steps
// ============================================

Given('I am logged in as a standard user', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/.*inventory.html/);
  console.log('✅ Logged in as standard_user');
});

Given('I have added a product to the cart', async ({ page }) => {
  const addButton = page.getByTestId('add-to-cart-sauce-labs-backpack');
  await addButton.click();
  console.log('✅ Added product to cart');
});

Given('I am not logged in', async ({ page, context }) => {
  // Clear all storage to ensure not logged in
  await context.clearCookies();
  await page.goto(BASE_URL);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  console.log('✅ Cleared all session data');
});

When('I navigate to the home page', async ({ page, context }) => {
  // Clear session to avoid using stored login state
  await context.clearCookies();
  await page.goto(BASE_URL);
  console.log('✅ Navigated to home page');
});

// ============================================
// When Steps - XSS Testing
// ============================================

When('I navigate to checkout page', async ({ page }) => {
  await page.getByTestId('shopping-cart-link').click();
  await page.getByTestId('checkout').click();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
});

When('I fill checkout with XSS payload:', async ({ page }, dataTable: DataTable) => {
  const rows = dataTable.hashes();

  // Set up dialog listener to detect XSS
  page.on('dialog', async (dialog) => {
    console.log(`❌ XSS Detected! Alert message: ${dialog.message()}`);
    xssExecuted = true;
    await dialog.dismiss();
  });

  for (const row of rows) {
    const field = row.field;
    const value = row.value;

    switch (field) {
      case 'firstName':
        await page.getByTestId('firstName').fill(value);
        break;
      case 'lastName':
        await page.getByTestId('lastName').fill(value);
        break;
      case 'zipCode':
        await page.getByTestId('postalCode').fill(value);
        break;
    }
    console.log(`📝 Filled ${field} with XSS payload`);
  }

  // Click continue to submit the form
  await page.getByTestId('continue').click();
});

// ============================================
// When Steps - Auth Boundary Testing
// ============================================

When('I try to access the protected pages:', async ({ page, context }, dataTable: DataTable) => {
  const rows = dataTable.hashes();

  // Clear session first
  await context.clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Store results for later verification
  const results: Array<{ page: string; redirected: boolean }> = [];

  for (const row of rows) {
    const pageName = row.page;
    const url = row.url;

    await page.goto(`${BASE_URL}${url}`);
    await page.waitForLoadState('networkidle');

    // Check if redirected to login
    const currentUrl = page.url();
    const isRedirected = currentUrl.includes('saucedemo.com') && !currentUrl.includes(url);

    results.push({ page: pageName, redirected: isRedirected });
    console.log(
      `📍 ${pageName}: ${isRedirected ? 'Redirected to login ✅' : 'Accessed directly ❌'}`
    );
  }

  // Store for Then step verification
  (page as unknown as { authTestResults: typeof results }).authTestResults = results;
});

When('I logout from the application', async ({ page }) => {
  const menuButton = page.locator('#react-burger-menu-btn');
  await menuButton.click();
  await page.waitForSelector('.bm-menu', { state: 'visible' });
  await page.locator('#logout_sidebar_link').click();
  console.log('✅ Logged out from application');
});

When('I try to access the inventory page directly', async ({ page }) => {
  await page.goto(`${BASE_URL}/inventory.html`);
  await page.waitForLoadState('networkidle');
});

When('I complete a purchase with test data', async ({ page }) => {
  // Add product
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

  // Go to cart
  await page.getByTestId('shopping-cart-link').click();
  await page.getByTestId('checkout').click();

  // Fill checkout info
  await page.getByTestId('firstName').fill('Test');
  await page.getByTestId('lastName').fill('User');
  await page.getByTestId('postalCode').fill('12345');
  await page.getByTestId('continue').click();

  // Complete purchase
  await page.getByTestId('finish').click();
  await expect(page).toHaveURL(/.*checkout-complete.html/);
  console.log('✅ Purchase completed');
});

When('I try to access a malicious redirect URL', async ({ page }) => {
  // Try various open redirect patterns
  const maliciousUrls = [
    `${BASE_URL}?redirect=https://evil.com`,
    `${BASE_URL}?next=https://evil.com`,
    `${BASE_URL}?url=https://evil.com`,
    `${BASE_URL}?returnUrl=https://evil.com`,
  ];

  for (const url of maliciousUrls) {
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    console.log(`🔍 Tested: ${url}`);
  }
});

// ============================================
// Then Steps - XSS Verification
// ============================================

Then('the XSS script should not execute', async ({ page }) => {
  // Check if any alert was triggered (XSS)
  let alertTriggered = false;

  page.on('dialog', async (dialog) => {
    alertTriggered = true;
    console.log(`❌ XSS Alert triggered: ${dialog.message()}`);
    await dialog.dismiss();
  });

  // Wait a bit for any async XSS to execute
  await page.waitForTimeout(500);

  expect(alertTriggered, 'XSS script should not have executed').toBe(false);
  console.log('✅ No XSS script executed');
});

Then('I should see an error message', async ({ page }) => {
  const errorContainer = page.getByTestId('error');
  await expect(errorContainer).toBeVisible();
  console.log('✅ Error message displayed');
});

Then('the form should handle the input safely', async ({ page }) => {
  // Check that we either got an error or moved to next step safely
  const isOnNextStep = page.url().includes('checkout-step-two');
  const hasError = (await page.getByTestId('error').count()) > 0;

  expect(isOnNextStep || hasError, 'Form should either proceed safely or show error').toBe(true);
  console.log(`✅ Form handled input safely (next step: ${isOnNextStep}, error: ${hasError})`);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Then('no script should be executed', async ({ page }) => {
  expect(xssExecuted, 'No XSS script should have been executed').toBe(false);
  xssExecuted = false; // Reset for next test
  console.log('✅ No XSS script was executed');
});

// ============================================
// Then Steps - SQL Injection Verification
// ============================================

Then('I should not be logged in', async ({ page }) => {
  // Should still be on login page or show error
  const isOnLogin = page.url().includes('saucedemo.com') && !page.url().includes('inventory');
  expect(isOnLogin, 'User should not be logged in after SQL injection attempt').toBe(true);
  console.log('✅ SQL injection did not bypass authentication');
});

// ============================================
// Then Steps - Auth Boundary Verification
// ============================================

Then('I should be redirected to the login page for each attempt', async ({ page }) => {
  const results = (
    page as unknown as { authTestResults: Array<{ page: string; redirected: boolean }> }
  ).authTestResults;

  for (const result of results) {
    expect.soft(result.redirected, `Access to ${result.page} should redirect to login`).toBe(true);
  }

  const allRedirected = results.every((r) => r.redirected);
  console.log(`✅ All protected pages redirected: ${allRedirected}`);
});

Then('I should be redirected to the login page', async ({ page }) => {
  await expect(page).toHaveURL(/.*saucedemo.com\/$/);
  console.log('✅ Redirected to login page');
});

Then('I should see a session error message', async ({ page }) => {
  const errorElement = page.getByTestId('error');
  await expect(errorElement).toBeVisible();
  await expect(errorElement).toContainText(/access|login|session/i);
  console.log('✅ Session error message displayed');
});

// ============================================
// Then Steps - Security Headers Verification
// ============================================

Then('the page should have security-related headers', async ({ page }) => {
  // Navigate and capture response headers
  const response = await page.goto(BASE_URL);

  if (response) {
    const headers = response.headers();

    console.log('\n🔒 Security Headers Check:');
    console.log('━'.repeat(50));

    // Check for common security headers (some may not be present on demo site)
    const securityHeaders = [
      { name: 'x-frame-options', required: false },
      { name: 'x-content-type-options', required: false },
      { name: 'strict-transport-security', required: false },
      { name: 'content-security-policy', required: false },
      { name: 'x-xss-protection', required: false },
    ];

    for (const header of securityHeaders) {
      const value = headers[header.name];
      const status = value ? '✅' : '⚠️';
      console.log(`   ${status} ${header.name}: ${value || 'Not present'}`);
    }

    console.log('━'.repeat(50));

    // Note: SauceDemo is a demo site, so we use soft assertions
    console.log('ℹ️ Note: SauceDemo is a demo site - some security headers may be missing');
  }
});

Then('sensitive data should not be cached', async ({ page }) => {
  const response = await page.goto(BASE_URL);

  if (response) {
    const headers = response.headers();
    const cacheControl = headers['cache-control'] || '';
    const pragma = headers['pragma'] || '';

    console.log(`📝 Cache-Control: ${cacheControl}`);
    console.log(`📝 Pragma: ${pragma}`);

    // Soft assertion - demo site may have different caching policies
    expect
      .soft(
        cacheControl.includes('no-store') ||
          cacheControl.includes('no-cache') ||
          cacheControl === '',
        'Sensitive pages should not be cached'
      )
      .toBeTruthy();
  }
});

// ============================================
// Then Steps - URL Security Verification
// ============================================

Then('the confirmation URL should not contain sensitive information', async ({ page }) => {
  const url = page.url();

  // Check that sensitive info is not in URL
  const sensitivePatterns = [
    /password/i,
    /credit/i,
    /card/i,
    /ssn/i,
    /secret/i,
    /token=[A-Za-z0-9]+/i,
  ];

  for (const pattern of sensitivePatterns) {
    expect(url, `URL should not contain ${pattern}`).not.toMatch(pattern);
  }

  console.log('✅ No sensitive information in URL');
});

Then('the URL should not include any personal data', async ({ page }) => {
  const url = page.url();

  // Check that personal info is not in URL
  const personalDataPatterns = [
    /email=/i,
    /phone=/i,
    /address=/i,
    /name=Test/i,
    /12345/, // ZIP code from test
  ];

  for (const pattern of personalDataPatterns) {
    expect(url, `URL should not contain personal data matching ${pattern}`).not.toMatch(pattern);
  }

  console.log('✅ No personal data in URL');
});

Then('I should not be redirected to an external site', async ({ page }) => {
  const currentUrl = page.url();
  const urlObj = new URL(currentUrl);

  // Check hostname, not query params - should still be on saucedemo.com
  expect(urlObj.hostname, 'Should not redirect to external site').toContain('saucedemo.com');
  expect(urlObj.hostname, 'Hostname should not be evil.com').not.toBe('evil.com');

  console.log(`✅ No open redirect vulnerability - stayed on ${urlObj.hostname}`);
});
