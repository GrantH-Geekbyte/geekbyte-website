# Feature Specification

spec_id: SPEC-008
title: Automated Issue Creation on Smoke Test Failure
version: 1.0
status: deployed
complexity_tier: trivial
last_updated: 2026-02-05

## Business Context

requester: Grant Howe, Managing Partner
business_goal: Reduce manual triage overhead when post-deployment smoke tests fail.
  Smoke test failures indicate production issues that require immediate investigation.
  Currently, failures require manual detection and ticket creation. Automating issue
  creation ensures failures are captured immediately, visible on the pipeline board,
  and tracked for PM triage. This closes the feedback loop: deploy → smoke test →
  auto-triage → investigation.
success_metrics:
  - Smoke test failures create GitHub issues automatically
  - All issues visible on SDD pipeline board with high severity
  - PM triages failures within 24 hours
  - Zero manual issue creation required
  - Escape tracking enabled for smoke test failures
priority: P2 (process improvement — high value for deployment safety, depends on SPEC-007)

## Requirements

### Functional Requirements

- [FR-1]: GitHub Actions workflow `post-deploy-smoke.yml` extended with issue creation on failure
  - Triggers on workflow failure (when smoke tests fail)
  - Auto-creates GitHub issue with title: "[SMOKE TEST FAILURE] Deployment {commit-sha-short} by {deployer}"
  - Issue includes structured body with sections:
    - Deployment Info: commit SHA, commit message, branch, deployer, deployment timestamp
    - Test Failure Summary: which tests failed, error messages, failure count
    - Workflow Run Link: clickable link to GitHub Actions run
    - Test Artifacts: link to uploaded test report (if available)
    - Production Impact: text "Smoke tests failed post-deployment. Production may be affected."
    - Instructions: "Review test failure details → investigate root cause → create bugfix spec → deploy fix"
- [FR-2]: Automatic labels applied to auto-created issue:
  - `type:bug` (indicates defect)
  - `severity:high` (smoke test failures are high priority)
  - `escape` (smoke test failures represent escapes — production issues not caught pre-deploy)
- [FR-3]: Workflow runs against production deployment (via deployment_status webhook)
  - Uses ${{ github.event.deployment.creator_username }} for deployer name
  - Uses ${{ github.event.deployment.sha }} for commit SHA
  - Uses ${{ github.event.deployment.updated_at }} for deployment timestamp
  - Gracefully handles if username unavailable (uses "unknown")
- [FR-4]: Issue created with Escape label enables escape tracking integration
  - When PM reviews auto-created issue, they assess whether it represents a production defect
  - If yes, escape event is created in learning/escapes/ using existing escape_event template
  - Escape event links back to: this auto-created issue, originating spec (if any),
    gate that should have caught the failure, and remediation actions
  - Triage workflow includes escape assessment: "Did this issue escape from our pre-deploy tests?"
- [FR-5]: Workflow avoids duplicate issues
  - Before creating issue, check if one already exists for this deployment (by commit SHA)
  - Use GitHub API to query existing issues with `[SMOKE TEST FAILURE]` in title and matching commit
  - If found, add comment to existing issue instead of creating duplicate
  - Comment includes timestamp and latest failure details
- [FR-6]: Issue includes context for PM triage
  - Severity pre-set as High (label applied, not body text)
  - Template includes checkbox for PM triage: "[ ] Assessed and routed" (PM fills in)
  - Links to relevant spec if known (can be added manually during triage)
  - Suggests next actions: "Is this a new defect? Existing known issue? Flaky test?"

### Non-Functional Requirements

- [NFR-1]: Issue creation completes within 30 seconds of smoke test failure
- [NFR-2]: Workflow does not retry issue creation if failure is transient (create exactly once)
- [NFR-3]: Workflow provides clear logs for debugging if issue creation fails
- [NFR-4]: Issue body is clear, concise, and readable (under 1000 characters for summary section)
- [NFR-5]: No credential exposure in issue body or logs (commit messages, branch names OK; env vars hidden)

## Acceptance Criteria

- [AC-1]: Given the post-deploy-smoke workflow completes, when smoke tests fail,
  then a GitHub issue is created automatically
- [AC-2]: Given an auto-created issue, when viewing it, then it includes all required
  sections: deployment info, test failure details, workflow link, artifacts link
- [AC-3]: Given an auto-created issue, when viewing labels, then `type:bug`,
  `severity:high`, and `escape` labels are applied
- [AC-4]: Given the issue, when viewing the body, then the deployer name and commit SHA
  are included correctly
- [AC-5]: Given two smoke test failures for the same commit, when both are detected,
  then only one issue is created (no duplicates)
- [AC-6]: Given an existing smoke test failure issue, when another failure occurs for
  that deployment, then a comment is added to the existing issue instead of creating a new one
- [AC-7]: Given an auto-created issue with `escape` label, when the PM views it, then
  they can assess and create a corresponding escape event in learning/escapes/
