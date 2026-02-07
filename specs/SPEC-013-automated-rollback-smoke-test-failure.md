# Feature Specification

spec_id: SPEC-013
title: Automated Rollback on Smoke Test Failure
version: 1.0
status: pending
complexity_tier: complex
last_updated: 2026-02-05

## Business Context

requester: Grant Howe, Managing Partner
business_goal: Automate production recovery when post-deployment smoke tests fail. When smoke tests fail after Vercel deployment, the site may be broken or severely degraded. Currently, PM must manually detect the failure (via GitHub notification, Slack alert) and manually trigger rollback via Vercel dashboard. This introduces delay (MTTD/MTTR measured in minutes) and relies on human attention. Automating rollback on smoke test failure reduces mean time to recovery (MTTR) from ~10-15 minutes (manual detection + dashboard interaction) to ~2-3 minutes (automated detection + Vercel API rollback + verification), while maintaining safety checks to prevent rollback loops and false positives. Complex tier due to production automation, safety-critical decision logic, and risk of cascading failures.
success_metrics:
  - Smoke test failure detected and rollback triggered within 3 minutes
  - Smoke tests re-run against rolled-back deployment within 30 seconds
  - Rollback decision logged with all safety checks passed
  - Zero accidental rollbacks (flaky test prevention validated)
  - Zero rollback loops (first-deployment-today check prevents cascading)
  - PM approval required for production changes (option B: Slack approval gate)
  - Escape events created automatically for rolled-back deployments
  - Rollback rate tracked (indicator of pipeline quality)
priority: P1 (production safety — reduces downtime, Critical for SaaS; currently P2 for static site until product launches)

## Requirements

### Functional Requirements

- [FR-1]: GitHub Actions workflow `post-deploy-smoke-with-rollback.yml` created in `.github/workflows/`
  - Triggers on post-deployment smoke test failure (workflow_run event when post-deploy-smoke.yml fails)
  - Executes rollback decision gate (approval-based automation)
  - Inputs:
    - Current deployment SHA (passed from post-deploy-smoke.yml context)
    - Last deployment attempt timestamp
    - Current test run ID
  - Outputs:
    - Rollback decision (approved/rejected/escalated)
    - Previous deployment SHA if rollback approved
    - Post-rollback smoke test result
    - Escape event ID created

- [FR-2]: Safety checks performed before rollback approval
  - [FR-2a]: "First deployment today" check
    - Query deployment history for current date (last 24 hours)
    - If current deployment is first deployment today, escalate (do not auto-rollback)
    - Rationale: prevent rollback loops where rollback itself fails and triggers another rollback
    - Log decision: "First deployment today — escalating to PM for approval"
  - [FR-2b]: "Smoke test stability" check
    - Query GitHub Actions workflow run history for post-deploy-smoke.yml
    - Examine last 5 deployments to current branch (main)
    - Calculate failure rate: count failures / 5
    - If failure rate > 40% (2+ failures in last 5 runs), tests are flaky
    - Log decision with failure rate percentage
    - If flaky: escalate to PM ("Tests appear flaky — manual review recommended")
    - If stable: proceed to next check
  - [FR-2c]: "Previous successful deployment exists" check
    - Query Vercel deployment history via API
    - Identify last deployment with `state: ready` (passed Vercel checks)
    - Cross-reference with GitHub: which commit SHA corresponds to that deployment?
    - If previous deployment exists: proceed to approval gate
    - If no previous deployment exists: escalate ("No rollback target available — escalating")

- [FR-3]: PM approval gate (option B recommended for Complex tier)
  - [FR-3a]: Slack approval gate (primary)
    - Send Slack message to Grant with rollback summary:
      - Current deployment: {commit-sha-short} by {deployer} at {timestamp}
      - Failure details: which tests failed, error count
      - Previous deployment: {commit-sha-short} from {timestamp}
      - Safety checks: all passed, timestamps, failure rates
      - Action required: approve rollback or reject
    - Include two action buttons: "Approve Rollback" / "Reject & Escalate"
    - Approval action triggers rollback step in workflow
    - Timeout: 15 minutes (if no response, escalate to email)
    - Reject action: stops workflow, creates issue for PM review
  - [FR-3b]: Fallback email approval (backup)
    - If Slack approval timeout (15 min) or Slack unavailable: send email to grant@geekbyte.biz
    - Email subject: "[ALERT] Smoke test failure — rollback approval required"
    - Email includes rollback summary (same as Slack)
    - PM responds via email reply (reply "APPROVE" or "REJECT")
    - Fallback assumes PM will respond within 30 minutes
    - Note: Fallback reduces speed advantage; Slack integration essential for sub-5-minute MTTR

