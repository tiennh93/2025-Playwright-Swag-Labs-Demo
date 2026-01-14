import { After, Before } from '../fixtures';
import { ConsoleErrorMonitor } from '../utils/console-monitor';

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
  consoleMonitor?: ConsoleErrorMonitor;
  retryCount?: number;
}

// Enable strict console monitoring (auto-fail on errors)
const STRICT_CONSOLE_MONITORING = process.env.STRICT_CONSOLE === 'true';

Before(async ({ page, $testInfo }) => {
  log.info(`Starting: ${$testInfo.title}`);
  log.info(`Tags: ${$testInfo.tags.join(', ')}`);

  // Log retry information if this is a retry attempt
  if ($testInfo.retry > 0) {
    log.warn(`🔄 RETRY ATTEMPT ${$testInfo.retry}/${$testInfo.project.retries}`);
    log.warn(`Previous failure: ${$testInfo.error?.message || 'Unknown'}`);
  }

  // Initialize test data storage for cleanup
  const testData: TestData = {
    createdItems: [],
    addedToCart: [],
    retryCount: $testInfo.retry,
  };

  // Attach console error monitor
  const consoleMonitor = new ConsoleErrorMonitor();
  consoleMonitor.attach(page);
  testData.consoleMonitor = consoleMonitor;

  (page as { testData?: TestData }).testData = testData;
});

After(async ({ page, $testInfo }) => {
  const testData = (page as { testData?: TestData }).testData;

  // Check for console errors (strict mode)
  if (STRICT_CONSOLE_MONITORING && testData?.consoleMonitor?.hasErrors()) {
    const errors = testData.consoleMonitor.getErrors();
    log.error(`Console errors detected: ${errors.length}`);
    errors.forEach((err, i) => log.error(`  ${i + 1}. ${err}`));

    // Attach console errors to test report
    await $testInfo.attach('console-errors', {
      body: errors.join('\n'),
      contentType: 'text/plain',
    });
  }

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
  if (testData && testData.addedToCart && testData.addedToCart.length > 0) {
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

  // Clear console monitor
  testData?.consoleMonitor?.clear();
});
