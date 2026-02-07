# Feature Specification

spec_id: SPEC-010
title: Multi-Environment Deployments (Staging + Production)
version: 1.0
status: pending
complexity_tier: standard
last_updated: 2026-02-05

## Business Context

requester: Grant Howe, Managing Partner
business_goal: Reduce deployment risk by adding a staging environment where changes can be tested in production-like conditions before releasing to live site. Currently, PRs deploy directly to production after tests pass. While CI tests catch code issues, they cannot catch deployment-environment issues (build configs, environment variables, CDN behavior, asset optimization) or cross-browser rendering issues in the deployed context. A staging environment acts as a "dress rehearsal" where PM and stakeholders can review the deployed site (not local dev build) before production release.
success_metrics:
  - All PRs auto-deploy to staging after merge to main
  - Staging environment reflects production configuration exactly (baseURL, analytics disabled, environment variables)
  - PM can review staging site before production promotion
  - Production deployments require manual approval gate (staging review → approval → production)
  - Zero staging-to-production failures due to missed environment configuration issues
  - Vercel preview deployments available for all PRs (visual review before merge)
priority: P2 (process improvement — reduces deployment risk, not blocking feature work)

## Requirements

### Functional Requirements

- [FR-1]: Vercel project configured with multiple deployment environments
  - Production environment: geekbyte.biz (existing, no change)
  - Staging environment: staging.geekbyte.biz (new subdomain or preview URL)
  - Preview environment: auto-generated previews for each PR (Vercel default)
  - Each environment has its own deployment URL and environment variables
- [FR-2]: Automated staging deployment triggered by main branch commits
  - When PR is merged to main, Vercel auto-deploys to staging (Vercel webhook integration)
  - Staging deployment triggered independently from production (separate deployments, not aliases)
  - Deployment URL is consistent and known (staging.geekbyte.biz or hardcoded preview URL)
- [FR-3]: Environment-specific configuration applied per deployment context
  - Base URL configuration (affects API calls, form submission targets — currently not applicable for static site, but future-proof for Phase 3)
  - Analytics disabled on staging (prevent staging traffic from inflating production metrics)
  - Feature flags disabled/enabled per environment (if implemented in future)
  - Sitemap blocked on staging (prevent search engines indexing staging)
  - robots.txt configured to disallow staging crawling
- [FR-4]: Post-staging smoke tests run on staging environment
  - When staging deployment completes, smoke tests run against staging.geekbyte.biz
  - Same test suite as production (pages.spec.js, navigation.spec.js)
  - Tests report in GitHub workflow artifacts
  - Tests failure does NOT block production deployment (approval gate is manual)
- [FR-5]: Manual approval gate between staging and production
  - PM reviews staging.geekbyte.biz (visual inspection, cross-browser testing)
  - Creates GitHub release or manual deployment trigger in Vercel
  - Only after approval does production deployment occur
  - Approval documented in release notes or deployment log
- [FR-6]: Vercel preview deployments for pull requests
  - Every PR gets a unique preview URL (Vercel automatic)
  - Preview is production-like (uses production config where applicable)
  - Preview URL posted in PR for visual review before merge
  - Preview cleaned up after PR merge (Vercel automatic)
- [FR-7]: Environment configuration managed as code
  - `.vercelenv.staging` file defines staging environment variables
  - `.vercelenv.production` file defines production environment variables
  - vercel.json configured with environment assignments per deployment target
  - Configuration supports future base URL, analytics keys, feature flags
- [FR-8]: Deployment documentation created
  - Deployment flow diagram (PR → staging → production)
  - How to review staging site
  - How to promote staging to production (manual step-by-step)
  - How to handle staging deployment failures
  - How to handle rollback (revert main commit or manual revert in Vercel)
  - Environment variable management process

### Non-Functional Requirements

