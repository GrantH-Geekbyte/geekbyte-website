# Feature Specification

spec_id: SPEC-015
title: Google Analytics 4 Integration
version: 1.0
status: pending
complexity_tier: standard
last_updated: 2026-02-08

## Business Context

requester: Grant Howe, Managing Partner
business_goal: Implement Google Analytics 4 (GA4) tracking across the GeekByte website to
  understand user behavior, measure marketing effectiveness, and make data-driven decisions
  about content and conversion optimization. Currently, the site has no analytics installed,
  meaning we have zero visibility into traffic sources, user engagement, conversion paths,
  or content performance. GA4 tracking is essential for measuring success of marketing
  campaigns (e.g., AI CEO Brief landing page), understanding which service pages resonate
  with visitors, and identifying drop-off points in the contact form funnel. This data
  will inform future content strategy, CTA optimization, and product roadmap decisions
  as the site evolves toward an AI agent product with subscriptions.
success_metrics:
  - GA4 property created and configured for geekbyte.biz domain
  - Tracking script deployed to all pages (Home, About, Contact, 3 service pages, campaign pages)
  - Page view events firing correctly and visible in GA4 real-time reports
  - Custom events tracking key user interactions (contact form submissions, service page visits,
    CTA clicks, campaign form submissions)
  - Privacy-compliant implementation (cookie consent banner if legally required)
  - Data flowing into GA4 within 24 hours of deployment
priority: P2 (High-value infrastructure — enables data-driven decision making, not blocking current operations)

## Requirements

### Functional Requirements

- [FR-1]: Create Google Analytics 4 property for geekbyte.biz domain
  - Property name: "GeekByte Website"
  - Data stream: Web stream for https://geekbyte.biz
  - Measurement ID format: G-XXXXXXXXXX (provided by GA4 during setup)

- [FR-2]: Add GA4 gtag.js tracking script to all HTML pages
  - Pages: index.html, about.html, contact.html, services/fractional-cto.html,
    services/board-advisory.html, services/growth-advisory.html, campaigns/ai-ceo-brief.html,
    and any future pages added
  - Script placement: In <head> section, immediately after opening <head> tag (for earliest
    possible tracking initialization)
  - Script structure: Google's recommended gtag.js snippet (async script + inline config)

- [FR-3]: Track automatic page view events (default GA4 behavior)
  - No custom configuration required — gtag.js automatically sends page_view event on load
  - Verify page_view events include: page_title, page_location, page_referrer

- [FR-4]: Track contact form submission events
  - Event name: `form_submit`
  - Event parameters: `form_name: "contact_form"`, `form_location: "contact_page"`
  - Trigger: On successful form validation (when form would submit if backend were connected)
  - Implementation: Add gtag event call to existing contact form validation in js/main.js

- [FR-5]: Track campaign form submission events
  - Event name: `form_submit`
  - Event parameters: `form_name: "campaign_form"`, `form_location: "ai_ceo_brief"`
  - Trigger: On successful form submission (Formspree integration)
  - Implementation: Add gtag event call to form submit handler in campaigns/ai-ceo-brief.html

- [FR-6]: Track service page engagement events
  - Event name: `view_service`
  - Event parameters: `service_name: "fractional_cto" | "board_advisory" | "growth_advisory"`
  - Trigger: On page load for service pages
  - Implementation: Add conditional gtag event call based on current page URL

- [FR-7]: Track CTA button clicks
  - Event name: `cta_click`
  - Event parameters: `cta_text: [button text]`, `cta_location: [page name]`
  - Trigger: Click on primary CTA buttons (e.g., "Schedule a Call", "Get in Touch", "Contact Us")
  - Implementation: Add click event listeners to CTA buttons in js/main.js

- [FR-8]: Privacy-compliant implementation
  - Cookie consent banner: Evaluate legal requirement based on target audience (US-focused,
    primarily B2B traffic to PE professionals — GDPR may not apply, but CCPA/state privacy
    laws may require notice)
  - Implementation approach: If consent required, use lightweight consent banner (e.g., simple
    CSS/JS banner with "Accept" button that sets localStorage flag and initializes GA4)
  - Default behavior: If no consent requirement, load GA4 immediately on page load
  - IP anonymization: Enable in GA4 property settings (not code-level — handled by GA4 config)

