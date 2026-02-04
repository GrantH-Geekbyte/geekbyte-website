# SDD Team Operations Guide

**Version:** 1.0
**Last Updated:** 2026-02-04
**Audience:** SDD team members (PM, Architect, Engineering Lead, DevOps Lead)

---

## Overview

This guide documents how work flows through the SDD pipeline when operating as a surgical team. **The GitHub issue is the work assignment; the spec file is the contract.**

### Core Principle

Each gate has an owner. When a gate is approved, work is **reassigned** to the next gate owner with clear handoff instructions. The issue moves through the board as ownership transfers.

---

## Team Roles & Gate Ownership

| Role | Gate Owned | Responsibilities |
|------|------------|------------------|
| **PM** | Spec Gate | Write specs, ensure requirements complete, approve for architecture review |
| **Architect** | Architecture Gate | Review design, validate tier, ensure patterns followed, approve for implementation |
| **Engineering Lead** | QA Gate | Coordinate implementation, run tests, verify quality, approve for deployment |
| **DevOps Lead** | Deploy Gate | Deploy to production, verify deployment, close issue when live |

---

## Assignment Workflow

### 1. Spec Drafted → Assigned to PM (Spec Gate)

**What Happens:**
- New issue created using "SDD Feature Spec" template
- Status: Draft
- Assigned to: PM
- Labels: tier label, type label, `role:pm`

**PM Actions:**
1. Review spec completeness (FRs, NFRs, ACs, scope, dependencies)
2. Validate business goal aligns with strategy
3. **If approved:** Add gate transition comment, reassign to Architect, move to "Spec Gate" column
4. **If rejected:** Add rejection comment with required changes, keep assigned to PM

---

### 2. Spec Gate Approved → Reassigned to Architect (Arch Gate)

**What Happens:**
- PM adds gate transition comment (see template below)
- Issue reassigned from PM to Architect
- Status moved to: "Arch Gate"
- Label updated: `role:pm` → `role:architect`

**Architect Actions:**
1. Read spec + review technical approach
2. Validate complexity tier (check escalation triggers)
3. Create Architecture Checklist (if Standard+ tier)
4. **If approved:** Add gate transition comment, reassign to Engineering Lead, move to "Implementation"
5. **If rejected:** Add rejection comment, reassign back to PM with required changes

**Skipped for Trivial tier:** Issue goes directly from PM to Engineering Lead

---

### 3. Arch Gate Approved → Reassigned to Engineering Lead (QA Gate)

**What Happens:**
- Architect adds gate transition comment
- Issue reassigned from Architect to Engineering Lead
- Status moved to: "QA Gate"
- Label updated: `role:architect` → `role:engineering`

**Engineering Lead Actions:**
1. Coordinate implementation (delegate to frontend-developer, test-automator, etc.)
2. Run tests, verify ACs met
3. Create QA Checklist with test results + effort comparison
4. **If approved:** Add gate transition comment, reassign to DevOps Lead, move to "Deploy Gate"
5. **If rejected:** Add rejection comment, fix issues, re-test, or reassign back to Architect if design flaw found

**Skipped for Trivial tier:** Issue goes directly from PM to Engineering Lead (no Arch Gate)

---

### 4. QA Gate Approved → Reassigned to DevOps Lead (Deploy Gate)

**What Happens:**
- Engineering Lead adds gate transition comment
- Issue reassigned from Engineering Lead to DevOps Lead
- Status moved to: "Deploy Gate"
- Label updated: `role:engineering` → `role:devops`

**DevOps Lead Actions:**
1. Review deployment checklist
2. Deploy to production
3. Verify deployment successful
4. Update spec file status to `deployed`
5. **If approved:** Add gate transition comment, move to "Done", unassign issue
6. **If rejected:** Add rejection comment, reassign back to Engineering Lead with deployment issue details

**Skipped for Trivial tier:** Engineering Lead deploys directly, moves to Done

---

### 5. Deploy Gate Approved → Done (Unassigned)

**What Happens:**
- DevOps Lead adds final gate transition comment
- Issue moved to: "Done"
- Issue unassigned (work complete)
- Spec file status: `deployed`

---

## Gate Transition Comment Template

When reassigning at a gate, use this template:

```markdown
## [Gate Name] - [APPROVED / REJECTED]

**Decision:** APPROVED
**Reviewer:** [Your Name / Role]
**Date:** YYYY-MM-DD

**Evidence:**
- [Key point 1 that supports approval]
- [Key point 2 that supports approval]
- [Link to checklist if applicable]

**Handoff to Next Gate:**
@[next-gate-owner-username]: This spec is approved and ready for [Next Gate Name].

**What you need:**
- [Instruction 1 for next gate owner]
- [Instruction 2 for next gate owner]
- [Any concerns or notes to be aware of]

**Files:**
- Spec: `specs/SPEC-XXX-title.md`
- [Checklist if applicable]: `checklists/[TYPE]-SPEC-XXX.md`

---

Moving to: [Next Status Column]
Reassigning to: @[next-gate-owner-username]
Updating labels: `role:[current]` → `role:[next]`
```

### Example (Arch Gate Approval):

