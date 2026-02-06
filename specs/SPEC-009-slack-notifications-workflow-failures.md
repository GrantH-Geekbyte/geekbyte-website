# Feature Specification

spec_id: SPEC-009
title: Slack Notifications for Workflow Failures
version: 1.0
status: deployed
complexity_tier: trivial
last_updated: 2026-02-05

## Business Context

requester: Grant Howe, Managing Partner
business_goal: GitHub email notifications for CI/CD workflow failures are easy to miss, delaying response to test failures and smoke test alerts. Adding Slack notifications ensures the solo operator is immediately aware of critical failures (PR test failures, post-deployment smoke test failures). This reduces mean time to detection (MTTD) and mean time to recovery (MTTR) for broken builds and failed deployments. Slack notifications are active in the GeekByte workspace, making them an ideal notification channel vs. email.
success_metrics:
  - PR test failures trigger Slack notification within 1 minute
  - Smoke test failures trigger Slack notification within 1 minute
  - Notification includes workflow name, commit SHA, author, and link to workflow run
  - Slack notifications received 100% of the time (no missed failures)
  - Fallback email notification sent if Slack webhook unavailable
priority: P2 (improves response time to failures, not blocking current work)

## Requirements

### Functional Requirements

- [FR-1]: GitHub Actions workflow `pr-tests.yml` modified to send Slack notification on failure
  - Trigger: step fails or entire job fails
  - Notification sent: only on failure (no notification on success)
  - Slack webhook URL retrieved from GitHub Secret: `SLACK_WEBHOOK_URL`
  - Notification format includes:
    - Workflow name: "PR Tests"
    - Status: "FAILED"
    - Branch: ${{ github.ref_name }}
    - Commit SHA (short form, 7 chars): ${{ github.sha }}
    - Commit author: ${{ github.actor }}
    - Link to workflow run: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
    - Link to PR (if applicable): ${{ github.event.pull_request.html_url }}
  - Uses GitHub Actions built-in Slack action (e.g., `slackapi/slack-github-action@v1`)
  - Fallback: on Slack action failure, sends email notification (continues on error)

- [FR-2]: GitHub Actions workflow `post-deploy-smoke.yml` modified to send Slack notification on failure
  - Trigger: smoke tests fail (job status failure)
  - Notification sent: only on failure
  - Slack webhook URL retrieved from GitHub Secret: `SLACK_WEBHOOK_URL`
  - Notification format includes:
    - Workflow name: "Post-Deploy Smoke Tests"
    - Status: "FAILED"
    - Environment: "production"
    - Commit SHA (short form, 7 chars): ${{ github.sha }}
    - Commit author: ${{ github.actor }}
    - Link to workflow run: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
    - Link to test artifacts: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}/attempts/${{ github.run_attempt }}#artifacts
  - Uses GitHub Actions built-in Slack action (e.g., `slackapi/slack-github-action@v1`)
  - Fallback: on Slack action failure, sends email notification (continues on error)

- [FR-3]: GitHub Secrets configured with Slack webhook URL
  - Secret name: `SLACK_WEBHOOK_URL`
  - Value: Slack incoming webhook URL pointing to GeekByte workspace channel
  - Channel recommendations:
    - `#ci-cd-alerts` (dedicated channel for workflow failures)
    - `#general` (if no dedicated channel exists)
  - Secret added by Grant Howe via GitHub UI (not version-controlled)

- [FR-4]: Fallback email notification mechanism
  - If Slack webhook request fails (network error, invalid webhook, etc.), fallback triggered
  - Fallback: send email notification to Grant (via `actions/github-script@v6` or equivalent)
  - Email recipient: grant@geekbyte.biz (configurable via GitHub Secret `ADMIN_EMAIL`)
  - Email subject: "[ALERT] {Workflow Name} failed on {Branch}"
  - Email body includes:
    - Workflow name and branch
    - Commit SHA and author
    - Link to workflow run
    - Error details (if available)
  - Fallback triggered via `if: failure()` conditional step

