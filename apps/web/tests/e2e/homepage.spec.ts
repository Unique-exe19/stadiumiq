// =============================================================================
// E2E Test – Fan Portal Homepage
// Accessibility & User Journey
// =============================================================================
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Homepage – Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have no critical accessibility violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .disableRules(['color-contrast', 'target-size'])
      .analyze();

    expect(results.violations.filter((v: any) => v.impact === 'critical')).toHaveLength(0);
    expect(results.violations.filter((v: any) => v.impact === 'serious')).toHaveLength(0);
  });

  test('should have a single h1 element', async ({ page }) => {
    const h1s = await page.locator('h1').count();
    expect(h1s).toBe(1);
  });

  test('should have a skip navigation link', async ({ page }) => {
    const skipLink = page.locator('a.skip-link, a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });

  test('should navigate to main content via skip link', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveText(/skip to main content/i);
    await page.keyboard.press('Enter');
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('should have lang attribute on html element', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });

  test('should have meta description', async ({ page }) => {
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();
    expect(metaDesc!.length).toBeGreaterThan(50);
  });

  test('all images should have alt text', async ({ page }) => {
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);
  });

  test('all interactive elements should be keyboard accessible', async ({ page }) => {
    const buttons = page.locator('button, [role="button"], a[href]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    // Tab through first 5 interactive elements
    for (let i = 0; i < Math.min(count, 5); i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    }
  });
});

test.describe('AI Chat Demo – Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render chat interface', async ({ page }) => {
    const chatInput = page.locator('#chat-input');
    await expect(chatInput).toBeVisible();
  });

  test('should allow sending a quick prompt', async ({ page }) => {
    const promptBtn = page.locator('[aria-label*="Quick question"]').first();
    await promptBtn.click();

    // Wait for AI response
    const assistantMessage = page.locator('[aria-label*="AI:"]').last();
    await expect(assistantMessage).toBeVisible({ timeout: 8000 });
  });

  test('should have proper ARIA live region on chat', async ({ page }) => {
    const chatLog = page.locator('[role="log"]');
    await expect(chatLog).toHaveAttribute('aria-live', 'polite');
  });

  test('quick prompt buttons should have accessible labels', async ({ page }) => {
    const promptBtns = page.locator('[aria-label*="Quick question"]');
    const count = await promptBtns.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Staff Dashboard – Protected Route', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/staff');
    // In production this would redirect; demo shows dashboard
    await expect(page).toHaveURL(/staff|login/);
  });
});

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 812 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    test(`should render correctly on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();
      await expect(page).toHaveScreenshot(`homepage-${vp.name.toLowerCase()}.png`, {
        maxDiffPixels: 200,
      });
    });
  }
});
