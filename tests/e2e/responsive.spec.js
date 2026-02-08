// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Responsive Design Tests
 *
 * Covers FR-4, AC-4: Verify pages render correctly at desktop, tablet, and mobile viewports
 *
 * Tests that pages are responsive and don't have layout issues at common viewport sizes.
 * Checks for content overflow, broken layouts, and hidden content.
 */

// Pages to test responsiveness
const pages = [
  '/',
  '/about.html',
  '/contact.html',
  '/services/fractional-cto.html',
  '/services/board-advisory.html',
  '/services/growth-advisory.html',
  '/campaigns/ai-ceo-brief.html',
];

// Viewport sizes to test
const viewports = [
  { name: 'Desktop', width: 1280, height: 720 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 },
];

test.describe('Responsive Layout', () => {
  for (const viewport of viewports) {
    for (const pagePath of pages) {
      test(`${pagePath} renders without overflow at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
        // Set viewport size
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        // Navigate to page
        await page.goto(pagePath);

        // Check that body doesn't have horizontal overflow
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => window.innerWidth);

        // Allow small tolerance (1px) for rounding differences
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);

        // Verify main structural elements are visible
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
      });
    }
  }
});

test.describe('Mobile Navigation', () => {
  test('navigation is accessible on mobile viewport', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // On mobile, either nav is visible or hamburger menu is visible
    const nav = page.locator('nav');
    const hamburger = page.locator('button:has-text("Menu"), .hamburger, .menu-toggle, [aria-label*="menu" i]');

    // At least one should be visible
    const navVisible = await nav.isVisible();
    const hamburgerVisible = await hamburger.isVisible();

    expect(navVisible || hamburgerVisible).toBeTruthy();
  });
});

test.describe('Forms Responsive', () => {
  test('contact form is usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/contact.html');

    // Form should be visible
    await expect(page.locator('form')).toBeVisible();

    // Form inputs should be visible and tappable
    const nameInput = page.locator('input[name="name"], input[id="name"]');
    const emailInput = page.locator('input[name="email"], input[id="email"]');
    const messageInput = page.locator('textarea[name="message"], textarea[id="message"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();

    // Submit button should be visible
    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('campaign download button is usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/campaigns/ai-ceo-brief.html');

    // Download button should be visible (SPEC-014: removed form, added direct download)
    const downloadBtn = page.locator('a[download]');
    await expect(downloadBtn).toBeVisible();

    // Download button should have correct PDF path
    await expect(downloadBtn).toHaveAttribute('href', 'downloads/AI_Transformation_Executive_Brief_Geekbyte.pdf');

    // Button should be clickable on mobile
    await expect(downloadBtn).toHaveClass(/btn-primary/);
  });
});

test.describe('Content Readability', () => {
  for (const viewport of viewports) {
    test(`text is readable at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      // Check main heading font size is reasonable
      const h1 = page.locator('h1').first();
      const fontSize = await h1.evaluate(el => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });

      // Minimum readable font size (14px on mobile, 16px+ on larger screens)
      const minSize = viewport.width < 768 ? 14 : 16;
      expect(fontSize).toBeGreaterThanOrEqual(minSize);

      // Check body text is readable
      const paragraph = page.locator('main p').first();
      const bodyFontSize = await paragraph.evaluate(el => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });

      expect(bodyFontSize).toBeGreaterThanOrEqual(14);
    });
  }
});

test.describe('Images Responsive', () => {
  test('images scale properly on different viewports', async ({ page }) => {
    await page.goto('/');

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Get all images on the page
      const images = await page.locator('img').all();

      for (const img of images) {
        // Check image doesn't overflow its container
        const imgWidth = await img.evaluate(el => el.getBoundingClientRect().width);
        const viewportWidth = await page.evaluate(() => window.innerWidth);

        expect(imgWidth).toBeLessThanOrEqual(viewportWidth);
      }
    }
  });
});
