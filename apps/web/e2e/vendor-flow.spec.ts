import { test, expect } from '@playwright/test';

test.describe('Vendor Flow', () => {
  test('should navigate to become a vendor page', async ({ page }) => {
    await page.goto('/become-a-vendor');
    // The route is in (vendor)/become-a-vendor
    await expect(page).toHaveURL(/.*become-a-vendor/);
  });

  test('should access vendor dashboard', async ({ page }) => {
    // There is a vendor-dashboard directory
    await page.goto('/vendor-dashboard');
    await expect(page).toHaveURL(/.*vendor-dashboard/);
  });
});
