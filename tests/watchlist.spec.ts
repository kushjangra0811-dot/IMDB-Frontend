import { test, expect } from '@playwright/test';

test.describe('Watchlist Synchronization', () => {
  test('Cross-tab synchronization via BroadcastChannel', async ({ context }) => {
    // Open two tabs
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    await page1.goto('/');
    await page2.goto('/');

    // Ensure we start with no watchlist items
    // (Assuming first movie card is 'Inception' or similar)
    const watchlistBtn1 = page1.locator('button[aria-label="Add to watchlist"]').first();
    const watchlistBtn2 = page2.locator('button[aria-label="Remove from watchlist"]').first();

    // In tab 1, add to watchlist
    await watchlistBtn1.click();

    // Verify it changed to "Remove from watchlist" in tab 1
    await expect(page1.locator('button[aria-label="Remove from watchlist"]').first()).toBeVisible();

    // Verify Tab 2 automatically synced and shows "Remove from watchlist" (active state)
    await expect(page2.locator('button[aria-label="Remove from watchlist"]').first()).toBeVisible();

    // Remove it from tab 2
    await page2.locator('button[aria-label="Remove from watchlist"]').first().click();

    // Verify Tab 1 automatically synced back
    await expect(page1.locator('button[aria-label="Add to watchlist"]').first()).toBeVisible();
  });

  test('Offline background sync resilience', async ({ page, context }) => {
    await page.goto('/');

    // Go offline
    await context.setOffline(true);

    const watchlistBtn = page.locator('button[aria-label="Add to watchlist"]').first();
    
    // Click while offline
    await watchlistBtn.click();
    
    // UI should optimistically update to "Remove from watchlist"
    await expect(page.locator('button[aria-label="Remove from watchlist"]').first()).toBeVisible();

    // Go online
    await context.setOffline(false);

    // After coming online, ServiceWorker/online listener should flush queue.
    // Wait for a second to let sync happen
    await page.waitForTimeout(2000);

    // Refresh page
    await page.reload();

    // State should persist because it was synced to the server
    await expect(page.locator('button[aria-label="Remove from watchlist"]').first()).toBeVisible();
    
    // Clean up
    await page.locator('button[aria-label="Remove from watchlist"]').first().click();
  });
});
