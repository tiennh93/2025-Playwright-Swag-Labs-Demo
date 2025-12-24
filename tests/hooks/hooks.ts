import { After, Before } from '../fixtures/fixtures';

Before(async ({ page }) => {
  console.log('🏁 Start Scenario...');
  // Ví dụ: await page.setViewportSize({ width: 1280, height: 720 });
});

After(async ({ page, $testInfo }) => {
  console.log('✅ End Scenario');

  if ($testInfo.status === 'failed') {
    console.log(`⚠️ Scenario Failed: ${$testInfo.title}`);
    // Tại đây Playwright config đã tự chụp màn hình, ta không cần code thêm
  }
});
