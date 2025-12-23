import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';
import { Page } from '@playwright/test';

const { When, Then } = createBdd(test);

// Biến global để lưu trang mới (popup)
let newPage: Page | null = null;

When('I click on the Linkedin link', async ({ inventoryPage, page }) => {
  // Kỹ thuật "Catch Page Event":
  // Chúng ta phải chờ sự kiện 'popup' xảy ra ĐỒNG THỜI với hành động click.
  // Nếu click xong mới chờ thì có thể sự kiện đã trôi qua rồi -> Fail.
  const [popup] = await Promise.all([
    page.waitForEvent('popup'), // 1. Lắng nghe sự kiện mở tab mới
    inventoryPage.clickLinkedin(), // 2. Thực hiện click
  ]);

  newPage = popup; // Lưu reference của tab mới để assert
});

Then('a new tab should open with URL containing {string}', async ({ page }, urlPart: string) => {
  // Assert trên trang MỚI (newPage), không phải trang cũ (page)
  expect(newPage).not.toBeNull();
  await newPage!.waitForLoadState(); // Đợi tab mới load xong
  await expect(newPage!).toHaveURL(new RegExp(urlPart));
});
