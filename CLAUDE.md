# CLAUDE.md — GeekByte Website

## Project Overview

GeekByte LLC corporate website and future product platform. Currently a static
marketing site for PE-focused technology advisory services. Evolving toward an
AI agent product with subscription billing.

**Owner:** Grant Howe, Managing Partner, GeekByte LLC
**Methodology:** Spec-Driven Development (SDD) v3.0 — Solo Operator Model
**URL:** https://www.geekbyte.biz

## Current State

### Tech Stack
- **Frontend:** Static HTML5, CSS3 (custom properties), vanilla JavaScript (ES6+)
- **Structure:** Multi-page static site with shared nav/footer
- **Styling:** CSS custom properties for theming, Flexbox/Grid, mobile-first responsive
- **JavaScript:** Vanilla JS — mobile nav toggle, contact form validation, smooth scrolling, debounce/viewport utilities
- **Hosting:** Vercel (connected to GitHub repository for automatic deployments)
- **Domain:** geekbyte.biz
- **Frameworks:** None — pure HTML/CSS/JS, no build process
- **Dependencies:** None

### Site Map
```
index.html                          # Home — service overview, hero, CTAs
about.html                          # About page
contact.html                        # Contact page with validated form
services/
  fractional-cto.html               # Fractional CTO service page
  board-advisory.html               # Board Advisory service page
  growth-advisory.html              # Growth Advisory service page
campaigns/
  ai-ceo-brief.html                 # AI executive brief campaign landing page
  downloads/                        # Campaign PDF downloads
css/
  style.css                         # Main stylesheet with CSS custom properties
js/
  main.js                           # Shared JavaScript (nav, forms, utilities)
images/
  logos/brand/geekbyte-logo.png     # Brand logo
  graphics/hero-value-cycle.svg     # Hero section SVG
  geekbyte-og-image.png             # Social sharing OG image (1200x630)
```

