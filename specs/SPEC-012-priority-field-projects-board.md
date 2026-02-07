# Feature Specification

spec_id: SPEC-012
title: Add Priority Field to GitHub Projects Board
version: 1.0
status: pending
complexity_tier: trivial
last_updated: 2026-02-05

## Business Context

requester: Grant Howe, Managing Partner
business_goal: Add a Priority field to the GitHub Projects board to enable better queue
  management and execution order visibility. The pipeline board currently has custom
  fields for tracking effort metrics (AI Time, Human Estimate, Speedup Factor) and
  operational fields (Spec ID, First Pass, Source), but lacks a way to filter and sort
  by priority. With 5 new specs (#13-#17) now in Draft and more coming, a priority
  system becomes essential for demonstrating to stakeholders (PSTrax, Level Equity)
  which features ship first and why. Priority also enables the PM to quickly identify
  P1/P2 specs that should be pulled into the current sprint versus P3/P4 specs that
  remain in the backlog. This is infrastructure work similar to SPEC-005 (adding the
  Source field) — pure configuration with zero production impact.
success_metrics:
  - Priority field visible in board table view alongside existing custom fields
  - Can filter specs by priority (e.g., show only P1 and P2 specs)
  - Can sort specs by priority in descending order (P1 → P2 → P3 → P4)
  - Execution order clear from priority values on board
  - Demo-ready for stakeholder presentations showing prioritized backlog
  - All 5 Draft specs (#13-#17) have Priority values set based on their descriptions
priority: P3 (infrastructure improvement — enables better planning but not blocking)

## Requirements

### Functional Requirements

- [FR-1]: Custom field "Priority" created in GitHub Projects board
  - Field type: Single-select
  - Options (4 priority levels):
    - P1 (Critical)
    - P2 (High)
    - P3 (Medium)
    - P4 (Low)
  - Default value: P3 (Medium) — conservative default ensures specs don't skip triage

- [FR-2]: Priority definitions documented in governance/sdd-team-operations.md
  - P1 (Critical): Production incident, user-blocking bug, security vulnerability,
    or foundational dependency for multiple specs. Ship ASAP (same day if possible).
  - P2 (High): High-value feature, significant improvement to pipeline efficiency,
    or spec with external stakeholder deadline. Ship within current sprint (1-2 weeks).
  - P3 (Medium): Standard feature, enhancement, or infrastructure improvement. Ship
    when capacity allows (backlog, pulled into sprint as needed).
  - P4 (Low): Nice-to-have, speculative feature, or deferred exploration. Ship
    when all P1/P2/P3 specs complete or when strategic value increases.

- [FR-3]: Priority values set for existing 5 Draft specs (#13-#17)
  - SPEC-008: Automated Issue Creation on Smoke Test Failure → P2 (High)
    Rationale: Improves observability and reduces manual issue creation. High value
    for demo and pipeline efficiency.
  - SPEC-009: Slack Notifications for Workflow Failures → P2 (High)
    Rationale: Reduces mean time to detect (MTTD) for failures. High value for
    solo operator model.
  - SPEC-010: Multi-Environment Deployments (Staging + Production) → P3 (Medium)
    Rationale: Infrastructure improvement. Nice-to-have but not blocking current work.
  - SPEC-011: Visual Regression Testing in CI → P3 (Medium)
    Rationale: Quality improvement. Adds value but not critical for current static site.
  - SPEC-013: Automated Rollback on Smoke Test Failure → P2 (High)
    Rationale: Production safety. Complex tier, high implementation effort, but high
    ROI for reducing downtime. (Note: SPEC-013 description shows P1 for SaaS context,
    but P2 for current static site — we set P2 until product launches, then escalate to P1.)

- [FR-4]: Priority field visible in board table view
  - Added as a column in the table view (alongside Spec ID, AI Time, Human Estimate, etc.)
  - Column positioned between "Status" and "Spec ID" for visibility
  - Sortable by priority (descending: P1 first, P4 last)
  - Filterable by priority (e.g., filter to show only P1 + P2 specs)

- [FR-5]: Priority included in issue template for SDD Feature Spec
  - Template updated to include Priority dropdown field
  - When creating new spec issue, PM selects priority before submission
  - Default priority: P3 (Medium) — ensures PM makes explicit triage decision if changing

### Non-Functional Requirements

- [NFR-1]: Field creation takes under 5 minutes (automated via GitHub CLI + GraphQL API)
- [NFR-2]: Priority values set for 5 Draft specs in under 10 minutes total
  (automated via gh CLI bulk update or manual via UI)
- [NFR-3]: Priority definitions clear and actionable — team members can triage new
  specs without PM guidance by referencing governance doc

## Acceptance Criteria

- [AC-1]: Given the GitHub Projects board, when viewing the table view, then the
  Priority field is visible as a column between "Status" and "Spec ID"
- [AC-2]: Given the Priority field, when creating a new spec issue using the SDD
  template, then a Priority dropdown is available with options P1, P2, P3, P4
- [AC-3]: Given the Priority field created, when viewing any spec on the board, then
  its priority is set to P3 (Medium) by default if not explicitly changed
- [AC-4]: Given the 5 Draft specs (#13-#17), when viewing the board, then each spec
  has a Priority value set:
  - #13 (SPEC-008): P2 (High)
  - #14 (SPEC-009): P2 (High)
  - #15 (SPEC-010): P3 (Medium)
  - #16 (SPEC-011): P3 (Medium)
  - #17 (SPEC-013): P2 (High)
- [AC-5]: Given the board table view, when sorting by Priority descending, then
  specs are ordered P1 → P2 → P3 → P4
- [AC-6]: Given the board table view, when filtering by "Priority = P2", then only
  P2 specs are shown (#13, #14, #17)
- [AC-7]: Given governance/sdd-team-operations.md, when reading the Priority section,
  then all 4 priority levels (P1, P2, P3, P4) are defined with clear criteria and examples

## Scope

### In Scope
- GitHub Projects custom field creation (Priority single-select with 4 options)
- Priority definitions documented in governance/sdd-team-operations.md
- Priority values set for existing 5 Draft specs (#13-#17)
- Priority field added to board table view as a visible, sortable, filterable column
- Issue template updated to include Priority dropdown

### Out of Scope
- Automated priority assignment based on spec content (future enhancement with AI analysis)
- Priority escalation rules (e.g., P3 → P2 after 30 days in backlog — future governance spec)
- Integration with external project management tools (Jira, Linear, etc.)
- Priority-based workflow automation (e.g., auto-assign P1 specs to PM — future spec)
- Priority analytics dashboard (e.g., "% of P1 specs completed this month" — future)
- SLA targets per priority level (e.g., P1 = 24h SLA — future governance spec)

## Dependencies

- [DEP-1]: SPEC-003 deployed — GitHub Projects board exists with custom fields infrastructure
- [DEP-2]: GitHub CLI (gh) installed and authenticated with permissions to modify project fields
- [DEP-3]: Grant has admin access to GitHub Projects board to create custom fields

## Technical Notes

### GraphQL API Approach (Automated)

**Create Priority field:**
```bash
gh api graphql -f query='
  mutation {
    addProjectV2SingleSelectField(input: {
      projectId: "PVT_kwHODgy_rs4BOVUX"
      name: "Priority"
      options: [
        {name: "P1 (Critical)", color: RED}
        {name: "P2 (High)", color: ORANGE}
        {name: "P3 (Medium)", color: YELLOW}
        {name: "P4 (Low)", color: GRAY}
      ]
    }) {
      projectV2Field {
        id
        name
      }
    }
  }
'
```

**Set Priority for Draft specs:**
```bash
# Get field ID for Priority (from creation response)
PRIORITY_FIELD_ID="PVTSSF_xxxx"

# Get item IDs for issues #13-#17
gh project item-list 1 --owner GrantH-Geekbyte --format json | jq '.items[] | select(.content.number >= 13 and .content.number <= 17)'

# Set Priority for each spec
gh project item-edit --project-id PVT_kwHODgy_rs4BOVUX --id <item-id-13> --field-id $PRIORITY_FIELD_ID --single-select-option-id <P2-option-id>
gh project item-edit --project-id PVT_kwHODgy_rs4BOVUX --id <item-id-14> --field-id $PRIORITY_FIELD_ID --single-select-option-id <P2-option-id>
gh project item-edit --project-id PVT_kwHODgy_rs4BOVUX --id <item-id-15> --field-id $PRIORITY_FIELD_ID --single-select-option-id <P3-option-id>
gh project item-edit --project-id PVT_kwHODgy_rs4BOVUX --id <item-id-16> --field-id $PRIORITY_FIELD_ID --single-select-option-id <P3-option-id>
gh project item-edit --project-id PVT_kwHODgy_rs4BOVUX --id <item-id-17> --field-id $PRIORITY_FIELD_ID --single-select-option-id <P2-option-id>
```

### Priority Definitions for Governance Documentation

Add this section to `governance/sdd-team-operations.md`:

```markdown
## Priority Levels

Specs are triaged using a 4-level priority system. Priority determines execution order
and sprint planning. When in doubt, default to P3 (Medium) and escalate to PM for triage.

### P1 (Critical)
**Ship ASAP (same day if possible)**
- Production incident (site down, major functionality broken)
- User-blocking bug (feature advertised but non-functional)
- Security vulnerability (discovered exploit, dependency CVE)
- Foundational dependency (multiple specs blocked until this completes)
- External deadline (stakeholder presentation, investor demo, contract obligation)

**Examples:**
- SPEC-001: Fix About Page (404 on advertised page — user-blocking)
- Post-launch incident: payment gateway broken (SaaS product)
- Security: XSS vulnerability reported by penetration tester

### P2 (High)
**Ship within current sprint (1-2 weeks)**
- High-value feature (significant ROI or stakeholder request)
- Pipeline efficiency improvement (saves 30+ min per spec)
- Infrastructure foundational to roadmap (enables future P1 features)
- Observability/monitoring improvement (reduces MTTD/MTTR by 50%+)
- Quality gate improvement (prevents escapes or defects)

**Examples:**
- SPEC-008: Automated Issue Creation on Smoke Test Failure (observability + efficiency)
- SPEC-009: Slack Notifications for Workflow Failures (reduces MTTD)
- SPEC-013: Automated Rollback on Smoke Test Failure (production safety, reduces MTTR)
- New service page with stakeholder deadline (e.g., board meeting presentation)

### P3 (Medium)
**Ship when capacity allows (backlog, pulled into sprint as needed)**
- Standard feature (adds value but not urgent)
- Enhancement to existing feature (improves UX or performance)
- Infrastructure improvement (nice-to-have, not blocking)
- Refactoring (code quality improvement without user-facing change)
- Documentation update (governance, runbooks, onboarding guides)

**Examples:**
- SPEC-010: Multi-Environment Deployments (infrastructure improvement)
- SPEC-011: Visual Regression Testing in CI (quality improvement)
- SPEC-012: Add Priority Field to Projects Board (planning improvement)
- Blog post feature (content-driven, no external deadline)

### P4 (Low)
**Ship when all P1/P2/P3 specs complete or when strategic value increases**
- Nice-to-have (low ROI, speculative)
- Deferred exploration (research spike, proof-of-concept)
- Future product feature (not relevant until product launches)
- Cosmetic change (visual polish with no functional impact)
- Optimization (performance improvement with < 10% gain)

**Examples:**
- Dark mode toggle (cosmetic, no user requests)
- Newsletter archive page (content feature, low traffic)
- Speculative AI agent conversational UI (future product, deferred)

### Triage Guidelines

**When creating a new spec:**
1. Read the spec business goal and success metrics
2. Ask: "Is this blocking production, users, or stakeholders?" → P1
3. Ask: "Does this deliver high value within 1-2 weeks?" → P2
4. Ask: "Is this standard feature/enhancement work?" → P3
5. Ask: "Is this nice-to-have or future exploration?" → P4
6. If uncertain, default to P3 and tag PM for triage

**Priority escalation triggers:**
- P3 → P2: External stakeholder requests feature for upcoming demo
- P3 → P1: Bug discovered in production (was enhancement, now incident)
- P4 → P2: Strategic shift (future product feature becomes current priority)

**Priority de-escalation triggers:**
- P2 → P3: Stakeholder deadline postponed
- P1 → P2: Workaround discovered (incident mitigated, fix can wait)
```

### Issue Template Update

Update `.github/ISSUE_TEMPLATE/sdd-feature-spec.md` to include Priority dropdown:

```yaml
name: SDD Feature Spec
description: Create a new SDD feature specification
title: "SPEC-XXX: [Feature Title]"
labels: ["type:feature", "tier:standard"]
body:
  - type: input
    id: spec-id
    attributes:
      label: Spec ID
      description: Sequential spec ID (e.g., SPEC-012)
      placeholder: SPEC-XXX
    validations:
      required: true

  - type: dropdown
    id: priority
    attributes:
      label: Priority
      description: Select priority level (see governance/sdd-team-operations.md for definitions)
      options:
        - P1 (Critical)
        - P2 (High)
        - P3 (Medium)
        - P4 (Low)
      default: 2  # P3 (Medium) — index 2 in zero-indexed array
    validations:
      required: true

  - type: dropdown
    id: tier
    attributes:
      label: Complexity Tier
      description: Select complexity tier
      options:
        - Trivial
        - Standard
        - Complex
        - Critical
      default: 1  # Standard
    validations:
      required: true

  # ... rest of template
```

## Tier Justification

rationale: Trivial tier. Configuration-only change in GitHub Projects board. No code
  changes, no production impact, no new architectural patterns. Follows the exact
  same pattern as SPEC-005 (adding Source field) which was also Trivial tier. Field
  creation via GraphQL API is well-established and tested. Priority values for 5 Draft
  specs can be set manually via UI in under 10 minutes or automated via gh CLI. Total
  implementation time under 15 minutes. Documentation update to governance file is
  straightforward (priority definitions are clear and unambiguous).
escalation_triggers_checked:
  - Authentication/authorization: No
  - Payment/financial data: No
  - PII/PHI handling: No
  - New external integration: No
  - Database schema change: No
  - Core domain model: No
  - Production code changes: No

---

## Gate Log

| Gate | Reviewer | Date | Decision | Evidence |
|------|----------|------|----------|----------|
| Spec | | | PENDING | Awaiting approval |
| Architecture | Skip (Trivial) | | | |
| QA | Skip (Trivial) | | | |
| Deploy | | | PENDING | Awaiting deployment |

## Effort Comparison

| Stage | AI Time | Human Estimate | Human Breakdown |
|-------|---------|----------------|-----------------|
| **Spec Writing** | 8 min | 45-60 min | Research GitHub Projects single-select field API (10m), understand priority definitions and triage criteria (15m), write 5 FRs with priority definitions (15m), write 7 ACs covering field creation + priority values (10m), scope & dependencies (5m), format & governance documentation outline (5m) |
| **Architecture Review** | Skip (Trivial) | Skip (Trivial) | — |
| **Implementation + Test** | 7 min | 1.5-2 hours | Automated via gh CLI + GraphQL API: create Priority single-select field with 4 options (2m), retrieve item IDs for issues #13-#17 (1m), set priority values for 5 Draft specs (2m), update governance/sdd-team-operations.md with priority definitions (1.5-2h human — writing clear definitions, examples, triage guidelines). AI time assumes governance doc generation; human estimate assumes PM writing definitions from scratch. |
| **Deployment** | Skip (Trivial) | Skip (Trivial) | — |
| **Total** | 15 min | 2.25-3 hours | **AI Speedup: 9-12x** |

### Assumptions
- **Spec Writing:** PM familiar with GitHub Projects custom fields (SPEC-003 and SPEC-005 completed), understands SDD pipeline and priority concepts
- **Implementation:** Fully automated via GitHub CLI (gh) and GraphQL API. AI time includes: field creation via GraphQL mutation (2m), item ID retrieval for Draft specs (1m), priority value setting via gh project item-edit (2m), governance documentation generation with priority definitions + triage guidelines (10m). Human estimate assumes PM manually creating field via GitHub UI (5m), manually setting priority for 5 specs via UI (5m), manually writing priority definitions and triage guidelines in governance doc (1.5-2h — significant writing, editing, examples, review).
- **Trivial Tier:** No architecture review, no QA checklist, no deployment checklist. PM approves spec gate and deploys directly (git commit + push governance doc update).

### Notes
- **GraphQL API:** Field creation follows SPEC-003 pattern (well-tested). If GraphQL mutation fails, fallback to manual UI creation (adds 5 min).
- **Priority Values:** Can be set via gh CLI (automated) or manually via GitHub Projects UI (5-10 min). Recommend CLI for consistency and auditability.
- **Governance Documentation:** Priority definitions are critical for team triage consistency. AI time assumes Claude generates clear definitions based on examples from SPEC-008/009/010/011/013 priorities. Human estimate reflects PM writing from scratch with examples, triage logic, escalation scenarios.
- **Issue Template Update:** Optional enhancement. If skipped, Priority can be set manually after issue creation. Template update adds ~5 min (human time).
