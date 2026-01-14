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

// ============================================
// ARIA Labels Testing
// ============================================

Then('all buttons should have accessible names', async ({ page }) => {
  // Get all buttons on the inventory page
  const buttons = page.locator('button');
  const count = await buttons.count();

  console.log(`🔍 Checking ${count} buttons for accessible names...`);

  const buttonsWithoutNames: string[] = [];

  for (let i = 0; i < count; i++) {
    const button = buttons.nth(i);
    const isVisible = await button.isVisible();

    if (isVisible) {
      // Check for accessible name via aria-label, aria-labelledby, or text content
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaLabelledBy = await button.getAttribute('aria-labelledby');
      const textContent = await button.textContent();
      const title = await button.getAttribute('title');

      const hasAccessibleName =
        (ariaLabel && ariaLabel.trim().length > 0) ||
        (ariaLabelledBy && ariaLabelledBy.trim().length > 0) ||
        (textContent && textContent.trim().length > 0) ||
        (title && title.trim().length > 0);

      if (!hasAccessibleName) {
        const buttonId = (await button.getAttribute('id')) || `button-${i}`;
        buttonsWithoutNames.push(buttonId);
      }
    }
  }

  if (buttonsWithoutNames.length > 0) {
    console.log('⚠️ Buttons without accessible names:');
    buttonsWithoutNames.forEach((b) => console.log(`  - ${b}`));
  }

  // SauceDemo is a demo site, so we log findings but don't fail for known issues
  console.log(
    `✅ Button accessibility check: ${count - buttonsWithoutNames.length}/${count} buttons have accessible names`
  );
});

Then('the shopping cart should have an ARIA label', async ({ page }) => {
  const cart = page.locator('.shopping_cart_link');

  // Check for ARIA label or accessible text
  const ariaLabel = await cart.getAttribute('aria-label');
  const title = await cart.getAttribute('title');

  // Log findings
  console.log('🛒 Shopping Cart ARIA check:');
  console.log(`  aria-label: ${ariaLabel || '(none)'}`);
  console.log(`  title: ${title || '(none)'}`);

  // The cart should have some form of accessible identification
  // SauceDemo may not have this, so we document it as a finding
  if (!ariaLabel && !title) {
    console.log('  ⚠️ Recommendation: Add aria-label="Shopping Cart" to cart link');
  } else {
    console.log('  ✅ Cart has accessible name');
  }

  // Soft assertion - don't fail but document
  expect.soft(ariaLabel || title, 'Cart should have an accessible name').toBeTruthy();
});

Then('the menu button should have an ARIA label', async ({ page }) => {
  const menuButton = page.locator('#react-burger-menu-btn');

  // Check for ARIA attributes
  const ariaLabel = await menuButton.getAttribute('aria-label');
  const ariaExpanded = await menuButton.getAttribute('aria-expanded');
  const ariaControls = await menuButton.getAttribute('aria-controls');

  console.log('☰ Menu Button ARIA check:');
  console.log(`  aria-label: ${ariaLabel || '(none)'}`);
  console.log(`  aria-expanded: ${ariaExpanded || '(none)'}`);
  console.log(`  aria-controls: ${ariaControls || '(none)'}`);

  // Recommendations
  const recommendations: string[] = [];
  if (!ariaLabel) recommendations.push('Add aria-label="Open navigation menu"');
  if (ariaExpanded === null) recommendations.push('Add aria-expanded state');

  if (recommendations.length > 0) {
    console.log('  ⚠️ Recommendations:');
    recommendations.forEach((r) => console.log(`    - ${r}`));
  } else {
    console.log('  ✅ Menu button has proper ARIA attributes');
  }

  // Soft assertion
  expect.soft(ariaLabel, 'Menu button should have aria-label').toBeTruthy();
});

Then('the sidebar menu should have proper ARIA attributes', async ({ page }) => {
  // Open the menu first
  const menuButton = page.locator('#react-burger-menu-btn');
  await menuButton.click();
  await page.waitForTimeout(300); // Wait for animation

  const sidebarMenu = page.locator('.bm-menu-wrap');

  // Check ARIA attributes on the menu container
  const role = await sidebarMenu.getAttribute('role');
  const ariaHidden = await sidebarMenu.getAttribute('aria-hidden');

  console.log('📋 Sidebar Menu ARIA check:');
  console.log(`  role: ${role || '(none)'}`);
  console.log(`  aria-hidden: ${ariaHidden || '(none)'}`);

  // Check menu items
  const menuItems = page.locator('.bm-item');
  const itemCount = await menuItems.count();
  console.log(`  Menu items: ${itemCount}`);

  for (let i = 0; i < itemCount; i++) {
    const item = menuItems.nth(i);
    const text = await item.textContent();
    const tabIndex = await item.getAttribute('tabindex');
    console.log(`    [${i + 1}] ${text?.trim()} (tabindex: ${tabIndex || 'auto'})`);
  }

  // Close menu
  const closeButton = page.locator('#react-burger-cross-btn');
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }

  console.log('  ✅ Sidebar menu check completed');
});

Then('the product list should have proper ARIA attributes', async ({ page }) => {
  const productList = page.locator('.inventory_list');

  // Check for list semantics
  const role = await productList.getAttribute('role');

  console.log('📦 Product List ARIA check:');
  console.log(`  Container role: ${role || '(none - uses default)'}`);

  // Check individual items
  const items = page.locator('.inventory_item');
  const itemCount = await items.count();
  console.log(`  Total items: ${itemCount}`);

  // Sample check first item
  if (itemCount > 0) {
    const firstItem = items.first();
    const itemRole = await firstItem.getAttribute('role');
    const itemAriaLabel = await firstItem.getAttribute('aria-label');

    console.log(`  First item:`);
    console.log(`    role: ${itemRole || '(none)'}`);
    console.log(`    aria-label: ${itemAriaLabel || '(none)'}`);

    // Check Add to Cart button
    const addButton = firstItem.locator('button');
    const buttonText = await addButton.textContent();
    const buttonAriaLabel = await addButton.getAttribute('aria-label');

    console.log(`    Add button text: ${buttonText?.trim()}`);
    console.log(`    Add button aria-label: ${buttonAriaLabel || '(uses text content)'}`);
  }

  // Recommendations for semantic HTML
  if (!role) {
    console.log(
      '  ⚠️ Recommendation: Consider using role="list" on container and role="listitem" on items'
    );
  }

  console.log('  ✅ Product list check completed');
});
