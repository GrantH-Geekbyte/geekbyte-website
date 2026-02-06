# Feature Specification

spec_id: SPEC-014
title: About Page Positioning Rewrite
version: 1.0
status: pending
complexity_tier: standard
last_updated: 2026-02-06

## Business Context

requester: Grant Howe, Managing Partner
business_goal: Rewrite the GeekByte About page with company-first positioning that emphasizes
  technical leadership expertise in AI-native development. The current About page exists but
  needs repositioning to better align with our AI-native advisory positioning vs. traditional
  consulting/implementation services. Target audience is CTOs/VPs of Engineering at growth-stage
  tech companies and PE portfolio company leadership evaluating technical advisors. Content has
  been professionally optimized by the marketing-copywriter agent and is embedded in this spec
  as the implementation requirement.
success_metrics:
  - About page clearly positions GeekByte as AI-native advisory (not implementation)
  - Grant's bio emphasizes AI development expertise while maintaining PE credibility
  - SEO metadata aligns with new AI-native positioning
  - Content resonates with technical leaders navigating AI adoption
  - Messaging differentiates from traditional consultants and dev shops
priority: P2 (High-value content update, strategic positioning for stakeholder presentations)

## Requirements

### Functional Requirements

- [FR-1]: Update about.html with three content sections following recommended combinations
  from approved copy:
  - Section 1: Company Positioning (Option A) — clearest AI-native positioning
  - Section 2: Value Proposition (Option B) — strongest outcome focus
  - Section 3: Grant Howe Bio (Option A) — best AI-native emphasis

- [FR-2]: Section 1 (Company Positioning) replaces current hero + intro sections
  - Headline: "Technical Leadership for Companies Building with AI"
  - Two paragraphs: advisory positioning, AI-native vs. retrofitting, pattern recognition
  - CSS class: .content-section with .about-intro container
  - Max-width: 850px for readability

- [FR-3]: Section 2 (Value Proposition) replaces current "Why PE Partners Choose Me" section
  - Headline: "What You Get with GeekByte"
  - Section intro: benefit-heavy opening paragraph
  - Three differentiator cards:
    1. "Faster, Better Technical Decisions" (build vs. buy, AI provider selection, architecture)
    2. "Risk Identification Before It's Expensive" (data pipelines, model versioning, reliability)
    3. "Advisory That Scales Your Team, Not Replaces It" (team improvement, PE use case)
  - CSS class: .why-work-section with .differentiator-grid (3-column grid)

- [FR-4]: Section 3 (Grant Howe Bio) replaces current bio section
  - Title: "Fractional CTO | Independent Board Member | AI Development Advisor"
  - Four paragraphs:
    1. 25+ years experience with AI-native focus, PE exits, M&A integrations
    2. Prior ECI and Sage roles (established credibility)
    3. Current advisory focus: AI-native product development, CTO/engineering leader advisory
    4. Cross-sector experience, pattern recognition benefit, Cinch Ops board role
  - CSS class: .bio-section with .bio-grid (2-column: image + content)
  - Maintain existing bio photo, LinkedIn icon, CTA buttons

- [FR-5]: Verify and update SEO metadata to align with AI-native positioning
  - Page title: Update if needed to reflect AI-native advisory focus
  - Meta description: Update to emphasize AI development expertise + PE experience
  - OG tags (title, description): Ensure consistent with new positioning
  - Schema.org Person markup: Update "description" field if needed

- [FR-6]: Preserve existing page structure, navigation, footer, and responsive behavior
  - Header navigation unchanged (About link remains active)
  - Footer unchanged (links, copyright, social)
  - Mobile responsiveness maintained (existing breakpoints: 768px, 480px)
  - Accessibility features preserved (skip-link, semantic HTML, ARIA where applicable)

### Non-Functional Requirements

