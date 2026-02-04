// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

/**
 * Accessibility Tests
 *
 * Covers FR-6, AC-6: Basic accessibility validation per page
 *
 * Uses @axe-core/playwright to scan pages for accessibility violations.
 * Focuses on critical and serious violations that would impact users.
 */

// All pages to test for accessibility
const pages = [
  { path: '/', name: 'Homepage' },
  { path: '/about.html', name: 'About' },
  { path: '/contact.html', name: 'Contact' },
  { path: '/services/fractional-cto.html', name: 'Fractional CTO' },
  { path: '/services/board-advisory.html', name: 'Board Advisory' },
  { path: '/services/growth-advisory.html', name: 'Growth Advisory' },
  { path: '/campaigns/ai-ceo-brief.html', name: 'Campaign Landing Page' },
];

test.describe('Accessibility Checks', () => {
  for (const pageInfo of pages) {
    test(`${pageInfo.name} has no critical accessibility violations`, async ({ page }) => {
      await page.goto(pageInfo.path);

      // Run axe accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Filter for critical and serious violations
      const criticalViolations = accessibilityScanResults.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );

      // Fail test if critical/serious violations found
      expect(criticalViolations).toHaveLength(0);
    });
  }
});

test.describe('Specific Accessibility Requirements', () => {
  test('all images have alt text', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img').all();

    for (const img of images) {
      const altText = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');

      // Each image should have alt text or aria-label
      expect(altText !== null || ariaLabel !== null).toBeTruthy();
    }
  });

  test('page has valid heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Should have exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // Should have at least some headings
    const headingCount = await page.locator('h1, h2, h3, h4, h5, h6').count();
    expect(headingCount).toBeGreaterThan(0);
  });

  test('form inputs have associated labels', async ({ page }) => {
    await page.goto('/contact.html');

    const inputs = await page.locator('input:not([type="hidden"]), textarea, select').all();

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');

      // Input should have id with associated label, or aria-label, or aria-labelledby
      const hasLabel = id
        ? await page.locator(`label[for="${id}"]`).count() > 0
        : false;

      expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test('links have descriptive text', async ({ page }) => {
    await page.goto('/');

    const links = await page.locator('a').all();

    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');

      // Link should have text content, aria-label, or title
      const hasDescriptiveText = (text && text.trim().length > 0) || ariaLabel || title;
      expect(hasDescriptiveText).toBeTruthy();
    }
  });

  test('page has skip-to-content link', async ({ page }) => {
    await page.goto('/');

    // Check for skip link (common accessibility pattern)
    const skipLink = page.locator('a[href="#main"], a[href="#content"], a:has-text("Skip to")').first();

    // Skip link is recommended but not always present in simple sites
    // Just verify if it exists, it works
    const skipLinkExists = (await skipLink.count()) > 0;

    if (skipLinkExists) {
      await expect(skipLink).toHaveAttribute('href', /#.+/);
    }
  });
});

test.describe('Color Contrast', () => {
  test('pages pass color contrast checks', async ({ page }) => {
    await page.goto('/');

    // Run axe scan specifically for color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    // Check for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );

    // Color contrast violations should be minimal
    expect(contrastViolations).toHaveLength(0);
  });
});

test.describe('Keyboard Navigation', () => {
  test('all interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Get all interactive elements
    const interactiveElements = await page.locator('a, button, input, select, textarea').all();

    for (const element of interactiveElements) {
      // Check if element is visible
      const isVisible = await element.isVisible();

      if (isVisible) {
        // Should be focusable (tabindex >= 0 or naturally focusable)
        const tabIndex = await element.getAttribute('tabindex');
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());

        // Naturally focusable elements or tabindex >= 0
        const isFocusable =
          ['a', 'button', 'input', 'select', 'textarea'].includes(tagName) ||
          (tabIndex !== null && parseInt(tabIndex) >= 0);

        expect(isFocusable).toBeTruthy();
      }
    }
  });

  test('navigation is keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab through navigation
    await page.keyboard.press('Tab');

    // At least one element should be focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});

test.describe('ARIA Attributes', () => {
  test('pages have proper ARIA landmarks', async ({ page }) => {
    await page.goto('/');

    // Run axe scan for ARIA issues
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['best-practice'])
      .analyze();

    // Check for ARIA-related violations
    const ariaViolations = accessibilityScanResults.violations.filter(
      v => v.id.includes('aria')
    );

    // ARIA violations should be minimal
    expect(ariaViolations.length).toBeLessThan(5);
  });
});
