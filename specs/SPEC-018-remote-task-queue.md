# Feature Specification

spec_id: SPEC-018
title: Remote Task Queue System
version: 1.0
status: draft
complexity_tier: standard
last_updated: 2026-02-09

## Business Context

requester: Grant Howe, Managing Partner
business_goal: Enable remote communication with Claude Code in the development environment when not physically present at the local computer. Currently, all SDD pipeline work requires being at the local machine with Claude Code running in the terminal. This spec introduces a file-based task queue that allows task submission via Git commits and asynchronous processing via GitHub Actions, enabling remote work initiation (e.g., "create SPEC-019 while I'm away" or "run tests and report results").
success_metrics:
  - Task submission to result delivery: < 20 minutes (including polling interval)
  - Task success rate: > 95%
  - User can submit tasks and receive results without being at local machine
  - Zero security incidents (unauthorized task execution)
  - Task queue handles: spec creation, test execution, codebase queries, git operations
priority: P3 (enhancement — enables remote async work, not blocking current operations)

## Requirements

### Functional Requirements

- [FR-1]: Task queue directory structure created in repository root
  - `tasks/inbox/` - New tasks submitted by user (monitored by processor)
  - `tasks/processing/` - Tasks currently being processed (atomic move from inbox)
  - `tasks/completed/` - Successfully completed tasks with results
  - `tasks/failed/` - Failed tasks with error details and diagnostics
  - Each directory contains `.gitkeep` to ensure it exists in Git
- [FR-2]: Task file format defined as JSON schema (version 1.0)
  - Required fields: `task_id` (unique identifier), `submitted_at` (ISO 8601 timestamp), `type` (enum: spec_creation, test_run, codebase_query, git_operations), `description` (human-readable task summary)
  - Optional fields: `priority` (enum: standard, high; default: standard), `parameters` (object with type-specific data), `notification_webhook` (Slack webhook URL for completion notification)
  - Example task file: `tasks/inbox/TASK-001-2026-02-09-12:30.json`
  - Schema validation enforced before processing
- [FR-3]: Response file format defined as JSON schema (version 1.0)
  - Required fields: `task_id` (matches task), `status` (enum: completed, failed), `started_at` (ISO 8601 timestamp), `completed_at` (ISO 8601 timestamp)
  - For completed tasks: `result` (object with task-specific output), `artifacts` (array of file paths created/modified), `summary` (human-readable result description)
  - For failed tasks: `error` (error message), `error_type` (enum: validation_error, execution_error, timeout_error), `logs` (array of log messages for debugging)
  - Response file written to `tasks/completed/` or `tasks/failed/` matching task filename
- [FR-4]: GitHub Actions workflow `task-processor.yml` created in `.github/workflows/`
  - Triggers: (1) Scheduled cron every 15 minutes, (2) Manual `workflow_dispatch` for testing
  - Runs on ubuntu-latest runner
  - Installs Node.js v24 and npm dependencies
  - Executes `scripts/process-tasks.js` task processor script
  - Commits results back to repository (completed/failed directories)
  - Configures git user as "Claude Task Processor <noreply@anthropic.com>"
  - Reports workflow status in GitHub Actions summary
- [FR-5]: Task processor script `scripts/process-tasks.js` created
  - Scans `tasks/inbox/` for `*.json` files sorted by filename (FIFO processing)
  - Validates each task against JSON schema (reject invalid tasks immediately)
  - Processes tasks one at a time (single-threaded to avoid Git conflicts)
  - Moves task file from `inbox/` to `processing/` atomically (via rename)
  - Invokes task handler based on task type
  - Writes response file to `completed/` or `failed/`
  - Sends notification webhook if specified in task
  - 10-minute timeout per task (enforced via `setTimeout`)
  - Rate limiting: max 10 tasks processed per workflow run (prevents abuse)
