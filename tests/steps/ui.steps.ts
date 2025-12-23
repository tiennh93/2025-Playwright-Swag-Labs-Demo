import { expect } from '@playwright/test';
import { Then } from '../fixtures/fixtures';

Then('the login page should look exactly like the design', async ({ page }) => {
  // Playwright sẽ chụp màn hình và so sánh với file ảnh gốc (snapshot)
  // Lần chạy đầu tiên sẽ thất bại vì chưa có ảnh gốc -> Nó tự sinh ra ảnh gốc.
  await expect(page).toHaveScreenshot('login-page-design.png', {
    maxDiffPixels: 100, // Cho phép lệch tối đa 100 điểm ảnh (pixel)
  });
});
