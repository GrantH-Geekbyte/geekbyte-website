# SPEC-016: Fix Vercel Auto-Deployment Configuration

**Status:** Draft
**Created:** 2026-02-08
**Priority:** P1 (Critical - Blocking SPEC-014 deployment)
**Complexity:** Standard
**Estimated Effort:** 30-60 minutes

---

## Problem Statement

Vercel is not automatically deploying updates when PRs are merged to the `main` branch. This blocks production deployments and creates manual overhead.

**Current Behavior:**
- PR merged to `main` → No production deployment
- Vercel shows old commit (5b9a7ca from 19h ago) in production
- Latest `main` commit (71b892c, SPEC-014) not deployed

**Impact:**
- SPEC-014 stuck in deployment stage (code merged, not live)
- Manual deploy hooks required for every deployment
- No automated smoke tests triggering (rely on `deployment_status` webhooks)

---

## Business Context

**Why This Matters:**
- Deployment friction slows velocity and introduces risk
- Manual deployments increase chance of human error
- Blocks the multi-environment deployment model (SPEC-010)
- Prevents automated post-deploy verification (SPEC-007, SPEC-008)

**Current Workaround:**
- Manual deploy hooks (requires copy/paste URL, trigger via browser or curl)
- "Redeploy" button (redeploys same commit, not latest main)

---

## Requirements

### Functional Requirements

**FR-1: Auto-Deploy on Main Branch Updates**
- When PR is merged to `main`, Vercel automatically deploys to production
- Deployment uses the latest `main` commit, not a stale commit
- Deployment completes within 5 minutes of merge

**FR-2: GitHub Integration Configured**
- Vercel GitHub app has repository access
- Production branch is set to `main`
- Auto-deploy is enabled for production environment

**FR-3: Deployment Status Webhooks**
- Vercel sends `deployment_status` events to GitHub
- Events trigger GitHub Actions workflows:
  - `staging-smoke-tests.yml` (Preview deployments)
  - `post-deploy-smoke.yml` (Production deployments)

**FR-4: Deploy Verification**
- Ability to verify deployment configuration via Vercel UI
- Ability to test auto-deploy (make trivial change, confirm deployment triggers)

### Non-Functional Requirements

**NFR-1: Reliability**
- Auto-deployment success rate >99%
- Failed deployments surface errors in Vercel UI and GitHub

**NFR-2: Visibility**
- Deployment status visible in GitHub PR (Vercel bot comments)
- Deployment history searchable in Vercel dashboard

**NFR-3: Rollback**
- Previous working deployment easily identifiable
- Rollback via Vercel UI or git revert

---

## Acceptance Criteria

1. **AC-1:** Merge a trivial PR to `main` → Vercel deploys to production automatically within 5 minutes
2. **AC-2:** Production deployment shows latest `main` commit (not stale commit)
3. **AC-3:** Vercel Settings → Git shows "Production Branch: main" with auto-deploy enabled
4. **AC-4:** GitHub Actions workflow "Post-Deploy Smoke Tests" triggers on production deployment
5. **AC-5:** SPEC-014 successfully deploys to production using the fixed configuration

---

## Scope

### In Scope
- Vercel project settings configuration
- GitHub integration verification
- Webhook configuration for GitHub Actions
- Testing auto-deploy with SPEC-014
- Documentation of correct Vercel settings

### Out of Scope
- Changing GitHub branch protection rules
- Adding new GitHub Actions workflows (already exist)
- Vercel CLI installation (UI configuration sufficient)
- Multi-region deployments or CDN configuration

---

## Technical Approach

### Investigation Steps

1. **Verify GitHub Integration:**
   - Vercel Settings → Git → "Connected Git Repository"
   - Confirm: GrantH-Geekbyte/geekbyte-website connected
   - Check: GitHub App permissions (read/write to repository)

2. **Check Production Branch Setting:**
   - Vercel Settings → Git → Look for "Production Branch" or similar
   - Expected: Should be set to `main`
   - If not visible: Check Vercel Project Settings → General

