import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { defineBddConfig } from 'playwright-bdd';
import { BASE_URL } from './tests/utils/config';

dotenv.config({ path: path.join(__dirname, '.env.local') });

const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: ['tests/steps/**/*.ts', 'tests/fixtures/**/*.ts'],
});

const statePath = path.join(__dirname, 'state.json');
const storageState = fs.existsSync(statePath) ? statePath : undefined;

export default defineConfig({
  globalSetup: require.resolve('./tests/global-setup'),
  testDir,
  reporter: [['html'], ['allure-playwright']],
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: BASE_URL,
    testIdAttribute: 'data-test',
    ...(storageState && { storageState }),
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  workers: process.env.CI ? 2 : undefined,
});