### CSS Custom Properties
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --accent-color: #3b82f6;
    /* Additional variables in css/style.css */
}
```

### JavaScript Capabilities
- Mobile navigation toggle (hamburger menu)
- Contact form client-side validation (backend integration ready — see main.js lines 75-92)
- Smooth scrolling
- Active page highlighting
- Utility functions: debounce, viewport detection

### Known Issues
- None currently tracked

### Recent Updates
- Added campaign landing pages with Formspree integration
- Contact form now submits to Formspree (f/mbdrppqp)
- Added LinkedIn social links to footer and about page
- Implemented development workflow requiring marketing-copywriter review

## Product Roadmap

1. **Current:** Static marketing site (HTML/CSS/JS)
2. **Near-term:** Content additions, blog/insights, case studies, SDD methodology page
3. **Mid-term:** AI agent product — conversational agent trained on Grant's knowledge
4. **Long-term:** Subscription model with payments, user accounts, gated access

### Architectural Implications
- Phase 2 can stay static or move to a static site generator (Hugo, Astro)
- Phase 3 requires a backend (API, database, AI integration) — this is the critical architecture decision
- Phase 4 adds auth, payments, user management — mandatory Critical tier in SDD

## Development Methodology: SDD v3.0

### Pipeline
```
PM-Spec → Spec Gate → Architect-Review → Arch Gate → Implementer-Tester → QA Gate → Deployment → Deploy Gate → Production
```

### Agent Architecture: Two Layers

This project uses a **two-layer agent architecture**:

**Layer 1 — SDD Pipeline Agents** (orchestration)
These control the flow of work through the pipeline. They produce and validate
artifacts (specs, checklists) and invoke specialist agents for execution.
- `sdd/pm-spec.md` — Spec authoring and structuring
- `sdd/architect-review.md` — Architecture validation against patterns
- `sdd/implementer-tester.md` — Implementation coordination and QA
- `sdd/deployment.md` — Deployment preparation
- `sdd/learning-engine.md` — Learning event analysis

**Layer 2 — Specialist Agents** (execution)
These do the actual work. They existed before SDD and continue to operate
as they always have, but are now invoked within the pipeline structure.
- `architect-reviewer.md` — System design validation
- `code-reviewer.md` — Code quality and security review
- `error-detective.md` — Error pattern analysis
- `frontend-developer.md` — Frontend implementation
- `graphic-artist.md` — Visual design specs
- `marketing-copywriter.md` — Marketing copy
- `multi-agent-coordinator.md` — Agent orchestration
- `penetration-tester.md` — Security testing
- `qa-expert.md` — Quality assurance strategy
- `test-automator.md` — Test automation
- `ui-designer.md` — UI design

### How the Layers Work Together

When a spec flows through the pipeline:

1. **PM-Spec stage:** `sdd/pm-spec.md` produces the Feature Spec.
   May invoke `marketing-copywriter` for content-heavy specs.

2. **Architect-Review stage:** `sdd/architect-review.md` validates the spec.
   Invokes `architect-reviewer` for design validation.
   Invokes `penetration-tester` for security-sensitive specs.

3. **Implementer-Tester stage:** `sdd/implementer-tester.md` coordinates implementation.
   Invokes `frontend-developer` for HTML/CSS/JS implementation.
   Invokes `ui-designer` and `graphic-artist` for design work.
   Invokes `test-automator` and `qa-expert` for testing.
   Invokes `code-reviewer` for code quality checks.

4. **Deployment stage:** `sdd/deployment.md` prepares release.

5. **Learning Engine:** `sdd/learning-engine.md` analyzes gate events.
   Invokes `error-detective` for escape root cause analysis.

### Gate Ownership (Solo Operator)
All gates owned by Grant with AI agent structured review.
See `governance/solo-operator-model.md` for the full model.
Critical tier requires external second reviewer.

### Conventions
- Spec IDs: `SPEC-NNN` (sequential, starting at 001)
- Checklists: `ARCH-SPEC-NNN`, `QA-SPEC-NNN`, `DEPLOY-SPEC-NNN`
- Branches: `spec/SPEC-NNN-short-description`
- Commits reference spec ID: `[SPEC-NNN] description`

### Complexity Tier Defaults
| Change Type | Default Tier |
|------------|-------------|
| Copy/content updates | Trivial |
| New static page | Standard |
| Styling/layout changes | Trivial or Standard |
| New interactive feature | Standard or Complex |
| Framework migration | Complex |
| AI agent integration | Complex or Critical |
| Auth/user accounts | Critical |
| Payment/subscription | Critical |

## Development Workflow

**Mandatory Process:** See `.claude/development-workflow.md` for complete workflow.

### Key Requirements
1. **Content Review:** All public-facing content MUST be reviewed by `marketing-copywriter` agent before implementation
2. **QA Process:** Complete QA checklist (`.claude/qa-checklist.md`) before every commit
3. **No Exceptions:** Even "small" changes follow the full process

### Quick Reference
- **Before writing content:** Ask "Will users see this?" → YES → Use marketing-copywriter
- **Before every commit:** Run QA checklist, document results in commit message
- **Before every push:** Confirm QA was completed

## Code Conventions

### HTML
- Semantic HTML5 (header, nav, main, section, footer)
- Accessibility: alt text, skip-to-content link, ARIA where needed
- SEO: meta tags, OG tags on every page

### CSS
- CSS custom properties for theming (defined in :root)
- Mobile-first responsive design
- Breakpoints: 768px, 480px
- Flexbox and Grid for layout
- No CSS frameworks

### JavaScript
- Vanilla ES6+ (no frameworks or build tools)
- `main.js` for shared functionality
- Client-side form validation pattern established
- Event delegation where appropriate

## Security

### Current
- Static site — minimal attack surface
- No user data collection beyond contact form (client-side only)
- No authentication or sessions
- HTTPS enforced via hosting provider

### Future Requirements
- Auth via established provider (not custom-built)
- Payments via Stripe or equivalent (never handle card data directly)
- PII encrypted at rest and in transit
- Rate limiting on API endpoints
- Agent conversation data retention policy
