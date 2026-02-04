# Feature Specification

spec_id: SPEC-002
title: Add Playwright Test Framework
version: 1.4
status: deployed
complexity_tier: standard
last_updated: 2026-02-04

## Business Context

requester: Grant Howe, Managing Partner
business_goal: Establish automated testing infrastructure for the GeekByte website.
  The site currently has no automated tests — all verification is manual. As the site
  grows toward an AI agent product with subscriptions, automated testing becomes
  essential. Starting now with the static site means the framework is in place and
  patterns are established before complexity increases.
success_metrics:
  - Playwright installed and configured in the project
  - Baseline test suite covering all existing pages
  - Tests run reliably from command line
  - Test patterns established that scale as the site evolves
priority: P2 (foundational infrastructure — not blocking but high value)

## Requirements

### Functional Requirements

- [FR-1]: Playwright installed and configured for the project
- [FR-2]: Test suite covering all existing pages:
  - index.html (Home)
  - about.html (About)
  - contact.html (Contact)
  - services/fractional-cto.html
  - services/board-advisory.html
  - services/growth-advisory.html
  - campaigns/ai-ceo-brief.html (Campaign landing page)
- [FR-3]: Navigation tests — every nav link resolves from every page (no 404s)
- [FR-4]: Responsive tests — pages render correctly at desktop (1280px),
  tablet (768px), and mobile (375px) viewports
- [FR-5]: Contact form validation tests — form rejects invalid input,
  accepts valid input
- [FR-6]: Accessibility checks — basic a11y validation per page
- [FR-7]: Mobile navigation tests — hamburger menu opens/closes, links work
- [FR-8]: SEO checks — each page has title, meta description, OG tags
- [FR-9]: Campaign page form tests — form validation for required fields (name, email, company, role)
- [FR-10]: Campaign page form integration — form submits to Formspree endpoint (action URL correct)
- [FR-11]: Campaign page features — newsletter opt-in checkbox present and optional (not required)
- [FR-12]: Campaign page PDF download — verify PDF download trigger on form submission (link.click() event)

### Non-Functional Requirements

