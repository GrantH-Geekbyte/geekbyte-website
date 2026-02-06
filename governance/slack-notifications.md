# Slack Notifications for CI/CD Workflow Failures

**Specification:** SPEC-009
**Version:** 1.0
**Last Updated:** 2026-02-05
**Owner:** Grant Howe, Managing Partner

## Overview

This document describes how Slack notifications are configured for GitHub Actions workflow failures in the GeekByte website repository. Notifications provide immediate visibility into CI/CD failures (PR test failures, production smoke test failures) via Slack, reducing mean time to detection (MTTD) and mean time to recovery (MTTR).

## What Gets Notified

Slack notifications are sent for the following workflow failures:

1. **PR Test Failures** (`.github/workflows/pr-tests.yml`)
   - Triggered when: Playwright tests fail on a pull request
   - Channel: GeekByte Slack workspace
   - Includes: Branch, author, commit SHA, PR link, workflow run link

2. **Production Smoke Test Failures** (`.github/workflows/post-deploy-smoke.yml`)
   - Triggered when: Post-deployment smoke tests fail in production
   - Channel: GeekByte Slack workspace
   - Includes: Environment (production), commit SHA, deployer, workflow run link, test artifacts link

**Notifications are sent ONLY on failure.** Successful workflows do not send notifications.

## One-Time Setup

### 1. Create Slack Incoming Webhook

**Prerequisites:**
- Admin access to GeekByte Slack workspace
- Channel created for notifications (recommended: `#ci-cd-alerts` or use `#general`)

**Steps:**
1. Go to Slack workspace: https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. App name: "GitHub CI/CD Alerts"
4. Select workspace: GeekByte
5. Click "Incoming Webhooks" in sidebar
6. Toggle "Activate Incoming Webhooks" to ON
7. Click "Add New Webhook to Workspace"
8. Select channel: `#ci-cd-alerts` (or `#general`)
9. Click "Allow"
10. Copy webhook URL: `https://hooks.slack.com/services/T.../B.../...`

**Important:** Keep webhook URL secret. It provides unauthenticated access to post to your Slack channel.

### 2. Configure GitHub Secrets

**Prerequisites:**
- Admin access to GitHub repository (Settings > Secrets and variables > Actions)

**Steps:**
1. Go to repository: https://github.com/GrantH-Geekbyte/geekbyte-website
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Secret name: `SLACK_WEBHOOK_URL`
5. Secret value: Paste webhook URL from step 1
6. Click "Add secret"

**Verification:**
- Secret should appear in list with name `SLACK_WEBHOOK_URL`
- Value is hidden (shows as "***")
- Available to all workflows in repository

### 3. Verify Workflows Are Updated

Check that both workflows include Slack notification steps:

**`.github/workflows/pr-tests.yml`:**
```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**`.github/workflows/post-deploy-smoke.yml`:**
```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Notification Format

### PR Test Failure Notification

**Example:**
```
🔴 PR Tests Failed
Branch: feature/add-new-feature
Author: GrantH-Geekbyte
Commit: `a1b2c3d`
PR: #42
View Workflow Run
```

**Fields:**
- **Branch:** Git branch name where tests failed
- **Author:** GitHub username who triggered the workflow
- **Commit:** Short SHA (7 chars) of the commit that failed
- **PR:** Pull request number with link
- **View Workflow Run:** Direct link to GitHub Actions run with logs and details

### Smoke Test Failure Notification

**Example:**
```
🚨 Production Smoke Tests Failed
Environment: production
Commit: `a1b2c3d`
Deployer: GrantH-Geekbyte
View Workflow Run
View Test Artifacts
```

**Fields:**
- **Environment:** Deployment environment (always "production" for this workflow)
- **Commit:** Short SHA (7 chars) of the deployed commit
- **Deployer:** GitHub username who triggered the deployment
- **View Workflow Run:** Direct link to GitHub Actions run
- **View Test Artifacts:** Direct link to test report artifacts (Playwright HTML report)

## Troubleshooting

### Notification Not Received

**Symptoms:**
- Workflow failed but no Slack notification received
- Slack channel shows no recent messages from GitHub CI/CD Alerts

**Diagnosis:**
1. Check workflow run logs in GitHub Actions
2. Find the "Notify Slack on failure" step
3. Check if step ran (should show yellow warning icon if failed)
4. Read step output for error messages

**Common Causes:**

| Cause | Solution |
|-------|----------|
| Secret `SLACK_WEBHOOK_URL` not configured | Add secret in GitHub Settings > Secrets |
| Webhook URL is invalid or deleted | Regenerate webhook in Slack and update GitHub Secret |
| Slack app deleted or permissions revoked | Recreate Slack app and webhook |
| Network timeout | Retry workflow; GitHub Actions will retry webhook automatically |
| Slack rate limited | Wait 1 minute and retry |

### Secret Not Found Error

**Error Message:**
```
Error: Secret SLACK_WEBHOOK_URL not found
```

**Solution:**
1. Go to GitHub repository Settings → Secrets and variables → Actions
2. Verify `SLACK_WEBHOOK_URL` exists
3. If missing, add it following "Configure GitHub Secrets" section above
4. If present but error persists, delete and re-add secret

### Webhook Returns 404 or 410