- [FR-4]: Vercel rollback execution
  - [FR-4a]: Rollback via Vercel API
    - Use Vercel API endpoint: `POST /v13/deployments/{id}/rollback`
    - Requires: Vercel API token stored in GitHub Secret `VERCEL_API_TOKEN`
    - Input: deployment ID of previous successful deployment (from FR-2c)
    - Vercel returns: new deployment created with reverted code
    - Log: Vercel response with new deployment SHA and status
  - [FR-4b]: Wait for rollback deployment ready
    - Poll Vercel API: GET `/v13/deployments/{id}` for state
    - Wait up to 5 minutes for state to become "ready"
    - If timeout: escalate ("Rollback deployment not ready after 5 minutes — escalating")
    - Once ready: proceed to post-rollback smoke tests
  - [FR-4c]: Handle Vercel API errors gracefully
    - API authentication failure: escalate immediately (token invalid/expired)
    - Deployment not found: escalate (likely deleted or API issue)
    - Rate limit (429): retry with exponential backoff (3 attempts, 10s/30s/60s)
    - Timeout: escalate after 5 minutes

- [FR-5]: Post-rollback smoke test verification
  - [FR-5a]: Run smoke tests against rolled-back deployment
    - Trigger Playwright smoke tests against rolled-back Vercel deployment
    - Use existing post-deploy-smoke configuration (`npm run test:live`)
    - Timeout: 60 seconds
  - [FR-5b]: Evaluate smoke test results
    - If pass: rollback successful — proceed to success workflow
    - If fail: rollback itself is broken — escalate immediately to PM
    - If timeout: escalate (Vercel deployment not responding)
  - [FR-5c]: Success workflow
    - Log: "Rollback successful. Smoke tests passed against rolled-back deployment."
    - Create GitHub issue for investigation (SPEC-008 pattern)
      - Title: "[ROLLBACK COMPLETED] {deployment-sha-short} rolled back to {previous-sha-short}"
      - Labels: `type:rollback`, `severity:high`, `escape`
      - Body: deployment info, failure details, rollback details, investigation instructions
    - Create escape event (SPEC-005 pattern)
      - Escape type: "production-defect-post-deployment-detection"
      - Link to: failed deployment, rolled-back deployment, smoke test failure run, GitHub issue
    - Notify PM via Slack: "Rollback completed. Investigation issue created: #{issue-number}"

- [FR-6]: Escalation pathway (when rollback cannot proceed)
  - Escalation triggers:
    - First deployment today (safety check)
    - Tests are flaky (stability check)
    - No previous deployment available (rollback target check)
    - PM rejects rollback (approval gate)
    - Vercel API error (API availability)
    - Rollback deployment fails to become ready (infrastructure issue)
    - Post-rollback smoke tests fail (rollback itself is broken)
  - Escalation action:
    - Send Slack urgent message to Grant with:
      - Issue: description of escalation trigger
      - Context: current deployment, test failures, safety check results
      - Action: requires manual intervention
      - Link: GitHub Actions run, failed deployment, smoke test results
    - Create GitHub issue marked `severity:critical`, `type:incident`
    - Hold workflow (do not proceed with rollback)

- [FR-7]: Rollback decision logging and audit trail
  - Log file created: `.logs/rollback/{date}-{run-id}-rollback.log`
  - Contents:
    - Timestamp of smoke test failure detection
    - Deployment info: SHA, author, timestamp, URL
    - Safety checks: results of each check (FR-2a/b/c with details)
    - Approval decision: who approved, when, method (Slack/email)
    - Vercel API calls: request/response for rollback
    - Post-rollback test results: pass/fail, error details if failed
    - Escape event ID created
    - Total MTTR (recovery time from failure detection to success)
  - Uploaded as GitHub Actions artifact for 90 days
  - Linked in issue body for PM review

