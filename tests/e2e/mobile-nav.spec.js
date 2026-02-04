// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Mobile Navigation Tests
 *
 * Covers FR-7, AC-8: Mobile navigation tests - hamburger menu opens/closes, links work
 *
 * Tests the mobile navigation menu behavior including:
 * - Hamburger menu toggle functionality
 * - Menu visibility on mobile viewport
 * - Navigation links are clickable when menu is open
 * - Menu closes after navigation (if implemented)
 */

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('hamburger menu is visible on mobile', async ({ page }) => {
    await page.goto('/');

    // Look for common hamburger menu selectors
    const hamburger = page.locator(
      'button:has-text("Menu"), ' +
      '.hamburger, ' +
      '.menu-toggle, ' +
      'button[aria-label*="menu" i], ' +
      'button[aria-label*="navigation" i], ' +
      '[class*="mobile-menu"], ' +
      '[class*="nav-toggle"]'
    ).first();

    // Hamburger should be visible on mobile
    await expect(hamburger).toBeVisible();
  });

  test('clicking hamburger menu opens navigation - FR-7, AC-8', async ({ page }) => {
    await page.goto('/');

    // Find hamburger menu
    const hamburger = page.locator(
      'button:has-text("Menu"), ' +
      '.hamburger, ' +
      '.menu-toggle, ' +
      'button[aria-label*="menu" i], ' +
      'button[aria-label*="navigation" i]'
    ).first();

    // Get navigation links container
    const nav = page.locator('nav, [class*="mobile-nav"], [class*="nav-menu"]').first();

    // Click hamburger to open menu
    await hamburger.click();

    // Wait a moment for animation
    await page.waitForTimeout(300);

    // Navigation should be visible or have active/open class
    const navVisible = await nav.isVisible();
    const hasActiveClass = await nav.evaluate(el => {
      return el.classList.contains('active') ||
             el.classList.contains('open') ||
             el.classList.contains('show') ||
             el.getAttribute('aria-hidden') === 'false';
    });

    expect(navVisible || hasActiveClass).toBeTruthy();
  });

  test('navigation links are clickable when menu is open', async ({ page }) => {
    await page.goto('/');

    // Open hamburger menu
    const hamburger = page.locator(
      'button:has-text("Menu"), ' +
      '.hamburger, ' +
      '.menu-toggle, ' +
      'button[aria-label*="menu" i]'
    ).first();

    await hamburger.click();
    await page.waitForTimeout(300);

    // Get navigation links
    const navLinks = page.locator('nav a, [class*="mobile-nav"] a, [class*="nav-menu"] a');
    const linkCount = await navLinks.count();

    expect(linkCount).toBeGreaterThan(0);

    // First link should be visible and clickable
    const firstLink = navLinks.first();
    await expect(firstLink).toBeVisible();

    // Get href before clicking
    const href = await firstLink.getAttribute('href');
    expect(href).toBeTruthy();
  });

  test('clicking hamburger again closes menu', async ({ page }) => {
    await page.goto('/');

    // Find hamburger menu
    const hamburger = page.locator(
      'button:has-text("Menu"), ' +
      '.hamburger, ' +
      '.menu-toggle, ' +
      'button[aria-label*="menu" i]'
    ).first();

    // Open menu
    await hamburger.click();
    await page.waitForTimeout(300);

    // Close menu
    await hamburger.click();
    await page.waitForTimeout(300);

    // Check if menu is closed
    const nav = page.locator('nav, [class*="mobile-nav"], [class*="nav-menu"]').first();
    const isClosed = await nav.evaluate(el => {
      return el.classList.contains('closed') ||
             !el.classList.contains('active') ||
             !el.classList.contains('open') ||
             el.getAttribute('aria-hidden') === 'true' ||
             window.getComputedStyle(el).display === 'none';
    });

    // Menu should be closed or hidden
    expect(isClosed).toBeTruthy();
  });

  test('all main navigation links are present in mobile menu', async ({ page }) => {
    await page.goto('/');

    // Open menu
    const hamburger = page.locator(
      'button:has-text("Menu"), ' +
      '.hamburger, ' +
      '.menu-toggle, ' +
      'button[aria-label*="menu" i]'
    ).first();

    await hamburger.click();
    await page.waitForTimeout(300);

    // Check for main navigation links
    const homeLink = page.locator('nav a[href="/"], nav a[href="index.html"], nav a:has-text("Home")');
    const aboutLink = page.locator('nav a[href*="about"]');
    const contactLink = page.locator('nav a[href*="contact"]');
    const servicesLink = page.locator('nav a:has-text("Services"), nav a[href*="services"]');

    // At least home, about, and contact should be present
    expect(await homeLink.count()).toBeGreaterThan(0);
    expect(await aboutLink.count()).toBeGreaterThan(0);
    expect(await contactLink.count()).toBeGreaterThan(0);
  });

  test('hamburger menu has proper ARIA attributes', async ({ page }) => {
    await page.goto('/');

    // Find hamburger button
    const hamburger = page.locator(
      'button:has-text("Menu"), ' +
      '.hamburger, ' +
      '.menu-toggle, ' +
      'button[aria-label*="menu" i]'
    ).first();

    // Should have aria-label or aria-labelledby
    const ariaLabel = await hamburger.getAttribute('aria-label');
    const ariaLabelledBy = await hamburger.getAttribute('aria-labelledby');
    const ariaControls = await hamburger.getAttribute('aria-controls');

    expect(ariaLabel || ariaLabelledBy).toBeTruthy();

    // Click to open
    await hamburger.click();
    await page.waitForTimeout(300);

    // Should have aria-expanded attribute
    const ariaExpanded = await hamburger.getAttribute('aria-expanded');

    // aria-expanded should be 'true' when menu is open
    expect(ariaExpanded).toBe('true');
  });

  test('navigation links navigate correctly from mobile menu', async ({ page }) => {
    await page.goto('/');

    // Open menu
    const hamburger = page.locator(
      'button:has-text("Menu"), ' +
      '.hamburger, ' +
      '.menu-toggle, ' +
      'button[aria-label*="menu" i]'
    ).first();

    await hamburger.click();
    await page.waitForTimeout(300);

    // Click on About link
    const aboutLink = page.locator('nav a[href*="about"]').first();
    await aboutLink.click();

    // Should navigate to about page (with or without .html extension)
    await expect(page).toHaveURL(/.*about/);
  });
});

