import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

/**
 * Slack Reporter Configuration
 */
export interface SlackReporterOptions {
  webhookUrl?: string;
  channel?: string;
  username?: string;
  iconEmoji?: string;
  notifyOnSuccess?: boolean;
  notifyOnFailure?: boolean;
  mentionOnFailure?: string[];
  environment?: string;
  showDetailedResults?: boolean;
}

/**
 * Test Summary for Slack Notification
 */
interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  duration: number;
  failedTests: Array<{
    title: string;
    file: string;
    error?: string;
  }>;
}

/**
 * Slack Reporter for Playwright
 * Sends test results to a Slack channel via webhook
 *
 * Usage in playwright.config.ts:
 * ```ts
 * reporter: [
 *   ['./tests/reporters/slack-reporter.ts', {
 *     webhookUrl: process.env.SLACK_WEBHOOK_URL,
 *     channel: '#test-results',
 *     notifyOnFailure: true,
 *     notifyOnSuccess: true,
 *     mentionOnFailure: ['@qa-team'],
 *   }]
 * ]
 * ```
 */
export default class SlackReporter implements Reporter {
  private options: SlackReporterOptions;
  private summary: TestSummary;
  private startTime: number = 0;

  constructor(options: SlackReporterOptions = {}) {
    this.options = {
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      channel: options.channel || '#test-results',
      username: options.username || 'Playwright Bot',
      iconEmoji: options.iconEmoji || ':robot_face:',
      notifyOnSuccess: options.notifyOnSuccess ?? false,
      notifyOnFailure: options.notifyOnFailure ?? true,
      mentionOnFailure: options.mentionOnFailure || [],
      environment: options.environment || process.env.NODE_ENV || 'development',
      showDetailedResults: options.showDetailedResults ?? true,
      ...options,
    };

    this.summary = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      flaky: 0,
      duration: 0,
      failedTests: [],
    };
  }

  onBegin(_config: FullConfig, _suite: Suite): void {
    this.startTime = Date.now();
    console.log('📤 Slack Reporter: Test run started');
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.summary.total++;

    switch (result.status) {
      case 'passed':
        this.summary.passed++;
        break;
      case 'failed':
        this.summary.failed++;
        this.summary.failedTests.push({
          title: test.title,
          file: test.location.file.split('/').pop() || test.location.file,
          error: result.error?.message?.slice(0, 200),
        });
        break;
      case 'skipped':
        this.summary.skipped++;
        break;
      case 'timedOut':
        this.summary.failed++;
        this.summary.failedTests.push({
          title: test.title,
          file: test.location.file.split('/').pop() || test.location.file,
          error: 'Test timed out',
        });
        break;
    }

    // Check for flaky tests
    if (result.retry > 0 && result.status === 'passed') {
      this.summary.flaky++;
    }
  }

  async onEnd(result: FullResult): Promise<void> {
    this.summary.duration = Date.now() - this.startTime;

    const hasFailures = this.summary.failed > 0;

    // Determine if we should send notification
    const shouldNotify =
      (hasFailures && this.options.notifyOnFailure) ||
      (!hasFailures && this.options.notifyOnSuccess);

    if (!shouldNotify) {
      console.log('📤 Slack Reporter: Notification skipped based on configuration');
      return;
    }

    if (!this.options.webhookUrl) {
      console.log('⚠️ Slack Reporter: SLACK_WEBHOOK_URL not configured');
      console.log('📊 Test Results Summary:');
      this.printSummary();
      return;
    }

    try {
      await this.sendSlackNotification(result);
      console.log('✅ Slack Reporter: Notification sent successfully');
    } catch (error) {
      console.error('❌ Slack Reporter: Failed to send notification', error);
    }
  }

  /**
   * Send Slack notification via webhook
   */
  private async sendSlackNotification(result: FullResult): Promise<void> {
    const message = this.buildSlackMessage(result);

    const response = await fetch(this.options.webhookUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Build Slack message payload
   */
  private buildSlackMessage(result: FullResult): Record<string, unknown> {
    const isSuccess = result.status === 'passed';
    const statusEmoji = isSuccess ? '✅' : '❌';
    const statusText = isSuccess ? 'PASSED' : 'FAILED';
    const color = isSuccess ? '#36a64f' : '#dc3545';

    const durationMinutes = (this.summary.duration / 60000).toFixed(2);
    const passRate = ((this.summary.passed / this.summary.total) * 100).toFixed(1);

    // Build mentions string
    const mentions =
      !isSuccess && this.options.mentionOnFailure?.length
        ? this.options.mentionOnFailure.join(' ') + '\n'
        : '';

    const blocks: Record<string, unknown>[] = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${statusEmoji} Playwright Tests ${statusText}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Environment:*\n${this.options.environment}`,
          },
          {
            type: 'mrkdwn',
            text: `*Duration:*\n${durationMinutes} min`,
          },
          {
            type: 'mrkdwn',
            text: `*Total Tests:*\n${this.summary.total}`,
          },
          {
            type: 'mrkdwn',
            text: `*Pass Rate:*\n${passRate}%`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            `${mentions}` +
            `✅ Passed: *${this.summary.passed}* | ` +
            `❌ Failed: *${this.summary.failed}* | ` +
            `⏭️ Skipped: *${this.summary.skipped}* | ` +
            `🔄 Flaky: *${this.summary.flaky}*`,
        },
      },
    ];

    // Add failed tests details
    if (this.options.showDetailedResults && this.summary.failedTests.length > 0) {
      const failedTestsText = this.summary.failedTests
        .slice(0, 5) // Limit to 5 failed tests
        .map((t) => `• ${t.title}\n  _${t.file}_${t.error ? `\n  \`${t.error}\`` : ''}`)
        .join('\n');

      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            `*Failed Tests:*\n${failedTestsText}` +
            (this.summary.failedTests.length > 5
              ? `\n_...and ${this.summary.failedTests.length - 5} more_`
              : ''),
        },
      });
    }

    // Add divider and timestamp
    blocks.push(
      { type: 'divider' },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `🕐 ${new Date().toISOString()} | 🏷️ ${process.env.GITHUB_REF || 'local'}`,
          },
        ],
      }
    );

    return {
      channel: this.options.channel,
      username: this.options.username,
      icon_emoji: this.options.iconEmoji,
      attachments: [
        {
          color,
          blocks,
        },
      ],
    };
  }

  /**
   * Print summary to console (fallback when webhook not configured)
   */
  private printSummary(): void {
    console.log('━'.repeat(50));
    console.log(`  Total:   ${this.summary.total}`);
    console.log(`  Passed:  ${this.summary.passed}`);
    console.log(`  Failed:  ${this.summary.failed}`);
    console.log(`  Skipped: ${this.summary.skipped}`);
    console.log(`  Flaky:   ${this.summary.flaky}`);
    console.log(`  Duration: ${(this.summary.duration / 1000).toFixed(2)}s`);
    console.log('━'.repeat(50));

    if (this.summary.failedTests.length > 0) {
      console.log('\n❌ Failed Tests:');
      this.summary.failedTests.forEach((t) => {
        console.log(`  • ${t.title} (${t.file})`);
        if (t.error) {
          console.log(`    ${t.error}`);
        }
      });
    }
  }
}

/**
 * Helper function to send a custom Slack message
 * Can be used in tests or hooks for custom notifications
 */
export async function sendSlackMessage(
  webhookUrl: string,
  message: string,
  options: { channel?: string; username?: string; emoji?: string } = {}
): Promise<void> {
  const payload = {
    channel: options.channel || '#test-results',
    username: options.username || 'Playwright Bot',
    icon_emoji: options.emoji || ':robot_face:',
    text: message,
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
