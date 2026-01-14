/**
 * Retry Helper Utility
 *
 * Provides retry patterns with exponential backoff for handling flaky operations
 * like network requests or unstable element interactions.
 */

export interface RetryOptions {
  /** Maximum number of retry attempts. Default: 3 */
  maxRetries?: number;
  /** Initial delay in milliseconds before first retry. Default: 1000 */
  initialDelay?: number;
  /** Multiplier for exponential backoff. Default: 2 */
  backoffMultiplier?: number;
  /** Maximum delay between retries in milliseconds. Default: 10000 */
  maxDelay?: number;
  /** Whether to log retry attempts. Default: true */
  logRetries?: boolean;
  /** Custom error filter - only retry if this returns true */
  shouldRetry?: (error: Error) => boolean;
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  backoffMultiplier: 2,
  maxDelay: 10000,
  logRetries: true,
  shouldRetry: () => true,
};

/**
 * Retry helper with exponential backoff
 *
 * @param operation - Async function to retry
 * @param options - Retry configuration options
 * @returns The result of the operation if successful
 * @throws The last error if all retries fail
 *
 * @example
 * ```typescript
 * // Basic usage
 * const result = await retry(async () => {
 *   return await page.locator('.element').click();
 * });
 *
 * // With custom options
 * const result = await retry(
 *   async () => await fetchData(),
 *   { maxRetries: 5, initialDelay: 500 }
 * );
 *
 * // With error filter
 * const result = await retry(
 *   async () => await apiCall(),
 *   {
 *     shouldRetry: (error) => error.message.includes('timeout')
 *   }
 * );
 * ```
 */
export async function retry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...defaultOptions, ...options };
  let lastError: Error | undefined;
  let currentDelay = config.initialDelay;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry this error
      if (!config.shouldRetry(lastError)) {
        throw lastError;
      }

      // If this was the last attempt, throw
      if (attempt === config.maxRetries) {
        break;
      }

      // Log retry attempt
      if (config.logRetries) {
        console.log(
          `🔄 Retry ${attempt + 1}/${config.maxRetries}: ${lastError.message.substring(0, 100)}...`
        );
        console.log(`   Waiting ${currentDelay}ms before next attempt...`);
      }

      // Wait before retrying
      await sleep(currentDelay);

      // Calculate next delay with exponential backoff
      currentDelay = Math.min(currentDelay * config.backoffMultiplier, config.maxDelay);
    }
  }

  // All retries exhausted
  if (config.logRetries) {
    console.log(`❌ All ${config.maxRetries} retries failed`);
  }

  throw lastError;
}

/**
 * Retry helper with fixed delay (no exponential backoff)
 */
export async function retryWithFixedDelay<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  return retry(operation, {
    maxRetries,
    initialDelay: delayMs,
    backoffMultiplier: 1, // Fixed delay
    maxDelay: delayMs,
  });
}

/**
 * Wait for a condition to be true with retry
 */
export async function waitForCondition(
  condition: () => Promise<boolean>,
  options: RetryOptions & { timeout?: number } = {}
): Promise<boolean> {
  const startTime = Date.now();
  const timeout = options.timeout || 30000;

  while (Date.now() - startTime < timeout) {
    try {
      if (await condition()) {
        return true;
      }
    } catch {
      // Condition threw an error, continue waiting
    }

    await sleep(options.initialDelay || 500);
  }

  throw new Error(`Condition not met within ${timeout}ms timeout`);
}

/**
 * Simple sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry statistics for debugging
 */
export interface RetryStats {
  totalAttempts: number;
  successfulAttempt: number;
  totalDelayMs: number;
  errors: string[];
}

/**
 * Retry with statistics collection
 */
export async function retryWithStats<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<{ result: T; stats: RetryStats }> {
  const config = { ...defaultOptions, ...options };
  const stats: RetryStats = {
    totalAttempts: 0,
    successfulAttempt: 0,
    totalDelayMs: 0,
    errors: [],
  };

  let currentDelay = config.initialDelay;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    stats.totalAttempts++;

    try {
      const result = await operation();
      stats.successfulAttempt = attempt + 1;

      if (config.logRetries && attempt > 0) {
        console.log(`✅ Succeeded on attempt ${attempt + 1}`);
        console.log(`   Total retry delay: ${stats.totalDelayMs}ms`);
      }

      return { result, stats };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      stats.errors.push(errorMessage);

      if (attempt === config.maxRetries) {
        break;
      }

      if (config.logRetries) {
        console.log(`🔄 Attempt ${attempt + 1} failed: ${errorMessage.substring(0, 80)}...`);
      }

      stats.totalDelayMs += currentDelay;
      await sleep(currentDelay);
      currentDelay = Math.min(currentDelay * config.backoffMultiplier, config.maxDelay);
    }
  }

  throw new Error(`All ${config.maxRetries} retries failed. Errors: ${stats.errors.join(' | ')}`);
}