- [FR-9]: Test GA4 events are firing correctly
  - Use GA4 DebugView (Chrome extension or debug mode) to verify events in real-time
  - Verify all event parameters are captured correctly
  - Test across all pages and all tracked interactions
  - Confirm events appear in GA4 real-time reports within 5 minutes of firing

### Non-Functional Requirements

- [NFR-1]: GA4 script loads asynchronously and does not block page rendering
  - Page load time impact: < 100ms additional on first page view (gtag.js is async and cached)
  - Lighthouse performance score: No degradation (maintain current score)

- [NFR-2]: GA4 tracking resilient to script blockers and ad blockers
  - Graceful degradation: If GA4 script is blocked, site functions normally without errors
  - Error handling: Wrap gtag calls in try/catch or check if gtag function exists before calling

- [NFR-3]: Event data structure supports future analysis needs
  - Event parameters use consistent naming (snake_case)
  - Event names follow GA4 recommended events where applicable (e.g., form_submit, view_item)
  - Custom parameters are descriptive and filterable in GA4 reports

- [NFR-4]: Privacy compliance with US data protection regulations
  - Cookie consent banner (if required) does not auto-dismiss — requires explicit user action
  - Consent preference persists across sessions (localStorage or cookie)
  - GA4 configured with IP anonymization enabled (EU/GDPR best practice, apply globally)

- [NFR-5]: Documentation for future maintenance
  - Document GA4 Measurement ID in CLAUDE.md or separate analytics.md file
  - Document custom event structure (event names, parameters) for future reference
  - Include instructions for accessing GA4 property and adding new events

## Acceptance Criteria

- [AC-1]: Given a new GA4 property created for geekbyte.biz, when accessing the GA4 admin
  panel, then the property displays with data stream configured for https://geekbyte.biz
  and Measurement ID available

- [AC-2]: Given the GA4 tracking script, when viewing source of index.html, about.html,
  contact.html, and all service pages, then gtag.js script is present in <head> with
  correct Measurement ID

- [AC-3]: Given a user visiting any page on the site, when the page loads, then a page_view
  event fires and appears in GA4 DebugView or real-time reports within 5 minutes

- [AC-4]: Given the contact form on contact.html, when a user fills out valid information
  and submits the form, then a form_submit event fires with parameters: form_name="contact_form",
  form_location="contact_page"

- [AC-5]: Given the campaign form on campaigns/ai-ceo-brief.html, when a user submits the
  form successfully, then a form_submit event fires with parameters: form_name="campaign_form",
  form_location="ai_ceo_brief"

- [AC-6]: Given a user visiting services/fractional-cto.html, when the page loads, then a
  view_service event fires with parameter: service_name="fractional_cto" (same pattern for
  board_advisory and growth_advisory)

- [AC-7]: Given a user clicking a primary CTA button (e.g., "Schedule a Call"), when the
  click occurs, then a cta_click event fires with parameters: cta_text="[button text]",
  cta_location="[page name]"

- [AC-8]: Given the privacy implementation, when evaluating legal requirements, then if
  consent is required, a cookie consent banner is implemented that blocks GA4 initialization
  until user accepts; if consent is not required, GA4 loads immediately without banner

- [AC-9]: Given GA4 DebugView enabled (via Chrome extension or ?debug_mode=true URL parameter),
  when performing tracked interactions (page views, form submissions, CTA clicks), then all
  events appear in DebugView with correct event names and parameters

- [AC-10]: Given a user with an ad blocker enabled, when visiting the site, then the site
  functions normally without JavaScript errors, and if gtag.js is blocked, tracking fails
  gracefully without impacting user experience

- [AC-11]: Given the GA4 real-time report, when accessing it 24 hours after deployment, then
  page_view events from all pages are visible, and custom events (form_submit, view_service,
  cta_click) appear with correct parameters

- [AC-12]: Given the project documentation, when reviewing CLAUDE.md or analytics.md, then
  GA4 Measurement ID, custom event structure, and maintenance instructions are documented