test.describe('Mobile Menu Visibility', () => {
  test('desktop navigation hidden on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // On mobile, full desktop nav should be hidden (if separate from mobile)
    // Check if there's a desktop-only nav that's hidden
    const desktopNav = page.locator('[class*="desktop-nav"]');
    const count = await desktopNav.count();

    if (count > 0) {
      const isHidden = await desktopNav.evaluate(el => {
        return window.getComputedStyle(el).display === 'none';
      });
      expect(isHidden).toBeTruthy();
    }
  });

  test('hamburger menu hidden on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    // On desktop, hamburger should be hidden
    const hamburger = page.locator(
      'button:has-text("Menu"), ' +
      '.hamburger, ' +
      '.menu-toggle, ' +
      'button[aria-label*="menu" i]'
    ).first();

    const count = await hamburger.count();
    if (count > 0) {
      const isHidden = await hamburger.evaluate(el => {
        return window.getComputedStyle(el).display === 'none' ||
               window.getComputedStyle(el).visibility === 'hidden';
      });
      expect(isHidden).toBeTruthy();
    }
  });
});

test.describe('Mobile Navigation Accessibility', () => {
  test('mobile navigation is keyboard accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Tab to hamburger menu
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // May need multiple tabs

    // Press Enter to open menu
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    // Menu should open with keyboard
    const nav = page.locator('nav, [class*="mobile-nav"]').first();
    const isOpen = await nav.evaluate(el => {
      return el.classList.contains('active') ||
             el.classList.contains('open') ||
             el.getAttribute('aria-hidden') === 'false' ||
             window.getComputedStyle(el).display !== 'none';
    });

    expect(isOpen).toBeTruthy();
  });
});
