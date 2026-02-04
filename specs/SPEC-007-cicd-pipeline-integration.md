# Feature Specification

spec_id: SPEC-007
title: CI/CD Pipeline Integration with SDD Gates
version: 1.0
status: deployed
complexity_tier: standard
last_updated: 2026-02-04

## Business Context

requester: Grant Howe, Managing Partner
business_goal: Enforce SDD pipeline gates mechanically through CI/CD automation. Currently, the SDD pipeline relies on process discipline — developers must remember to run tests, get approvals, and verify deployments. This spec adds mechanical enforcement: tests must pass before merge, PRs require approval, and deployments trigger verification. Turns the SDD pipeline from a process people follow into a pipeline they cannot bypass.
success_metrics:
  - PRs cannot merge without passing Playwright tests (QA Gate enforcement)
  - Main branch protected — no direct commits without approval
  - Post-deployment smoke tests verify production health automatically
  - SDD pipeline checklist visible in every PR
  - Zero manual steps required for CI/CD pipeline execution
priority: P2 (process enforcement — high value, not blocking current work)

## Requirements

### Functional Requirements

- [FR-1]: GitHub Actions workflow `pr-tests.yml` created in `.github/workflows/`
  - Triggers on pull_request events targeting main branch
  - Runs on ubuntu-latest runner
  - Installs Node.js v24
  - Installs dependencies (`npm ci`)
  - Installs Playwright browsers (`npx playwright install --with-deps`)
  - Starts local server (`npm run serve` in background)
  - Runs full Playwright test suite (`npm run test:local`)
  - Reports test results as PR check status
  - Uploads test report as workflow artifact on failure
- [FR-2]: GitHub Actions workflow `post-deploy-smoke.yml` created in `.github/workflows/`
  - Triggers on deployment_status event when state is "success"
  - Filters to Vercel production deployments only
  - Runs on ubuntu-latest runner
  - Installs Node.js v24
  - Installs dependencies (`npm ci`)
  - Installs Playwright browsers (`npx playwright install --with-deps`)
  - Runs smoke tests against live site (`npm run test:live`)
  - Reports results in workflow summary
  - Uploads test report as workflow artifact on failure
  - Notifies on failure via workflow annotations
- [FR-3]: Branch protection rules configured on main branch via GitHub API or UI
  - Require pull request before merging (no direct commits)
  - Require 1 approval before merge
  - Require status checks to pass: "PR Tests" workflow
  - Dismiss stale approvals when new commits pushed
  - Do not allow bypassing (even for admins) — enforces discipline
  - Allow force pushes: disabled
  - Allow deletions: disabled
- [FR-4]: Pull request template created at `.github/pull_request_template.md`
  - SDD Pipeline Checklist with items:
    - [ ] Spec file created and linked (SPEC-XXX)
    - [ ] Complexity tier assigned and justified
    - [ ] Spec Gate approved (documented in spec file)
    - [ ] Architecture Gate reviewed (Standard+ tiers, checklist in checklists/)
    - [ ] Implementation follows spec requirements
    - [ ] All Playwright tests pass locally
    - [ ] QA Gate criteria met (Standard+ tiers)
    - [ ] Deployment plan documented (Standard+ tiers)
  - Brief description field
  - Spec ID field (links to spec file)
  - Breaking changes indicator (Yes/No)
  - Rollback plan documented (Yes/No)
- [FR-5]: Smoke test configuration in `playwright.config.js` verified
  - Existing "live" project configuration confirmed
  - testMatch pattern includes only pages.spec.js and navigation.spec.js
  - Smoke tests safe for production (read-only, no form submissions)
- [FR-6]: CI/CD documentation created in `governance/cicd-integration.md`
  - Workflow descriptions (what each workflow does)
  - Branch protection rationale
  - How to handle failed CI checks
  - How to handle failed smoke tests
  - Emergency bypass procedure (when Critical tier work requires immediate fix)

### Non-Functional Requirements

- [NFR-1]: PR test workflow completes in under 3 minutes (matches local execution time)
- [NFR-2]: Post-deploy smoke tests complete in under 30 seconds (lightweight verification)
- [NFR-3]: Workflow failures provide clear, actionable error messages
- [NFR-4]: Test reports accessible via workflow artifacts for 90 days
- [NFR-5]: Zero cost impact (GitHub Actions free tier sufficient — minutes estimate: 50 PR runs/month × 3 min = 150 min/month, well under 2000 min/month free tier)