## Scope

### In Scope
- GA4 property creation and configuration (Measurement ID, data stream, IP anonymization)
- gtag.js script integration across all existing HTML pages (7 pages total)
- Custom event tracking: form submissions (contact + campaign), service page views, CTA clicks
- Privacy compliance evaluation and implementation (consent banner if required)
- Event testing and verification using GA4 DebugView
- Documentation of GA4 setup, Measurement ID, and custom event structure

### Out of Scope
- Google Tag Manager (GTM) implementation — direct gtag.js integration is simpler for static site
- Enhanced ecommerce tracking (no ecommerce on site currently)
- User ID tracking or cross-device tracking (no authentication, no user accounts)
- Custom dimensions beyond event parameters (may add in future spec if needed)
- Historical data import or migration (no previous analytics to migrate)
- Integration with Google Ads or other marketing platforms (future spec if needed)
- A/B testing or Google Optimize integration (future spec)
- Server-side tracking or Measurement Protocol (client-side only for static site)
- Advanced audience segmentation or custom reports (can be configured in GA4 UI post-deployment)

## Dependencies

- [DEP-1]: Google account with access to create GA4 properties (Grant's Google account or
  GeekByte organizational account)
- [DEP-2]: GA4 Measurement ID obtained from property creation (must be created before implementation)
- [DEP-3]: Access to HTML files and js/main.js for script integration
- [DEP-4]: Deployment access (Vercel auto-deploy from main branch)
- [DEP-5]: Chrome browser with GA4 DebugView extension or access to GA4 real-time reports for testing
- [DEP-6]: Legal review of privacy requirements (optional — can proceed with best-practice
  implementation and add consent banner retroactively if needed)

## Technical Notes

### GA4 Property Setup

**Step 1: Create GA4 Property**
1. Log in to Google Analytics (analytics.google.com)
2. Create new property: "GeekByte Website"
3. Add data stream: Web
4. Website URL: https://geekbyte.biz
5. Stream name: "GeekByte Production"
6. Enhanced measurement: Enable all (page views, scrolls, outbound clicks, site search, video engagement, file downloads)
7. Copy Measurement ID (format: G-XXXXXXXXXX)

**Step 2: Configure Property Settings**
- IP anonymization: Navigate to Data Settings > Data Collection, enable "Anonymize IP addresses"
- Data retention: Set to 14 months (maximum for standard GA4)
- Google Signals: Enable if cross-device tracking desired (requires consent in some jurisdictions)

**Step 3: Create Custom Events (Optional)**
- Can be configured in GA4 UI or via gtag.js code (recommend code-based for flexibility)

### Script Integration Structure

**Placement:** Add to <head> section of all HTML pages, immediately after opening <head> tag.

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Implementation Notes:**
- Replace `G-XXXXXXXXXX` with actual Measurement ID from GA4 property
- Script loads asynchronously (async attribute on first script tag)
- gtag() function initializes dataLayer and sends config event
- config event automatically sends page_view

### Custom Event Implementation

**Contact Form Event (js/main.js):**
Add to existing form validation function (around line 75-92):
```javascript
// After successful validation, before form would submit
if (window.gtag) {
  gtag('event', 'form_submit', {
    'form_name': 'contact_form',
    'form_location': 'contact_page'
  });
}
```

**Campaign Form Event (campaigns/ai-ceo-brief.html):**
Add to inline form submit handler:
```javascript
// After Formspree submission success
if (window.gtag) {
  gtag('event', 'form_submit', {
    'form_name': 'campaign_form',
    'form_location': 'ai_ceo_brief'
  });
}
```

**Service Page View Event:**
Add to js/main.js (DOMContentLoaded):
```javascript
// Detect service page and fire event
const servicePath = window.location.pathname;
if (servicePath.includes('/services/')) {
  let serviceName = servicePath.split('/').pop().replace('.html', '');
  if (window.gtag) {
    gtag('event', 'view_service', {
      'service_name': serviceName.replace(/-/g, '_')
    });
  }
}
```

