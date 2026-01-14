import { Page } from '@playwright/test';
import lighthouse from 'lighthouse';
import { URL } from 'url';

/**
 * Performance thresholds for Lighthouse audits
 * Scores are 0-100, times are in milliseconds
 */
export interface PerformanceThresholds {
  performance?: number;
  accessibility?: number;
  bestPractices?: number;
  seo?: number;
  pwa?: number;
  // Core Web Vitals thresholds (in ms)
  lcp?: number; // Largest Contentful Paint - should be < 2500ms
  fid?: number; // First Input Delay - should be < 100ms
  cls?: number; // Cumulative Layout Shift - should be < 0.1
  fcp?: number; // First Contentful Paint - should be < 1800ms
  tti?: number; // Time to Interactive - should be < 3800ms
}

/**
 * Default thresholds based on Lighthouse recommendations
 */
export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  performance: 50,
  accessibility: 80,
  bestPractices: 80,
  seo: 80,
  lcp: 4000, // More lenient for demo site
  fcp: 3000,
  cls: 0.25,
};

/**
 * Lighthouse audit result
 */
export interface LighthouseResult {
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    pwa: number;
  };
  metrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    timeToInteractive: number;
    speedIndex: number;
    totalBlockingTime: number;
  };
  audits: Record<string, unknown>;
}

/**
 * LighthouseHelper - Utility class for running Lighthouse audits with Playwright
 */
export class LighthouseHelper {
  private page: Page;
  private thresholds: PerformanceThresholds;

  constructor(page: Page, thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS) {
    this.page = page;
    this.thresholds = thresholds;
  }