- [NFR-1]: Page renders in under 3 seconds on mobile (no new assets, text-only update)
- [NFR-2]: WCAG 2.1 AA accessibility maintained (semantic HTML, alt text, contrast ratios)
- [NFR-3]: Responsive design verified across desktop (1200px+), tablet (768px), mobile (480px, 375px)
- [NFR-4]: SEO metadata complete (title, description, OG tags, canonical URL, Schema.org)
- [NFR-5]: Content adheres to positioning guidelines:
  - Emphasize: Technical leadership, AI-native development, advisory (not implementation),
    pattern recognition, PE experience
  - Avoid: "We implement" language, specific client names, quantified metrics claims

## Acceptance Criteria

- [AC-1]: Given the About page at /about.html, when the page loads, then Section 1 (Company
  Positioning) displays with headline "Technical Leadership for Companies Building with AI"
  and two paragraphs positioning GeekByte as AI-native advisory

- [AC-2]: Given Section 1, when reading the content, then it clearly distinguishes advisory
  from implementation services and emphasizes AI-native development (not retrofitting)

- [AC-3]: Given Section 2 (Value Proposition), when viewing the differentiator cards, then
  three cards are displayed in a 3-column grid with headlines:
  1. "Faster, Better Technical Decisions"
  2. "Risk Identification Before It's Expensive"
  3. "Advisory That Scales Your Team, Not Replaces It"

- [AC-4]: Given Section 2 differentiator cards, when reading the content, then each card
  includes specific examples (build vs. buy, AI providers, data pipelines, model versioning,
  team improvement) demonstrating expertise

- [AC-5]: Given Section 3 (Grant Howe Bio), when viewing the bio, then the title reads
  "Fractional CTO | Independent Board Member | AI Development Advisor" (emphasis on AI)

- [AC-6]: Given Section 3 bio content, when reading, then paragraph 3 explicitly focuses on
  "AI-native product development" and "helping teams build AI-native architectures from
  the ground up rather than retrofitting legacy systems"

- [AC-7]: Given the About page metadata, when inspecting <head>, then:
  - <title> tag reflects AI-native positioning (e.g., includes "AI Development" or similar)
  - Meta description emphasizes AI expertise + PE experience (under 160 characters)
  - OG title and description align with updated positioning
  - Schema.org Person "description" field updated (if needed)

- [AC-8]: Given a mobile viewport (375px width), when viewing the About page, then all
  sections stack vertically, bio grid becomes 1-column, differentiator grid becomes 1-column,
  and all text remains readable

- [AC-9]: Given a user on desktop (1200px+), when viewing the About page, then the bio grid
  displays 2-column layout (300px image + content), differentiator grid displays 3-column
  layout, and max-width container (1200px) centers content

- [AC-10]: Given the current about.html structure, when comparing old vs. new content, then
  existing CSS classes (.content-section, .bio-section, .why-work-section, .differentiator-grid)
  are reused without modification (no new CSS required)

## Scope

### In Scope
- Content replacement for three sections: Company Positioning, Value Proposition, Grant Bio
- HTML content updates to existing about.html (text replacement only)
- SEO metadata review and updates (title, meta description, OG tags)
- Verification of responsive behavior across viewports
- Accessibility verification (semantic HTML, ARIA, alt text)
- Use of approved copy from content/about-page-copy-2026-02-05.md

### Out of Scope
- CSS changes (existing design system sufficient — .content-section, .bio-section, etc.)
- New images or graphics (existing bio photo remains)
- JavaScript changes (static content, no interactive features)
- Backend integration (static HTML page, no form submission)
- A/B testing infrastructure (content is final, approved by marketing-copywriter)
- Additional sections beyond the three specified (no testimonials, case studies, etc.)
- Changes to other pages (index.html, service pages, contact.html remain unchanged)

## Dependencies

- [DEP-1]: Approved copy available in content/about-page-copy-2026-02-05.md (COMPLETE)
- [DEP-2]: Existing about.html structure and CSS design system (confirmed via codebase exploration)
- [DEP-3]: Access to repository for HTML file updates
- [DEP-4]: Deployment access (Netlify/Vercel auto-deploy from main branch)

## Technical Notes

### Content Structure

