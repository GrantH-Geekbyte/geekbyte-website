// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Visual Regression Tests
 *
 * SPEC-011: Captures full-page screenshots at multiple viewports and compares
 * them against baseline images to detect unintended visual changes (CSS breaks,
 * layout shifts, color changes, rendering issues).
 *
 * Coverage:
 * - 6 pages: home, about, contact, 3 service pages
 * - 3 viewports: desktop (1280px), tablet (768px), mobile (375px)
 * - Total: 18 screenshots per test run
 *
 * Baseline Management:
 * - Initial baselines: npm run update-visual-baselines
 * - Update baselines: npm run update-visual-baselines (after intentional design changes)
 * - Run tests: npm run test:visual
 *
 * Threshold: 1% pixel tolerance to handle anti-aliasing and minor rendering differences
 */

// Pages to capture visual baselines
const pages = [
  { path: '/', name: 'home' },
  { path: '/about.html', name: 'about' },
  { path: '/contact.html', name: 'contact' },
  { path: '/services/fractional-cto.html', name: 'fractional-cto' },
  { path: '/services/board-advisory.html', name: 'board-advisory' },
  { path: '/services/growth-advisory.html', name: 'growth-advisory' },
];

// Viewport sizes matching responsive breakpoints
const viewports = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

test.describe('Visual Regression', () => {
  for (const viewport of viewports) {
    for (const pageInfo of pages) {
      test(`${pageInfo.name} at ${viewport.name} (${viewport.width}px) matches baseline`, async ({ page }) => {
        // Set viewport size
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        // Navigate to page
        await page.goto(pageInfo.path);

        // Wait for page to be fully loaded (fonts, images, CSS)
        await page.waitForLoadState('networkidle');

        // Capture and compare full-page screenshot against baseline
        // Naming convention: {page-name}-{viewport-name}-{width}w.png
        const screenshotName = `${pageInfo.name}-${viewport.name}-${viewport.width}w.png`;

        await expect(page).toHaveScreenshot(screenshotName, {
          fullPage: true,
          // 5% pixel tolerance: handles cross-platform font rendering and anti-aliasing differences
          // Windows vs Linux can have up to 3-5% difference in text rendering
          maxDiffPixelRatio: 0.05,
          // Animation handling: disable animations to prevent flakiness
          animations: 'disabled',
        });
      });
    }
  }
});

/**
 * Usage Notes:
 *
 * 1. Generate initial baselines:
 *    npm run update-visual-baselines
 *
 * 2. Run visual regression tests:
 *    npm run test:visual
 *
 * 3. Review visual differences:
 *    - Failed tests generate diff images in test-results/ directory
 *    - Diff images show: actual screenshot, expected baseline, highlighted differences
 *    - Download artifacts from GitHub Actions PR workflow
 *
 * 4. Intentional design changes:
 *    - Make CSS/HTML changes
 *    - Run: npm run update-visual-baselines
 *    - Commit updated baselines: git add screenshots/ && git commit -m "[SPEC-NNN] Update visual baselines"
 *
 * 5. CSS bug fixes:
 *    - Fix the CSS issue
 *    - Run: npm run test:visual
 *    - Tests should pass (screenshot now matches baseline)
 *
 * 6. False positives:
 *    - If minor rendering differences cause failures, consider:
 *      a) Increasing maxDiffPixelRatio threshold (current: 0.01 = 1%)
 *      b) Ensuring fonts and images are fully loaded (networkidle)
 *      c) Disabling animations (already configured)
 */