  /**
   * Run Lighthouse audit on the current page
   * Note: This requires Chrome/Chromium browser
   */
  async runAudit(url?: string): Promise<LighthouseResult> {
    const targetUrl = url || this.page.url();
    const wsEndpoint = this.page.context().browser()?.wsEndpoint();

    if (!wsEndpoint) {
      throw new Error(
        'Browser WebSocket endpoint not available. Make sure you are using Chromium.'
      );
    }

    // Parse the WebSocket endpoint to get the port
    const wsUrl = new URL(wsEndpoint);
    const port = parseInt(wsUrl.port, 10);

    console.log(`🔍 Running Lighthouse audit on: ${targetUrl}`);

    const result = await lighthouse(targetUrl, {
      port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
    });

    if (!result || !result.lhr) {
      throw new Error('Lighthouse audit failed - no results returned');
    }

    const { lhr } = result;

    const lighthouseResult: LighthouseResult = {
      scores: {
        performance: Math.round((lhr.categories.performance?.score || 0) * 100),
        accessibility: Math.round((lhr.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((lhr.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((lhr.categories.seo?.score || 0) * 100),
        pwa: Math.round((lhr.categories.pwa?.score || 0) * 100),
      },
      metrics: {
        firstContentfulPaint: lhr.audits['first-contentful-paint']?.numericValue || 0,
        largestContentfulPaint: lhr.audits['largest-contentful-paint']?.numericValue || 0,
        cumulativeLayoutShift: lhr.audits['cumulative-layout-shift']?.numericValue || 0,
        timeToInteractive: lhr.audits['interactive']?.numericValue || 0,
        speedIndex: lhr.audits['speed-index']?.numericValue || 0,
        totalBlockingTime: lhr.audits['total-blocking-time']?.numericValue || 0,
      },
      audits: lhr.audits,
    };

    this.logResults(lighthouseResult);

    return lighthouseResult;
  }

  /**
   * Log Lighthouse results in a readable format
   */
  private logResults(result: LighthouseResult): void {
    console.log('\n📊 Lighthouse Audit Results:');
    console.log('━'.repeat(50));

    // Scores
    console.log('\n🏆 Scores:');
    console.log(`   Performance:    ${this.formatScore(result.scores.performance)}`);
    console.log(`   Accessibility:  ${this.formatScore(result.scores.accessibility)}`);
    console.log(`   Best Practices: ${this.formatScore(result.scores.bestPractices)}`);
    console.log(`   SEO:            ${this.formatScore(result.scores.seo)}`);

    // Core Web Vitals
    console.log('\n⚡ Core Web Vitals:');
    console.log(
      `   FCP (First Contentful Paint):     ${this.formatTime(result.metrics.firstContentfulPaint)}`
    );
    console.log(
      `   LCP (Largest Contentful Paint):   ${this.formatTime(result.metrics.largestContentfulPaint)}`
    );
    console.log(
      `   CLS (Cumulative Layout Shift):    ${result.metrics.cumulativeLayoutShift.toFixed(3)}`
    );
    console.log(
      `   TTI (Time to Interactive):        ${this.formatTime(result.metrics.timeToInteractive)}`
    );

    console.log('━'.repeat(50));
  }

  /**
   * Format score with color indicator
   */
  private formatScore(score: number): string {
    const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
    return `${emoji} ${score}/100`;
  }

  /**
   * Format time in human-readable format
   */
  private formatTime(ms: number): string {
    if (ms < 1000) {
      return `${Math.round(ms)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  }

  /**
   * Assert that Lighthouse scores meet thresholds
   */
  assertThresholds(result: LighthouseResult): { passed: boolean; failures: string[] } {
    const failures: string[] = [];

    // Check category scores
    if (this.thresholds.performance && result.scores.performance < this.thresholds.performance) {
      failures.push(
        `Performance score ${result.scores.performance} is below threshold ${this.thresholds.performance}`
      );
    }
    if (
      this.thresholds.accessibility &&
      result.scores.accessibility < this.thresholds.accessibility
    ) {
      failures.push(
        `Accessibility score ${result.scores.accessibility} is below threshold ${this.thresholds.accessibility}`
      );
    }
    if (
      this.thresholds.bestPractices &&
      result.scores.bestPractices < this.thresholds.bestPractices
    ) {
      failures.push(
        `Best Practices score ${result.scores.bestPractices} is below threshold ${this.thresholds.bestPractices}`
      );
    }
    if (this.thresholds.seo && result.scores.seo < this.thresholds.seo) {
      failures.push(`SEO score ${result.scores.seo} is below threshold ${this.thresholds.seo}`);
    }

    // Check Core Web Vitals
    if (this.thresholds.lcp && result.metrics.largestContentfulPaint > this.thresholds.lcp) {
      failures.push(
        `LCP ${this.formatTime(result.metrics.largestContentfulPaint)} exceeds threshold ${this.formatTime(this.thresholds.lcp)}`
      );
    }
    if (this.thresholds.fcp && result.metrics.firstContentfulPaint > this.thresholds.fcp) {
      failures.push(
        `FCP ${this.formatTime(result.metrics.firstContentfulPaint)} exceeds threshold ${this.formatTime(this.thresholds.fcp)}`
      );
    }
    if (this.thresholds.cls && result.metrics.cumulativeLayoutShift > this.thresholds.cls) {
      failures.push(
        `CLS ${result.metrics.cumulativeLayoutShift.toFixed(3)} exceeds threshold ${this.thresholds.cls}`
      );
    }

    return {
      passed: failures.length === 0,
      failures,
    };
  }
}

/**
 * Simple Performance Metrics using Playwright's built-in APIs
 * Works without Lighthouse dependency
 */
export class SimplePerformanceHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Measure page load metrics using Navigation Timing API
   */
  async measurePageLoad(): Promise<{
    domContentLoaded: number;
    loadComplete: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
  }> {
    // Wait for page to fully load
    await this.page.waitForLoadState('load');

    // Get Navigation Timing metrics
    const timing = await this.page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.startTime,
        loadComplete: perf.loadEventEnd - perf.startTime,
      };
    });

    // Get Paint Timing metrics
    const paintMetrics = await this.page.evaluate(() => {
      const entries = performance.getEntriesByType('paint');
      const fcp = entries.find((e) => e.name === 'first-contentful-paint');
      return {
        firstContentfulPaint: fcp?.startTime || 0,
      };
    });

    // Get LCP using PerformanceObserver
    const lcp = await this.page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let lcpValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          lcpValue = lastEntry.startTime;
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        // Resolve after a short delay to capture LCP
        setTimeout(() => {
          observer.disconnect();
          resolve(lcpValue);
        }, 500);
      });
    });

    const result = {
      domContentLoaded: Math.round(timing.domContentLoaded),
      loadComplete: Math.round(timing.loadComplete),
      firstContentfulPaint: Math.round(paintMetrics.firstContentfulPaint),
      largestContentfulPaint: Math.round(lcp),
    };

    console.log('\n⚡ Page Load Metrics:');
    console.log(`   DOM Content Loaded:    ${result.domContentLoaded}ms`);
    console.log(`   Load Complete:         ${result.loadComplete}ms`);
    console.log(`   First Contentful Paint: ${result.firstContentfulPaint}ms`);
    console.log(`   Largest Contentful Paint: ${result.largestContentfulPaint}ms`);

    return result;
  }

  /**
   * Measure resource loading times
   */
  async measureResources(): Promise<{
    totalResources: number;
    totalSize: number;
    resources: Array<{ name: string; type: string; size: number; duration: number }>;
  }> {
    const resources = await this.page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries.map((r) => ({
        name: r.name.split('/').pop() || r.name,
        type: r.initiatorType,
        size: r.transferSize,
        duration: Math.round(r.duration),
      }));
    });

    const totalSize = resources.reduce((sum, r) => sum + r.size, 0);

    console.log('\n📦 Resource Metrics:');
    console.log(`   Total Resources: ${resources.length}`);
    console.log(`   Total Size:      ${(totalSize / 1024).toFixed(2)} KB`);

    return {
      totalResources: resources.length,
      totalSize,
      resources,
    };
  }
}