- [FR-8]: Rollback rate monitoring and reporting
  - Track rollback events in metrics/rollback-rate.json
  - Contents per month:
    - Month identifier (YYYY-MM)
    - Total deployments
    - Failed smoke tests
    - Rollback attempts (approved + escalated)
    - Successful rollbacks
    - Failed rollbacks (that escalated)
    - Rollback rate: successful rollbacks / deployments
  - Goal: rollback rate < 1% indicates healthy pipeline
  - Goal: rollback rate > 5% indicates pipeline quality issue (require spec gate review)
  - Updated automatically with each rollback event
  - Visible in governance dashboard (future feature)

- [FR-9]: Documentation in `governance/automated-rollback.md`
  - What triggers automated rollback (smoke test failure)
  - Safety checks explained (why each check exists, what it prevents)
  - Approval workflow (Slack vs. email fallback)
  - Vercel integration details (API endpoints, token setup)
  - Post-rollback workflow (issue creation, escape event, PM notification)
  - Escalation scenarios (when rollback cannot proceed)
  - Rollback rate metrics (how to interpret, when to act)
  - Troubleshooting: common failure modes and recovery
  - Emergency manual rollback procedure (if automation fails entirely)

### Non-Functional Requirements

- [NFR-1]: MTTR (mean time to recovery) from smoke test failure to rollback completion: < 3 minutes (typical case: 2 min safety checks + 30s Vercel API + 30s smoke test verification)
- [NFR-2]: Slack approval response time: < 15 minutes (allows PM to respond; timeout escalates to email fallback)
- [NFR-3]: Rollback decision atomicity: either execute fully or escalate — no partial rollbacks
- [NFR-4]: Audit trail completeness: 100% of rollback decisions logged with rationale and evidence
- [NFR-5]: Vercel API reliability: tolerate transient failures with exponential backoff (3 attempts)
- [NFR-6]: Zero accidental rollbacks: all safety checks must pass before approval is requested
- [NFR-7]: Rollback failure observability: if post-rollback smoke tests fail, PM notified within 1 minute
- [NFR-8]: Workflow logs clear and actionable: PM can diagnose rollback decision without reading code
- [NFR-9]: No cascading failures: first-deployment-today check prevents rollback loop (deploy A fails → rollback to deployment B, B fails → do NOT rollback again)
- [NFR-10]: Secrets handling: Vercel token never logged or exposed in workflow output

## Acceptance Criteria

- [AC-1]: Given a production deployment completes and post-deploy-smoke.yml fails, when smoke tests finish, then the post-deploy-smoke-with-rollback.yml workflow triggers automatically
- [AC-2]: Given the rollback workflow, when first-deployment-today check is false (not first deploy), when smoke tests are stable (< 40% failure in last 5 runs), when previous successful deployment exists, then PM approval is requested via Slack
- [AC-3]: Given PM approves rollback via Slack button, when the approval is received, then Vercel rollback API is called with previous deployment ID
- [AC-4]: Given Vercel rollback succeeds, when new deployment is ready, then smoke tests are run against rolled-back deployment
- [AC-5]: Given post-rollback smoke tests pass, when all checks complete, then issue is created with labels `type:rollback`, `severity:high`, `escape`
- [AC-6]: Given post-rollback smoke tests pass, when issue is created, then escape event is generated in learning/escapes/ linked to the issue
- [AC-7]: Given post-rollback smoke tests fail, when failure detected, then PM is escalated immediately with message "[CRITICAL] Rollback failed — manual investigation required"
- [AC-8]: Given a first deployment today, when post-deploy-smoke fails, then escalation is triggered (no automatic rollback)
- [AC-9]: Given flaky tests (> 40% failure in last 5 runs), when smoke tests fail, then escalation is triggered (no automatic rollback)
- [AC-10]: Given no previous successful deployment, when attempting rollback, then escalation is triggered
- [AC-11]: Given Slack approval timeout (15 minutes), when PM does not respond, then fallback email is sent to grant@geekbyte.biz
- [AC-12]: Given each rollback event, when workflow completes, then metrics/rollback-rate.json is updated with deployment count, rollback outcome, and MTTR
- [AC-13]: Given the rollback audit log, when PM reviews it, then all safety checks, approval decision, API calls, and results are documented
- [AC-14]: Given a failed rollback scenario (any escalation), when PM creates a spec to fix the issue, then the escape event created in AC-6 is linked to that spec

