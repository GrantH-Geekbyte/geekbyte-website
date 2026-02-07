# Feature Specification

spec_id: SPEC-011
title: Visual Regression Testing in CI
version: 1.0
status: pending
complexity_tier: standard
last_updated: 2026-02-05

## Business Context

requester: Grant Howe, Managing Partner
business_goal: Functional tests (navigation, content, SEO) verify that pages load and work correctly, but they don't catch visual regressions — CSS breaks, color changes, layout shifts, and rendering problems that affect user experience. A developer might accidentally change a CSS rule that breaks the layout on mobile, or a CSS update might cause unexpected color shifts. These issues would pass all functional tests but degrade the user experience. Visual regression testing captures screenshots before and after code changes, compares them pixel-by-pixel, and alerts the team to unintended visual changes. This catches CSS breaks, responsive design issues, and cross-browser rendering problems before they reach production.
success_metrics:
  - Screenshot capture integrated into Playwright test workflow
  - Baseline screenshots stored (S3 or GitHub) with clear version control
  - Visual regression tests run on every PR and report results
  - Visual changes highlighted in PR with before/after diff images
  - PM can distinguish intentional design changes from accidental CSS breaks
  - Zero false positives (minor rendering differences tolerated via configurable threshold)
  - All critical pages covered (home, services, contact, campaigns)
  - Multiple viewport sizes tested (mobile, tablet, desktop)
priority: P2 (quality assurance improvement — high value, not blocking current work)

## Requirements

### Functional Requirements

- [FR-1]: Screenshot capture configured in Playwright
  - Capture full-page screenshots of each test page at multiple viewport sizes
  - Screenshots stored in consistent location with deterministic naming (e.g., `page-name-viewport-baseline.png`)
  - Support for baseline generation on demand (e.g., `npx playwright test --update-snapshots`)

- [FR-2]: Baseline screenshot storage strategy implemented
  - Baselines stored in GitHub repository (`screenshots/baseline/` directory)
  - Alternative: S3 bucket configuration available (deferred to Architecture Gate)
  - Baselines version-controlled (git history tracks changes, allows rollback)
  - Clear process for updating baselines when design changes are intentional

- [FR-3]: Visual regression test suite created
  - Visual tests cover all key pages:
    - Home page (index.html)
    - All service pages (fractional-cto, board-advisory, growth-advisory)
    - Contact page (contact.html)
    - Campaign landing page (campaigns/ai-ceo-brief.html)
    - About page (about.html)
  - Tests at three viewport sizes per page: desktop (1280px), tablet (768px), mobile (375px)
  - Total: 6 pages × 3 viewports = 18 screenshots per test run

- [FR-4]: Screenshot comparison and diff generation
  - Pixel-by-pixel comparison of new screenshots vs. baselines
  - Configurable threshold to tolerate minor rendering differences (e.g., 1% pixel difference = pass)
  - Diff images generated automatically showing what changed (highlighted areas)
  - Diff images uploaded to PR for visual review

- [FR-5]: PR workflow integration
  - Visual regression tests run on every PR (via existing pr-tests.yml workflow)
  - Test results reported as PR check status (pass/fail/review)
  - If visual differences detected: create comment on PR with diff images
  - Diff images include side-by-side comparison (before/after) or highlighted overlay

- [FR-6]: Visual change approval workflow
  - PR author can request visual change review (comment in PR or automated prompt)
  - PM reviews diff images and decides: intentional design change or CSS bug?
  - If intentional: approve and update baselines (`npx playwright test --update-snapshots`)
  - If unintentional: request CSS fix and re-run tests
  - Baseline update requires separate commit (traceable in git history)

- [FR-7]: Cross-browser visual testing (optional, deferred to future spec if needed)
  - Note: Playwright captures screenshots in Chromium by default
  - Firefox/WebKit visual capture available but deferred to SPEC-NNN (future)