**Section 1: Company Positioning (Option A)**
- Location: Replace lines 102-123 in current about.html (hero-content + bio-section intro)
- HTML structure:
  ```html
  <section class="content-section">
      <div class="container">
          <div class="about-intro">
              <h2>Technical Leadership for Companies Building with AI</h2>
              <p class="lead-text">[Paragraph 1: advisory positioning]</p>
              <p class="lead-text">[Paragraph 2: AI-native vs. retrofitting]</p>
          </div>
      </div>
  </section>
  ```

**Section 2: Value Proposition (Option B)**
- Location: Replace lines 150-170 (current "Why PE Partners Choose Me" section)
- HTML structure:
  ```html
  <section class="why-work-section">
      <div class="container">
          <h2>What You Get with GeekByte</h2>
          <p class="section-intro">[Intro paragraph]</p>
          <div class="differentiator-grid">
              <div class="differentiator">
                  <h4>Faster, Better Technical Decisions</h4>
                  <p>[Content with examples]</p>
              </div>
              <div class="differentiator">
                  <h4>Risk Identification Before It's Expensive</h4>
                  <p>[Content with examples]</p>
              </div>
              <div class="differentiator">
                  <h4>Advisory That Scales Your Team, Not Replaces It</h4>
                  <p>[Content with examples]</p>
              </div>
          </div>
      </div>
  </section>
  ```

**Section 3: Grant Howe Bio (Option A)**
- Location: Update lines 103-123 (.bio-content within .bio-section)
- Changes:
  - Update .bio-title from "Fractional CTO | Independent Board Member | Growth Advisor"
    to "Fractional CTO | Independent Board Member | AI Development Advisor"
  - Replace 4 paragraphs with approved bio copy (Option A)
  - Preserve bio-photo, LinkedIn icon SVG, bio-links CTAs

### SEO Metadata Updates

Current metadata (lines 6-29 in about.html):
- Title: "Grant Howe - CTO/SVP | PE Technology Leadership | Geekbyte LLC"
- Meta description: "Grant Howe - CTO/SVP with multiple successful PE exits..."
- OG title: "Grant Howe - CTO/SVP | PE Technology Leadership"

Recommended updates:
- Title: "Grant Howe - AI Development Advisor | CTO/SVP | Geekbyte LLC"
- Meta description: "AI-native development advisory for CTOs and engineering leaders. 25+ years technology executive experience with focus on AI architecture, PE exits, and technical leadership."
- OG title: "Grant Howe - AI Development Advisor | PE Technology Leadership"
- OG description: Update to match meta description (under 200 characters)
- Schema.org Person "description": Update to include "AI-native product development advisor"

### Approved Copy Source

**File:** `content/about-page-copy-2026-02-05.md`

**Recommended Combination:**
- Section 1: Option A (lines 11-23 in copy file)
- Section 2: Option B (lines 96-119 in copy file)
- Section 3: Option A (lines 156-185 in copy file)

**Implementation Note:** Copy is HTML-ready and includes proper semantic tags (.lead-text,
differentiator structure, bio-content). No rewriting or editing required during implementation.

## Tier Justification

rationale: Standard tier. Content update to existing page following established patterns. No
  new architectural decisions, no new code paths, no database changes. Similar to SPEC-001
  (About page creation) but simpler since page already exists with correct structure. Content
  is pre-approved by marketing-copywriter agent, so no creative decisions required during
  implementation. HTML structure reuses existing CSS classes (.content-section, .bio-section,
  .why-work-section, .differentiator-grid) with zero CSS changes. SEO metadata updates are
  straightforward text replacements. Mobile responsiveness already implemented in existing
  CSS (breakpoints at 768px, 480px). Total implementation time estimated at 30-45 minutes
  (text replacement, metadata updates, responsive verification). No external dependencies
  beyond deployment access.

escalation_triggers_checked:
  - Authentication/authorization: No
  - Payment/financial data: No
  - PII/PHI handling: No
  - New external integration: No
  - Database schema change: No
  - Core domain model: No
  - New architectural pattern: No
  - Framework migration: No
  - AI/ML integration: No (content about AI, but no AI features)

---

