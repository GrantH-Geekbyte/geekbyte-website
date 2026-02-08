// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Campaign Download Button Tests (SPEC-014)
 *
 * Tests for the CEO Brief campaign page with direct PDF download.
 * Replaced email capture form with direct download button.
 */

test.describe('CEO Brief Campaign - Download Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/campaigns/ai-ceo-brief.html');
  });

  test('download button is present and visible', async ({ page }) => {
    const downloadBtn = page.locator('a[download="AI_Transformation_Executive_Brief_Geekbyte.pdf"]');
    await expect(downloadBtn).toBeVisible();
  });

  test('download button has correct PDF path', async ({ page }) => {
    const downloadBtn = page.locator('a[download]');
    await expect(downloadBtn).toHaveAttribute('href', 'downloads/AI_Transformation_Executive_Brief_Geekbyte.pdf');
  });

  test('download button has correct text', async ({ page }) => {
    const downloadBtn = page.locator('a[download]');
    await expect(downloadBtn).toContainText('Download Now');
  });

  test('download button has correct styling', async ({ page }) => {
    const downloadBtn = page.locator('a[download]');
    await expect(downloadBtn).toHaveClass(/btn-primary/);
  });

  test('page does not contain form elements', async ({ page }) => {
    // Verify form was removed
    const form = page.locator('form#briefForm');
    await expect(form).not.toBeVisible();
  });

  test('page contains simplified copy', async ({ page }) => {
    const formSection = page.locator('.form-section');
    await expect(formSection).toContainText('Just battle-tested insights from 4 PE exits');
  });
});