**CTA Click Event:**
Add click listeners in js/main.js:
```javascript
// Select all primary CTA buttons
const ctaButtons = document.querySelectorAll('.cta-button, .btn-primary, a[href*="contact"]');
ctaButtons.forEach(button => {
  button.addEventListener('click', function() {
    if (window.gtag) {
      gtag('event', 'cta_click', {
        'cta_text': this.textContent.trim(),
        'cta_location': document.title
      });
    }
  });
});
```

### Privacy Compliance Evaluation

**Target Audience Analysis:**
- Primary: US-based PE professionals, CTOs, VPs of Engineering
- Secondary: Portfolio company leadership (likely US-based)
- Geographic reach: Primarily United States, some international PE firms

**Regulatory Considerations:**
- **GDPR (EU):** Likely not primary concern (US-focused site), but best practice is IP anonymization
- **CCPA (California):** May apply if California residents visit site — requires privacy policy
  with data collection disclosure and opt-out mechanism
- **State privacy laws (Virginia, Colorado, Utah, Connecticut):** Similar to CCPA, may require notice

**Recommended Approach:**
1. **No consent banner initially** — US B2B site with minimal PII collection, analytics is
   legitimate business interest
2. **Privacy policy update** — Add section disclosing GA4 usage, cookies, IP anonymization,
   opt-out mechanism (link to browser settings or GA4 opt-out extension)