## Scope

### In Scope
- GitHub Actions workflow for rollback decision and execution (`post-deploy-smoke-with-rollback.yml`)
- Safety checks: first-deployment-today, smoke test stability, previous deployment availability
- Slack approval gate (primary) with email fallback
- Vercel API integration for rollback execution
- Post-rollback smoke test verification
- Escape event creation (using SPEC-005 patterns)
- GitHub issue creation for investigation (using SPEC-008 patterns)
- Rollback audit logging and MTTR calculation
- Rollback rate metrics tracking
- Governance documentation
- GitHub Secrets configuration for Vercel API token

### Out of Scope
- Automatic remediation/fix deployment (rollback only; fixes require new spec)
- Multi-environment rollback (only production; staging/preview handled separately)
- Slack custom app development (using standard GitHub Actions Slack integration)
- Cost analysis of rollback vs. downtime (policy decision made by PM)
- Integration with external SLO/monitoring systems (future spec)
- Database rollback (static site only; future products require separate strategy)
- Performance baseline comparison (pre/post rollback — future enhancement)
- Rollback approval delegation to team members (solo operator model; future with team)
- Blue-green or canary deployments (future infrastructure approach)

## Dependencies

- [DEP-1]: SPEC-007 deployed — post-deploy-smoke.yml workflow exists and triggers on deployment_status
- [DEP-2]: SPEC-008 deployed — auto-issue creation pattern established (will reuse for rollback investigation issue)
- [DEP-3]: SPEC-005 deployed — escape event creation and learning/escapes/ templates established
- [DEP-4]: SPEC-009 deployed — Slack notifications available (will use Slack approval mechanism)
- [DEP-5]: Vercel API access and documentation reviewed
  - API endpoint: POST /v13/deployments/{id}/rollback
  - Authentication: Vercel API token (create via Vercel dashboard)
  - Scope: requires "read" and "write" permissions on deployments
- [DEP-6]: Vercel deployment history queryable via API
  - GET /v13/deployments with filters for state/timestamp
  - Requires same token scope
- [DEP-7]: GitHub Secrets configured for Vercel API token (`VERCEL_API_TOKEN`)
  - Created by Grant via GitHub Settings > Secrets
