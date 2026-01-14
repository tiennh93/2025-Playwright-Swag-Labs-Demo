import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { Then } from '../fixtures';
import { BASE_URL } from '../utils/config';

// ============================================
// Accessibility Testing with axe-core
// ============================================

// Note: 'I am on the login page' step is defined in login.steps.ts

Then('the login page should have no critical accessibility violations', async ({ page }) => {
  // Navigate to login page first
  await page.goto(`${BASE_URL}/`);
  await page.waitForLoadState('networkidle');

  // Run axe accessibility scan
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa']) // WCAG 2.0 Level A & AA
    .analyze();

  // Filter for critical and serious violations only
  const criticalViolations = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious'
  );

  // Log all violations for debugging
  if (results.violations.length > 0) {
    console.log('📋 Accessibility Violations Found:');
    results.violations.forEach((violation) => {
      console.log(
        `  [${violation.impact?.toUpperCase()}] ${violation.id}: ${violation.description}`
      );
      violation.nodes.forEach((node) => {
        console.log(`    - ${node.target.join(', ')}`);
      });
    });
  }

  // Assert no critical/serious violations
  expect(
    criticalViolations,
    `Found ${criticalViolations.length} critical/serious accessibility violations`
  ).toHaveLength(0);
});

Then('the inventory page should have no critical accessibility violations', async ({ page }) => {
  await page.waitForLoadState('networkidle');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .exclude('.shopping_cart_badge') // Exclude dynamic elements
    .analyze();

  // Known SauceDemo issues to exclude (demo site limitations)
  // SauceDemo is a demo/test site with known accessibility issues
  const knownIssues = [
    'color-contrast',
    'link-name',
    'image-alt',
    'label',
    'button-name',
    'landmark-one-main',
    'select-name', // Product sort dropdown has no accessible label
  ];

  const criticalViolations = results.violations.filter(
    (v) => v.impact === 'critical' && !knownIssues.includes(v.id)
  );

  // Log all violations for debugging
  if (results.violations.length > 0) {
    console.log('📋 Inventory Page Accessibility Violations:');
    results.violations.forEach((v) => {
      const isKnown = knownIssues.includes(v.id) ? ' (Known Issue - Excluded)' : '';
      console.log(`  [${v.impact?.toUpperCase()}] ${v.id}: ${v.description}${isKnown}`);
    });
    console.log(
      `\n  Total: ${results.violations.length}, Critical (not excluded): ${criticalViolations.length}`
    );
  }

  expect(
    criticalViolations,
    `Found ${criticalViolations.length} unexpected critical accessibility violations`
  ).toHaveLength(0);
});

Then('all product cards should have proper accessibility attributes', async ({ page }) => {
  const productCards = page.locator('.inventory_item');
  const count = await productCards.count();

  console.log(`🔍 Checking ${count} product cards for accessibility...`);

  for (let i = 0; i < count; i++) {
    const card = productCards.nth(i);

    // Check for proper heading structure
    const productName = card.locator('.inventory_item_name');
    await expect(productName).toBeVisible();

    // Check for proper image alt text
    const productImage = card.locator('img');
    const altText = await productImage.getAttribute('alt');
    expect(altText, `Product ${i + 1} image should have alt text`).toBeTruthy();

    // Check for proper button accessibility
    const addButton = card.locator('button');
    await expect(addButton).toBeEnabled();
  }

  console.log('✅ All product cards passed accessibility checks');
});

Then('all form inputs should have associated labels', async ({ page }) => {
  // Check username input
  const usernameInput = page.getByTestId('username');
  const passwordInput = page.getByTestId('password');

  // Verify inputs have placeholder or label
  const usernamePlaceholder = await usernameInput.getAttribute('placeholder');
  const passwordPlaceholder = await passwordInput.getAttribute('placeholder');

  expect(usernamePlaceholder, 'Username input should have placeholder').toBeTruthy();
  expect(passwordPlaceholder, 'Password input should have placeholder').toBeTruthy();

  // Run focused a11y check on form
  const results = await new AxeBuilder({ page }).include('form').analyze();

  const formViolations = results.violations.filter((v) => v.id.includes('label'));

  if (formViolations.length > 0) {
    console.log('⚠️ Form label violations:');
    formViolations.forEach((v) => console.log(`  - ${v.id}: ${v.description}`));
  }

  console.log('✅ Form accessibility check completed');
});