3. **Monitor regulatory changes** — Reassess if traffic patterns change or new laws enacted
4. **Opt-out mechanism** — Provide link in footer to GA4 opt-out browser extension
   (https://tools.google.com/dlpage/gaoptout)

**If consent banner required (future):**
```html
<div id="cookie-consent" style="display: none;">
  <p>We use cookies and analytics to improve your experience. <a href="/privacy">Learn more</a></p>
  <button id="accept-cookies">Accept</button>
</div>
```

### Testing Checklist

**Pre-Deployment:**
1. Create GA4 property and obtain Measurement ID
2. Verify gtag.js script added to all 7 pages (index, about, contact, 3 services, campaign)
3. Verify custom event code added to js/main.js and campaign form
4. Test locally with GA4 DebugView extension or ?debug_mode=true URL parameter
5. Verify no JavaScript errors in console (especially if gtag blocked)

**Post-Deployment:**
1. Visit each page and verify page_view events in GA4 real-time reports
2. Submit contact form and verify form_submit event fires
3. Submit campaign form and verify form_submit event fires
4. Visit each service page and verify view_service event fires with correct service_name
5. Click CTA buttons on each page and verify cta_click event fires
6. Test with ad blocker enabled — confirm site functions without errors
7. Check GA4 DebugView for event structure (event names, parameters)
8. Wait 24 hours and verify data appears in GA4 standard reports (not just real-time)

### Documentation Requirements

**File:** `c:\Users\GrantHowe\OneDrive - Howe Group LLC\Documents\Howe Group\Geekbyte\Website\CLAUDE.md`

Add to "Current State" section:
```markdown
### Analytics
- **Google Analytics 4:** Property ID G-XXXXXXXXXX
- **Measurement ID:** G-XXXXXXXXXX (replace with actual ID)
- **Custom Events:**
  - `form_submit` — Contact form and campaign form submissions
  - `view_service` — Service page views (fractional_cto, board_advisory, growth_advisory)
  - `cta_click` — Primary CTA button clicks
- **Privacy:** IP anonymization enabled, opt-out link in footer
```

Alternatively, create separate `docs/analytics.md` file with full event reference.

## Tier Justification

rationale: Standard tier. Adding GA4 is a well-established pattern with clear implementation
  steps. No architectural changes to site structure — pure additive integration. Script
  integration requires editing 7 HTML files (routine), custom event tracking requires
  JavaScript additions to existing js/main.js and inline form handlers (straightforward).
  No database, no backend, no authentication, no PII beyond what users voluntarily submit
  in forms (already present, GA4 doesn't change that). Privacy compliance evaluation is
  analysis, not implementation complexity. Testing is straightforward using GA4 built-in
  tools (DebugView, real-time reports). Total implementation time estimated at 1.5-2 hours
  (property setup 15m, script integration 30m, custom events 45m, testing 30m). Similar
  complexity to SPEC-002 (Playwright) — new tool integration with testing verification.

escalation_triggers_checked:
  - Authentication/authorization: No
  - Payment/financial data: No
  - PII/PHI handling: No (GA4 collects anonymized data, IP anonymization enabled)
  - New external integration: Yes, but standard third-party analytics (not custom API)
  - Database schema change: No
  - Core domain model: No
  - New architectural pattern: No (analytics is observability, not architecture)
  - Framework migration: No
  - AI/ML integration: No

---

## Gate Log

| Gate | Reviewer | Date | Decision | Evidence |
|------|----------|------|----------|----------|
| Spec | | | | |
| Architecture | | | | |
| QA | | | | |
| Deploy | | | | |

## Effort Comparison

| Stage | AI Time (Actual) | Human Estimate | Human Breakdown |
|-------|------------------|----------------|-----------------|
| **Spec Writing** | 20 min | 1.5-2 hours | Review GA4 documentation (20m), identify tracking requirements (15m), write 9 FRs covering property setup, script integration, event tracking, privacy (30m), write 12 ACs in Given/When/Then (20m), document custom event structure in Technical Notes (15m), privacy compliance evaluation (10m), testing checklist (10m) |
| **Architecture Review** | 10 min | 45-60 min | Read spec (10m), evaluate privacy implications (15m), validate event structure (10m), confirm no architectural impact (5m), complete checklist (10m) |
| **Implementation + Test** | ~2.5 hours | 2-2.5 hours | Create GA4 property and configure settings (15m), integrate gtag.js script into 7 HTML pages (20m), implement custom events in js/main.js and form handlers (30m), test with DebugView across all pages and events (30m), verify real-time reports (15m), escaped defects: routing conflicts (20m), staging smoke test fixes (30m), visual regression baseline updates (20m) |
| **Deployment** | 20 min | 10-15 min | Commit changes (2m), push to GitHub (1m), Vercel auto-deployment (2m), post-deploy smoke tests (5m), verify GA4 data flowing (5m), troubleshoot vercel.json routes conflict (5m) |
| **Total** | ~3 hours 10 min | 4.75-6.25 hours | **AI Speedup: ~1.5-2x** (lower due to escaped defects and routing conflicts) |

### Assumptions
- **Spec Writing:** PM familiar with GA4 basics, has access to GA4 documentation, understands
  privacy compliance concepts (GDPR, CCPA)
- **Architecture Review:** Architect evaluates privacy implications, confirms analytics does
  not impact site architecture (observability vs. core functionality)
- **Implementation:** Mid-level frontend developer familiar with JavaScript, comfortable with
  GA4 setup (has created properties before), understands event tracking concepts. Estimate
  includes: GA4 property creation and configuration (15m), script integration across 7 pages
  (20m), custom event implementation in js/main.js and inline handlers (30m), testing with
  DebugView and real-time reports (30m), verify all events firing correctly, documentation (10m).
- **Deployment:** DevOps engineer familiar with Vercel deployment process, monitors deployment,
  performs post-deploy smoke tests, verifies GA4 data flowing into real-time reports.

### Notes
- **GA4 Setup:** Property creation is one-time, but requires Google account access and familiarity
  with GA4 interface. Measurement ID obtained during setup is used in all script integrations.
- **Script Integration:** gtag.js snippet is identical across all pages — copy/paste with
  Measurement ID replacement. No page-specific configuration required.
- **Custom Events:** Event tracking uses gtag('event', ...) pattern — consistent across all
  custom events. Event names follow GA4 recommended events where possible (form_submit) and
  custom naming for domain-specific events (view_service, cta_click).
- **Testing:** GA4 DebugView provides real-time event validation during development. Real-time
  reports verify production data flow. Full reporting data appears 24-48 hours after deployment.
- **Privacy:** IP anonymization is GA4 property setting (UI config), not code-level implementation.
  Consent banner is out of scope for initial deployment — can be added in future spec if
  regulatory landscape changes or traffic patterns shift to EU/international.