- [NFR-1]: Tests complete in under 60 seconds total
- [NFR-2]: Tests runnable with a single command (e.g., `npx playwright test`)
- [NFR-3]: Clear, readable test output — failures identify what broke and where
- [NFR-4]: Tests configurable to run against both local server (localhost) and live
  site (https://geekbyte.biz) via baseURL configuration parameter
- [NFR-5]: Test structure supports easy addition of new tests as pages/features are added

## Acceptance Criteria

- [AC-1]: Given a developer at the command line, when they run `npx playwright test`,
  then all tests execute and report results
- [AC-2]: Given the test suite, when run against the current site, then every existing
  page loads without errors (HTTP 200)
- [AC-3]: Given the navigation tests, when checking all nav links from all pages,
  then every link resolves (zero 404s)
- [AC-4]: Given the responsive tests, when rendering each page at 1280px, 768px,
  and 375px widths, then no content overflow or broken layouts
- [AC-5]: Given the contact form tests, when submitting empty required fields,
  then validation errors appear
- [AC-6]: Given the a11y tests, when scanning each page, then no critical
  accessibility violations
- [AC-7]: Given the SEO tests, when checking each page, then title, meta description,
  and OG tags are present and non-empty
- [AC-8]: Given the mobile nav tests, when toggling the hamburger menu on mobile
  viewport, then menu opens and all links are clickable
- [AC-9]: Given the campaign page form tests, when submitting the form with missing
  required fields, then validation errors prevent submission
- [AC-10]: Given the campaign page form, when checking the form action attribute,
  then it points to the correct Formspree endpoint (https://formspree.io/f/mbdrppqp)
- [AC-11]: Given the campaign page, when checking the newsletter checkbox, then it
  is present, unchecked by default, and not marked as required
- [AC-12]: Given the campaign page form, when form submission is successful, then the
  PDF download trigger executes (programmatic link.click() after 500ms delay)

## Scope

### In Scope
- Playwright installation and configuration (playwright.config.ts or .js)
- package.json setup (or update if exists) with test scripts
- Test directory structure (e.g., tests/ or e2e/)
- Baseline test suite covering FR-2 through FR-8
- Local server setup for testing (e.g., simple static file server)
- .gitignore updates for Playwright artifacts (test-results/, playwright-report/)
- README or docs update with test running instructions

### Out of Scope
- CI/CD integration (separate future spec — likely Trivial tier once tests exist)
- Visual regression testing / screenshot comparison (future spec)
- Performance/load testing (future spec, likely Complex tier)
- Tests for features that don't exist yet (agent, subscriptions, auth)
- Cross-browser testing beyond Playwright defaults (Chromium, Firefox, WebKit
  are included by default — no additional browser configuration)

## Dependencies

- [DEP-1]: Node.js installed in the development environment (installation included in
  spec if not present — will be verified during implementation)
- [DEP-2]: All pages to be tested must exist (currently satisfied — all pages including
  campaigns/ai-ceo-brief.html are present and functional)
- [DEP-3]: A way to serve static files locally for testing (satisfied via npm package
  `serve` which will be added to package.json)

## Technical Notes

### Suggested Project Structure
```
tests/
  e2e/
    navigation.spec.js       # Nav links resolve from all pages
    pages.spec.js             # Each page loads, has correct content structure
    responsive.spec.js        # Viewport tests at 3 breakpoints
    contact-form.spec.js      # Contact form validation
    campaign-form.spec.js     # Campaign landing page form (Formspree, newsletter checkbox)
    accessibility.spec.js     # a11y checks (consider @axe-core/playwright)
    seo.spec.js               # Meta tags, OG tags, titles
    mobile-nav.spec.js        # Hamburger menu behavior
playwright.config.js          # Playwright configuration
package.json                  # Dependencies and test scripts
```

### Key Decisions for Architecture Gate
- **Test runner config:** Playwright config with baseURL pointing to local server
- **A11y tooling:** @axe-core/playwright for accessibility checks, or Playwright's
  built-in accessibility tree assertions
- **Local server:** How to serve static files for tests — simplest option is
  `npx serve .` or a Playwright fixture that starts a server
- **JavaScript vs TypeScript:** Tests in JS to match the project's current stack,
  or TS for better IDE support? Recommend JS for consistency.

## Tier Justification

rationale: Standard tier. This adds a new development dependency (Node.js/Playwright)
  and a test directory, but follows well-established patterns. No impact on production
  code or architecture. No new code paths in the site itself. The framework is standard
  and well-documented.
escalation_triggers_checked:
  - Authentication/authorization: No
  - Payment/financial data: No
  - PII/PHI handling: No
  - New external integration: No (Playwright is a dev dependency only)
  - Database schema change: No
  - Core domain model: No
  - New architectural pattern: No — testing infrastructure, not production architecture

---

## Gate Log

| Gate | Reviewer | Date | Decision | Evidence |
|------|----------|------|----------|----------|
| Spec | Grant Howe (Claude) | 2026-02-04 | APPROVED | Requirements complete (12 FR, 5 NFR), AC testable (12), scope clear, tier appropriate, clarifications resolved: Node.js install if needed, support local+live execution, PDF download test added |
| Architecture | Grant Howe (Claude - Plan) | 2026-02-04 | APPROVED | Standard tier validated, all 5 conditions acknowledged: (1) Node.js dev-only, (2) localhost full tests + live smoke tests, (3) test maintenance accepted, (4) form mocking, (5) baseline execution acknowledged. Checklist: ARCH-SPEC-002.md |
| QA | Grant Howe | 2026-02-04 | APPROVED | Mobile nav link test fixed (regex updated to accept /about without .html). 149/175 tests pass (85.1%). Core framework working. 26 test calibration issues deferred to SPEC-004. Checklist: QA-SPEC-002.md |
| Deploy | Grant Howe (Claude) | 2026-02-04 | APPROVED | Deployed to production via git push. Commit e0ec41b. Vercel auto-deployment successful. Site verified: Home (200), About (200), Contact (200). Zero production impact (dev dependencies only). Checklist: DEPLOY-SPEC-002.md |

## Effort Comparison

| Stage | AI Time | Human Estimate | Human Breakdown |
|-------|---------|----------------|-----------------|
| **Spec Writing** | 15 min | 2-3 hours | Requirements gathering (45m), research Playwright patterns (30m), write 12 FRs (45m), write 12 ACs in Given/When/Then (30m), scope & dependencies (20m), format (10m) |
| **Architecture Review** | 20 min | 1.5-2 hours | Read spec (20m), evaluate technical approaches (30m), security implications (20m), validate tier (15m), document decisions (20m), create checklist (15m) |
| **Implementation + Test** | 25 min | 8-10 hours | Setup & research (1h), configuration (45m), implement 175 tests across 8 spec files (5-6h), debugging & iteration (1-2h), documentation & QA (45m) |
| **Deployment** | 8 min | 30-45 min | Create deployment checklist (3m), git commit with 17 files (2m), git push to GitHub (1m), Vercel auto-deployment + verification (2m) |
| **Total** | 68 min | 12.5-16.5 hours | **AI Speedup: 11-15x** |

### Assumptions
- **Spec Writing:** PM familiar with testing concepts, has access to existing Playwright documentation
- **Architecture Review:** Senior architect, familiar with project stack and testing infrastructure patterns
- **Implementation:** Mid-level developer (2-4 years experience), familiar with JavaScript and testing concepts but new to Playwright, working in focused blocks with normal context-switching. Includes: setup, config, writing 8 test files (navigation, pages, responsive, contact-form, campaign-form, accessibility, SEO, mobile-nav), debugging baseline failures, documentation
- **Deployment:** DevOps engineer familiar with Vercel and project deployment process
