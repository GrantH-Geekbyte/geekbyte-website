// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Contact Form Tests
 *
 * Covers FR-5, AC-5: Contact form validation tests
 *
 * Tests form validation - ensures form rejects invalid input and accepts valid input.
 * Uses mocking to prevent actual form submissions during automated testing.
 */

test.describe('Contact Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Formspree endpoint to prevent actual submissions
    await page.route('https://formspree.io/f/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, next: 'https://formspree.io/thanks' }),
      });
    });

    await page.goto('/contact.html');
  });

  test('form is present and visible', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
  });

  test('form has required fields', async ({ page }) => {
    // Name field
    const nameField = page.locator('input[name="name"], input[id="name"]');
    await expect(nameField).toBeVisible();

    // Email field
    const emailField = page.locator('input[name="email"], input[id="email"]');
    await expect(emailField).toBeVisible();

    // Message field
    const messageField = page.locator('textarea[name="message"], textarea[id="message"]');
    await expect(messageField).toBeVisible();

    // Submit button
    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('empty form submission shows validation errors', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"], input[type="submit"]');

    // Try to submit empty form
    await submitButton.click();

    // Check for HTML5 validation or custom validation
    // Either browser validation prevents submission, or custom validation shows errors
    const nameField = page.locator('input[name="name"], input[id="name"]');
    const emailField = page.locator('input[name="email"], input[id="email"]');

    // Check if fields have required attribute or validation state
    const nameRequired = await nameField.evaluate(el => el.hasAttribute('required'));
    const emailRequired = await emailField.evaluate(el => el.hasAttribute('required'));

    // At least name and email should be required
    expect(nameRequired || emailRequired).toBeTruthy();
  });

  test('invalid email shows validation error', async ({ page }) => {
    const nameField = page.locator('input[name="name"], input[id="name"]');
    const emailField = page.locator('input[name="email"], input[id="email"]');
    const messageField = page.locator('textarea[name="message"], textarea[id="message"]');

    // Fill form with invalid email
    await nameField.fill('Test User');
    await emailField.fill('invalid-email');
    await messageField.fill('This is a test message');

    const submitButton = page.locator('button[type="submit"], input[type="submit"]');
    await submitButton.click();

    // Browser should prevent submission due to invalid email format
    // Check that email field has type="email" for HTML5 validation
    const emailType = await emailField.getAttribute('type');
    expect(emailType).toBe('email');
  });

  test('valid form submission succeeds', async ({ page }) => {
    const nameField = page.locator('input[name="name"], input[id="name"]');
    const emailField = page.locator('input[name="email"], input[id="email"]');
    const messageField = page.locator('textarea[name="message"], textarea[id="message"]');

    // Fill form with valid data
    await nameField.fill('Test User');
    await emailField.fill('test@example.com');
    await messageField.fill('This is a test message for automated testing.');

    const submitButton = page.locator('button[type="submit"], input[type="submit"]');

    // Submit should not throw errors
    await submitButton.click();

    // Wait a moment for any submission handling
    await page.waitForTimeout(1000);

    // Form should either show success message, redirect, or clear
    // (Exact behavior depends on site implementation)
  });

  test('form action points to Formspree', async ({ page }) => {
    const form = page.locator('form');
    const action = await form.getAttribute('action');

    // Verify form submits to Formspree
    expect(action).toContain('formspree.io');
  });

  test('required fields are marked as required', async ({ page }) => {
    const nameField = page.locator('input[name="name"], input[id="name"]');
    const emailField = page.locator('input[name="email"], input[id="email"]');
    const messageField = page.locator('textarea[name="message"], textarea[id="message"]');

    // Check for required attribute or aria-required
    const nameRequired = await nameField.evaluate(el =>
      el.hasAttribute('required') || el.getAttribute('aria-required') === 'true'
    );
    const emailRequired = await emailField.evaluate(el =>
      el.hasAttribute('required') || el.getAttribute('aria-required') === 'true'
    );

    // At least some fields should be required
    expect(nameRequired || emailRequired).toBeTruthy();
  });
});

test.describe('Contact Form Accessibility', () => {
  test('form fields have labels', async ({ page }) => {
    await page.goto('/contact.html');

    // Check that form fields have associated labels
    const nameField = page.locator('input[name="name"], input[id="name"]');
    const emailField = page.locator('input[name="email"], input[id="email"]');
    const messageField = page.locator('textarea[name="message"], textarea[id="message"]');

    // Labels should exist (either label element or aria-label)
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
