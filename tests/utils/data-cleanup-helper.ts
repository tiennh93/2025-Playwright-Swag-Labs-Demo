import { APIRequestContext } from '@playwright/test';

/**
 * Data Cleanup Helper - Utility for cleaning up test data via API
 */
export class DataCleanupHelper {
  private request: APIRequestContext;
  private resourcesToDelete: Array<{ url: string; method?: string }> = [];

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Register a resource for deletion
   */
  registerForDeletion(url: string, method: string = 'DELETE') {
    this.resourcesToDelete.push({ url, method });
  }

  /**
   * Execute cleanup of all registered resources
   */
  async cleanup(): Promise<void> {
    if (this.resourcesToDelete.length === 0) return;

    console.log('🧹 cleaning up test data...');

    // Process in reverse order to handle dependencies
    for (const resource of this.resourcesToDelete.reverse()) {
      try {
        console.log(`🧹 Deleting: ${resource.url}`);
        // In a real app, you would execute the request:
        // await this.request.fetch(resource.url, { method: resource.method });

        // Simulating cleanup delay
        await new Promise((resolve) => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`❌ Failed to clean up ${resource.url}`, error);
      }
    }

    this.resourcesToDelete = [];
    console.log('✅ Data cleanup complete');
  }
}