- [FR-8]: Visual test reporting
  - Test report includes per-page, per-viewport summary
  - Clear pass/fail status with pixel difference metrics
  - Links to diff images for failed tests
  - Screenshot gallery available in workflow artifacts

- [FR-9]: Local visual regression testing
  - Developers can run visual tests locally (`npm run test:visual` or `npx playwright test visual.spec.js`)
  - Baseline comparison works offline (baselines in repo)
  - Update baselines locally with `--update-snapshots` flag

- [FR-10]: .gitignore updates
  - Screenshot artifacts excluded from git (test-results/, diff-images/)
  - Baseline screenshots committed to repo (not ignored)
  - Playwright report directory excluded

### Non-Functional Requirements

- [NFR-1]: Visual regression tests complete in under 90 seconds per PR
  - Capturing 18 screenshots + comparison should take ~60-90 seconds

- [NFR-2]: Diff image generation creates human-readable visual comparisons
  - Diffs must be clear enough for a non-technical PM to see what changed

- [NFR-3]: False positive rate minimized
  - Configurable threshold prevents anti-aliasing differences from failing tests
  - Threshold recommendation: 1% pixel tolerance (allows sub-pixel rendering variations)

- [NFR-4]: Baseline size reasonable
  - 18 baseline screenshots ≈ 2-5MB (PNG, compressed)
  - Should not impact repo size significantly

- [NFR-5]: Workflow artifact retention
  - Failed test artifacts (diff images, reports) retained for 30 days
  - Baseline comparison available in PR for full history

## Acceptance Criteria

- [AC-1]: Given the visual regression test suite, when run locally, then all 18 screenshots capture without errors (6 pages × 3 viewports)

- [AC-2]: Given baseline screenshots in the repo, when running tests with no CSS changes, then all 18 comparisons pass (zero diff pixels or within 1% threshold)

- [AC-3]: Given a CSS change that affects a single page (e.g., color change on home page), when running visual tests, then that page's screenshots fail comparison and diff images highlight the change

- [AC-4]: Given a PR with visual changes, when tests run in GitHub Actions, then the "Visual Regression" check status is reported and diff images are available in workflow artifacts

- [AC-5]: Given visual differences detected in a PR, when PM reviews diff images, then the PM can clearly see what changed (before/after comparison is obvious)

- [AC-6]: Given an intentional design change (e.g., new color scheme), when baseline is updated with `--update-snapshots`, then the new baseline is committed to git and subsequent tests pass

- [AC-7]: Given a CSS bug fix (e.g., fixing a layout break), when tests are re-run, then the visual regression test passes (screenshot matches updated baseline)

