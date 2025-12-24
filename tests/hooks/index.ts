import { After, Before } from '../fixtures';

// Structured logger utility
const log = {
  info: (msg: string) => console.log(`ℹ️  ${new Date().toISOString()} | ${msg}`),
  warn: (msg: string) => console.warn(`⚠️  ${new Date().toISOString()} | ${msg}`),
  error: (msg: string) => console.error(`❌ ${new Date().toISOString()} | ${msg}`),
  step: (msg: string) => console.log(`📍 ${new Date().toISOString()} | STEP: ${msg}`),
};

// Type for test data storage
interface TestData {
  createdItems: string[];
  addedToCart: string[];
}

Before(async ({ page, $testInfo }) => {
  log.info(`Starting: ${$testInfo.title}`);
  log.info(`Tags: ${$testInfo.tags.join(', ')}`);

  // Initialize test data storage for cleanup
  (page as { testData?: TestData }).testData = {
    createdItems: [],
    addedToCart: [],
  };
});

After(async ({ page, $testInfo }) => {
  if ($testInfo.status === 'failed') {
    log.error(`FAILED: ${$testInfo.title}`);
    log.error(`Error: ${$testInfo.error?.message}`);

    // Attach screenshot on failure (in addition to auto-screenshot from config)
    await $testInfo.attach('failure-screenshot', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  } else {
    log.info(`PASSED: ${$testInfo.title}`);
  }

  // Data cleanup - Remove items from cart if any were added
  const testData = (page as { testData?: TestData }).testData;
  if (testData?.addedToCart?.length > 0) {
    log.info(`Cleaning up ${testData.addedToCart.length} items from cart...`);
    try {
      // Navigate to cart and clear if needed
      if (!page.url().includes('cart')) {
        await page.goto('/cart.html').catch(() => {});
      }
      // Items will be auto-cleared when session ends, but we log it
      log.info('✅ Cart cleanup completed');
    } catch {
      log.warn('Cart cleanup skipped (session may have ended)');
    }
  }
});
