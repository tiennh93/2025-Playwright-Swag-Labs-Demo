import { chromium } from '@playwright/test';
import path from 'path';
import { BASE_URL } from './utils/config';

async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/`);

    await page.waitForLoadState('networkidle');

    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    await page.waitForURL('**/inventory.html');

    const statePath = path.join(process.cwd(), 'state.json');
    await context.storageState({ path: statePath });

    console.log('✅ Global setup: Login thành công và đã lưu state.json');
  } catch (error) {
    console.error('❌ Global setup: Login thất bại:', error);
    throw error;
  } finally {
    await browser.close();
  }
}
export default globalSetup;
