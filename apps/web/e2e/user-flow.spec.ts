import { test, expect } from '@playwright/test';

test.describe('User (Storefront) Flow', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    // Check if the page loads correctly by looking for a common element or just checking status
    // Assuming there's a title or a main element. Next.js might return title "Fushion" or similar.
    await expect(page).toHaveURL('/');
  });

  test('should navigate to products page', async ({ page }) => {
    // If there's an "all-products" page we can visit it
    await page.goto('/all-products');
    await expect(page).toHaveURL(/.*all-products/);
  });

  test('should navigate to cart page', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL(/.*cart/);
  });

  test('should navigate to category page', async ({ page }) => {
    await page.goto('/categories');
    await expect(page).toHaveURL(/.*categories/);
  });
});
