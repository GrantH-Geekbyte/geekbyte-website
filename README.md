# GeekByte Website — SDD Implementation

**Project:** GeekByte LLC Corporate Website → AI Agent Product Platform
**Methodology:** Spec-Driven Development v3.0 (Solo Operator Model)
**Owner:** Grant Howe, Managing Partner
**Started:** February 2026
**Phase:** Adoption (Day 0-90)

## What This Is

This is the SDD pipeline infrastructure for the GeekByte website project.
Every change to the site flows through this pipeline as a Feature Spec,
reviewed at each gate, with documented human judgment at every approval point.

This is also a dogfooding exercise — using SDD on a real project to
pressure-test the methodology before deploying it at scale.

## Directory Structure

```
.claude/agents/              # Agent configs (5 agents)
  pm-spec.md                 #   Spec authoring
  architect-review.md        #   Architecture validation
  implementer-tester.md      #   Implementation + testing
  deployment.md              #   Deployment preparation
  learning-engine.md         #   Learning event analysis
governance/                  # Process governance
  solo-operator-model.md     #   How gates work for a one-person team
  tier-selection-guidelines.md  # Complexity tier decision guide
  escalation-protocols.md    #   How to handle disputes and emergencies
  pipeline-monitoring.md     #   Alert thresholds and review cadence
patterns/                    # Pattern library (grows from real work)
  spec/                      #   Spec patterns
  architecture/              #   Architecture patterns
  qa/                        #   QA patterns
  deployment/                #   Deployment patterns
specs/                       # Feature Specs
  SPEC-001-fix-about-page.md #   First spec: fix About page 404
checklists/                  # Gate checklists (generated per spec)
learning/
  events/                    # Gate rejection/modification events
  escapes/                   # Production escape tracking
metrics/
  velocity-baseline.md       # Velocity tracking
CLAUDE.md                    # Project context for agents
```

## How to Use

### Creating a new spec
1. Describe the change you want
2. Use the pm-spec agent to produce a structured Feature Spec
3. Review the spec — does it capture your real intent?
4. Approve with documented reasoning → moves to Architecture Review

### Running through the pipeline
1. **Spec Gate:** Review and approve the Feature Spec
2. **Arch Gate:** Agent validates architecture, you review concerns
3. **QA Gate:** Agent implements and tests, you verify adequacy
4. **Deploy Gate:** Confirm deployment readiness, authorize release

### Logging learning events
When a gate rejects or modifies a spec, create a file in learning/events/:
```
LE-YYYY-MM-DD-NNN.md
```
When a defect reaches production, create a file in learning/escapes/:
```
ESC-INC-NNN.md
```

## First Spec

SPEC-001 fixes the About page 404. It's Standard tier — enough process
to exercise the pipeline without overwhelming a first run. Start here.

## Key Files to Read First

1. `governance/solo-operator-model.md` — How gates work when you're solo
2. `CLAUDE.md` — Project context (fill in the TBD items)
3. `governance/tier-selection-guidelines.md` — How to classify changes
4. `specs/SPEC-001-fix-about-page.md` — Your first spec to run through

## Running Tests

This project uses Playwright for automated end-to-end testing.

### Prerequisites
- Node.js v24+ installed (check with `node --version`)
- Dependencies installed (run `npm install` if needed)

### Test Commands

```bash
# Run all tests against localhost (requires local server running)
npm test

# Start local server in separate terminal
npm run serve

# Run tests against localhost explicitly
npm run test:local

# Run smoke tests against live site (geekbyte.biz)
npm run test:live

# Run tests in debug mode
npm run test:debug

# Run tests in UI mode (interactive)
npm run test:ui
```

### Test Structure

Tests are organized in `tests/e2e/`:
- `navigation.spec.js` — Navigation links resolve from all pages (no 404s)
- `pages.spec.js` — All pages load successfully with correct structure
- `responsive.spec.js` — Pages render correctly at desktop, tablet, mobile viewports
- `contact-form.spec.js` — Contact form validation and submission
- `campaign-form.spec.js` — Campaign landing page form (Formspree integration)
- `accessibility.spec.js` — Accessibility checks using @axe-core/playwright
- `seo.spec.js` — SEO meta tags, OG tags, and titles
- `mobile-nav.spec.js` — Mobile hamburger menu functionality

### Running Tests Locally

1. Start the local server:
   ```bash
   npm run serve
   ```
   This starts a server at http://localhost:3000

2. In a separate terminal, run tests:
   ```bash
   npm test
   ```

### Test Configuration

- **Local testing:** Full test suite runs against http://localhost:3000
- **Live testing:** Read-only smoke tests run against https://geekbyte.biz
- **Form mocking:** Form submissions to Formspree are mocked to prevent spam
- **Browsers:** Tests run on Chromium (Chrome for Testing)

### Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

Reports are saved in `playwright-report/` (git-ignored).

### Troubleshooting

**Tests fail with connection refused:**
- Make sure local server is running (`npm run serve`)
- Verify it's accessible at http://localhost:3000

**Browser not found:**
- Run `npx playwright install` to download browsers

**Tests time out:**
- Check that pages load quickly (< 30 seconds)
- Verify no broken external resources (fonts, images)