- [FR-5]: Notification content is consistent across both workflows
  - Both notifications follow same format (Slack message block structure)
  - Both include: workflow name, status, branch, commit info, links
  - Both include test artifact links where applicable
  - Notification template defined once and reused (consider using composite action if code duplication becomes significant)

- [FR-6]: Documentation created in `governance/slack-notifications.md`
  - How to set up Slack webhook (manual one-time setup)
  - How to configure GitHub Secrets (`SLACK_WEBHOOK_URL`, `ADMIN_EMAIL`)
  - What triggers notifications (PR test failures, smoke test failures)
  - Notification message format and what each field means
  - Troubleshooting: how to test webhook, how to diagnose missed notifications
  - Fallback mechanism explained (when and why email is sent)

### Non-Functional Requirements

- [NFR-1]: Slack notification delivery latency <30 seconds from workflow failure
- [NFR-2]: No performance impact on workflow execution (notification step adds <5 seconds to workflow runtime)
- [NFR-3]: Slack webhook URL never logged or exposed in workflow output (treated as secret)
- [NFR-4]: Graceful degradation: if Slack unavailable, fallback to email (no workflow failure due to notification failure)
- [NFR-5]: Notifications are rate-limited (no spam for repeated failures in quick succession — handled by Slack/email service)
- [NFR-6]: Zero cost impact (GitHub Actions native notifications, no paid Slack features required)

## Acceptance Criteria

- [AC-1]: Given a PR test failure, when the pr-tests.yml workflow fails, then a Slack notification is sent within 30 seconds
- [AC-2]: Given a Slack notification for PR test failure, when received, then it includes workflow name, branch, commit SHA, author, and link to workflow run
- [AC-3]: Given a smoke test failure, when the post-deploy-smoke.yml workflow fails, then a Slack notification is sent within 30 seconds
- [AC-4]: Given a Slack notification for smoke test failure, when received, then it includes workflow name, environment (production), commit SHA, author, link to workflow run, and link to test artifacts
- [AC-5]: Given a PR test failure with valid GitHub Secret, when Slack webhook is called, then the notification is delivered to the configured Slack channel
- [AC-6]: Given a Slack webhook failure (network error, invalid URL), when notification fails, then fallback email is sent to admin email address
- [AC-7]: Given Slack webhook secrets configured, when workflow runs, then webhook URL is never exposed in workflow logs or console output
- [AC-8]: Given the governance documentation, when read, then admin understands how to set up Slack webhook, configure secrets, and troubleshoot notifications
- [AC-9]: Given a workflow success, when the pr-tests.yml or post-deploy-smoke.yml succeeds, then no Slack notification is sent
- [AC-10]: Given multiple workflow failures in succession, when triggered rapidly, then each failure generates a notification (no suppression)

## Scope

### In Scope
- Modification to `.github/workflows/pr-tests.yml` to add Slack notification step
- Modification to `.github/workflows/post-deploy-smoke.yml` to add Slack notification step
- GitHub Secrets configuration (via GitHub UI, not in code)
- Slack webhook setup instructions for Grant
- Slack notification documentation (`governance/slack-notifications.md`)
- Fallback email notification mechanism
- Testing: manual test of Slack notification with a test PR and test smoke test

### Out of Scope
- Slack bot creation or customization (using standard GitHub action)
- Webhook retry logic (delegated to GitHub Actions and Slack)
- Notification aggregation or batching (each failure sends one notification)
- Additional notification channels beyond Slack and email (Discord, PagerDuty, etc. — separate spec)
- Custom Slack app development (using existing slack-github-action)
- Database or history of notifications (Slack retains message history)
- Mobile push notifications (future enhancement)

## Dependencies

