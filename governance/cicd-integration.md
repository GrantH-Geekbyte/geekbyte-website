# CI/CD Integration with SDD Gates

**Specification:** SPEC-007
**Version:** 1.0
**Last Updated:** 2026-02-04
**Owner:** Grant Howe, Managing Partner

## Overview

This document describes the CI/CD pipeline integration that mechanically enforces SDD pipeline gates through GitHub Actions workflows and branch protection rules. The integration turns the SDD pipeline from a process people follow into a pipeline they cannot bypass.

## Workflow Descriptions

### PR Tests Workflow (.github/workflows/pr-tests.yml)

**Purpose:** Enforces the QA Gate mechanically by running the full Playwright test suite against every pull request.

**Trigger:** Runs automatically on pull_request events targeting the main branch.

**What it does:**
1. Checks out the code
2. Sets up Node.js v24 with npm caching
3. Installs dependencies with `npm ci` (reproducible builds)
4. Installs Playwright browsers (Chromium)
5. Starts local server in background (`npm run serve`)
6. Waits for server to be ready (http://localhost:3000)
7. Runs full Playwright test suite (`npm run test:local`)
8. Reports results as PR check status
9. Uploads test report as artifact on failure (90-day retention)

**Success criteria:** All tests must pass for PR to be mergeable.

**Execution time:** ~3 minutes (matches local execution time per NFR-1)

**Cost:** ~3 GitHub Actions minutes per PR run

### Post-Deploy Smoke Tests Workflow (.github/workflows/post-deploy-smoke.yml)

**Purpose:** Verifies production deployment health by running read-only smoke tests against the live site.

**Trigger:** Runs automatically when Vercel reports a successful production deployment via `deployment_status` webhook.

**What it does:**
1. Filters to production deployments only (ignores preview deployments)
2. Checks out the code
3. Sets up Node.js v24 with npm caching
4. Installs dependencies with `npm ci`
5. Installs Playwright browsers (Chromium)
6. Runs smoke tests against https://geekbyte.biz (`npm run test:live`)
7. Reports results in workflow summary with success/failure indicator
8. Uploads test report as artifact on failure (90-day retention)

**Smoke test subset:**
- `tests/e2e/pages.spec.js` — Page load verification (HTTP 200, title, structure)
- `tests/e2e/navigation.spec.js` — Navigation link resolution (no 404s)

**Production safety:** All smoke tests are read-only (HTTP GET only, no form submissions, no mutations).

**Execution time:** ~30 seconds (per NFR-2)

**Cost:** ~1 GitHub Actions minute per deployment

## Branch Protection Rules

**Branch:** main

**Configuration:** (Set via GitHub UI: Settings → Branches → Add rule)

| Rule | Setting | Rationale |
|------|---------|-----------|
| Require pull request before merging | ✅ Enabled | Enforces PR workflow, prevents direct commits |
| Require approvals | ✅ 1 approval | Solo operator self-review discipline, demonstrates team workflow |
| Dismiss stale approvals | ✅ Enabled | Ensures new code is reviewed after changes |
| Require status checks to pass | ✅ Enabled | Enforces QA Gate mechanically |
| Required status check | "PR Tests" | Must pass before merge allowed |
| Require branches to be up to date | ❌ Disabled | Solo operator — no merge conflicts expected |
| Do not allow bypassing | ✅ Enabled | Enforces discipline, even for admins |
| Allow force pushes | ❌ Disabled | Protects git history integrity |
| Allow deletions | ❌ Disabled | Prevents accidental branch removal |

**Verification:** After configuration, test by attempting direct commit to main (should be rejected).

## Failure Response Procedures

### PR Test Failures

**When:** PR Tests workflow fails on a pull request.

**What it means:** The code does not meet QA Gate criteria (tests are failing).

**How to respond:**

1. **Check the workflow run:**
   - Go to the PR → Checks tab → "PR Tests" workflow
   - Click "Details" to view the workflow log
   - Review the test failure output

2. **Download the test report:**
   - Click "Summary" at the top of the workflow run
   - Scroll to "Artifacts" section
   - Download "playwright-report"
   - Extract and open `index.html` in browser

3. **Fix the failing tests:**
   - If tests are failing due to a real bug: Fix the bug in the code
   - If tests are failing due to intentional behavior change: Update the tests
   - If tests are flaky: Investigate flakiness and fix the test

4. **Re-run the workflow:**
   - Push new commits to the PR branch
   - Workflow will automatically re-run
   - Verify tests pass before requesting approval

5. **Do NOT bypass:**
   - Merging with failing tests defeats the purpose of the QA Gate
   - Only use emergency bypass procedure for Critical tier hotfixes (see below)

### Smoke Test Failures

**When:** Post-Deploy Smoke Tests workflow fails after a production deployment.

**What it means:** The production site is not working as expected (potential regression).

**How to respond:**

1. **Assess severity:**
   - Go to Actions tab → "Post-Deploy Smoke Tests" workflow
   - Click the failed run → Review workflow summary
   - Download the test report artifact if available

2. **Determine if rollback is needed:**
   - **Critical failure** (site unreachable, major pages 404): Rollback immediately
   - **Minor failure** (flaky test, non-critical page): Investigate before deciding
   - **False positive** (test bug, not production bug): Fix test in next PR

3. **Execute rollback on Vercel (if needed):**
   - Go to Vercel dashboard → geekbyte.biz project
   - Go to Deployments tab
   - Find the previous successful deployment
   - Click "..." menu → "Promote to Production"
   - Confirm promotion
   - Verify site is working by manually visiting key pages

4. **Create escape incident report:**
   - If the failure represents a real regression that reached production:
     - Create `learning/escapes/ESC-INC-XXX.md`
     - Document what escaped, why tests didn't catch it, root cause
     - Add to Learning Engine backlog for analysis
   - If the failure is a false positive (test bug):
     - No escape report needed
     - Create a spec to fix the flaky test

5. **Fix the root cause:**
   - Create a new spec to address the regression
   - Follow SDD pipeline (don't skip gates to rush a fix)
   - Use Critical tier if immediate fix required

### Common Troubleshooting

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| PR Tests fail with "connection refused" | Server didn't start | Check `npm run serve` logs in workflow, verify package.json has serve script |
| PR Tests fail with "timeout" | Tests taking too long | Check if external resources are slow, increase timeout in playwright.config.js |
| PR Tests pass locally but fail in CI | Environment difference | Check for hardcoded localhost, missing dependencies, or timing issues |
| Smoke tests fail with 404 | Vercel deployment incomplete | Wait 1-2 minutes and manually re-run workflow |
| Smoke tests fail with timeout | Live site slow or unreachable | Check Vercel status page, verify DNS, test site manually |
| Workflow doesn't trigger | Webhook configuration issue | Verify Vercel GitHub integration, check webhook delivery logs |

## Emergency Bypass Procedure

**When to use:** Critical tier hotfixes only (production down, security vulnerability, data loss risk).

**When NOT to use:** Convenience, deadline pressure, "just this once" situations.

### Procedure

1. **Document the emergency:**
   - Create a file: `learning/events/LE-YYYY-MM-DD-emergency-bypass.md`
   - Document: What's broken, impact, why bypass is necessary, who authorized

2. **Temporarily disable branch protection:**
   - Go to GitHub → Settings → Branches → Edit rule for "main"
   - Uncheck "Require pull request before merging"
   - Click "Save changes"
   - **Screenshot the original settings before changing**

3. **Apply the hotfix:**
   - Commit directly to main with message format: `[EMERGENCY] Description`
   - Push to main
   - Verify fix in production immediately

4. **Re-enable branch protection:**
   - Go to GitHub → Settings → Branches → Edit rule for "main"
   - Re-check "Require pull request before merging"
   - Restore all original settings (use screenshot)
   - Click "Save changes"

5. **Create retrospective spec (within 24 hours):**
   - Create a spec documenting what was changed
   - Include: Root cause analysis, why bypass was necessary, how to prevent recurrence
   - Assign Critical tier
   - Complete all gates retroactively (architecture review, QA review, deployment review)
   - Purpose: Ensure the emergency change gets the scrutiny it would have received normally

### Authorization

- **Solo operator:** Grant Howe can authorize emergency bypass
- **Future team:** Requires VP Engineering or CTO approval

### Audit Trail

All branch protection changes are logged in GitHub's audit log:
- Settings → Developer settings → Audit log
- Filter by "protected_branch"

## Vercel Webhook Configuration

**Required for post-deploy smoke tests to trigger automatically.**

### Verification Steps

1. Go to Vercel dashboard → geekbyte.biz project
2. Go to Settings → Git
3. Confirm GitHub integration is active
4. Go to Settings → Webhooks (if available)
5. Verify webhook sends `deployment_status` events to GitHub

### Testing Webhook Delivery

1. Push a commit to main (or merge a PR)
2. Wait for Vercel to deploy
3. Go to GitHub → Settings → Webhooks
4. Click "Recent Deliveries"
5. Find the `deployment_status` event
6. Verify payload includes:
   - `state: "success"`
   - `environment: "production"`

### Fallback: Manual Smoke Test Execution

If webhook is not configured or unreliable:

1. Go to GitHub → Actions tab
2. Click "Post-Deploy Smoke Tests" workflow
3. Click "Run workflow" dropdown
4. Select branch: main
5. Click "Run workflow"

**Note:** This requires adding `workflow_dispatch` trigger to the workflow file (out of scope for SPEC-007, create future spec if needed).

## Artifact Management

### Test Report Artifacts

**Storage:**
- PR test reports: `playwright-report` artifact (uploaded on failure only)
- Smoke test reports: `smoke-test-report` artifact (uploaded on failure only)

**Retention:** 90 days (GitHub default)

**Estimated storage:**
- Average report size: ~5MB (includes screenshots, videos, traces)
- Projected failures: ~10 per month (optimistic)
- Total storage: ~50MB per month, ~150MB over 3 months
- Well under GitHub's 500MB free tier limit

**Accessing artifacts:**
1. Go to the workflow run (Actions tab)
2. Click "Summary"
3. Scroll to "Artifacts" section
4. Click artifact name to download (ZIP file)
5. Extract and open `index.html` to view report

### Cleanup

GitHub automatically deletes artifacts after 90 days. No manual cleanup required.

If storage becomes an issue:
- Reduce retention period (edit workflow file, change `retention-days`)
- Upload only traces (not full HTML report)
- Compress artifacts before upload

## Cost Estimation

**GitHub Actions Free Tier:**
- 2000 minutes per month for private repositories
- Unlimited for public repositories

**Projected Usage (private repo):**
- PR tests: 50 PRs/month × 3 min = 150 min/month
- Smoke tests: 50 deployments/month × 1 min = 50 min/month
- **Total: 200 min/month** (10% of free tier)

**Well within free tier limits.** No cost impact expected.

## Maintenance

### Workflow File Updates

**When to update:**
- Node.js version changes (update `node-version` in both workflows)
- Test commands change (update `npm run` commands)
- New test types added (update PR tests workflow)
- Smoke test subset changes (update post-deploy workflow description)

**How to update:**
- Create a spec (Trivial or Standard tier depending on change)
- Update workflow file in `.github/workflows/`
- Test by creating a PR and verifying workflow runs correctly

### PR Template Updates

**When to update:**
- SDD pipeline gates added/removed
- Tier definitions change
- New gate criteria introduced

**How to update:**
- Update `.github/pull_request_template.md`
- No deployment required (takes effect immediately on next PR)

### Branch Protection Updates

**When to update:**
- Adding/removing required status checks
- Changing approval count
- Adjusting bypass permissions

**How to update:**
- Go to GitHub → Settings → Branches → Edit rule
- Make changes
- Document changes in this file

### Quarterly Review

**Cadence:** Every 90 days (aligned with SDD Adoption phase milestones)

**Review checklist:**
- Verify workflows are running successfully (check failure rate)
- Review artifact storage usage (ensure under limits)
- Verify GitHub Actions minute usage (ensure under free tier)
- Review emergency bypass log (ensure procedure followed correctly)
- Update documentation if process has evolved

## Future Enhancements

**Out of scope for SPEC-007, potential future specs:**

- **SPEC-008:** Automated issue creation on smoke test failure (Trivial)
- **SPEC-009:** Slack/email notifications for workflow failures (Trivial)
- **SPEC-010:** Multi-environment deployments (staging, preview) (Standard)
- **SPEC-011:** Visual regression testing in CI (Standard)
- **SPEC-012:** Performance testing in CI (Lighthouse, Core Web Vitals) (Standard)
- **SPEC-013:** Automated rollback on smoke test failure (Complex)
- **SPEC-014:** GitHub Projects board automation (Standard)

## References

- **Spec:** `specs/SPEC-007-cicd-pipeline-integration.md`
- **Architecture Review:** `checklists/ARCH-SPEC-007.md`
- **Solo Operator Model:** `governance/solo-operator-model.md`
- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Playwright Docs:** https://playwright.dev/docs/ci
- **Vercel Webhook Docs:** https://vercel.com/docs/concepts/git/vercel-for-github

---

**Document Status:** ✅ Complete (all conditions from ARCH-SPEC-007 addressed)
