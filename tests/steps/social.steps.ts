import { expect, Page } from '@playwright/test';
import { Then, When } from '../fixtures';

let newPage: Page | null = null;

// ============================================
// Multi-Tab Testing: Social Media Links
// ============================================

When('I click on the LinkedIn link', async ({ page }) => {
  // Wait for popup event when clicking the link
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.locator('a[href*="linkedin.com"]').click(),
  ]);
  newPage = popup;
  console.log('📱 New tab opened for LinkedIn');
});

// eslint-disable-next-line no-empty-pattern
Then('a new tab should open with URL containing {string}', async ({}, urlPart: string) => {
  expect(newPage, 'New tab should be opened').not.toBeNull();

  // Wait for navigation to complete (may redirect)
  await newPage!.waitForLoadState('domcontentloaded');

  // Some social sites redirect, so check if URL contains the expected part
  const currentUrl = newPage!.url();
  console.log(`🔗 New tab URL: ${currentUrl}`);

  expect(currentUrl.toLowerCase()).toContain(urlPart.toLowerCase());
});

Then('the new tab should be closed after verification', async () => {
  if (newPage && !newPage.isClosed()) {
    await newPage.close();
    console.log('✅ New tab closed successfully');
  }
  newPage = null;
});

Then('all social media links should have valid URLs', async ({ page }) => {
  // SauceDemo only has LinkedIn, Twitter, and Facebook links in the footer
  const socialLinks = [
    { name: 'Twitter', selector: 'a[href*="twitter.com"]' },
    { name: 'Facebook', selector: 'a[href*="facebook.com"]' },
    { name: 'LinkedIn', selector: 'a[href*="linkedin.com"]' },
  ];

  let foundLinks = 0;

  for (const link of socialLinks) {
    const element = page.locator(link.selector);
    const count = await element.count();

    if (count > 0) {
      const href = await element.getAttribute('href');
      expect(href, `${link.name} link should have href`).toBeTruthy();
      expect(href, `${link.name} link should be a valid URL`).toMatch(/^https?:\/\//);
      console.log(`✅ ${link.name}: ${href}`);
      foundLinks++;
    } else {
      console.log(`⚠️ ${link.name}: Not found on page`);
    }
  }

  expect(foundLinks, 'At least one social link should be present').toBeGreaterThan(0);
  console.log(`📊 Found ${foundLinks} social media links`);
});