## Gate Log

| Gate | Reviewer | Date | Decision | Evidence |
|------|----------|------|----------|----------|
| Spec | Grant Howe (Claude) | 2026-02-06 | APPROVED | Requirements complete (6 FR, 5 NFR), 10 AC testable, scope clear. Content update with approved copy from marketing-copywriter. Standard tier appropriate. |
| Architecture | Claude (Architect-Reviewer) | 2026-02-06 | APPROVED | CSS design system supports new content without modification. Zero architectural debt. Responsive behavior preserved. SEO metadata approach sound. No security risks. Ready for implementation. |
| QA | | | PENDING | Awaiting QA checklist completion |
| Deploy | | | PENDING | Awaiting deployment |

## Effort Comparison

| Stage | AI Time | Human Estimate | Human Breakdown |
|-------|---------|----------------|-----------------|
| **Spec Writing** | 12 min | 2-2.5 hours | Review existing About page HTML structure (15m), review approved copy file and select recommended options (20m), map copy to existing CSS classes (15m), write 6 FRs covering 3 content sections + SEO + preservation requirements (30m), write 10 detailed ACs (25m), document copy source and HTML structure in Technical Notes (20m), scope, dependencies, tier justification (15m) |
| **Architecture Review** | 15 min | 45-60 min | Review spec for architectural implications (10m), verify existing CSS classes support new content structure (15m), confirm no new patterns required (10m), validate accessibility and responsive requirements (10m), complete architecture checklist (10m), document approval (5m) |
| **Implementation + Test** | 25-30 min | 2.5-3.5 hours | HTML content replacement: Section 1 Company Positioning (5m), Section 2 Value Proposition (8m), Section 3 Grant Bio (8m), SEO metadata updates (title, description, OG tags, Schema.org — 10m), responsive testing across 3 viewports (20m), accessibility verification (15m), cross-browser testing (10m), git commit with descriptive message (5m). Human estimate assumes mid-level frontend developer familiar with existing codebase and semantic HTML. |
| **Deployment** | 5 min | 10-15 min | Push to GitHub (auto-triggers Netlify/Vercel deployment — 2m), monitor deployment logs (3m), verify live site (5m), update deployment log (2m), smoke test About page on production (3m) |
| **Total** | 57-62 min | 6-7.25 hours | **AI Speedup: 6-7x** |

### Assumptions
- **Spec Writing:** PM familiar with SDD template format, has reviewed approved copy file,
  understands existing About page HTML structure and CSS design system
- **Architecture Review:** Architect verifies content update follows existing patterns, no
  new architectural decisions required (Standard tier, straightforward content replacement)
- **Implementation:** Frontend developer familiar with GeekByte codebase, HTML5 semantic
  markup, CSS custom properties, responsive design patterns. Copy is pre-approved and
  HTML-ready (no copywriting during implementation). Developer performs text replacement,
  metadata updates, and testing. No CSS changes required. AI time includes: reading existing
  about.html (3m), replacing 3 content sections (20m), updating SEO metadata (7m), responsive
  testing (10m), accessibility verification (5m), git commit (2m).
- **Deployment:** Auto-deployment via Netlify/Vercel from main branch. Human estimate assumes
  DevOps engineer monitors deployment, verifies live site, performs smoke test, updates logs.

### Notes
- **Content Source:** All copy pre-approved in content/about-page-copy-2026-02-05.md. No
  creative decisions during implementation — spec defines exact sections and options to use.
- **CSS Reuse:** Existing classes (.content-section, .bio-section, .why-work-section,
  .differentiator-grid) support new content structure without modification. Zero CSS changes.
- **Responsive Behavior:** Already implemented in css/style.css (lines 2433-2708). No new
  breakpoints or media queries required.
- **SEO Metadata:** Updates are text-only replacements in <head> section. Schema.org Person
  markup already exists (lines 32-52), only "description" field needs update.
- **Accessibility:** Existing semantic HTML structure (h2, section, p, .lead-text) meets
  WCAG 2.1 AA. No accessibility enhancements required beyond verification.
