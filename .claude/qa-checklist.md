# QA Checklist for Geekbyte Website

## Pre-Commit Checks

### Test Coverage Impact
- [ ] Identify test files covering modified/removed features
- [ ] Update or remove affected test files
- [ ] Verify no orphaned test fixtures or mocks
- [ ] Run full test suite locally before pushing (`npm test`)

### Forms
- [ ] Test form submission on local/staging environment
- [ ] Verify third-party service URLs match documented format (e.g., Formspree)
- [ ] Confirm form data is actually received (check email/dashboard)
- [ ] Test validation messages (required fields, email format)
- [ ] Test error handling (network failure, service down)

### Links
- [ ] All internal links resolve correctly
- [ ] External links have `target="_blank"` and `rel="noopener noreferrer"`
- [ ] LinkedIn URLs are correct (personal vs company)
- [ ] No broken anchor links

### Assets
- [ ] No double file extensions (e.g., `.jpg.jpg`)
- [ ] Images load correctly
- [ ] Favicon displays

### Accessibility
- [ ] Skip link works
- [ ] Hamburger menu has ARIA attributes
- [ ] Form labels are associated with inputs
- [ ] Color contrast meets WCAG AA

### Security
- [ ] CSP header allows all required resources
- [ ] No sensitive data in frontend code
- [ ] External services are allowlisted in CSP `connect-src`

## Post-Deploy Checks

### Critical Path Testing
1. [ ] Load homepage - verify no console errors
2. [ ] Navigate to all pages via menu
3. [ ] Submit contact form with test data
4. [ ] Verify form submission received
5. [ ] Test on mobile (hamburger menu)

### Third-Party Integrations
- [ ] Formspree: Submit test, confirm email received
- [ ] Google Fonts: Verify fonts load
- [ ] CalendarBridge: Test booking link

## Form Change Specific

When modifying contact forms:
1. Check service documentation for correct URL format
2. Test submission locally if possible
3. After deploy, submit a real test message
4. Verify you receive the submission before marking complete