- [DEP-8]: Slack approval mechanism (PR#XXX from SPEC-009 integration extends Slack capabilities)

## Technical Notes

### Rollback Safety Philosophy

This spec prioritizes **safety over speed**. While the goal is fast recovery (MTTR < 3 min), a false positive rollback (rolling back a working deployment) is worse than a false negative (delaying rollback by a few minutes for manual approval). Key safety principles:

1. **Multi-gate approval**: Safety checks (FR-2) + PM approval (FR-3) before execution
2. **Stable test requirement**: Will not rollback if tests are flaky (prevents rollback storms)
3. **First-deployment-safety**: Will not rollback first deployment of the day (prevents loops)
4. **Post-rollback verification**: Tests must pass against rolled-back deployment before declaring success
5. **Escalation as default**: Any doubt → escalate to PM (conservative bias)

### Vercel API Integration

**Vercel Rollback Endpoint:**
```
POST /v13/deployments/{id}/rollback
Authorization: Bearer {VERCEL_API_TOKEN}
Content-Type: application/json

Body: {}  (empty body required)

Response:
{
  "id": "dpl_new123456",
  "name": "geekbyte-biz",
  "url": "geekbyte-biz.vercel.app",
  "projectId": "prj_xxx",
  "state": "BUILDING",
  "createdAt": 1707123456000,
  "creator": {
    "uid": "xxx",
    "email": "xxx@vercel.com"
  }
}
```

**Deployment state polling:**
```
GET /v13/deployments/{id}

States:
- BUILDING: deployment in progress
- READY: deployment complete, live
- ERROR: deployment failed
- CANCELED: deployment canceled
```

**Deployment history query:**
```
GET /v13/deployments?state=READY&limit=10&sort=createdAt

Returns: array of recent successful deployments with timestamps and SHAs
```

### Safety Check Implementation Details

**FR-2a: First Deployment Today**
```javascript
// Query deployments from last 24 hours
const today = new Date();
today.setHours(0, 0, 0, 0);
const deploymentsToday = deployments.filter(d => d.createdAt > today);

if (deploymentsToday.length === 1 && deploymentsToday[0].id === currentDeploymentId) {
  escalate("First deployment today — escalating");
}
```
Rationale: Prevents rollback loop where rollback itself fails and creates another failure to rollback.

**FR-2b: Smoke Test Stability**
```javascript
// Query last 5 post-deploy-smoke.yml runs for main branch
const recentRuns = await github.rest.actions.listWorkflowRuns({
  owner, repo, workflow_id: "post-deploy-smoke.yml", branch: "main", per_page: 5
});

const failures = recentRuns.data.workflow_runs.filter(r => r.conclusion === "failure").length;
const failureRate = failures / recentRuns.data.workflow_runs.length;

if (failureRate > 0.4) {
  escalate(`Tests appear flaky: ${(failureRate * 100).toFixed(1)}% failure rate`);
}
```
Rationale: High failure rate indicates test instability, not code problems. Rollback under flaky tests risks chasing ghosts.

**FR-2c: Previous Deployment Available**
```javascript
// Query last 10 successful deployments
const previousDeployments = await vercelApi.getDeployments({
  state: "READY",
  limit: 10,
  sort: "createdAt"
});

// Find the most recent one before current deployment
const previousDeployment = previousDeployments.find(d =>
  d.createdAt < currentDeployment.createdAt
);

if (!previousDeployment) {
  escalate("No previous successful deployment available");
}
```
Rationale: Cannot rollback without a target. Ensures rollback destination exists before attempting.

### Slack Approval Gate Implementation

**Slack message structure (using Slack Block Kit):**
```json
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "*Production Smoke Test Failure — Rollback Approval Required*\n\n*Current Deployment:*\n`{current-sha-short}` by {author} at {timestamp}\n\n*Test Failure:*\n{test-error-summary}\n\n*Rollback Target:*\n`{previous-sha-short}` from {previous-timestamp}\n\n*Safety Checks:*\n✓ Not first deployment today\n✓ Tests are stable (0% failure in last 5 runs)\n✓ Previous deployment available\n\n*Action Required:* Approve or Reject rollback"
  }
}
```

**Approval buttons:**
```json
{
  "type": "actions",
  "elements": [
    {
      "type": "button",
      "text": { "type": "plain_text", "text": "Approve Rollback" },
      "value": "approve",
      "style": "primary",
      "action_id": "rollback_approve"
    },
    {
      "type": "button",
      "text": { "type": "plain_text", "text": "Reject & Escalate" },
      "value": "reject",
      "style": "danger",
      "action_id": "rollback_reject"
    }
  ]
}
```

**Approval handling:**
- GitHub Actions Slack action receives callback from Slack
- Callback routed to workflow environment variable
- Workflow conditional: `if: env.APPROVAL_ACTION == 'approve'`

### Vercel API Error Handling

**Retry strategy for transient failures:**
```yaml
- name: Execute Vercel Rollback
  uses: actions/github-script@v6
  env:
    VERCEL_API_TOKEN: ${{ secrets.VERCEL_API_TOKEN }}
  with:
    script: |
      const MAX_RETRIES = 3;
      const BACKOFF_TIMES = [10000, 30000, 60000]; // 10s, 30s, 60s

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}/rollback`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${process.env.VERCEL_API_TOKEN}` }
          });

          if (response.ok) {
            console.log('Rollback successful');
            return;
          } else if (response.status === 429) {
            console.log(`Rate limited, retrying in ${BACKOFF_TIMES[attempt]}ms`);
            await new Promise(r => setTimeout(r, BACKOFF_TIMES[attempt]));
          } else {
            throw new Error(`Vercel API error: ${response.status}`);
          }
        } catch (error) {
          if (attempt === MAX_RETRIES - 1) throw error;
          console.log(`Attempt ${attempt + 1} failed, retrying...`);
        }
      }
```

### Audit Log Structure

**File: `.logs/rollback/2026-02-05-run-12345-rollback.log`**
```
=== ROLLBACK AUDIT LOG ===
Workflow Run ID: 12345
Date: 2026-02-05T14:32:00Z

=== SMOKE TEST FAILURE DETECTED ===
Workflow: post-deploy-smoke.yml
Tests Failed: 2/10
Error: "Hero section not rendering in Playwright"
Failure Details: [full error output]

=== CURRENT DEPLOYMENT ===
Deployment ID: dpl_abc123
Commit SHA: a1b2c3d4e5f6
Commit Message: "Update hero styling"
Author: jane.doe
Deployment URL: https://geekbyte-biz-abc123.vercel.app
Deployment Timestamp: 2026-02-05T14:25:00Z

=== SAFETY CHECKS ===

[✓ PASS] First Deployment Today Check
  Deployments in last 24h: 3 (not first)

[✓ PASS] Smoke Test Stability Check
  Last 5 deployments failure rate: 0% (0/5 failed)
  Stable: YES

[✓ PASS] Previous Deployment Available
  Previous ID: dpl_xyz789
  Previous SHA: z9y8x7w6v5u4
  Previous Timestamp: 2026-02-05T14:15:00Z

=== APPROVAL GATE ===
Method: Slack
PM: Grant Howe (@granth)
Approval Time: 2026-02-05T14:34:15Z
Decision: APPROVED
Response Time: 2 minutes 15 seconds

=== VERCEL ROLLBACK ===
Rollback Request: 2026-02-05T14:34:16Z
Rollback Target Deployment ID: dpl_xyz789
Response Status: 200 OK
New Deployment ID: dpl_new456
New Deployment URL: https://geekbyte-biz-new456.vercel.app

Waiting for deployment ready...
Poll 1 (1 sec): BUILDING
Poll 2 (2 sec): BUILDING
Poll 3 (3 sec): READY
Ready Timestamp: 2026-02-05T14:35:20Z

=== POST-ROLLBACK SMOKE TESTS ===
Test Run Triggered: 2026-02-05T14:35:21Z
Target: https://geekbyte-biz-new456.vercel.app
Tests Passed: 10/10
Test Duration: 28 seconds
Result: SUCCESS

=== ROLLBACK COMPLETED ===
Total Recovery Time: 5 minutes 20 seconds (from failure to success)
Status: SUCCESSFUL
Investigation Issue Created: #567
Escape Event Created: ESCAPE-2026-021

=== PM NOTIFICATION ===
Slack Message: "Rollback completed. Smoke tests passed against rolled-back deployment. Investigation issue: #567"
Send Time: 2026-02-05T14:35:50Z
```

**Uploaded as artifact:** `rollback-audit-{date}-{run-id}.log`
**Retention:** 90 days (GitHub Actions default)
**Linked in:** GitHub issue created for investigation

### Metrics Tracking

**File: `metrics/rollback-rate.json`**
```json
{
  "2026-01": {
    "total_deployments": 24,
    "failed_smoke_tests": 2,
    "rollback_attempts": 2,
    "rollback_approved": 2,
    "rollback_escalated": 0,
    "successful_rollbacks": 2,
    "failed_rollbacks": 0,
    "rollback_rate": 0.083,
    "mttr_avg_seconds": 280,
    "notes": "Healthy month — rollback rate 8.3%"
  },
  "2026-02": {
    "total_deployments": 8,
    "failed_smoke_tests": 1,
    "rollback_attempts": 1,
    "rollback_approved": 1,
    "rollback_escalated": 0,
    "successful_rollbacks": 1,
    "failed_rollbacks": 0,
    "rollback_rate": 0.125,
    "mttr_avg_seconds": 245,
    "notes": "Tracking — low deployment volume"
  }
}
```

**Interpretation:**
- Rollback rate < 1%: excellent — near-zero production defects
- Rollback rate 1-5%: acceptable — occasional issues caught pre-deployment
- Rollback rate > 5%: concerning — pipeline quality issue, require investigation
- Escalation rate > 50%: concerning — safety checks too strict or tests too flaky

### Workflow Trigger Strategy

**Option A: workflow_run trigger (complex, explicit)**
```yaml
on:
  workflow_run:
    workflows: ["Post-Deploy Smoke Tests"]
    types: [completed]
    branches: [main]
```
Trigger on completion of post-deploy-smoke.yml. Requires explicit workflow naming and run evaluation.

**Option B: Custom event from post-deploy-smoke.yml (simpler, recommended)**
```yaml
# In post-deploy-smoke.yml:
- name: Trigger rollback workflow
  if: failure()
  run: |
    gh workflow run post-deploy-smoke-with-rollback.yml \
      -f deployment-sha=${{ github.sha }} \
      -f deployment-id=${{ github.event.deployment.id }}
```
Directly trigger rollback workflow with inputs. Cleaner, more explicit.

This spec recommends **Option B** for clarity and control.

### Key Architectural Decisions for Review

1. **Approval requirement**: Complex tier mandates human approval for production changes. Option B (Slack approval) chosen over Option A (auto-rollback with notification) because:
   - Prevents cascading failures (smoke test false positives)
   - Gives PM situational awareness before recovery
   - Satisfies governance requirement: no automated production changes without approval
   - MTTR only increases by ~2 minutes (acceptable trade-off)

2. **First-deployment-today safety check**: Prevents rollback loops by never rolling back a deployment that is the only deployment today. If rollback itself fails, we don't want another failure triggering another rollback.

3. **Flaky test detection (40% threshold)**: Based on 5-run sample, > 2 failures indicates instability. Threshold chosen to avoid false negatives (missing real issues) while preventing rollback on consistently flaky tests.

4. **Post-rollback verification required**: Must verify rolled-back deployment works (smoke tests pass) before declaring success. Prevents cascading failures (rollback that doesn't work).

5. **Escape event on rollback success**: Every rollback represents a production incident (defect escaped pre-deployment testing). Automatic escape creation ensures incident is recorded and linked to investigation.

6. **Metrics tracking**: Rollback rate is leading indicator of pipeline health. > 5% rollback rate suggests pre-deployment testing is not catching defects. This triggers PM review of spec gate rigor.

## Tier Justification

rationale: **Complex tier**. Automated rollback is a safety-critical production change with significant risk of cascading failures. While individual components (Vercel API integration, GitHub Actions workflows, Slack notifications) are well-established patterns, the combination introduces new complexity:
- Automated production state changes (rollback is deployment)
- Multi-level safety decision logic (4 independent safety checks)
- Risk of cascading failures (rollback itself fails → escalates, not loops)
- External API dependency (Vercel) with failure modes
- Approval gate integration (combines Slack + GitHub Actions)
- Metrics and monitoring (new observability requirements)

escalation_triggers_checked:
  - **Automated production changes**: YES (rollback is a deployment change) — requires approval gate and audit logging
  - **Safety-critical decision-making**: YES (bad rollback logic causes downtime) — requires multi-gate safety checks and escapes to Slack
  - **External API integration**: YES (Vercel API) — requires error handling, retry logic, timeout protection
  - **Risk of cascading failures**: YES (rollback loop if not careful) — requires first-deployment-today check and post-rollback verification
  - **Approval delegation**: Partially (solo operator model, Grant approves) — option B requires Slack infrastructure
  - **User-facing impact**: YES (rollback affects production availability) — requires MTTR target and escape tracking
  - **Multi-system coordination**: YES (GitHub Actions + Vercel + Slack) — requires clear error handling and escalation
  - **Compliance/audit**: YES (rollback decisions must be logged) — requires detailed audit trail

**Complex tier justified.** Requires:
- Architecture Review: validate safety check logic, Vercel integration, approval workflow
- External review recommended: Vercel API expert, incident response expert
- QA verification: all safety checks, approval gate, post-rollback scenarios, escalation paths
- Deployment checklist: secret management (Vercel token), Slack integration, metrics monitoring

---

## Gate Log

| Gate | Reviewer | Date | Decision | Evidence |
|------|----------|------|----------|----------|
| Spec | | | PENDING | Awaiting approval |
| Architecture | | | PENDING | Awaiting review (Complex tier — external review recommended) |
| QA | | | PENDING | Awaiting verification |
| Deploy | | | PENDING | Awaiting deployment |

## Effort Comparison

| Stage | AI Time | Human Estimate | Human Breakdown |
|-------|---------|----------------|-----------------|
| **Spec Writing** | 18 min | 2.5-3 hours | Research Vercel rollback API (30m), understand smoke test context from SPEC-007/008/009 (20m), write 9 FR with safety logic details (40m), write 14 AC with test scenarios (30m), technical notes & API details (20m), tier justification addressing escalation triggers (10m) |
| **Architecture Review** | 12 min | 1.5-2 hours | Validate safety check logic for false positives (20m), review Vercel API integration and error handling (15m), assess approval workflow design (Slack vs. email) (15m), identify failure modes and escalation paths (15m), review MTTR targets and achievability (10m), document conditions & recommendations (15m) |
| **Implementation + Test** | 20 min | 4-5 hours | Create post-deploy-smoke-with-rollback.yml workflow (45m), implement safety checks (FR-2a/b/c) with GitHub API calls (45m), implement Slack approval gate (30m), implement email fallback (15m), Vercel API integration with error handling (45m), post-rollback smoke test verification (15m), audit logging (20m), metrics tracking update (15m), test with simulated smoke failure (30m), write governance documentation (30m), QA checklist (30m) |
| **Deployment** | _deployment agent_ | 20-30 min | Create deployment checklist (10m), configure GitHub Secrets (Vercel token) (5m), git commit workflow + documentation (3m), git push to GitHub (1m), create test scenario (simulated smoke failure) (5m), verify Slack approval gate (5m), verify metrics tracking (3m), document rollback scenarios (5m) |
| **Total** | 50 min | 8-10 hours | **AI Speedup: 9-12x** |

### Assumptions
- **Spec Writing:** PM familiar with SPEC-007/008/009 context (smoke tests, issue creation, Slack notifications). Complex spec requires deep understanding of safety checks, rollback logic, and failure modes. PM researches Vercel API independently.
- **Architecture Review:** Architect with CI/CD expertise + Vercel integration experience. Requires validating safety logic doesn't create false positives, reviewing approval workflow, assessing MTTR achievability. External incident response expert recommended for escalation design.
- **Implementation:** Senior DevOps engineer or platform engineer (4+ years GitHub Actions, 2+ years Vercel, 1+ year incident response). Implementation time includes: workflow creation (45m), safety check implementation with GitHub API (45m), Slack approval integration (30m), email fallback (15m), Vercel API integration with retries (45m), smoke test verification (15m), audit logging (20m), metrics tracking (15m), testing scenarios (30m), documentation (30m). Human estimate assumes researching Vercel API thoroughly, debugging safety check logic, testing all failure scenarios, writing comprehensive governance docs.
- **Deployment:** DevOps lead familiar with GitHub Secrets, Vercel API, Slack integration. Includes: secret management (5m), git operations (3m), test scenario creation (5m), gate verification (5m), metrics verification (3m), documentation (5m).

### Notes
- **Spec to Implementation:** Safety checks are implementation-heavy. GitHub API calls for deployment history and workflow run history must be tested thoroughly.
- **Testing Strategy:** Create test matrix: successful rollback (happy path), escalation scenarios (first deployment today, flaky tests, no previous deployment, PM rejects, Vercel API error, post-rollback failure). Each scenario requires manual verification.
- **Vercel Integration:** Requires Vercel API token with deployment read/write scope. Token created via Vercel dashboard, stored in GitHub Secret. Verify API endpoints match Vercel documentation version.
- **Slack Integration:** Requires approval action handling. GitHub Actions + Slack approval integration is newer pattern; may need research for latest best practices.
- **MTTR Target:** 3-minute target is achievable with Slack approval (2 min for PM + ~1 min for safety checks + API). Email fallback increases to ~10 minutes.
- **Metrics:** Rollback rate tracking is new observability requirement. Helps PM understand pipeline health over time.