- [FR-6]: Task type handlers implemented in `scripts/task-handlers/` directory
  - `spec-creation-handler.js` - Creates Feature Spec documents (simulates PM-Spec agent workflow)
    - Parameters: `title`, `requirements` (markdown), `complexity_tier` (optional)
    - Output: New spec file in `specs/SPEC-NNN-title.md`, spec ID assigned
    - Result: `{ spec_id: "SPEC-NNN", file_path: "specs/SPEC-NNN-title.md", summary: "..." }`
  - `test-run-handler.js` - Executes Playwright tests
    - Parameters: `test_suite` (enum: all, smoke, visual), `project` (enum: local, live)
    - Output: Test results summary (passed/failed counts)
    - Result: `{ passed: 170, failed: 0, duration_ms: 120000, summary: "All tests passed" }`
  - `codebase-query-handler.js` - Answers questions about codebase
    - Parameters: `query` (string question)
    - Output: Answer with file references and line numbers
    - Result: `{ answer: "...", references: ["file.js:42"], summary: "..." }`
  - `git-operations-handler.js` - Performs Git operations
    - Parameters: `operation` (enum: create_branch, create_pr), `branch_name`, `pr_title`, `pr_body`
    - Output: Branch/PR URL
    - Result: `{ operation: "create_pr", pr_number: 31, pr_url: "...", summary: "..." }`
- [FR-7]: Slack notification integration for task completion
  - Reuses Slack webhook from SPEC-009 (stored in GitHub secret `SLACK_WEBHOOK_URL`)
  - Sends notification on task completion (both success and failure)
  - Notification payload includes: task ID, status, summary, link to result file in GitHub
  - Notification sent only if task file includes `notification_webhook` field OR uses default webhook from secret
  - Notification format matches existing workflow failure notifications (consistent UX)
- [FR-8]: Security validation layer
  - JSON schema validation (reject malformed tasks)
  - Task type whitelist (only allowed types processed)
  - File path sanitization (prevent directory traversal in parameters)
  - Rate limiting per workflow run (max 10 tasks)
  - Audit log written to `tasks/audit.log` (task ID, timestamp, submitter, status)
  - Tasks with invalid signatures or schemas moved to `tasks/failed/` with validation error
- [FR-9]: Documentation created in `governance/remote-task-queue.md`
  - User guide: how to submit tasks (create JSON file, commit to inbox)
  - Task type reference with examples
  - Response format documentation
  - Security model explanation
  - Troubleshooting guide (common errors and fixes)
  - Notification setup instructions

### Non-Functional Requirements

- [NFR-1]: Task pickup latency: 0-15 minutes (polling interval via cron schedule)
- [NFR-2]: Task processing time: < 10 minutes per task (enforced timeout)
- [NFR-3]: Response file write time: < 5 seconds after task completion
- [NFR-4]: Task processor workflow success rate: > 99% (graceful error handling)
- [NFR-5]: No lost tasks (all tasks in inbox eventually processed or moved to failed)
- [NFR-6]: Notification delivery: 100% success rate for valid webhooks
- [NFR-7]: Audit trail maintained for all task submissions and executions (immutable Git history)
- [NFR-8]: Zero cost impact (GitHub Actions free tier sufficient — estimate: 96 runs/day × 2 min = 192 min/day × 30 days = 5760 min/month, under 2000 min/month free tier; Note: May require paid plan)
- [NFR-9]: Clear error messages for failed tasks (actionable diagnostics in response file)
- [NFR-10]: Task submission process understandable in < 5 minutes (documented with examples)

## Acceptance Criteria

- [AC-1]: Given a task file in `tasks/inbox/`, when the task processor workflow runs, then the task is picked up within 15 minutes
- [AC-2]: Given a valid task JSON file, when processed, then the task moves from `inbox/` to `processing/` to `completed/` atomically
- [AC-3]: Given an invalid task JSON file, when processed, then the task moves to `failed/` with a validation error response
- [AC-4]: Given a `spec_creation` task, when processed, then a new spec file is created in `specs/` and the response includes the spec ID
- [AC-5]: Given a `test_run` task, when processed, then Playwright tests execute and the response includes pass/fail counts
- [AC-6]: Given a `codebase_query` task, when processed, then the response includes an answer with file references
- [AC-7]: Given a `git_operations` task to create a branch, when processed, then the branch is created and the response includes the branch name
- [AC-8]: Given a task with `notification_webhook`, when the task completes, then a Slack notification is sent to that webhook
- [AC-9]: Given a task that exceeds 10-minute timeout, when processing, then the task fails with a timeout error
- [AC-10]: Given more than 10 tasks in `inbox/`, when processed in one workflow run, then only the first 10 are processed (rate limiting)
- [AC-11]: Given a task submission, when viewed in Git history, then an audit trail exists showing task ID, timestamp, and status
- [AC-12]: Given the documentation in `governance/remote-task-queue.md`, when a user reads it, then they can successfully submit a task within 5 minutes

