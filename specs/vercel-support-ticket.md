# Vercel Support Ticket - Deploy Hooks Not Creating Deployments

**Date:** 2026-02-08
**Severity:** Critical - Production deployments blocked
**Project:** geekbyte-website
**Project ID:** prj_IbDNnAil9XekEpdtAJO7TMW9NxKK

---

## Issue Summary

Deploy hooks return successful responses with job IDs in "PENDING" state, but no deployments are created or appear in the Vercel dashboard. This completely blocks our ability to deploy code to production.

**ROOT CAUSE IDENTIFIED:** After reconnecting the GitHub integration, Vercel failed to create the GitHub webhook. The webhook does not exist in GitHub Settings → Webhooks, preventing all deployment triggers from functioning.

---

## Current State

**Production Environment:**
- Stuck on commit: `5b9a7ca` [SPEC-011] Add Visual Regression Testing
- Deployed: 19+ hours ago
- Status: Stale - multiple critical updates merged to main not deploying

**Main Branch (Latest):**
- Current commit: `71b892c` [SPEC-014] Remove Email Gate from CEO Brief Campaign
- Merged: Today (2026-02-08)
- Status: **Not deployed** - 3 commits ahead of production

**Business Impact:**
- User-facing feature changes (SPEC-014) stuck in merged but not deployed state
- Manual deployment process completely broken
- Unable to deliver customer-facing updates

---

## Reproduction Steps

### Deploy Hook Trigger

**Endpoint:**
```
POST https://api.vercel.com/v1/integrations/deploy/prj_IbDNnAil9XekEpdtAJO7TMW9NxKK/rabzfUB8AJ
```

**Response:**
```json
{
  "job": {
    "id": "2DZvHfpY3D3UGocFxGUZ",
    "state": "PENDING",
    "createdAt": 1770574536359
  }
}
```

**Expected Behavior:**
- Deployment appears in Vercel dashboard within 10-30 seconds
- Deployment shows "Building" or "Queued" status
- Deployment pulls latest main branch commit
- Deployment completes and deploys to production

**Actual Behavior:**
- HTTP 200 response with job ID returned ✓
- Job state shows "PENDING" ✓
- **No deployment appears in dashboard** ✗
- **No build initiated** ✗
- **Production unchanged** ✗

---

## Failed Job IDs

These deploy hook calls returned success but never created deployments:

1. **z25EEDXCD64rZOEjHEv9**
   - Triggered: ~1 hour ago
   - Status: PENDING (at trigger time)
   - Result: No deployment created

2. **2DZvHfpY3D3UGocFxGUZ**
   - Triggered: ~10 minutes ago (most recent)
   - Status: PENDING (at trigger time)
   - Result: No deployment created

**Request:** Please investigate these job IDs in your logs to determine why they never resulted in deployments.

---

## Related Community Reports

**Similar Issue:** https://community.vercel.com/t/critical-vercel-fails-to-verify-create-github-webhook-auto-deploy-broken-despite-clean-install/32370

This community post describes the exact same symptoms:
- GitHub integration shows "Connected" in Vercel UI
- Deploy hooks return success responses
- No deployments are actually created
- Auto-deploy broken despite clean GitHub App reinstall

**Our Configuration:**
The project `vercel.json` explicitly enables GitHub integration and main branch deployments:
```json
"git": {
  "deploymentEnabled": {
    "main": true
  }
},
"github": {
  "enabled": true,
  "autoAlias": true,
  "silent": false
}
```

This suggests the issue is with Vercel's webhook creation/verification system, not project configuration.

---

## Troubleshooting Already Performed

### 1. Deployment Protection Settings

**Action:** Disabled Vercel Authentication in Deployment Protection
- **Before:** "Vercel Authentication" enabled for "Standard Protection"
- **After:** Disabled completely
- **Result:** No change - deployments still not created

### 2. GitHub Integration

**Action:** Disconnected and reconnected GitHub repository
- Disconnected: GrantH-Geekbyte/geekbyte-website
- Reconnected: Same repository with fresh permissions
- **Result:** Integration connected successfully, but deployments still not created

### 3. Deploy Hooks

**Action:** Created new deploy hooks after reconnection
- Old hook ID: `ZOZtEYfiBA` (returned "not_found" after reconnect)
- New hook ID: `rabzfUB8AJ` (current)
- Branch: main
- **Result:** New hooks work (return success), but deployments still not created

### 4. Manual Deployment Attempts

**Attempted via Vercel UI:**
- "Redeploy" button: Redeployed wrong commit (old commit, not latest main)
- "Promote to Production": Not available (no preview deployments to promote)
- **Result:** Unable to manually trigger deployment of latest code

### 5. Filters and UI Issues

**Action:** Removed all filters in deployments dashboard
- Checked: All branches, all environments, all authors
- Refreshed multiple times
- Waited 10+ minutes between attempts
- **Result:** No hidden or filtered deployments - simply not being created

### 6. vercel.json Configuration Verified

**Action:** Reviewed vercel.json for ignored build steps or deployment blockers
- Confirmed: `git.deploymentEnabled.main: true` ✓
- Confirmed: `github.enabled: true` ✓
- Confirmed: No `ignoredBuildStep` present ✓
- **Result:** Configuration is correct, issue is not in project settings

### 7. Git Commit Author Verification

