# Feature Specification

spec_id: SPEC-005
title: GitHub Issues Support Ticket Integration
version: 1.0
status: deployed
complexity_tier: trivial
last_updated: 2026-02-05

## Business Context

requester: Grant Howe, Managing Partner
business_goal: Demonstrate how customer support tickets flow into the SDD
  development pipeline. Shows stakeholders (PSTrax, Level Equity) the full
  lifecycle: customer reports issue → triage → spec → pipeline → verified fix.
  This establishes the support workflow pattern before the AI agent product
  has real customers.
success_metrics:
  - Support tickets visually distinct on the pipeline board
  - Clear triage-to-spec-to-deployment flow visible
  - Demo-ready for "how we handle customer issues" story
  - Workflow pattern established that scales to real support volume
priority: P3 (demo enablement — no customers yet, but showcases process maturity)

## Requirements

### Functional Requirements

- [FR-1]: GitHub Issue template for support tickets with fields:
  - Reporter name / contact
  - Issue description
  - Steps to reproduce (if applicable)
  - Severity (Critical / High / Medium / Low)
  - Affected page or feature
  - Browser / device (if relevant)
- [FR-2]: Label `type:support` added to repository (distinct color — suggest purple)
- [FR-3]: Labels for support severity:
  - `severity:critical` (red)
  - `severity:high` (orange)
  - `severity:medium` (yellow)
  - `severity:low` (gray)
- [FR-4]: Custom field `Source` added to GitHub Project board with options:
  - Internal
  - Support Ticket
  - Stakeholder Request
- [FR-5]: Support ticket triage workflow documented:
  - Ticket created → PM reviews → assigns severity
  - PM decides: fix inline (Trivial) or write spec (Standard+)
  - If spec needed: spec created, linked to original ticket
  - Ticket tracks through pipeline via linked spec
  - Ticket closed when fix deployed, with deployment reference
- [FR-6]: Escape tracking integration:
  - Support tickets that represent production defects are flagged as escapes
  - Label `escape` added to repository (distinct color — suggest bright red)
  - When a ticket is flagged as an escape, an escape event is created in
    learning/escapes/ using the existing escape_event template
  - Escape event links back to: originating spec, gate that should have
    caught it, root cause category, and remediation actions
  - Triage workflow includes escape assessment: "Did this issue pass through
    our pipeline? If yes, which gate should have caught it?"
- [FR-7]: Sample support ticket created as demonstration
  (use a real minor issue from the site if one exists, or create
  a realistic example — if it's a real issue, also create the
  corresponding escape event as a demonstration)

### Non-Functional Requirements

- [NFR-1]: Support template takes under 2 minutes to fill out
- [NFR-2]: Triage decision (severity + spec-or-not) takes under 5 minutes
- [NFR-3]: Workflow is documented clearly enough for a non-technical
  stakeholder to follow the lifecycle

## Acceptance Criteria

- [AC-1]: Given the GitHub repository, when creating a new issue, then
  "Support Ticket" appears as a template option
- [AC-2]: Given a support ticket issue, when viewing it on the board,
  then it is visually distinct from feature specs (purple `type:support` label)
- [AC-3]: Given a support ticket that needs a spec, when the PM creates
  a spec, then the spec issue links back to the original support ticket
- [AC-4]: Given the board table view, when filtering by Source = "Support Ticket",
  then only support-originated work is shown
- [AC-5]: Given a support ticket that represents a production defect, when
  the PM flags it as an escape, then the `escape` label is applied and an
  escape event file is created in learning/escapes/
- [AC-6]: Given an escape event, when viewing it, then it identifies the
  originating spec, the gate that should have caught it, why it escaped,
  and the remediation action
- [AC-7]: Given the board, when filtering by `escape` label, then only
  escaped defects are shown — this is the escape rate view
- [AC-8]: Given the sample support ticket, when viewing it, then
  all template fields are populated and it demonstrates the full workflow

## Scope

### In Scope
- GitHub Issue template for support tickets
- Labels for type, severity, and escape identification
- Custom field for Source on the Project board
- Triage workflow documentation including escape assessment (markdown in repo)
- Escape event creation workflow connecting to learning/escapes/ templates
- One sample support ticket demonstrating the flow
- One sample escape event (if sample ticket represents a real defect)

### Out of Scope
- Customer-facing support portal (future — Phase 4)
- Email-to-issue automation (future)
- SLA tracking or response time metrics (future)
- Integration with external support tools (Zendesk, Intercom — Phase 4)
- Auto-assignment or routing rules
- Customer notification when fix ships (future)

## Dependencies

- [DEP-1]: SPEC-003 completed (GitHub Projects board exists with custom fields)
- [DEP-2]: Grant has admin access to create issue templates and labels

## Tier Justification

rationale: Trivial tier. No code changes. GitHub configuration only —
  issue template, labels, one custom field. No production impact,
  no architectural changes. Documentation artifact (triage workflow)
  is a markdown file.
escalation_triggers_checked:
  - Authentication/authorization: No
  - Payment/financial data: No
  - PII/PHI handling: No (support template collects reporter name only,
    stored in GitHub — no additional PII handling)
  - New external integration: No
  - Database schema change: No
  - Core domain model: No

---

## Gate Log

| Gate | Reviewer | Date | Decision | Evidence |
|------|----------|------|----------|----------|
| Spec | Grant Howe (Claude) | 2026-02-05 | APPROVED | Requirements complete (7 FR, 3 NFR), 8 AC testable, scope clear. Establishes support ticket → pipeline flow. Escape tracking integrates with learning system. Trivial tier appropriate. |
| Architecture | Skip (Trivial) | | | |
| QA | Skip (Trivial) | | | |
| Deploy | Grant Howe (Claude) | 2026-02-05 | APPROVED | All deliverables complete: issue template, 6 labels, Source field, triage workflow (465 lines), escape template, sample ticket #12 with escape event ESC-001. Demo-ready for stakeholder presentations. |

## Effort Comparison

| Stage | AI Time | Human Estimate | Human Breakdown |
|-------|---------|----------------|-----------------|
| **Spec Writing** | 3 min | 45-60 min | Review existing support workflows (15m), write 7 FRs with escape integration (20m), write 8 ACs (10m), scope & dependencies (10m) |
| **Architecture Review** | Skip (Trivial) | Skip (Trivial) | — |
| **Implementation + Test** | 22 min | 2.5-3 hours | Create issue template (5m), create 6 labels via CLI (2m), add Source field to board (3m), write triage workflow doc (12m), create escape template (8m), create sample ticket + escape event (10m), test workflow (5m) |
| **Deployment** | Skip (Trivial) | Skip (Trivial) | — |
| **Total** | 25 min | 3-4 hours | **AI Speedup: 7-10x** |

### Assumptions
- **Spec Writing:** PM familiar with support ticket workflows and escape tracking concepts
- **Implementation:** Fully automated via GitHub CLI (gh) and GraphQL API. AI time includes: issue template creation (5m), label creation (2m), custom field via GraphQL (3m), comprehensive triage workflow documentation with escape integration (12m), escape event template (8m), sample ticket + escape event (10m). Human estimate assumes PM writing templates and docs from scratch, researching GitHub issue template YAML syntax, learning GraphQL for custom fields, and documenting triage workflow without existing patterns.