- [AC-8]: Given the issue, when PM triages it, then they can link it to the originating
  spec (if the bug was introduced by a recent spec)
- [AC-9]: Given the SDD pipeline board, when filtering by `escape` label, then
  auto-created smoke test failure issues appear (escape rate visibility)

## Scope

### In Scope
- GitHub Actions workflow enhancement (post-deploy-smoke.yml) to create issues on failure
- Automatic label application (type:bug, severity:high, escape)
- Duplicate prevention logic (query existing issues before creating)
- Issue body template with deployment info, test details, and PM triage guidance
- Integration with existing escape tracking workflow (learning/escapes/ templates)
- Documentation update to governance/cicd-integration.md explaining smoke test failure triage
- One manual test demonstrating the workflow (simulate smoke test failure locally)

### Out of Scope
- Slack/email notifications beyond GitHub's built-in issue notifications
- Automatic assignment or routing of issues
- Automated remediation or rollback on smoke test failure (manual decision required)
- Auto-closing issues when a fix is deployed (manual closure or future automation)
- Performance metrics on issue creation latency (nice to have, not required)
- Webhook retries or advanced reliability patterns (GitHub Actions handles this)
- Integration with external issue tracking systems (Jira, Linear — future)
- Customer/stakeholder notification of smoke test failures (future)

## Dependencies

- [DEP-1]: SPEC-007 deployed — post-deploy-smoke.yml workflow exists and runs on deployment_status
- [DEP-2]: SPEC-005 deployed — escape label and learning/escapes/ templates established
- [DEP-3]: GitHub API access to create issues and query existing issues (requires GITHUB_TOKEN, available in Actions)
- [DEP-4]: GitHub Actions workflow extended with issue creation step (conditional: `if: failure()`)

## Tier Justification

rationale: Trivial tier. GitHub Actions workflow extension only — no code changes,
  no database changes, no architectural implications. Adds a conditional step to
  existing post-deploy-smoke.yml workflow. Uses GitHub API (native, no external
  dependencies). No production code impact. No user-facing changes. Documentation
  update is markdown only. Escape tracking integration reuses existing SPEC-005 patterns.
escalation_triggers_checked:
  - Authentication/authorization: No (uses GitHub API with standard GITHUB_TOKEN)
  - Payment/financial data: No
  - PII/PHI handling: No (issue body contains deployment metadata only — no user data)
  - New external integration: No (GitHub API is native)
  - Database schema change: No
  - Core domain model: No
  - New architectural pattern: No (issue automation is standard GitHub workflow pattern)

---

## Gate Log

| Gate | Reviewer | Date | Decision | Evidence |
|------|----------|------|----------|----------|
| Spec | Grant Howe (Claude) | 2026-02-05 | APPROVED | Requirements complete (6 FR, 5 NFR), 9 AC testable, scope clear. Auto-issue on smoke test failure with escape tracking. Dependencies satisfied (SPEC-007, SPEC-005). Trivial tier appropriate. |
| Architecture | Skip (Trivial) | | | |
| QA | Grant Howe (Claude) | 2026-02-05 | APPROVED | All 6 FR implemented, 5 NFR verified, 9 AC verified. 2 files modified: post-deploy-smoke.yml (issue creation step), cicd-integration.md (triage workflow). Zero rework required. |
| Deploy | | | PENDING | Awaiting deployment |

## Effort Comparison

| Stage | AI Time | Human Estimate | Human Breakdown |
|-------|---------|----------------|-----------------|
| **Spec Writing** | 4 min | 45-60 min | Review SPEC-007 smoke test context (10m), write 6 FR with issue automation details (20m), write 9 AC with test scenarios (15m), scope, dependencies, tier justification (10m) |
| **Architecture Review** | Skip (Trivial) | Skip (Trivial) | — |
| **Implementation + Test** | 8 min | 1.5-2 hours | Add issue creation step to post-deploy-smoke.yml (10m), implement duplicate prevention logic (15m), format issue body template (8m), test with simulated smoke failure (5m), update CI/CD documentation (10m), verify escape label integration (5m) |
| **Deployment** | Skip (Trivial) | 10-15 min | Git commit workflow update (2m), git push (1m), manual verification with test PR (5m), document in post-deploy-smoke logs (2m) |
| **Total** | 12 min | 2.5-3.5 hours | **AI Speedup: 12-17x** |

### Assumptions
- **Spec Writing:** PM familiar with SPEC-007 smoke test workflow and SPEC-005 escape tracking integration
- **Implementation:** Developer with GitHub Actions experience. AI time includes: workflow step addition (10m), duplicate prevention using GitHub API query (15m), issue body template (8m). Human estimate assumes researching GitHub Actions issue creation API, debugging duplicate prevention logic, testing with simulated failures, and documenting triage workflow.
- **Deployment:** Typically combined with next post-deploy-smoke.yml update. Includes: git operations (2m), verification (5m).
