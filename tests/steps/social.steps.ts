import { expect, Page } from '@playwright/test';
import { Then, When } from '../fixtures/fixtures';

let newPage: Page | null = null;

When('I click on the Linkedin link', async ({ inventoryPage, page }) => {
  const [popup] = await Promise.all([page.waitForEvent('popup'), inventoryPage.clickLinkedin()]);

  newPage = popup;
});

Then('a new tab should open with URL containing {string}', async ({ page }, urlPart: string) => {
  expect(newPage).not.toBeNull();
  await newPage!.waitForLoadState();
  await expect(newPage!).toHaveURL(new RegExp(urlPart));
});