```markdown
## Architecture Gate - APPROVED

**Decision:** APPROVED
**Reviewer:** Claude (Architect Agent)
**Date:** 2026-02-04

**Evidence:**
- Standard tier validated (no escalation triggers)
- No new external dependencies
- Follows established patterns (gh CLI + GraphQL API)
- Zero production impact (GitHub config only)

**Handoff to Implementation:**
@engineering-lead: This spec is approved and ready for implementation.

**What you need:**
- Implement via GitHub CLI (role labels + workflow doc)
- Follow pattern from SPEC-003 (automated via gh + GraphQL)
- Create sample walkthrough issue demonstrating gate transitions
- Target: under 30 min total implementation time

**Files:**
- Spec: `specs/SPEC-006-work-assignment-workflow.md`
- Architecture Checklist: Skipped (Trivial tier)

---

Moving to: QA Gate
Reassigning to: @engineering-lead
Updating labels: `role:architect` → `role:engineering`
```

---

## Rejection Workflow

If a gate rejects a spec:

1. **Add rejection comment** using template:
   ```markdown
   ## [Gate Name] - REJECTED

   **Decision:** REJECTED
   **Reviewer:** [Your Name / Role]
   **Date:** YYYY-MM-DD

   **Reason:**
   [Specific, actionable reason for rejection]

   **Required Changes:**
   - [ ] [Change 1]
   - [ ] [Change 2]
   - [ ] [Change 3]

   **Reassigning to:** @[appropriate-owner] to address the above issues.

   **Next Steps:**
   Once changes are made, ping me for re-review.
   ```

2. **Reassign to appropriate owner:**
   - Design flaw → reassign to PM
   - Implementation issue → keep with Engineering Lead
   - Deployment blocker → keep with DevOps Lead

3. **Move to "Rejected" column** (temporarily)

4. **When fixed:** Owner pings reviewer, issue moves back to appropriate gate column for re-review

---

## Board Views & Filters

### View My Assignments
Filter by: `assignee:@me`
Shows: All specs currently assigned to you

### View Specs at My Gate
Filter by: `label:role:[your-role]`
Shows: All specs waiting at your gate

### View Rejected Specs
Filter by: `status:Rejected`
Shows: All specs that failed a gate and need rework

---

## Quick Reference: Issue Lifecycle

```
1. PM creates issue → assigns to self
2. PM approves Spec Gate → reassigns to Architect (Standard+ only)
3. Architect approves Arch Gate → reassigns to Engineering Lead
4. Engineering Lead approves QA Gate → reassigns to DevOps Lead
5. DevOps Lead approves Deploy Gate → moves to Done, unassigns
```

**Trivial Tier Shortcut:**
```
1. PM creates issue → assigns to self
2. PM approves Spec Gate → reassigns to Engineering Lead (skip Architect)
3. Engineering Lead implements + deploys → moves to Done, unassigns
```

---

## Metrics Tracking

Each issue should have custom fields populated (configured in GitHub Projects):

- **Spec ID:** Links to spec file
- **AI Time:** Total AI pipeline time
- **Human Estimate:** Estimated human effort
- **Speedup Factor:** AI vs human comparison
- **First Pass:** Yes/No (did it pass all gates on first attempt?)

These metrics demonstrate SDD ROI to stakeholders.

---

## New Team Member Onboarding

**Read these in order:**
1. This guide (SDD Team Operations)
2. `governance/solo-operator-model.md` (understand gate structure)
3. `governance/tier-selection-guidelines.md` (understand complexity tiers)
4. `CLAUDE.md` (project context)
5. Shadow an existing issue through 2-3 gate transitions

**Time to competency:** ~2-3 hours reading + 1 week shadowing

---

## Troubleshooting

**Q: Issue assigned to me but I'm not the right gate owner**
A: Reassign to correct gate owner with comment explaining why

**Q: Spec approved at my gate but next gate owner unavailable**
A: Add comment noting approval, assign to yourself temporarily, ping next owner when available

**Q: Multiple specs assigned to me at once**
A: Prioritize by: P0 > P1 > P2 > P3, or escalate to PM if overloaded

**Q: Gate review taking longer than expected**
A: Add comment with status update + ETA, assign back to yourself to signal still in progress

---

## Demo Script (for Stakeholders)

**"How does SDD scale to a team?"**

1. Show GitHub Projects board with multiple specs in different columns
2. Filter by `role:architect` to show what's waiting for architecture review
3. Click into a spec, show gate transition comments documenting handoffs
4. Show custom fields with effort metrics (AI speedup visible at a glance)
5. Explain: "The issue is the work assignment. The spec file is the contract. Clear ownership, clear handoffs, measurable ROI."

**Key Talking Points:**
- "Each gate has an owner. No ambiguity about who's responsible."
- "Gate transition comments create an audit trail of decisions."
- "Effort metrics show 5-15x speedup per spec. That compounds."
- "Surgical team model scales: 4 roles, clear handoffs, minimal coordination overhead."

---

## Related Documentation

- [Solo Operator Model](./solo-operator-model.md) - Gate structure and approval process
- [Tier Selection Guidelines](./tier-selection-guidelines.md) - How to classify spec complexity
- [Escalation Protocols](./escalation-protocols.md) - When to escalate beyond team
- [Pipeline Monitoring](./pipeline-monitoring.md) - Velocity tracking and metrics

---

**Questions?** Contact Grant Howe (grant@geekbyte.biz)
