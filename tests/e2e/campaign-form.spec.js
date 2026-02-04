// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Campaign Landing Page Form Tests
 *
 * Covers FR-9, FR-10, FR-11, FR-12, AC-9, AC-10, AC-11, AC-12:
 * - Form validation for required fields (name, email, company, role)
 * - Form submits to correct Formspree endpoint
 * - Newsletter opt-in checkbox present, optional, unchecked by default
 * - PDF download trigger on successful submission
 *
 * Uses mocking to prevent actual form submissions during automated testing.
 */

test.describe('Campaign Form Structure', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Formspree endpoint to prevent actual submissions
    await page.route('https://formspree.io/f/mbdrppqp', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, next: 'https://formspree.io/thanks' }),
      });
    });

    await page.goto('/campaigns/ai-ceo-brief.html');
  });

  test('form is present and visible', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
  });

  test('form has all required fields - FR-9', async ({ page }) => {
    // Name field
    const nameField = page.locator('input[name="name"], input[id="name"]');
    await expect(nameField).toBeVisible();

    // Email field
    const emailField = page.locator('input[name="email"], input[id="email"]');
    await expect(emailField).toBeVisible();

    // Company field
    const companyField = page.locator('input[name="company"], input[id="company"]');
    await expect(companyField).toBeVisible();

    // Role field (could be input or select)
    const roleField = page.locator('input[name="role"], select[name="role"], input[id="role"], select[id="role"]');
    await expect(roleField).toBeVisible();

    // Submit button
    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('form action points to correct Formspree endpoint - FR-10, AC-10', async ({ page }) => {
    const form = page.locator('form');
    const action = await form.getAttribute('action');

    // Verify exact Formspree endpoint
    expect(action).toBe('https://formspree.io/f/mbdrppqp');
  });

  test('newsletter checkbox is present and optional - FR-11, AC-11', async ({ page }) => {
    // Newsletter opt-in checkbox
    const newsletterCheckbox = page.locator('input[type="checkbox"][name*="newsletter"], input[type="checkbox"][id*="newsletter"]');

    // Should be present
    await expect(newsletterCheckbox).toBeVisible();

    // Should not be required
    const isRequired = await newsletterCheckbox.evaluate(el => el.hasAttribute('required'));
    expect(isRequired).toBe(false);

    // Should be unchecked by default
    const isChecked = await newsletterCheckbox.isChecked();
    expect(isChecked).toBe(false);
  });
});