3. **Review Deployment Triggers:**
   - Vercel Settings → Git → Check if "Auto Deploy" or "Production Deployments" toggle exists
   - Verify: Deployments triggered on push to production branch

4. **Webhook Configuration:**
   - GitHub Repo Settings → Webhooks
   - Check if Vercel webhook exists
   - Events: Should include `deployment_status`

### Configuration Changes

**Option A: Vercel UI (Preferred)**
1. Navigate to Vercel Project → Settings → Git
2. Set "Production Branch" to `main` (if not already)
3. Enable "Auto Deploy" or equivalent toggle
4. Save changes

**Option B: Reconnect GitHub Integration**
If settings aren't visible:
1. Vercel Settings → Git → Disconnect repository
2. Reconnect: Select GrantH-Geekbyte/geekbyte-website
3. Grant necessary permissions
4. Verify production branch is `main`

**Option C: Vercel Support/Documentation**
If UI doesn't match expected:
1. Check Vercel documentation for current UI
2. Contact Vercel support if configuration unclear
3. Verify project type (static site vs framework)

### Verification

1. **Test Auto-Deploy:**
   - Create branch: `test/verify-auto-deploy`
   - Make trivial change (e.g., add comment to README)
   - Create PR, merge to `main`
   - Verify: Vercel deploys within 5 minutes
   - Verify: Deployment shows latest commit

2. **Test Webhooks:**
   - Check GitHub Actions after deployment
   - Verify: "Post-Deploy Smoke Tests" workflow triggered
   - Verify: Workflow received deployment URL

3. **Deploy SPEC-014:**
   - SPEC-014 is already merged to main (commit 71b892c)
   - Once auto-deploy fixed, trigger deployment
   - Verify: Production shows download button (not form)

---

## Dependencies

- **Blocks:** SPEC-014 (production deployment)
- **Depends On:** None
- **Related:**
  - SPEC-007 (CI/CD Pipeline Integration)
  - SPEC-008 (Auto-Issue on Smoke Test Failure)
  - SPEC-010 (Multi-Environment Deployments)

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Settings not visible in Vercel UI | Medium | Medium | Use Vercel docs/support, try CLI |
| GitHub integration permissions issue | Low | High | Re-authorize GitHub App |
| Configuration change breaks existing deployments | Low | High | Document current state before changes |
| Auto-deploy works but webhooks still broken | Medium | Low | Address webhooks separately (SPEC-017) |

---

## Complexity Tier Justification

**Tier: Standard**

**Rationale:**
- Configuration change, not code change
- Vercel UI-based (minimal technical risk)
- Well-documented by Vercel
- Reversible if issues occur

**NOT Complex/Critical because:**
- No code changes required
- No database or infrastructure changes
- Low risk to existing functionality
- Standard deployment configuration task

---

## Success Metrics

- **Primary:** SPEC-014 deploys to production automatically
- **Secondary:** Future PR merges trigger deployment within 5 minutes
- **Tertiary:** Deployment webhooks trigger GitHub Actions workflows

---

## Open Questions

1. **Q:** Is there a "Production Branch" setting in current Vercel UI?
   **A:** To be determined during investigation

2. **Q:** Does Vercel GitHub integration need re-authorization?
   **A:** Check permissions during investigation

3. **Q:** Should Preview deployments also auto-deploy?
   **A:** Yes - Preview for PR branches, Production for main (current behavior OK)

---

## Notes

- This spec was created because SPEC-014 deployment was blocked
- Vercel UI may have changed since DEPLOYMENT.md was written
- Deploy hooks work (tested), but manual trigger not sustainable
- Solving this unblocks future specs and improves deployment velocity

---

**Next Steps:**
1. Review this spec with Grant
2. Investigate Vercel settings (current UI)
3. Document findings and configuration steps
4. Apply fix
5. Verify with SPEC-014 deployment
6. Update DEPLOYMENT.md with correct process
