import { expect, APIResponse } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { BASE_URL } from '../utils/config';

const { Given, Then } = createBdd();

let healthResponse: APIResponse | undefined;

Given('I check the application health status', async ({ request }) => {
  healthResponse = await request.get(`${BASE_URL}/`);
});

// eslint-disable-next-line no-empty-pattern
Then('the application should respond with status code {int}', async ({}, status: number) => {
  expect(healthResponse).toBeDefined();
  expect(healthResponse!.status()).toBe(status);
});

Then('the loading performance should be acceptable', async ({ page }) => {
  const startTime = Date.now();
  await page.goto(`${BASE_URL}/`);
  const loadTime = Date.now() - startTime;

  console.log(`Page Load Time: ${loadTime}ms`);
  expect.soft(loadTime).toBeLessThan(15000);
});