**Action:** Verified commit author email matches Vercel team member
- All recent commits authored by: `grant@geekbyte.biz`
- Author email should match Vercel account holder
- **Result:** Commit author email is consistent

### 8. GitHub Webhooks Investigation ⚠️ **ROOT CAUSE IDENTIFIED**

**Action:** Checked GitHub repository webhooks page
- Location: `github.com/GrantH-Geekbyte/geekbyte-website/settings/hooks`
- **Finding:** **NO VERCEL WEBHOOK EXISTS**
- Expected: Webhook with Vercel URL receiving push/deployment events
- Actual: Webhooks page is completely empty

**This confirms the root cause:** When the GitHub integration was reconnected, Vercel failed to create the webhook. Without this webhook:
- GitHub cannot notify Vercel of code pushes
- Auto-deployments are impossible
- Deploy hooks have no webhook to trigger deployments
- The integration appears "Connected" in Vercel UI but is non-functional

---

## Configuration Details

### Git Settings
- **Repository:** GrantH-Geekbyte/geekbyte-website (GitHub)
- **Connection Status:** Connected (as of 2026-02-08)
- **Pull Request Comments:** Enabled
- **deployment_status Events:** Enabled
- **repository_dispatch Events:** Enabled

### Build and Deployment Settings
- **Framework:** Other (static site)
- **Build Command:** Default
- **Output Directory:** `public/` (if exists)
- **Prioritize Production Builds:** Enabled

### Current Deploy Hooks
```
Name: Manual Deploy
Branch: main
Webhook: https://api.vercel.com/v1/integrations/deploy/prj_IbDNnAil9XekEpdtAJO7TMW9NxKK/rabzfUB8AJ
Status: Returns success, but no deployments created
```

---

## Expected vs. Actual Behavior

### Expected Workflow (Per Vercel Documentation)
1. Merge PR to `main` branch on GitHub
2. Vercel GitHub integration triggers automatic deployment
3. OR: Trigger deploy hook manually
4. Deployment appears in dashboard
5. Build runs
6. Deployment completes and goes live

### Actual Behavior
1. Merge PR to `main` → **No deployment triggered** ✗
2. Trigger deploy hook → **Success response but no deployment** ✗
3. Check dashboard → **No deployments visible** ✗
4. Production → **Stuck on old commit** ✗

---

## Additional Symptoms

### Auto-Deployment Not Working
- Merging PRs to `main` branch does **not** trigger deployments
- Expected: Automatic production deployment
- Actual: Nothing happens

### GitHub Webhooks
- Not sure if deployment_status events are being sent to GitHub
- GitHub Actions workflows expecting these events are not triggering
- Unable to verify if Vercel → GitHub communication is working

### "Redeploy" Button Behavior
- Clicking "Redeploy" on production deployment works...
- BUT: Redeploys the **same old commit**, not latest main
- Does not pull fresh code from GitHub
- Suggests disconnect between Vercel and GitHub repository state

---

## What We Need

### 1. **Create Missing GitHub Webhook** (Root Cause)
**CRITICAL:** The GitHub webhook for this repository does not exist. Vercel failed to create it during the GitHub integration reconnection.

**Action Required:**
- Manually create/provision the GitHub webhook for repository `GrantH-Geekbyte/geekbyte-website`
- Webhook should listen for `push`, `pull_request`, and `deployment_status` events
- Verify webhook is properly registered in GitHub Settings → Webhooks

### 2. Verify Webhook Functionality
- After webhook is created, test that GitHub → Vercel communication works
- Verify that push events to `main` branch trigger deployments
- Confirm deploy hooks work once webhook exists

### 3. Deploy Latest Code
- Once webhook is working, deploy commit `71b892c` to production
- Contains user-facing changes (SPEC-014) that are time-sensitive
- Verify automatic deployments work for future pushes

---

## Environment Information

**Project Type:** Static HTML/CSS/JS site
**Git Provider:** GitHub
**Repository Visibility:** Private
**Vercel Plan:** [Specify your plan here]
**Last Successful Deployment:** 19+ hours ago (commit 5b9a7ca)
**Commits Not Deployed:** 3 commits (SPEC-010, SPEC-014, spec files)

---

## Questions for Support

1. Can you see job IDs `z25EEDXCD64rZOEjHEv9` and `2DZvHfpY3D3UGocFxGUZ` in your system?
2. Are these jobs stuck in queue or did they fail silently?
3. Is there a configuration issue preventing deployments for this project?
4. Can you manually trigger a deployment of latest main branch (commit 71b892c)?
5. Why is the GitHub integration not auto-deploying on main branch pushes?
6. **Has the GitHub webhook been properly created/verified?** (Based on community reports of webhook creation failures)
7. Can you verify webhook deliveries from GitHub → Vercel for repository `GrantH-Geekbyte/geekbyte-website`?

---

## Urgency

**Priority:** High
**Reason:** Production site cannot be updated, blocking critical feature delivery
**Workaround:** None available - all deployment methods exhausted
**Business Impact:** Customer-facing changes stuck in "merged but not deployed" state

---

## Contact Information

**Name:** Grant Howe
**Email:** [Your email]
**Project:** geekbyte-website
**Best Time to Contact:** [Your availability]

---

## Attachments

If possible, please attach:
- Screenshots of Vercel deployments dashboard showing no recent deployments
- Screenshot of Settings → Git showing connected repository
- Screenshot of deploy hook configuration

---

**Thank you for your assistance in resolving this critical deployment issue.**