## Scope

### In Scope
- File-based task queue with inbox/processing/completed/failed directories
- JSON schema for task and response formats
- GitHub Actions workflow for task processing (scheduled cron)
- Task handlers for: spec_creation, test_run, codebase_query, git_operations
- Slack notification integration for task completion
- Security validation (schema, whitelist, rate limiting, audit log)
- User documentation and troubleshooting guide
- Manual workflow trigger for testing (`workflow_dispatch`)

### Out of Scope
- Real-time API endpoint for task submission (no server infrastructure)
- Web UI for task queue management (Git-based only)
- Complex authentication beyond GitHub repository access
- Task prioritization queue (FIFO only in this version)
- Multi-user concurrent task submission (single operator assumed)
- Integration with external task management systems (Jira, Asana, Trello)
- Mobile app for task submission
- Advanced task types: deployment, rollback, infrastructure changes
- Task chaining (task B waits for task A to complete)
- Scheduled/recurring tasks (cron-like task scheduling)
- Task templates library or marketplace
- Task analytics dashboard
- Email-based task submission
- Real-time websocket notifications

### Deferred to Future Specs
- Advanced task types (SPEC-019: deployment tasks, rollback tasks)
- Task chaining and dependencies (SPEC-020: workflow orchestration)
- Task templates library (SPEC-021: reusable task definitions)
- Web UI for task management (requires backend infrastructure)

## Dependencies

- [DEP-1]: SPEC-007 (CI/CD Pipeline Integration) - GitHub Actions workflows established and tested
- [DEP-2]: SPEC-009 (Slack Notifications) - Slack webhook configured in GitHub secrets
- [DEP-3]: Node.js v24 runtime - Required for task processor script execution
- [DEP-4]: GitHub repository write access - Task processor commits results to repo
- [DEP-5]: SDD agent prompts in `.claude/agents/sdd/` - Reference for simulating agent workflows
- [DEP-6]: Playwright test suite - Required for `test_run` task type
- [DEP-7]: Existing spec numbering system - Must maintain sequential SPEC-NNN IDs for spec_creation tasks

## Technical Notes

### Architecture Decision: Git-Based Task Submission

**Decision:** Tasks are submitted by committing JSON files to `tasks/inbox/` and pushing to GitHub.

**Rationale:**
- Leverages existing authentication (GitHub repository access)
- Provides audit trail (all tasks in Git history)
- No additional infrastructure required (no API server)
- Familiar workflow for developer users (Git commit/push)

**Trade-offs:**
- Not real-time (0-15 minute latency due to polling)
- Requires Git knowledge (not user-friendly for non-technical users)
- Cannot support truly instant task execution

**Alternatives Considered:**
- Email-based submission: More complex parsing, less secure, less auditable (rejected)
- Slack bot: Requires server hosting, out of scope for static site (rejected)
- GitHub Issues as queue: Less structured than JSON, issues are public on public repos (deferred)
- Cloud function API: Requires cloud infrastructure and costs (out of scope)

### Architecture Decision: GitHub Actions Cron Polling

**Decision:** Task processor runs every 15 minutes via GitHub Actions scheduled workflow.

**Rationale:**
- No server infrastructure required
- Fits within GitHub Actions free tier (with margin)
- Acceptable latency for async remote work use case
- Simple implementation (no webhook configuration)

**Trade-offs:**
- 0-15 minute latency (not real-time)
- Minimum 15-minute interval (GitHub Actions limitation)
- Consumes GitHub Actions minutes (may require paid plan for heavy usage)

**Alternatives Considered:**
- Webhook trigger: Requires webhook configuration, more complex (deferred)
- Every 5 minutes: Higher frequency, more minutes consumed (rejected due to cost)
- Manual trigger only: No automation, user must click "Run workflow" (rejected)