- [NFR-1]: Staging environment is identical to production in configuration (except analytics, base URLs)
- [NFR-2]: Staging deployment completes within 2 minutes (matches current production deployment time)
- [NFR-3]: Staging smoke tests complete within 30 seconds
- [NFR-4]: Staging and production can be deployed independently (no shared state)
- [NFR-5]: Staging environment fully operational before manual approval gate is triggered
- [NFR-6]: Environment variables stored securely (Vercel's encrypted environment variable storage)
- [NFR-7]: No cross-environment data leakage (analytics events, form submissions, etc.)

## Acceptance Criteria

- [AC-1]: Given a PR merged to main, when merge is complete, then Vercel deploys to staging.geekbyte.biz (or preview URL) automatically
- [AC-2]: Given staging deployment completes, when reviewing staging.geekbyte.biz, then the site renders identically to production (CSS, layout, navigation)
- [AC-3]: Given staging deployment completes, when smoke tests run against staging, then test results report successfully or indicate failures without blocking further action
- [AC-4]: Given PM reviews staging site, when changes are verified, then PM can manually trigger production deployment (via Vercel console or GitHub release)
- [AC-5]: Given production deployment is triggered, when deployment completes, then site at geekbyte.biz displays the approved changes
- [AC-6]: Given a PR is created, when the PR is created, then Vercel generates a preview deployment URL and posts it in PR comments
- [AC-7]: Given staging deployment, when checking environment configuration, then analytics are disabled (no staging traffic in production metrics)
- [AC-8]: Given staging.geekbyte.biz, when checking robots.txt, then crawling is disallowed for search engines
- [AC-9]: Given a rollback is needed, when main is reverted and re-pushed, then staging redeploys with previous working version automatically
- [AC-10]: Given deployment documentation, when a developer reads how to promote staging, then steps are clear and require no external research

## Scope

### In Scope
- Vercel environment configuration (staging + production)
- Environment variable files (.vercelenv.staging, .vercelenv.production)
- vercel.json configuration for multi-environment deployments
- GitHub Actions workflow for staging smoke tests (similar to SPEC-007 post-deploy workflow, targeted at staging)
- Robots.txt and sitemap modifications to prevent staging indexing
- Deployment documentation (flow, promotion steps, troubleshooting)
- Update PR template to reference staging review step
- Manual approval gate process documentation

### Out of Scope
- Automatic production promotion (requires manual approval — keeping gate human-controlled)
- Slack/email notifications for staging completions (GitHub provides built-in notifications)
- Staging domain purchase or DNS configuration (assumed already handled or delegated to DevOps)
- Production infrastructure changes (staging reuses existing Vercel project configuration)
- Automated environment variable rotation or secret management (use Vercel's built-in encrypted storage)
- Staging data backup or retention policies (staging is ephemeral per deployment)
- Custom staging subdomain routing (delegated to Vercel configuration)

## Dependencies

- [DEP-1]: SPEC-007 deployed — CI/CD workflows and branch protection exist (satisfied)
- [DEP-2]: SPEC-002 deployed — Playwright smoke tests exist and runnable (satisfied)
- [DEP-3]: Vercel project configured with GitHub integration (assumed satisfied — current deployment uses Vercel)
- [DEP-4]: Vercel supports environment-specific deployments (confirmed: Vercel supports multiple environments via environment variables and branch/production settings)
- [DEP-5]: Domain DNS configured to support staging.geekbyte.biz subdomain (technical dependency — DevOps to verify)
- [DEP-6]: GitHub API access to create/manage releases for approval workflow (Grant has admin access)

## Technical Notes

### Deployment Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Developer creates PR, requests review                           │
├─────────────────────────────────────────────────────────────────┤
│ → Vercel auto-deploys PR to preview.geekbyte.biz/prj/...       │
│ → Preview URL posted in PR comments                             │
│ → Stakeholders review preview                                   │
├─────────────────────────────────────────────────────────────────┤
│ PR approved and merged to main                                  │
├─────────────────────────────────────────────────────────────────┤
│ → GitHub Actions pr-tests.yml runs (SPEC-007)                   │
│ → If tests pass, merge proceeds                                 │
├─────────────────────────────────────────────────────────────────┤
│ main branch updated with new commit                             │
├─────────────────────────────────────────────────────────────────┤
│ → Vercel deploys main to staging.geekbyte.biz                   │
│ → Staging smoke tests trigger (post-staging-deploy-smoke.yml)   │
│ → Staging tests report (success or failure — non-blocking)      │
├─────────────────────────────────────────────────────────────────┤
│ PM reviews staging.geekbyte.biz                                 │
│ (visual inspection, form testing, layout verification)          │
├─────────────────────────────────────────────────────────────────┤
│ PM decides: approve for production or request changes           │
├─────────────────────────────────────────────────────────────────┤
│ IF approved:                                                     │
│ → PM creates GitHub Release (manual or via script)              │
│ → Release triggers Vercel production deployment                 │
│ → geekbyte.biz updates                                          │
│ → Post-deploy smoke tests run against production (SPEC-007)     │
│                                                                 │
│ IF not approved:                                                │
│ → Developer receives feedback and creates new PR                │
│ → Cycle repeats                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Environment Configuration Strategy

**Staging Environment Variables (.vercelenv.staging):**
```
ANALYTICS_ENABLED=false
BASE_URL=https://staging.geekbyte.biz
ENVIRONMENT=staging
FORM_SUBMISSION_ENDPOINT=https://staging-api.geekbyte.biz/submit (future)
FEATURE_FLAG_NEW_PRODUCT=false
```

**Production Environment Variables (.vercelenv.production):**
```
ANALYTICS_ENABLED=true
BASE_URL=https://www.geekbyte.biz
ENVIRONMENT=production
FORM_SUBMISSION_ENDPOINT=https://api.geekbyte.biz/submit (future)
FEATURE_FLAG_NEW_PRODUCT=false
```

**Vercel Configuration (vercel.json):**
- Production branch: main (already configured)
- Production environment: .vercelenv.production
- Preview/staging environment: .vercelenv.staging
- Automatic deployments: enabled for main branch
- Manual deployments for production: via GitHub Release event (documentation TBD)

### Key Architectural Decisions for Review

1. **Staging Trigger Strategy:**
   - Staging deploys on every main commit (not just releases)
   - Rationale: Continuous availability for testing, catch issues early
   - Alternative considered: Deploy only on tags (rejected: too friction-heavy)

2. **Manual Production Promotion:**
   - Production requires human approval after staging review
   - Rationale: Staging tests cannot catch all issues (UX, marketing copy, client expectations)
   - Approval gate: PM (Grant) reviews staging for sign-off
   - Alternative considered: Auto-promote after staging tests pass (rejected: defeats purpose of staging)

3. **Environment Variable Management:**
   - Use Vercel's encrypted environment storage (not .env files in repo)
   - Rationale: Security (no secrets in git), flexibility (change per deployment), audit trail
   - Configuration as code: vercel.json and .vercelenv files document structure (no secrets)

4. **Preview Deployments:**
   - Vercel's automatic PR previews (not custom implementation)
   - Rationale: Zero maintenance, integrated with GitHub, ephemeral cleanup
   - Enables visual review before merge (catches styling, layout issues)

5. **Smoke Tests on Staging:**
   - Same tests as production, different base URL
   - Rationale: Verify deployed code runs in staging environment, not just local
   - Non-blocking: Staging tests don't prevent production deployment
   - Rationale: Manual approval gate is the real safety mechanism; tests are warning signal

6. **robots.txt and Sitemap Control:**
   - robots.txt disallows staging crawling
   - Sitemap not served on staging
   - Rationale: Prevent staging content from ranking in search engines, prevent analytics pollution

### Vercel Integration Details

**Current State (verify during implementation):**
- Vercel is configured as production host (assumed based on CLAUDE.md)
- GitHub integration sends deployment webhooks
- Production branch: main
- Auto-deploy on main push: enabled (assumed)

**Configuration Changes:**
- Add staging deployment configuration (branch or environment-based)
- If using branch-based: create separate branch for staging (rejected: too complex)
- If using environment-based: Vercel environments feature (recommended)
- Add environment variables per environment (Vercel UI or API)

**Verification Steps (during implementation):**
- Confirm Vercel webhook sends `deployment_status` for staging deployments
- Confirm staging environment can be targeted independently from production
- Confirm environment variables are isolated per environment

### Robots.txt Implementation

**Current robots.txt (production):**
```
User-agent: *
Allow: /
Sitemap: https://www.geekbyte.biz/sitemap.xml
```

**Staging robots.txt:**
```
User-agent: *
Disallow: /
```

**Implementation approach:**
- Conditional rendering in HTML or build process (simple: check environment variable)
- Staging serves `Disallow: /` to block crawling
- Production serves normal `Allow: /`

## Tier Justification

rationale: Standard tier. Adds deployment environments and promotion workflow — standard DevOps practice with well-understood Vercel capabilities. No code changes to application (only config changes). Requires architecture review to validate environment configuration strategy and approval gate workflow. QA verification confirms environment isolation and deployment mechanics. No escalation triggers for Critical tier.

escalation_triggers_checked:
  - Authentication/authorization: No (approval gate is process-based, not code-based)
  - Payment/financial data: No
  - PII/PHI handling: No (static site, no user data handling change)
  - New external integration: No (Vercel already integrated)
  - Database schema change: No
  - Core domain model: No
  - New architectural pattern: No (multi-environment deployment is standard)

## Gate Log

| Gate | Reviewer | Date | Decision | Evidence |
|------|----------|------|----------|----------|
| Spec | _pending_ | _TBD_ | _PENDING_ | PM spec authoring complete. 8 FR, 7 NFR, 10 AC. Scope clear, dependencies identified, tier justified. Architecture gate recommended for environment configuration strategy and Vercel multi-environment setup verification. |
| Architecture | _pending_ | _TBD_ | _PENDING_ | Awaiting architect-reviewer validation. Key decisions: staging trigger strategy, manual approval gate, environment variable management, robots.txt control. Checklist: checklists/ARCH-SPEC-010.md |
| QA | _pending_ | _TBD_ | _PENDING_ | Awaiting implementation and QA validation. Test scenarios: AC-1 through AC-10. Checklist: checklists/QA-SPEC-010.md |
| Deploy | _pending_ | _TBD_ | _PENDING_ | Awaiting deployment gate. Checklist: checklists/DEPLOY-SPEC-010.md |

## Effort Comparison

| Stage | AI Time | Human Estimate | Human Breakdown |
|-------|---------|----------------|-----------------|
| **Spec Writing** | 15 min | 2-2.5 hours | Research Vercel multi-environment features (30m), design deployment flow and approval gate (30m), write 8 FRs with technical details (30m), write 10 ACs with deployment scenarios (25m), scope & dependencies (15m), technical notes & architecture decisions (20m) |
| **Architecture Review** | 12 min | 1.5-2 hours | Review environment configuration strategy (20m), validate Vercel multi-environment setup (15m), assess approval gate workflow (15m), review robots.txt and analytics isolation (10m), document conditions & recommendations (20m), verify DNS dependencies (15m) |
| **Implementation + Test** | 20 min | 4-5 hours | Vercel environment configuration (30m), environment variable setup (.vercelenv files) (20m), vercel.json configuration (20m), create staging smoke test workflow (30m), modify robots.txt for staging (15m), update PR template (10m), write deployment documentation (45m), test staging deployment end-to-end (45m), verify environment isolation (20m), QA checklist (30m) |
| **Deployment** | _deployment agent_ | 15-20 min | Create deployment checklist (5m), git commit environment configs + docs + workflow (3m), git push to GitHub (1m), Vercel environment configuration (10m), create test PR to verify staging deploy (5m), manual test staging review process (5m), document deployment results (2m) |
| **Total** | 47 min | 7-9.5 hours | **AI Speedup: 9-12x** |

### Assumptions
- **Spec Writing:** PM familiar with deployment concepts and Vercel (standard for web projects at this scale). Spec captures deployment flow, environment strategy, and approval gate mechanics.
- **Architecture Review:** Architect familiar with Vercel, multi-environment deployments, and testing strategies. Validates environment isolation, workflow design, and production safety.
- **Implementation:** Senior developer or DevOps engineer (3-5 years experience), familiar with Vercel configuration and GitHub Actions. Tasks: Vercel env setup (30m), workflow creation (30m), documentation (45m), testing (1h 5m). AI time includes research on Vercel features, environment variable structure, and approval gate process.
- **Deployment:** DevOps lead familiar with Vercel and GitHub. Includes: environment configuration (10m), git operations (4m), test PR workflow (5m), manual verification (5m), documentation (2m).
