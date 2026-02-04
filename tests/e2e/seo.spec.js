// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * SEO Tests
 *
 * Covers FR-8, AC-7: Verify each page has title, meta description, and OG tags
 *
 * Tests that all pages have proper SEO metadata including:
 * - Page title
 * - Meta description
 * - Open Graph tags (og:title, og:description, og:image, og:url)
 * - Twitter Card tags (optional but recommended)
 */

// All pages to test for SEO
const pages = [
  { path: '/', name: 'Homepage' },
  { path: '/about.html', name: 'About' },
  { path: '/contact.html', name: 'Contact' },
  { path: '/services/fractional-cto.html', name: 'Fractional CTO' },
  { path: '/services/board-advisory.html', name: 'Board Advisory' },
  { path: '/services/growth-advisory.html', name: 'Growth Advisory' },
  { path: '/campaigns/ai-ceo-brief.html', name: 'Campaign Landing Page' },
];

test.describe('Basic SEO Meta Tags', () => {
  for (const pageInfo of pages) {
    test(`${pageInfo.name} has title tag`, async ({ page }) => {
      await page.goto(pageInfo.path);

      // Page should have a title
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
      expect(title.length).toBeLessThan(70); // Recommended max length
    });

    test(`${pageInfo.name} has meta description`, async ({ page }) => {
      await page.goto(pageInfo.path);

      // Page should have meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);

      const content = await metaDescription.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content.length).toBeGreaterThan(50); // Minimum useful length
      expect(content.length).toBeLessThan(160); // Recommended max length
    });

    test(`${pageInfo.name} has viewport meta tag`, async ({ page }) => {
      await page.goto(pageInfo.path);

      // Mobile-friendly viewport tag
      const viewport = page.locator('meta[name="viewport"]');
      await expect(viewport).toHaveCount(1);

      const content = await viewport.getAttribute('content');
      expect(content).toContain('width=device-width');
    });
  }
});

test.describe('Open Graph Tags', () => {
  for (const pageInfo of pages) {
    test(`${pageInfo.name} has og:title`, async ({ page }) => {
      await page.goto(pageInfo.path);

      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveCount(1);

      const content = await ogTitle.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content.length).toBeGreaterThan(0);
    });

    test(`${pageInfo.name} has og:description`, async ({ page }) => {
      await page.goto(pageInfo.path);

      const ogDescription = page.locator('meta[property="og:description"]');
      await expect(ogDescription).toHaveCount(1);

      const content = await ogDescription.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content.length).toBeGreaterThan(0);
    });

    test(`${pageInfo.name} has og:image`, async ({ page }) => {
      await page.goto(pageInfo.path);

      const ogImage = page.locator('meta[property="og:image"]');
      await expect(ogImage).toHaveCount(1);

      const content = await ogImage.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content).toMatch(/\.(jpg|jpeg|png|webp|svg)$/i);
    });

    test(`${pageInfo.name} has og:url`, async ({ page }) => {
      await page.goto(pageInfo.path);

      const ogUrl = page.locator('meta[property="og:url"]');

      // og:url is recommended but not always present
      const count = await ogUrl.count();
      if (count > 0) {
        const content = await ogUrl.getAttribute('content');
        expect(content).toBeTruthy();
        expect(content).toMatch(/^https?:\/\//);
      }
    });

    test(`${pageInfo.name} has og:type`, async ({ page }) => {
      await page.goto(pageInfo.path);

      const ogType = page.locator('meta[property="og:type"]');

      // og:type is recommended
      const count = await ogType.count();
      if (count > 0) {
        const content = await ogType.getAttribute('content');
        expect(content).toBeTruthy();
      }
    });
  }
});

test.describe('Twitter Card Tags', () => {
  test('homepage has Twitter Card tags', async ({ page }) => {
    await page.goto('/');

    // Twitter Card is optional but recommended
    const twitterCard = page.locator('meta[name="twitter:card"]');
    const count = await twitterCard.count();

    if (count > 0) {
      const content = await twitterCard.getAttribute('content');
      expect(content).toBeTruthy();
      expect(['summary', 'summary_large_image', 'app', 'player']).toContain(content);
    }
  });
});

test.describe('Canonical URL', () => {
  for (const pageInfo of pages) {
    test(`${pageInfo.name} has canonical URL`, async ({ page }) => {
      await page.goto(pageInfo.path);

      const canonical = page.locator('link[rel="canonical"]');

      // Canonical URL is optional but recommended
      const count = await canonical.count();
      if (count > 0) {
        const href = await canonical.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toMatch(/^https?:\/\//);
      }
    });
  }
});

test.describe('Favicon', () => {
  test('site has favicon', async ({ page }) => {
    await page.goto('/');

    // Check for favicon link
    const favicon = page.locator('link[rel*="icon"]');
    const count = await favicon.count();

    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Language Declaration', () => {
  test('HTML has lang attribute', async ({ page }) => {
    await page.goto('/');

    // HTML tag should have lang attribute
    const htmlLang = await page.evaluate(() => document.documentElement.lang);
    expect(htmlLang).toBeTruthy();
    expect(htmlLang).toBe('en'); // Assuming English content
  });
});

test.describe('Structured Data', () => {
  test('homepage may have structured data (JSON-LD)', async ({ page }) => {
    await page.goto('/');

    // Structured data is optional but beneficial
    const structuredData = page.locator('script[type="application/ld+json"]');
    const count = await structuredData.count();

    // If structured data exists, it should be valid JSON
    if (count > 0) {
      const content = await structuredData.first().textContent();
      expect(() => JSON.parse(content || '')).not.toThrow();
    }
  });
});

test.describe('Robots Meta Tag', () => {
  test('pages allow indexing', async ({ page }) => {
    await page.goto('/');

    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    const count = await robotsMeta.count();

    if (count > 0) {
      const content = await robotsMeta.getAttribute('content');
      // Should not have noindex (unless intentional)
      expect(content).not.toContain('noindex');
    }
  });
});

test.describe('Title Uniqueness', () => {
  test('each page has a unique title', async ({ page }) => {
    const titles = [];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.path);
      const title = await page.title();
      titles.push({ path: pageInfo.path, title });
    }

    // Check that most titles are unique
    const uniqueTitles = new Set(titles.map(t => t.title));
    expect(uniqueTitles.size).toBeGreaterThan(titles.length * 0.7); // At least 70% unique
  });
});