### Architecture Decision: Single-Threaded Task Processing

**Decision:** Process tasks one at a time (FIFO), not in parallel.

**Rationale:**
- Avoids Git merge conflicts when committing results
- Simpler implementation (no concurrency handling)
- Predictable task ordering
- Sufficient for single-operator use case

**Trade-offs:**
- No parallelization (slower total processing time)
- Long-running tasks block subsequent tasks

**Alternatives Considered:**
- Parallel processing: Complex Git conflict resolution, race conditions (rejected)
- Queue splitting by task type: Over-engineered for v1 (deferred)

### Security Considerations

**Authentication:** Repository write access serves as authentication mechanism. Only users with push access can submit tasks.

**Authorization:** Task type whitelist enforces allowed operations. Users cannot execute arbitrary code via task parameters.

**Input Validation:** JSON schema validation and file path sanitization prevent injection attacks.

**Rate Limiting:** Max 10 tasks per workflow run prevents abuse and runaway costs.

**Audit Trail:** All tasks logged in Git history (immutable record) and `tasks/audit.log`.

**Risk Mitigation:**
- Command injection: File path sanitization, no shell command execution from task parameters
- DoS via task spam: Rate limiting (10 tasks/run), GitHub Actions timeout (10 min/task)
- Malicious task payloads: Schema validation, type whitelist, parameter sanitization

### Complexity Tier Justification

**Tier: Standard**

**Rationale:**
- New feature, not an existing pattern in codebase
- Introduces new directory structure and file-based workflow
- Requires new GitHub Actions workflow (follows SPEC-007 pattern)
- Integrates with multiple systems (Git, Slack, GitHub API, Playwright)
- Security considerations (validation, rate limiting, audit logging)
- No Critical tier triggers: No authentication/payments/PII, no database schema, no external API integrations beyond existing Slack webhook
- Similar complexity to SPEC-007 (CI/CD Pipeline) which was also Standard tier
- Follows established GitHub Actions patterns from SPEC-007 and SPEC-009

**Escalation Triggers Checked:**
- ❌ Authentication/authorization system: No (GitHub repo access is sufficient)
- ❌ Payment/financial data: No
- ❌ PII/PHI handling: No (task metadata only)
- ❌ New external API integration: No (reuses Slack webhook from SPEC-009)
- ❌ Database schema change: No (file-based system)
- ❌ Core domain model change: No
- ⚠️  New architectural pattern: Yes (task queue) - but not Critical level complexity
- ❌ Framework migration: No

**Conclusion:** Standard tier is appropriate. Task queue is a new pattern, but implementation follows established GitHub Actions and file-based conventions. No Critical tier triggers present.

## Effort Estimate

**AI Time (Estimated):**
- Spec creation (this document): 45 minutes
- Directory structure and schemas: 15 minutes
- Task processor script: 90 minutes
- Task handler implementations (4 handlers): 120 minutes (30 min each)
- GitHub Actions workflow: 30 minutes
- Slack notification integration: 20 minutes
- Security validation layer: 45 minutes
- Documentation: 60 minutes
- Testing (manual with sample tasks): 45 minutes
- **Total AI Time: ~7.5 hours**

**Human Equivalent (Estimated):**
- Requirements gathering and design: 4 hours
- Implementation: 16 hours (complex logic, Git integration, error handling)
- Testing: 4 hours
- Documentation: 3 hours
- **Total Human Time: ~27 hours**

**Speedup Factor:** 27 / 7.5 = **3.6x**

**Note:** Lower speedup factor than typical (5-15x) due to:
- Novel architecture (no existing pattern to follow in codebase)
- Complex Git integration (atomic file moves, commits, conflict handling)
- Security validation requirements (schema design, sanitization logic)
- GitHub Actions cron and workflow orchestration (requires iterative testing)

**Actual Time Tracking:** To be populated post-implementation.
- Actual AI Time: TBD
- Actual Human Estimate: TBD
- Actual Speedup Factor: TBD

## Open Questions

None. Ready for Architecture Gate review.

## Revision History

- v1.0 (2026-02-09): Initial draft created. Standard tier assigned. Ready for Spec Gate approval.