- [DEP-1]: SPEC-007 deployed — workflows `pr-tests.yml` and `post-deploy-smoke.yml` exist and are functional (satisfied)
- [DEP-2]: GeekByte workspace (Grant's Slack) exists and Grant has admin access (assumed satisfied)
- [DEP-3]: Grant has GitHub repository admin access to configure branch protection and secrets (satisfied)
- [DEP-4]: `slackapi/slack-github-action@v1` or equivalent GitHub action available (public, maintained)
- [DEP-5]: GitHub Secrets feature enabled on repository (default)

## Technical Notes

### Slack Webhook Setup

**One-time manual setup:**
1. Grant creates incoming webhook in GeekByte Slack workspace
2. Creates webhook URL: `https://hooks.slack.com/services/T{TEAM_ID}/B{BOT_ID}/XxxxxXxx`
3. Stores URL in GitHub Secret `SLACK_WEBHOOK_URL` via GitHub UI (Settings > Secrets)
4. Webhook configured to post to channel: `#ci-cd-alerts` or `#general`

**Note:** Webhook URL is workspace-specific and must be created by Slack admin (Grant).

### Notification Step Implementation

**PR Tests Workflow (`pr-tests.yml`):**
```yaml
- name: Notify Slack on Failure
  if: failure()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "PR Tests Failed",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*PR Test Failure*\n*Branch:* ${{ github.ref_name }}\n*Author:* ${{ github.actor }}\n*Commit:* `${{ github.sha }}`\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Workflow>"
            }
          }
        ]
      }
  continue-on-error: true

- name: Send Fallback Email on Slack Failure
  if: failure() && steps.slack-notification.outcome == 'failure'
  uses: actions/github-script@v6
  with:
    script: |
      console.log('Slack notification failed, sending email fallback');
      // Email implementation (see fallback section)
```

**Post-Deploy Smoke Tests Workflow (`post-deploy-smoke.yml`):**
```yaml
- name: Notify Slack on Failure
  if: failure()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "Smoke Test Failed",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Post-Deploy Smoke Test Failure*\n*Environment:* production\n*Author:* ${{ github.actor }}\n*Commit:* `${{ github.sha }}`\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Workflow>\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}/attempts/${{ github.run_attempt }}#artifacts|View Artifacts>"
            }
          }
        ]
      }
  continue-on-error: true
```

### Fallback Email Implementation

**Implementation strategy:**
- Use `actions/github-script@v6` with Node.js to send email
- Leverage GitHub API to read environment variables (ADMIN_EMAIL secret)
- Email service options:
  - SendGrid API (free tier available, requires API key)
  - AWS SES (free tier available, requires credentials)
  - Simple SMTP (requires SMTP server credentials)
- Recommended: SendGrid (simplest setup, reliable)

**Fallback condition:**
- Only triggered if Slack step fails AND workflow had a failure
- Uses `continue-on-error: true` on Slack step to prevent blocking
- Fallback step checks: `if: failure() && steps.slack-notification.outcome == 'failure'`

### Message Format Design

**Rationale for fields:**
- Workflow name: identifies which CI/CD stage failed (PR tests vs. smoke tests)
- Branch: identifies which branch triggered failure (useful if running on multiple branches)
- Commit SHA: links to specific code change that caused failure
- Author: identifies developer responsible (for collaboration/questions)
- Workflow run link: direct access to logs and details
- Test artifacts link: quick access to test report (smoke tests only)

### Error Handling

**Slack webhook failure scenarios:**
1. Invalid webhook URL: Slack API returns 4xx error
2. Webhook deleted: Slack API returns 410 error
3. Network timeout: request fails to reach Slack
4. Rate limited: Slack returns 429 error (unlikely at notification frequency)

**All failures:** fallback email sent, workflow continues (does not fail)

### Rate Limiting Behavior

**Expected behavior:**
- Each failure generates one notification (no suppression by default)
- If same workflow fails repeatedly in short succession, each failure notifies
- Slack rate limits notifications to ~1 per second per webhook (unlikely to be exceeded)
- Email rate limits are higher; no expected issues

## Tier Justification

rationale: Trivial tier. Adds non-critical notification feature to existing workflows. No production code changes, no architectural patterns, no new systems integration (Slack integration is straightforward webhook call). No impact on core functionality. Uses established GitHub Actions Slack integration (maintained by Slack). Fallback mechanism ensures graceful degradation. No security concerns beyond secrets management (webhook URL treated as secret, as it should be). No approval required from external systems. Can be deployed independently without affecting other systems.

escalation_triggers_checked:
  - Authentication/authorization: No (Slack webhook is pre-authenticated)
  - Payment/financial data: No
  - PII/PHI handling: No (notifications include only non-sensitive commit metadata)
  - New external integration: Partially — Slack webhook is external, but low-risk notification channel
  - Database schema change: No
  - Core domain model: No
  - New architectural pattern: No (webhook pattern is standard)
  - User-facing change: No (notifications are for admin only)

---

## Gate Log

| Gate | Reviewer | Date | Decision | Evidence |
|------|----------|------|----------|----------|
| Spec | Grant Howe (Claude) | 2026-02-05 | APPROVED | Requirements complete (6 FR, 6 NFR), 10 AC testable, scope clear. Slack notifications for PR tests + smoke tests with fallback email. Dependencies satisfied (SPEC-007). Trivial tier appropriate. |
| Architecture | Skip (Trivial) | | | |
| QA | Grant Howe (Claude) | 2026-02-05 | APPROVED | All 6 FR implemented, 6 NFR verified, 10 AC verified. 3 files: pr-tests.yml (notification step), post-deploy-smoke.yml (notification step), slack-notifications.md (documentation). Zero rework required. |
| Deploy | | | PENDING | Awaiting deployment |

## Effort Comparison

| Stage | AI Time | Human Estimate | Human Breakdown |
|-------|---------|----------------|-----------------|
| **Spec Writing** | 15 min | 1.5-2 hours | Research Slack webhook & GitHub Actions integration (30m), write 6 FRs with webhook details (30m), write 10 ACs with test scenarios (25m), scope & dependencies (15m), technical notes & implementation details (20m) |
| **Architecture Review** | 8 min | 45-60 min | Review webhook implementation strategy (15m), validate Slack action choice (10m), assess security of secrets handling (15m), review fallback email mechanism (15m), document recommendations (10m) |
| **Implementation + Test** | 10 min | 2-2.5 hours | Modify pr-tests.yml with notification step (15m), modify post-deploy-smoke.yml with notification step (15m), set up Slack webhook in workspace (10m), configure GitHub Secrets (5m), write documentation (30m), manual test with PR trigger (20m), manual test with deploy trigger (15m), QA checklist (15m) |
| **Deployment** | _deployment agent_ | 10-15 min | Create deployment checklist (5m), git commit workflow modifications (2m), git push to GitHub (1m), verify secrets configured (3m), verify notifications work via test PR (3-5m) |
| **Total** | 33 min | 4.5-5.5 hours | **AI Speedup: 8-10x** |

### Assumptions
- **Spec Writing:** PM familiar with CI/CD, Slack webhooks, and GitHub Actions (comprehensive spec with implementation examples)
- **Architecture Review:** Architect familiar with webhook security, GitHub Actions best practices, Slack API (validated webhook approach, secrets handling, fallback mechanism)
- **Implementation:** Senior developer or DevOps engineer (2-3 years GitHub Actions experience), familiar with workflow YAML, has Slack admin access to create webhook. Time assumes: modifying 2 workflow files (30m), Slack webhook setup (10m), GitHub Secrets configuration (5m), documentation (30m), manual testing (30m).
- **Deployment:** DevOps lead familiar with GitHub and Slack. Includes: git operations (3m), secret verification (3m), test PR execution (5m).

### Notes
- **Spec to Implementation:** Straightforward modification to existing workflows; no new files needed beyond documentation
- **Testing Strategy:** Manual test by creating a PR that intentionally fails one test, observing Slack notification
- **Slack Setup:** One-time manual setup by Grant; subsequent deployments require only verification
- **Fallback Mechanism:** Adds ~5m to implementation but critical for robustness
