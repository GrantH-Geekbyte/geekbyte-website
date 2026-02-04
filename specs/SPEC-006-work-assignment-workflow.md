# Feature Specification

spec_id: SPEC-006
title: GitHub Issues Work Assignment Workflow
version: 1.2
status: deployed
complexity_tier: trivial
last_updated: 2026-02-04

## Business Context

requester: Grant Howe, Managing Partner
business_goal: Demonstrate how SDD pipeline work is assigned and tracked
  across a surgical team using GitHub Issues. Shows stakeholders that SDD
  scales beyond solo operator to team-based execution with clear ownership
  at each gate. The issue is the work assignment; the spec file is the contract.
success_metrics:
  - Clear assignment flow visible on the board: who owns what, at which gate
  - Gate transitions show handoff from one role to the next
  - Demo-ready for "how a team operates with SDD" story
  - Pattern established for PSTrax team onboarding
priority: P3 (demo enablement — showcases team scalability)

## Requirements

### Functional Requirements

- [FR-1]: Issue template for SDD spec work items with fields:
  - Spec ID (links to spec file in repo)
  - Complexity Tier
  - Current Gate
  - Assigned Gate Owner
  - Spec file path
- [FR-2]: GitHub Project board configured with Assignee visible on cards
- [FR-3]: Gate-based assignment workflow documented:
  - Draft → assigned to PM (Spec Gate owner)
  - Spec Gate approved → reassigned to Architect (Arch Gate owner)
  - Arch Gate approved → reassigned to Engineering Lead (QA Gate owner)
  - QA Gate approved → reassigned to DevOps Lead (Deploy Gate owner)
  - Deploy Gate approved → moved to Done, unassigned
  - Rejected at any gate → reassigned back to appropriate owner with
    rejection reason in comment
- [FR-4]: Role labels matching SDD gate ownership:
  - `role:pm` (for Spec Gate)
  - `role:architect` (for Arch Gate)
  - `role:engineering` (for Implementation + QA Gate)
  - `role:devops` (for Deploy Gate)
- [FR-5]: Gate transition comment template — when reassigning at a gate,
  a comment documents: gate decision (approved/rejected), evidence summary,
  and instructions for next gate owner
- [FR-6]: Sample walkthrough: create one issue and move it through all
  four gate transitions with realistic comments demonstrating the handoff
  workflow (use SPEC-002 data as the example since it has real gate evidence)

### Non-Functional Requirements

- [NFR-1]: Gate transition (reassign + comment) takes under 2 minutes
- [NFR-2]: Any team member can see at a glance: what's assigned to them,
  what gate it's at, and what's expected
- [NFR-3]: Workflow documentation readable by a new team member in under
  10 minutes

## Acceptance Criteria

- [AC-1]: Given the board, when viewing cards, then each card shows the
  current assignee (gate owner)
- [AC-2]: Given a spec at the Spec Gate, when the PM approves, then the
  issue is reassigned to the Architect with a gate transition comment
- [AC-3]: Given a gate rejection, when the issue is sent back, then the
  comment includes: which gate rejected, specific reason, and what needs
  to change
- [AC-4]: Given the board, when filtering by assignee, then a gate owner
  sees only the specs waiting for their review
- [AC-5]: Given the sample walkthrough issue, when viewing its comment
  history, then all four gate transitions are visible with realistic
  handoff comments
- [AC-6]: Given a new team member, when reading the workflow documentation,
  then they can follow the assignment process without additional explanation

## Scope

### In Scope
- Issue template for SDD work items
- Assignee display configuration on board
- Gate-based assignment workflow documentation (markdown in repo)
- Gate transition comment template
- Role labels
- Sample walkthrough demonstrating full lifecycle
- Documentation: "SDD Team Operations Guide" in governance/

### Out of Scope
- GitHub Actions automation (auto-reassign on gate approval — future spec)
- Slack or email notifications on assignment
- Workload balancing across team members
- SLA tracking for gate review times (future — ties to velocity metrics)
- Multi-team coordination (single surgical team for now)

## Dependencies

- [DEP-1]: SPEC-003 completed (GitHub Projects board exists)
- [DEP-2]: SPEC-002 completed (provides real gate data for sample walkthrough)

## Tier Justification

rationale: Trivial tier. No code changes. GitHub configuration and
  documentation only. Issue template, labels, and a workflow guide.
  No production impact, no architectural changes.
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
| Spec | Grant Howe (Claude) | 2026-02-04 | APPROVED | Requirements complete (6 FR, 3 NFR), AC testable (6), scope clear, tier appropriate. Demonstrates SDD team workflow scalability for stakeholder demos. |
| Architecture | Skip (Trivial) | | | |
| QA | Skip (Trivial) | | | |
| Deploy | Grant Howe (Claude) | 2026-02-04 | APPROVED | 4 role labels created, SDD Team Operations Guide written, sample walkthrough issue #4 created with all 4 gate transitions documented. Demo-ready for stakeholder presentations. |

## Effort Comparison

| Stage | AI Time | Human Estimate | Human Breakdown |
|-------|---------|----------------|-----------------|
| **Spec Writing** | 6 min | 40-50 min | Research GitHub assignment workflows (10m), write 6 FRs with gate flow (15m), write 6 ACs (10m), scope & dependencies (5m) |
| **Architecture Review** | Skip (Trivial) | Skip (Trivial) | — |
| **Implementation + Test** | 20 min | 2-2.5 hours | Create 4 role labels (2m), write SDD Team Operations Guide (12m), create sample walkthrough issue with 4 gate transition comments (6m) |
| **Deployment** | Skip (Trivial) | Skip (Trivial) | — |
| **Total** | 26 min | 2.5-3 hours | **AI Speedup: 6-7x** |

### Assumptions
- **Spec Writing:** PM familiar with SDD gate structure and team workflows
- **Implementation:** Automated via GitHub CLI (role labels) + manual documentation. AI time includes: label creation (2m), comprehensive operations guide with templates and examples (12m), walkthrough issue with realistic gate comments (6m). Human estimate assumes PM writing operations guide from scratch, researching GitHub assignment features, and documenting workflow patterns.
