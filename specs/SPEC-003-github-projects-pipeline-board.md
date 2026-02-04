# Feature Specification

spec_id: SPEC-003
title: Configure GitHub Projects as SDD Pipeline Board
version: 1.2
status: deployed
complexity_tier: trivial
last_updated: 2026-02-04

## Business Context

requester: Grant Howe, Managing Partner
business_goal: Provide a visual pipeline view of SDD spec flow for demonstration
  to stakeholders (PSTrax, Level Equity) and for day-to-day pipeline tracking.
  Spec files in Git remain the source of truth; GitHub Projects is the visibility
  and demo layer.
success_metrics:
  - Pipeline status visible at a glance without pulling the repo
  - Stakeholders can see specs flowing through gates
  - Complexity tiers visually identifiable
  - Effort comparison metrics (AI vs human) visible per spec
  - Demo-ready for SDD methodology presentations
priority: P2 (demo enablement — not blocking development)

## Requirements

### Functional Requirements

- [FR-1]: GitHub Project board created for the GeekByte website repository
- [FR-2]: Board columns matching SDD pipeline stages:
  - Draft
  - Spec Gate (awaiting PM review)
  - Arch Gate (awaiting architecture review)
  - QA Gate (awaiting QA verification)
  - Deploy Gate (awaiting deployment authorization)
  - Done
  - Rejected (with note indicating which gate and why)
- [FR-3]: Labels for complexity tiers:
  - `tier:trivial` (gray)
  - `tier:standard` (blue)
  - `tier:complex` (orange)
  - `tier:critical` (red)
- [FR-4]: Labels for spec type:
  - `type:feature`
  - `type:bugfix`
  - `type:refactor`
  - `type:infrastructure`
- [FR-5]: Issue template that links to the spec file in the repo
- [FR-6]: Existing specs (SPEC-001, SPEC-002) migrated to the board
  as reference items
- [FR-7]: Custom fields for effort metrics:
  - `AI Time` (text) — total AI pipeline time for the spec
  - `Human Estimate` (text) — estimated equivalent human effort
  - `Speedup Factor` (text) — headline comparison (e.g., "11-15x")
- [FR-8]: Custom fields for pipeline tracking:
  - `Spec ID` (text) — links to spec file (e.g., SPEC-002)
  - `First Pass` (single select: Yes / No) — whether spec passed each gate on first attempt
- [FR-9]: Table view configured alongside board view, showing all custom
  fields in columns for metrics-at-a-glance

### Non-Functional Requirements

- [NFR-1]: Board setup takes under 30 minutes
- [NFR-2]: Moving a card between columns takes under 30 seconds
  (no heavyweight process per move)
- [NFR-3]: Board is readable by someone unfamiliar with SDD
  (column names and labels are self-explanatory)

## Acceptance Criteria

- [AC-1]: Given the GitHub Project board, when viewing it, then all
  seven pipeline columns are visible in order
- [AC-2]: Given a new spec, when creating an issue, then the issue
  template includes a link field for the spec file path in the repo
- [AC-3]: Given the board, when filtering by tier label, then only
  specs of that tier are shown
- [AC-4]: Given SPEC-001 and SPEC-002, when viewing the board, then
  both appear as cards with correct tier labels and current status
- [AC-5]: Given the table view, when viewing completed specs, then
  AI Time, Human Estimate, and Speedup Factor columns are populated
- [AC-6]: Given SPEC-002 on the board, when viewing its custom fields,
  then AI Time shows "68 min", Human Estimate shows "12.5-16.5 hours",
  and Speedup Factor shows "11-15x"
- [AC-7]: Given the board, when switching between board view and table
  view, then both views display correctly with their respective layouts

## Scope

### In Scope
- GitHub Project board creation and column configuration
- Label creation for tiers and types
- Custom fields for effort metrics (AI Time, Human Estimate, Speedup Factor)
- Custom fields for pipeline tracking (Spec ID, First Pass)
- Table view configured with all custom fields visible
- Issue template for SDD specs
- Migration of SPEC-001 and SPEC-002 to the board with metrics populated

### Out of Scope
- Automation (auto-moving cards based on gate approvals — future spec)
- Integration with CI/CD pipeline
- Notifications or webhooks
- Velocity metric dashboards beyond GitHub Projects table view
- Aggregate calculations (total time saved, average speedup — manual for now)

## Dependencies

- [DEP-1]: GitHub repository for GeekByte website exists
- [DEP-2]: Grant has admin access to create Projects and labels

## Tier Justification

rationale: Trivial tier. No code changes. No architectural impact.
  Configuration-only task in GitHub's UI. No new code paths, no
  production impact. This is project management setup, not development.
escalation_triggers_checked:
  - Authentication/authorization: No
  - Payment/financial data: No
  - PII/PHI handling: No
  - New external integration: No
  - Database schema change: No
  - Core domain model: No

---

## Gate Log

| Gate | Reviewer | Date | Decision | Evidence |
|------|----------|------|----------|----------|
| Spec | Grant Howe (Claude) | 2026-02-04 | APPROVED | Requirements complete (9 FR, 3 NFR), AC testable (7), scope clear, tier appropriate. Custom fields added for effort metrics tracking. |
| Architecture | Skip (Trivial) | | | |
| QA | Skip (Trivial) | | | |
| Deploy | Grant Howe (Claude) | 2026-02-04 | APPROVED | Automated via GitHub CLI + GraphQL API. Project created, 8 labels created, 5 custom fields configured, SPEC-001 and SPEC-002 migrated with full metrics. Board URL: https://github.com/users/GrantH-Geekbyte/projects/1 |

## Effort Comparison

| Stage | AI Time | Human Estimate | Human Breakdown |
|-------|---------|----------------|-----------------|
| **Spec Writing** | 8 min | 45-60 min | Research GitHub Projects features (15m), write 9 FRs with custom fields (20m), write 7 ACs (10m), scope & dependencies (5m), format (5m) |
| **Architecture Review** | Skip (Trivial) | Skip (Trivial) | — |
| **Implementation + Test** | 18 min | 1.5-2 hours | Automated via gh CLI + GraphQL API: create project (1m), create 8 labels (1m), create 5 custom fields (2m), create issues #2 and #3 (2m), add to project (1m), set custom field values (3m), implementation guides (8m) |
| **Deployment** | Skip (Trivial) | Skip (Trivial) | — |
| **Total** | 26 min | 2.25-3 hours | **AI Speedup: 5-7x** |

### Assumptions
- **Spec Writing:** PM familiar with GitHub Projects, understands SDD pipeline structure
- **Implementation:** Fully automated via GitHub CLI (gh) and GraphQL API. AI time includes: gh auth setup (3m), project creation (1m), field configuration (6m), issue creation and migration (5m), implementation guide creation (8m). Human estimate assumes PM doing this manually in GitHub UI without automation or pre-written guide.
