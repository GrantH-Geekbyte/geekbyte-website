// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Page Load Tests
 *
 * Covers FR-2, AC-2: Verify all existing pages load without errors (HTTP 200)
 *
 * Tests that every page in the site loads successfully and contains
 * expected structural elements.
 */

// All pages that must exist and load successfully
const pages = [
  { path: '/', title: /GeekByte|Home/ },
  { path: '/about.html', title: /About/ },
  { path: '/contact.html', title: /Contact/ },
  { path: '/services/fractional-cto.html', title: /Fractional CTO/ },
  { path: '/services/board-advisory.html', title: /Board Advisory/ },
  { path: '/services/growth-advisory.html', title: /Growth Advisory/ },
  { path: '/campaigns/ai-ceo-brief.html', title: /AI.*CEO|Fighter Jet/ },
];

test.describe('Page Loading', () => {
  for (const pageInfo of pages) {
    test(`${pageInfo.path} loads successfully`, async ({ page }) => {
      const response = await page.goto(pageInfo.path);

      // Verify successful response
      expect(response?.status()).toBe(200);

      // Verify page title matches expected pattern
      await expect(page).toHaveTitle(pageInfo.title);
    });
  }
});

test.describe('Page Structure', () => {
  for (const pageInfo of pages) {
    test(`${pageInfo.path} has required structural elements`, async ({ page }) => {
      await page.goto(pageInfo.path);

      // Every page should have header, main, and footer
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();

      // Every page should have navigation
      await expect(page.locator('nav')).toBeVisible();

      // Every page should have a heading
      await expect(page.locator('h1')).toBeVisible();
    });
  }
});

test.describe('Homepage Specific', () => {
  test('homepage has hero section', async ({ page }) => {
    await page.goto('/');

    // Hero section should be visible
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();

    // Should have a prominent CTA
    const cta = page.locator('a:has-text("Contact"), a:has-text("Get Started"), a:has-text("Schedule")').first();
    await expect(cta).toBeVisible();
  });

  test('homepage lists services', async ({ page }) => {
    await page.goto('/');

    // Should mention the three core services
    await expect(page.locator('text=/Fractional CTO/i')).toBeVisible();
    await expect(page.locator('text=/Board Advisory/i')).toBeVisible();
    await expect(page.locator('text=/Growth/i')).toBeVisible();
  });
});

test.describe('Service Pages', () => {
  const servicePages = [
    '/services/fractional-cto.html',
    '/services/board-advisory.html',
    '/services/growth-advisory.html',
  ];

  for (const servicePage of servicePages) {
    test(`${servicePage} has service description`, async ({ page }) => {
      await page.goto(servicePage);

      // Should have multiple paragraphs of content
      const paragraphs = await page.locator('main p').count();
      expect(paragraphs).toBeGreaterThan(2);

      // Should have some kind of CTA
      const cta = page.locator('main a[href*="contact"], main a:has-text("Contact"), main a:has-text("Schedule")');
      await expect(cta.first()).toBeVisible();
    });
  }
});

test.describe('About Page', () => {
  test('about page has content about GeekByte', async ({ page }) => {
    await page.goto('/about.html');

    // Should mention GeekByte or Grant Howe
    await expect(page.locator('text=/GeekByte/i')).toBeVisible();
  });
});

test.describe('Contact Page', () => {
  test('contact page has a form', async ({ page }) => {
    await page.goto('/contact.html');

    // Should have a contact form
    await expect(page.locator('form')).toBeVisible();

    // Should have name, email, and message fields
    await expect(page.locator('input[name="name"], input[id="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"], input[id="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"], textarea[id="message"]')).toBeVisible();
  });
});

test.describe('Campaign Landing Page', () => {
  test('campaign page has form and content', async ({ page }) => {
    await page.goto('/campaigns/ai-ceo-brief.html');

    // Should have a form
    await expect(page.locator('form')).toBeVisible();

    // Should have compelling content
    const headings = await page.locator('h1, h2').count();
    expect(headings).toBeGreaterThan(0);
  });
});