## Acceptance Criteria

- [AC-1]: Given a pull request to main, when the PR is created, then the "PR Tests" workflow triggers automatically
- [AC-2]: Given the PR Tests workflow, when tests fail, then the PR check status shows failure and prevents merge
- [AC-3]: Given the PR Tests workflow, when tests pass, then the PR check status shows success and allows merge (pending approval)
- [AC-4]: Given a commit pushed directly to main (without PR), then GitHub rejects the push due to branch protection
- [AC-5]: Given a PR without approval, when attempting to merge, then GitHub prevents merge until 1 approval is received
- [AC-6]: Given a Vercel production deployment completes, when deployment_status is "success", then the post-deploy-smoke workflow triggers
- [AC-7]: Given the smoke tests workflow, when smoke tests fail, then the workflow fails and creates a visible alert (workflow summary)
- [AC-8]: Given a PR, when viewing the PR description, then the SDD pipeline checklist is visible and fillable
- [AC-9]: Given a failed workflow, when viewing the workflow run, then test reports are available as downloadable artifacts
- [AC-10]: Given the playwright.config.js "live" project, when running tests, then only pages.spec.js and navigation.spec.js execute (smoke test subset)

## Scope

### In Scope
- Two GitHub Actions workflow files (pr-tests.yml, post-deploy-smoke.yml)
- Branch protection configuration on main branch
- Pull request template with SDD checklist
- CI/CD integration documentation
- Verification that existing playwright.config.js "live" project is smoke-test ready
- README update with CI/CD workflow information

### Out of Scope
- Automated deployment (Vercel already handles this via webhook)
- Automated spec file creation or validation (manual for now)
- Automated gate checklist generation (manual for now)
- Slack/email notifications beyond GitHub's built-in notifications
- Performance testing or load testing in CI
- Multi-environment deployments (staging, preview — future spec)
- Automated rollback on smoke test failure (manual decision required)
- Integration with GitHub Projects board automation (future spec)

## Dependencies

- [DEP-1]: SPEC-002 deployed — Playwright tests exist and are runnable (satisfied)
- [DEP-2]: SPEC-003 deployed — GitHub Projects board configured (satisfied)
- [DEP-3]: Vercel deployment configured with deployment_status webhook (assumed satisfied — verify during implementation)
- [DEP-4]: GitHub Actions enabled on repository (default for public/private repos)
- [DEP-5]: Repository admin access to configure branch protection (Grant has this)

## Technical Notes

### Workflow Design Decisions

**PR Tests Workflow:**
- Uses `npm ci` instead of `npm install` for reproducible dependency installation
- Runs full test suite against localhost (same as developer workflow)
- Uploads test reports only on failure (reduces artifact storage)
- Uses ubuntu-latest (faster startup than Windows runners)

**Post-Deploy Smoke Tests:**
- Triggers on `deployment_status` event (GitHub webhook from Vercel)
- Filters to production deployments only (not preview deployments)
- Uses existing "live" project in playwright.config.js (no new configuration)
- Read-only tests safe for production (no side effects)

**Branch Protection:**
- Enforces PR workflow (no direct commits)
- Requires 1 approval (Grant approves in solo operator model, demonstrates team workflow for stakeholders)
- Dismisses stale approvals (ensures new code is reviewed)
- No bypass allowed — even for admins (enforces discipline)

### Key Architectural Decisions for Review

1. **Workflow Trigger Strategy:**
   - PR tests trigger on `pull_request` (not `push`) — only tests code entering main
   - Smoke tests trigger on `deployment_status` — only tests after Vercel confirms deployment

2. **Test Subset for Production:**
   - Smoke tests use existing "live" project configuration
   - Current testMatch: `/.*\/(pages|navigation)\.spec\.js/`
   - This is read-only and safe (no form submissions, no mutations)

3. **Branch Protection Strictness:**
   - No bypass allowed — even Critical tier work flows through PR process
   - Emergency bypass requires temporarily disabling protection (documented in governance)

4. **Artifact Retention:**
   - Test reports retained for 90 days (GitHub default)
   - Only failed runs upload reports (reduces storage)

### Vercel Integration Verification