- [AC-8]: Given multiple viewport sizes (desktop, tablet, mobile), when running tests, then each viewport captures correctly and comparisons are independent (a mobile change doesn't affect desktop pass/fail)

- [AC-9]: Given a failed visual regression test, when developer downloads diff images from workflow artifacts, then the images are viewable, labeled, and indicate which page/viewport changed

- [AC-10]: Given local development, when developer runs `npm run test:visual`, then baseline comparison works without needing cloud storage or external API access

## Scope

### In Scope
- Visual regression test suite in Playwright (new file: `tests/e2e/visual-regression.spec.js`)
- Baseline screenshot storage in `screenshots/baseline/` directory (committed to git)
- Playwright visual comparison configuration (threshold, diff options)
- CI/CD integration (add visual test step to existing `pr-tests.yml`)
- Diff image generation and PR artifact upload
- npm script for local visual testing (`npm run test:visual`)
- .gitignore updates (exclude test artifacts, include baselines)
- Documentation: visual regression testing workflow (updating baselines, reviewing diffs, handling false positives)
- Helper scripts or Playwright fixture to manage baseline updates (e.g., `npm run update-visual-baselines`)

### Out of Scope
- Cross-browser visual testing (Firefox, WebKit, Safari) — deferred to future spec
- Visual testing for dynamic content (form interactions, animations) — deferred to future spec
- S3-based baseline storage — GitHub storage recommended; S3 deferred to Architecture Gate decision
- Machine learning-based diff analysis (advanced feature detection) — deferred to future spec
- Visual performance metrics (rendering time, paint times) — separate concern (Performance Testing spec)
- Automated baseline updates (requires design approval workflow) — manual approval required
- Integration with external screenshot comparison services (Percy, BackstopJS) — using Playwright built-in for simplicity

## Dependencies

- [DEP-1]: SPEC-002 deployed — Playwright test framework exists (satisfied)
- [DEP-2]: SPEC-007 deployed — PR test workflow (pr-tests.yml) exists (satisfied)
- [DEP-3]: Baseline screenshot directory structure (`screenshots/baseline/`) must be created and committed to repo
- [DEP-4]: Storage strategy for baselines decided at Architecture Gate (GitHub repo vs. S3) — GitHub assumed for initial implementation
- [DEP-5]: Playwright v1.40+ installed (already satisfied by SPEC-002; visual comparison feature available in all 1.x versions)

## Technical Notes

### Screenshot Naming Convention
```
screenshots/baseline/
  home-desktop-1280w.png
  home-tablet-768w.png
  home-mobile-375w.png
  fractional-cto-desktop-1280w.png
  fractional-cto-tablet-768w.png
  ... (etc for each page/viewport)
```

### Playwright Visual Comparison API
```javascript
// Capture and compare screenshot
await expect(page).toHaveScreenshot('home-desktop-1280w.png', {
  maxDiffPixels: 100,  // Allow up to 100 pixels of difference
  threshold: 0.1       // Or: allow up to 10% pixel difference
});
```

### Configurable Threshold Strategy
- Default: `maxDiffPixels: 100` (absolute pixel count) OR `threshold: 0.01` (1% tolerance)
- Rationale: Rendering engines introduce minor anti-aliasing differences; 1% tolerance handles this
- Configuration in `playwright.config.js` under `webExpectToHaveScreenshot` option or per-test

### Baseline Management Commands
```bash
# Run visual tests with baseline update
npm run update-visual-baselines
# Translates to: npx playwright test visual-regression.spec.js --update-snapshots

# Run visual tests locally (compare only, no update)
npm run test:visual
# Translates to: npx playwright test visual-regression.spec.js
```

### CI/CD Integration Point
Add to existing `.github/workflows/pr-tests.yml`:
```yaml
- name: Run visual regression tests
  run: npm run test:visual

- name: Upload visual diffs on failure
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: visual-diffs
    path: test-results/
```

### Key Decisions for Architecture Gate

1. **Baseline Storage:**
   - GitHub repo (recommended): Simple, version-controlled, no external dependencies
   - S3 (alternative): External, scalable, but adds AWS configuration
   - Decision: Start with GitHub, migrate to S3 if repo size becomes concern

2. **Screenshot Threshold:**
   - Recommend: 1% pixel tolerance (handles rendering variance)
   - Rationale: Catches real CSS breaks, ignores anti-aliasing differences

3. **Diff Image Format:**
   - Playwright generates diff.png automatically
   - Consider: uploading to PR comment (vs. artifacts only)
   - Tool: Actions like `daun/playwright-report-comment` available for PR integration

4. **Viewport Selection:**
   - Desktop (1280px): Standard large-screen breakpoint
   - Tablet (768px): Matches CSS breakpoint in codebase
   - Mobile (375px): Typical mobile width (iPhone SE equivalent)
   - Rationale: Covers mobile-first responsive design testing

5. **Baseline Update Workflow:**
   - Design changes require manual baseline update
   - Update via: `npm run update-visual-baselines` locally, then push PR
   - Alternative: PR comment command (e.g., `/approve-visual-changes`) — deferred to future automation
   - Recommendation: Manual approval maintains control

## Tier Justification

rationale: Standard tier. Visual regression testing adds a new testing capability (screenshot capture and comparison) but uses well-established Playwright features. No new architectural patterns, no external integrations beyond existing GitHub/Playwright ecosystem. Baseline storage in GitHub (assumed) requires architecture review for storage strategy decision. Implementation is straightforward screenshot collection and comparison. No production code impact (testing infrastructure only).

escalation_triggers_checked:
  - Authentication/authorization: No
  - Payment/financial data: No
  - PII/PHI handling: No
  - New external integration: No (Playwright built-in, GitHub storage)
  - Database schema change: No
  - Core domain model: No
  - New architectural pattern: No — testing infrastructure, not production architecture

---

## Gate Log

| Gate | Reviewer | Date | Decision | Evidence |
|------|----------|------|----------|----------|
| Spec | _pending_ | 2026-02-05 | _pending_ | Specification complete: 10 FR, 5 NFR, 10 AC, scope clear, dependencies satisfied, tier appropriate. Recommended by ARCH-SPEC-007 (visual regression identified as high-value QA improvement). Ready for Architecture Gate. |
| Architecture | _pending_ | | _pending_ | Awaiting architecture review of baseline storage strategy (GitHub vs. S3) and threshold configuration. Checklist: checklists/ARCH-SPEC-011.md |
| QA | _pending_ | | _pending_ | Awaiting implementation and QA verification. Checklist: checklists/QA-SPEC-011.md |
| Deploy | _pending_ | | _pending_ | Awaiting QA gate approval and deployment preparation. Checklist: checklists/DEPLOY-SPEC-011.md |

## Effort Comparison

| Stage | AI Time | Human Estimate | Human Breakdown |
|-------|---------|----------------|-----------------|
| **Spec Writing** | 20 min | 2.5-3.5 hours | Understand visual regression concepts (30m), define baseline storage strategy (30m), write 10 FRs with Playwright API details (45m), write 10 ACs with test scenarios (30m), scope & dependencies (20m), technical notes & decisions (20m) |
| **Architecture Review** | 20 min | 1.5-2 hours | Review baseline storage options (GitHub vs. S3) (30m), evaluate threshold configuration (20m), validate Playwright API usage (20m), assess repo size impact (15m), document 5 key decisions & recommendations (30m) |
| **Implementation + Test** | 40 min | 6-8 hours | Create visual regression test file (1h), configure Playwright screenshot options (30m), capture baseline screenshots for 6 pages × 3 viewports (45m), integrate into CI/CD workflow (30m), write baseline update scripts (20m), create documentation (45m), test locally & in CI (1-1.5h), debug diff image generation (30m) |
| **Deployment** | 10 min | 30-45 min | Create deployment checklist (5m), git commit visual test files + baselines + docs (5m), git push to GitHub (1m), verify PR workflow runs visual tests (3-5m), manual verification of diff images in PR (3-5m) |
| **Total** | 90 min | 10.5-14.5 hours | **AI Speedup: 7-10x** |

### Assumptions
- **Spec Writing:** PM familiar with visual testing concepts, understands Playwright capabilities
- **Architecture Review:** Architect familiar with Playwright visual features, storage strategies, can make GitHub vs. S3 decision
- **Implementation:** Mid-level developer (2-4 years experience), familiar with JavaScript and Playwright (from SPEC-002), working on screenshot capture + comparison setup. Time includes: test file creation (1h), Playwright config (30m), baseline capture (45m), CI integration (30m), helper scripts (20m), docs (45m), debugging (1-1.5h)
- **Deployment:** DevOps engineer or senior developer familiar with git and GitHub. Includes: checklist creation (5m), git operations (6m), verification (5-10m)

### Notes on Effort Estimation
- Baseline screenshot capture is mostly automation time (18 screenshots × ~2 seconds each)
- Threshold tuning and false-positive handling may require iteration (included in debugging/test time)
- Diff image quality and PR integration are critical QA concerns (reflected in QA stage estimate)
- Documentation emphasis (45m) reflects importance of clear baseline update workflow for PM/team
