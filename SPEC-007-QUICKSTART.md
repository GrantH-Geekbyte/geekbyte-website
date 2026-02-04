# SPEC-007 Quick Start Guide

**For:** Grant Howe
**Purpose:** Get CI/CD pipeline operational in 10 minutes
**Prerequisite:** Code committed and pushed to GitHub

## Step 1: Configure Branch Protection (5 minutes)

1. Go to your GitHub repository
2. Click **Settings** → **Branches**
3. Click **Add branch protection rule**
4. Set **Branch name pattern:** `main`
5. Enable these checkboxes:
   - ✅ Require a pull request before merging
     - Set "Required approvals" to: **1**
     - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
     - After first PR runs, add: `Run Playwright Tests` (it won't appear until first workflow run)
   - ✅ Do not allow bypassing the above settings
   - ❌ Allow force pushes (keep DISABLED)
   - ❌ Allow deletions (keep DISABLED)
6. Click **Create**

## Step 2: Test the PR Workflow (3 minutes)

```bash
# Create test branch
git checkout -b test/ci-cd-verification

# Make a trivial change
echo "# CI/CD Pipeline Active" >> README.md

# Commit and push
git add README.md
git commit -m "[SPEC-007] Test PR workflow"
git push -u origin test/ci-cd-verification
```

Then:
1. Go to GitHub and create a pull request
2. Watch the "PR Tests" workflow run (should take ~3 minutes)
3. Verify the PR template appears with SDD checklist
4. If tests pass, approve and merge the PR

## Step 3: Verify Vercel Webhook (2 minutes)

After merging the test PR:

1. Wait for Vercel to deploy (~2 minutes)
2. Go to GitHub → **Actions** tab
3. Look for "Post-Deploy Smoke Tests" workflow
4. **If it ran:** ✅ Webhook is configured correctly
5. **If it didn't run:** See `governance/cicd-integration.md` section "Vercel Webhook Configuration"

## Done!

Your CI/CD pipeline is now active and enforcing SDD gates mechanically.

## What Changed?

**Before SPEC-007:**
- Tests run manually
- No automated verification on PRs
- Direct commits to main allowed
- Production deployments unverified

**After SPEC-007:**
- ✅ Every PR must pass tests before merge
- ✅ Direct commits to main blocked
- ✅ Production deployments automatically verified
- ✅ SDD checklist visible in every PR
- ✅ Test reports captured on failure

## Quick Reference

| Task | Command/Location |
|------|------------------|
| View workflow runs | GitHub → Actions tab |
| Download test reports | Workflow run → Summary → Artifacts |
| Modify workflows | `.github/workflows/*.yml` |
| Update PR template | `.github/pull_request_template.md` |
| Full documentation | `governance/cicd-integration.md` |
| Emergency bypass | See `governance/cicd-integration.md` |

## Next PR Template

When you create your next PR, the template will look like this:

```markdown
# Pull Request

## Spec Reference
**Spec ID:** SPEC-XXX
**Spec File:** `specs/SPEC-XXX-description.md`
**Complexity Tier:** [Trivial | Standard | Complex | Critical]

## Brief Description
[Your description here]

## SDD Pipeline Checklist
- [ ] Spec file created and linked (SPEC-XXX in specs/)
- [ ] Complexity tier assigned and justified
- [ ] Spec Gate approved
- [ ] Architecture Gate reviewed (Standard+ tiers)
- [ ] Implementation follows spec requirements
- [ ] All Playwright tests pass locally
- [ ] QA Gate criteria met (Standard+ tiers)
- [ ] Deployment plan documented (Standard+ tiers)

## Breaking Changes
**Does this PR introduce breaking changes?** [Yes | No]

## Rollback Plan
**Is a rollback plan documented?** [Yes | No]
```

## Troubleshooting

**PR Tests workflow doesn't appear in status checks:**
- Wait for first workflow run to complete
- Then go back to branch protection settings
- The status check will now be available to select

**Workflow fails with "npm ci" error:**
- Delete `package-lock.json` locally
- Run `npm install`
- Commit the new `package-lock.json`
- Push to trigger workflow again

**Smoke tests don't trigger:**
- Verify Vercel GitHub integration is active (Vercel dashboard → Settings → Git)
- Check GitHub webhook deliveries (Settings → Webhooks → Recent Deliveries)
- See detailed instructions in `governance/cicd-integration.md`

---

**Questions?** See `SPEC-007-IMPLEMENTATION-SUMMARY.md` for complete details.