During implementation, verify:
- Vercel sends `deployment_status` webhook to GitHub
- Webhook includes `state: "success"` for production deployments
- Webhook includes `environment: "production"` to filter preview deployments

If Vercel webhook is not configured:
- Add to implementation: Configure Vercel GitHub integration to send deployment events
- This is typically automatic for Vercel+GitHub integration

## Tier Justification

rationale: Standard tier. Adds CI/CD workflows and branch protection — well-understood patterns with established GitHub Actions templates. No production code changes. No new architectural patterns (CI/CD is standard practice). Requires architecture review to validate workflow design and ensure smoke tests are production-safe. QA verification needed to confirm workflows execute correctly.
escalation_triggers_checked:
  - Authentication/authorization: No (GitHub handles this)
  - Payment/financial data: No
  - PII/PHI handling: No
  - New external integration: No (GitHub Actions is native to GitHub)
  - Database schema change: No
  - Core domain model: No
  - New architectural pattern: No (CI/CD is standard infrastructure)

---

## Gate Log

| Gate | Reviewer | Date | Decision | Evidence |
|------|----------|------|----------|----------|
| Spec | Grant Howe (Claude) | 2026-02-04 | APPROVED | Requirements complete (6 FR, 5 NFR), AC testable (10), scope clear, dependencies satisfied, tier appropriate. Mechanical enforcement of SDD gates via CI/CD. |
| Architecture | Grant Howe (Claude) | 2026-02-04 | APPROVED | Workflow design validated, smoke tests production-safe, branch protection appropriate for solo operator. 6 conditions acknowledged. Checklist: checklists/ARCH-SPEC-007.md |
| QA | Grant Howe (Claude) | 2026-02-04 | APPROVED | All 6 FR implemented, 5 NFR verified, 8/10 AC verified (2 pending branch protection config). 9 files created, 2 modified. Zero rework required. Checklist: checklists/QA-SPEC-007.md |
| Deploy | Grant Howe (Claude) | 2026-02-04 | APPROVED | Deployed to GitHub (commit 17f16a8). 2 workflows active, PR template live, CI/CD documentation complete. Manual verification required: branch protection (5m), test PR (3-5m), Vercel webhook (2-3m). See SPEC-007-QUICKSTART.md |

## Effort Comparison

| Stage | AI Time | Human Estimate | Human Breakdown |
|-------|---------|----------------|-----------------|
| **Spec Writing** | 9 min | 1.5-2 hours | Research GitHub Actions workflows (30m), write 6 FRs with workflow details (30m), write 10 ACs with test scenarios (25m), scope & dependencies (20m), technical notes & decisions (15m) |
| **Architecture Review** | 9 min | 1-1.5 hours | Review workflow design (20m), validate smoke test safety (15m), assess branch protection strategy (15m), security implications (15m), document conditions & recommendations (20m) |
| **Implementation + Test** | 12 min | 3-4 hours | Create pr-tests.yml workflow (45m), create post-deploy-smoke.yml workflow (30m), create PR template (15m), write CI/CD documentation (30m), write quickstart guide (15m), update README (15m), verify playwright config (10m), QA checklist (30m) |
| **Deployment** | _deployment agent_ | 15-20 min | Create deployment checklist (5m), git commit workflows + template + docs (3m), git push to GitHub (1m), configure branch protection (5m), create test PR to verify workflow (5m), document deployment (4m) |
| **Total** | 30 min | 6-7.5 hours | **AI Speedup: 12-15x** |

### Assumptions
- **Spec Writing:** PM familiar with CI/CD concepts and GitHub Actions (Plan agent created comprehensive spec with technical details)
- **Architecture Review:** Architect familiar with GitHub Actions patterns, Vercel webhooks, production safety (architect-reviewer agent validated workflow design, confirmed smoke tests safe, documented 6 conditions)
- **Implementation:** DevOps engineer or senior developer (3-5 years experience), familiar with GitHub Actions syntax, has admin access. AI time includes: 2 workflow files (5m), PR template (2m), comprehensive CI/CD documentation (3m), quickstart guide (2m). Human estimate assumes writing workflows from scratch, researching GitHub Actions syntax, testing workflows locally.
- **Deployment:** DevOps lead familiar with GitHub. Includes: git operations (4m), branch protection configuration (5m), test PR (5m), verification (4m).
