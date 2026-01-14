import { Page } from '@playwright/test';

/**
 * Console Error Monitor - Auto-fail on browser console errors
 *
 * Implements strict mode console monitoring with whitelist support
 */
export class ConsoleErrorMonitor {
  private errors: string[] = [];
  private warnings: string[] = [];

  // Known errors to ignore (whitelist)
  private readonly whitelist: RegExp[] = [
    /favicon\.ico/i,
    /Failed to load resource.*404/i,
    /third-party cookie/i,
    /DevTools/i,
  ];

  /**
   * Start monitoring console errors
   */
  attach(page: Page): void {
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();

      // Check if error is whitelisted
      const isWhitelisted = this.whitelist.some((pattern) => pattern.test(text));

      if (type === 'error' && !isWhitelisted) {
        this.errors.push(text);
        console.error(`🚨 Console Error: ${text}`);
      } else if (type === 'warning') {
        this.warnings.push(text);
        console.warn(`⚠️ Console Warning: ${text}`);
      }
    });

    // Track uncaught exceptions
    page.on('pageerror', (error) => {
      this.errors.push(`Uncaught: ${error.message}`);
      console.error(`🔥 Uncaught Exception: ${error.message}`);
    });

    console.log('📡 Console Error Monitor attached');
  }

  /**
   * Get collected errors
   */
  getErrors(): string[] {
    return [...this.errors];
  }

  /**
   * Get collected warnings
   */
  getWarnings(): string[] {
    return [...this.warnings];
  }

  /**
   * Check if any errors occurred
   */
  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  /**
   * Clear collected errors and warnings
   */
  clear(): void {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Assert no console errors (strict mode)
   * @throws Error if any console errors were detected
   */
  assertNoErrors(): void {
    if (this.errors.length > 0) {
      const errorList = this.errors.map((e, i) => `  ${i + 1}. ${e}`).join('\n');
      throw new Error(`Console errors detected:\n${errorList}`);
    }
  }

  /**
   * Add pattern to whitelist
   */
  addToWhitelist(pattern: RegExp): void {
    this.whitelist.push(pattern);
  }
}

// Singleton instance for use across tests
export const consoleMonitor = new ConsoleErrorMonitor();
