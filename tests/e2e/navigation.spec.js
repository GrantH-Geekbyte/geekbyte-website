// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Navigation Tests
 *
 * Covers FR-3, AC-3: Verify all navigation links resolve from every page (no 404s)
 *
 * Tests that every navigation link from every page resolves successfully.
 * This ensures site-wide navigation integrity and catches broken links.
 */

// All pages to test navigation from
const pages = [
  '/',
  '/about.html',
  '/contact.html',
  '/services/fractional-cto.html',
  '/services/board-advisory.html',
  '/services/growth-advisory.html',
  '/campaigns/ai-ceo-brief.html',
];

// Expected navigation links present in the nav bar
const expectedNavLinks = [
  { text: 'Home', href: '/' },
  { text: 'About', href: '/about.html' },
  { text: 'Services', href: '#' }, // Dropdown toggle
  { text: 'Contact', href: '/contact.html' },
];

// Service pages in dropdown
const serviceLinks = [
  { text: 'Fractional CTO', href: '/services/fractional-cto.html' },
  { text: 'Board Advisory', href: '/services/board-advisory.html' },
  { text: 'Growth Advisory', href: '/services/growth-advisory.html' },
];

test.describe('Navigation Links', () => {
  for (const page of pages) {
    test(`all nav links resolve from ${page}`, async ({ page: browserPage }) => {
      // Navigate to the page
      await browserPage.goto(page);

      // Get all links in the navigation
      const navElement = browserPage.locator('nav');
      const links = await navElement.locator('a').all();

      // Verify each link
      for (const link of links) {
        const href = await link.getAttribute('href');

        // Skip anchor links (they don't navigate to a new page)
        if (href?.startsWith('#')) {
          continue;
        }

        // Get absolute URL
        const url = href?.startsWith('http')
          ? href
          : new URL(href || '', browserPage.url()).toString();

        // Check that the link resolves (doesn't 404)
        const response = await browserPage.request.get(url);
        expect(response.status(), `Link ${href} from ${page} should not 404`).toBeLessThan(400);
      }
    });
  }

  test('navigation contains expected links', async ({ page }) => {
    await page.goto('/');

    // Verify main nav links are present
    for (const link of expectedNavLinks) {
      const locator = page.locator(`nav a:has-text("${link.text}")`);
      await expect(locator).toBeVisible();
    }
  });

  test('service dropdown contains all service pages', async ({ page }) => {
    await page.goto('/');

    // Check for service links (may be in dropdown)
    for (const link of serviceLinks) {
      // Service links might be hidden in dropdown on desktop
      const locator = page.locator(`a[href="${link.href}"]`);
      await expect(locator).toHaveCount(1);
    }
  });

  test('logo links to homepage', async ({ page }) => {
    await page.goto('/about.html');

    // Click logo and verify it navigates to home
    const logo = page.locator('header a[href="/"], header a[href="index.html"], header a img').first();
    await logo.click();

    await expect(page).toHaveURL(/.*\/(index\.html)?$/);
  });
});

test.describe('Footer Links', () => {
  test('footer links resolve', async ({ page }) => {
    await page.goto('/');

    // Get all links in the footer
    const footerElement = page.locator('footer');
    const links = await footerElement.locator('a').all();

    // Should have at least some links in footer
    expect(links.length).toBeGreaterThan(0);

    // Verify each link
    for (const link of links) {
      const href = await link.getAttribute('href');

      // Skip anchor links and external links for now
      if (href?.startsWith('#') || href?.startsWith('http')) {
        continue;
      }

      // Get absolute URL
      const url = new URL(href || '', page.url()).toString();

      // Check that the link resolves
      const response = await page.request.get(url);
      expect(response.status(), `Footer link ${href} should not 404`).toBeLessThan(400);
    }
  });
});