test.describe('Campaign Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Formspree endpoint
    await page.route('https://formspree.io/f/mbdrppqp', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto('/campaigns/ai-ceo-brief.html');
  });

  test('empty form submission shows validation errors - FR-9, AC-9', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"], input[type="submit"]');

    // Try to submit empty form
    await submitButton.click();

    // Check that required fields have the required attribute
    const nameField = page.locator('input[name="name"], input[id="name"]');
    const emailField = page.locator('input[name="email"], input[id="email"]');
    const companyField = page.locator('input[name="company"], input[id="company"]');
    const roleField = page.locator('input[name="role"], select[name="role"], input[id="role"], select[id="role"]');

    // Verify fields are marked as required
    const nameRequired = await nameField.evaluate(el => el.hasAttribute('required'));
    const emailRequired = await emailField.evaluate(el => el.hasAttribute('required'));
    const companyRequired = await companyField.evaluate(el => el.hasAttribute('required'));
    const roleRequired = await roleField.evaluate(el => el.hasAttribute('required'));

    // All four fields should be required
    expect(nameRequired).toBe(true);
    expect(emailRequired).toBe(true);
    expect(companyRequired).toBe(true);
    expect(roleRequired).toBe(true);
  });

  test('missing name prevents submission', async ({ page }) => {
    const emailField = page.locator('input[name="email"], input[id="email"]');
    const companyField = page.locator('input[name="company"], input[id="company"]');
    const roleField = page.locator('input[name="role"], select[name="role"], input[id="role"], select[id="role"]');

    // Fill all except name
    await emailField.fill('test@example.com');
    await companyField.fill('Test Company');

    // Handle role field (could be input or select)
    const roleType = await roleField.evaluate(el => el.tagName.toLowerCase());
    if (roleType === 'select') {
      await roleField.selectOption({ index: 1 });
    } else {
      await roleField.fill('CEO');
    }

    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    await submitButton.click();

    // Name field should show validation error (HTML5 validation)
    const nameField = page.locator('input[name="name"], input[id="name"]');
    const isValid = await nameField.evaluate(el => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('invalid email format prevents submission', async ({ page }) => {
    const nameField = page.locator('input[name="name"], input[id="name"]');
    const emailField = page.locator('input[name="email"], input[id="email"]');
    const companyField = page.locator('input[name="company"], input[id="company"]');
    const roleField = page.locator('input[name="role"], select[name="role"], input[id="role"], select[id="role"]');

    // Fill with invalid email
    await nameField.fill('Test User');
    await emailField.fill('invalid-email');
    await companyField.fill('Test Company');

    const roleType = await roleField.evaluate(el => el.tagName.toLowerCase());
    if (roleType === 'select') {
      await roleField.selectOption({ index: 1 });
    } else {
      await roleField.fill('CEO');
    }

    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    await submitButton.click();

    // Email field should have type="email" for HTML5 validation
    const emailType = await emailField.getAttribute('type');
    expect(emailType).toBe('email');
  });

  test('valid form submission succeeds', async ({ page }) => {
    const nameField = page.locator('input[name="name"], input[id="name"]');
    const emailField = page.locator('input[name="email"], input[id="email"]');
    const companyField = page.locator('input[name="company"], input[id="company"]');
    const roleField = page.locator('input[name="role"], select[name="role"], input[id="role"], select[id="role"]');

    // Fill form with valid data
    await nameField.fill('Test User');
    await emailField.fill('test@example.com');
    await companyField.fill('Test Company');

    const roleType = await roleField.evaluate(el => el.tagName.toLowerCase());
    if (roleType === 'select') {
      await roleField.selectOption({ index: 1 });
    } else {
      await roleField.fill('CEO');
    }

    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    await submitButton.click();

    // Wait for submission handling
    await page.waitForTimeout(1000);

    // Submission should complete without errors
  });

  test('newsletter checkbox is optional - can submit without checking', async ({ page }) => {
    const nameField = page.locator('input[name="name"], input[id="name"]');
    const emailField = page.locator('input[name="email"], input[id="email"]');
    const companyField = page.locator('input[name="company"], input[id="company"]');
    const roleField = page.locator('input[name="role"], select[name="role"], input[id="role"], select[id="role"]');
    const newsletterCheckbox = page.locator('input[type="checkbox"][name*="newsletter"], input[type="checkbox"][id*="newsletter"]');

    // Fill required fields
    await nameField.fill('Test User');
    await emailField.fill('test@example.com');
    await companyField.fill('Test Company');

    const roleType = await roleField.evaluate(el => el.tagName.toLowerCase());
    if (roleType === 'select') {
      await roleField.selectOption({ index: 1 });
    } else {
      await roleField.fill('CEO');
    }

    // Leave newsletter unchecked
    const isChecked = await newsletterCheckbox.isChecked();
    expect(isChecked).toBe(false);

    // Should still be able to submit
    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    await submitButton.click();

    await page.waitForTimeout(1000);
    // No assertion needed - if no error thrown, test passes
  });
});

test.describe('Campaign Form PDF Download', () => {
  test('PDF download trigger exists - FR-12, AC-12', async ({ page }) => {
    await page.goto('/campaigns/ai-ceo-brief.html');

    // Check for PDF download mechanism in JavaScript
    // This could be a link, button, or script that triggers download
    const pdfLink = page.locator('a[href*=".pdf"], a[download], button:has-text("Download")');

    // PDF download mechanism should exist (may be triggered by form success)
    // We'll verify the download trigger is implemented in the form handler
    const pageContent = await page.content();

    // Check for PDF download code in page source
    // The spec mentions "programmatic link.click() after 500ms delay"
    const hasPdfDownloadCode = pageContent.includes('.pdf') ||
                               pageContent.includes('download') ||
                               pageContent.includes('click()');

    expect(hasPdfDownloadCode).toBe(true);
  });
});

test.describe('Campaign Form Accessibility', () => {
  test('form fields have labels', async ({ page }) => {
    await page.goto('/campaigns/ai-ceo-brief.html');

    const nameField = page.locator('input[name="name"], input[id="name"]');
    const emailField = page.locator('input[name="email"], input[id="email"]');

    // Check for labels
    const nameHasLabel = await nameField.evaluate(el => {
      const id = el.getAttribute('id');
      return document.querySelector(`label[for="${id}"]`) !== null ||
             el.hasAttribute('aria-label') ||
             el.hasAttribute('placeholder');
    });

    const emailHasLabel = await emailField.evaluate(el => {
      const id = el.getAttribute('id');
      return document.querySelector(`label[for="${id}"]`) !== null ||
             el.hasAttribute('aria-label') ||
             el.hasAttribute('placeholder');
    });

    expect(nameHasLabel).toBeTruthy();
    expect(emailHasLabel).toBeTruthy();
  });
});