**Error Message:**
```
Slack webhook returned 404 Not Found
```
or
```
Slack webhook returned 410 Gone
```

**Cause:**
Webhook URL has been deleted or disabled in Slack workspace.

**Solution:**
1. Go to Slack API: https://api.slack.com/apps
2. Select "GitHub CI/CD Alerts" app
3. Check "Incoming Webhooks" section
4. If webhook is missing, create new webhook
5. Update GitHub Secret with new webhook URL

### Message Not Formatted Correctly

**Symptoms:**
- Notification received but formatting is broken
- Missing fields or incorrect data

**Diagnosis:**
1. Check workflow file (`.github/workflows/pr-tests.yml` or `post-deploy-smoke.yml`)
2. Verify payload JSON is valid
3. Check for missing GitHub context variables

**Solution:**
- Review workflow YAML for syntax errors
- Ensure all variables like `${{ github.actor }}` are correctly referenced
- Test payload JSON in Slack Block Kit Builder: https://app.slack.com/block-kit-builder

## Fallback Mechanism

**Note:** The current implementation uses `continue-on-error: true` to ensure workflow does not fail if Slack notification fails. This means **no automated fallback email is sent** in this version.

**Future Enhancement (SPEC-009 Phase 2):**
- Add fallback email notification step
- Triggered when Slack notification step fails
- Sends email to `grant@geekbyte.biz` via SendGrid or AWS SES
- Requires additional GitHub Secret: `ADMIN_EMAIL` and `SENDGRID_API_KEY`

## Manual Testing

### Test PR Test Notification

1. Create a branch: `git checkout -b test/slack-notification`
2. Modify a test to fail: `tests/e2e/pages.spec.js`
   ```javascript
   test('intentional failure for Slack test', async ({ page }) => {
     expect(true).toBe(false); // This will fail
   });
   ```
3. Commit and push: `git add . && git commit -m "Test Slack notification" && git push`
4. Create PR via GitHub UI
5. Wait for workflow to run (~3 minutes)
6. Check Slack channel for notification
7. Close PR and delete branch after testing

### Test Smoke Test Notification

**Not recommended:** Production smoke tests run against live site. Do not intentionally break production.

**Alternative:** Wait for a real smoke test failure (rare) or simulate locally by modifying `post-deploy-smoke.yml` temporarily to force failure condition.

## Monitoring

### Check Notification Delivery Rate

1. Go to Slack channel: `#ci-cd-alerts`
2. Count notifications received in last 30 days
3. Go to GitHub Actions: https://github.com/GrantH-Geekbyte/geekbyte-website/actions
4. Filter by workflow: "PR Tests" and "Post-Deploy Smoke Tests"
5. Count failed runs in last 30 days
6. **Delivery Rate:** (Slack notifications received / Failed runs) × 100%
7. **Target:** 100% delivery rate

### Slack Webhook Health

1. Go to Slack API: https://api.slack.com/apps
2. Select "GitHub CI/CD Alerts" app
3. Check "Incoming Webhooks" section
4. Review recent webhook delivery logs (if available)

## Security

### Webhook URL Protection

- Webhook URL is stored in GitHub Secret (encrypted at rest)
- Never logged or exposed in workflow output
- `env: SLACK_WEBHOOK_URL` ensures it's passed as environment variable (not as command-line argument)
- `continue-on-error: true` prevents workflow logs from showing webhook errors with sensitive URLs

### Access Control

- Only GitHub repository admins can view/edit secrets
- Only Slack workspace admins can create/delete webhooks
- Webhooks are scoped to specific channel (not workspace-wide)

### Revocation

**If webhook URL is compromised:**
1. Go to Slack API: https://api.slack.com/apps
2. Select "GitHub CI/CD Alerts" app
3. Delete compromised webhook
4. Create new webhook
5. Update GitHub Secret with new URL
6. Verify notifications work with test PR

## Cost

- **GitHub Actions:** Notifications add <5 seconds to workflow runtime (negligible cost impact)
- **Slack:** Free tier unlimited webhooks and messages (no cost)
- **Total:** $0/month

## Maintenance

### When Slack Workspace Changes

**If Slack workspace URL changes:**
- Webhook URL will change
- Follow "Create Slack Incoming Webhook" section to regenerate webhook
- Update GitHub Secret with new URL

**If notification channel changes:**
- Create new webhook pointing to new channel
- Update GitHub Secret with new webhook URL
- Old webhook will continue to post to old channel until deleted

### When Workflows Change

**If adding new workflows:**
- Copy "Notify Slack on failure" step from existing workflow
- Adjust payload text to describe new workflow
- Test with intentional failure

**If modifying notification format:**
- Update `payload` in workflow YAML
- Test format with Slack Block Kit Builder: https://app.slack.com/block-kit-builder
- Create test PR to verify formatting

## Related Documentation

- **Spec:** `specs/SPEC-009-slack-notifications-workflow-failures.md`
- **CI/CD Integration:** `governance/cicd-integration.md`
- **PR Tests Workflow:** `.github/workflows/pr-tests.yml`
- **Smoke Tests Workflow:** `.github/workflows/post-deploy-smoke.yml`
- **Slack API Docs:** https://api.slack.com/messaging/webhooks

---

**Document Status:** ✅ Complete

**Setup Complete:** Requires manual one-time setup (Slack webhook + GitHub Secret)
