import { Page } from '@playwright/test';

/**
 * Debug Helper - Production-ready utilities for debugging Playwright tests
 */
export class DebugHelper {
  /**
   * Enable browser console logging to terminal
   */
  static enableConsoleLogging(page: Page): void {
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      console.log(`📺 Browser Console [${type}]: ${text}`);
    });
  }

  /**
   * Enable network request/response logging
   */
  static enableNetworkLogging(page: Page): void {
    page.on('request', (req) => {
      console.log(`🌐 → ${req.method()} ${req.url()}`);
    });

    page.on('response', (res) => {
      const status = res.status();
      const emoji = status >= 400 ? '❌' : '✅';
      console.log(`🌐 ${emoji} ${status} ${res.url()}`);
    });
  }

  /**
   * Take debug screenshot with timestamp
   */
  static async debugScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `./debug-screenshots/${name}-${timestamp}.png`;

    await page.screenshot({ path: filename, fullPage: true });
    console.log(`📸 Screenshot saved: ${filename}`);
  }

  /**
   * Log current page state
   */
  static async logPageState(page: Page): Promise<void> {
    console.log('📄 === Page State ===');
    console.log('📄 URL:', page.url());
    console.log('📄 Title:', await page.title());
    console.log('📄 Viewport:', page.viewportSize());
    console.log('📄 ================');
  }

  /**
   * Wait and log progress
   */
  static async waitWithLog(ms: number, message: string): Promise<void> {
    console.log(`⏱️  Waiting ${ms}ms: ${message}`);
    await new Promise((resolve) => setTimeout(resolve, ms));
    console.log(`✅ Wait complete: ${message}`);
  }
}

/**
 * Network Mock Helper - Utilities for mocking network requests
 */
export class NetworkMockHelper {
  /**
   * Mock all image requests to fail
   */
  static async mockImageLoadFailure(page: Page): Promise<void> {
    await page.route(/\.(jpg|jpeg|png|gif|svg|webp)$/i, (route) => {
      route.fulfill({
        status: 404,
        contentType: 'text/plain',
        body: 'Image not found',
      });
    });
    console.log('🔧 Mocked: All images will fail to load');
  }

  /**
   * Mock specific API endpoint
   */
  static async mockApiEndpoint(
    page: Page,
    urlPattern: string | RegExp,
    responseData: Record<string, unknown>,
    status: number = 200
  ): Promise<void> {
    await page.route(urlPattern, (route) => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(responseData),
      });
    });
    console.log(`🔧 Mocked: ${urlPattern} → ${status}`);
  }

  /**
   * Add delay to all network requests (simulate slow network)
   */
  static async simulateSlowNetwork(page: Page, delayMs: number = 2000): Promise<void> {
    await page.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      await route.continue();
    });
    console.log(`🐌 Simulating slow network: ${delayMs}ms delay`);
  }

  /**
   * Block specific domains
   */
  static async blockDomain(page: Page, domain: string): Promise<void> {
    await page.route(`**://${domain}/**`, (route) => {
      route.abort('blockedbyclient');
    });
    console.log(`🚫 Blocked domain: ${domain}`);
  }
}
