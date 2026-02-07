# Support Ticket Triage Workflow

**Version:** 1.0
**Last Updated:** 2026-02-05
**Owner:** Grant Howe, Managing Partner

## Overview

This document defines how customer support tickets flow into the SDD development pipeline, from initial report through triage, spec creation, implementation, and deployment verification.

## Workflow Steps

### 1. Ticket Creation

**When:** Customer reports an issue via GitHub (future: email, portal)

**Actions:**
- Customer creates issue using "Support Ticket" template
- Template auto-applies `type:support` label
- Issue appears on [GitHub Projects board](https://github.com/users/GrantH-Geekbyte/projects/1)
- Ticket enters "Todo" status

**Responsible:** Customer (or internal team member on behalf of customer)

---

### 2. Initial Triage

**When:** Within 24 hours of ticket creation (Critical: within 1 hour)

**Actions:**
1. **Review severity** — Validate customer-provided severity matches impact:
   - **Critical:** Site down, major functionality broken → Apply `severity:critical`
   - **High:** Significant feature not working → Apply `severity:high`
   - **Medium:** Feature partially working or workaround available → Apply `severity:medium`
   - **Low:** Minor issue or enhancement request → Apply `severity:low`

2. **Assess escape status** — Ask: "Did this issue pass through our pipeline?"
   - If **YES** → This is an **escape**. Proceed to Escape Tracking (Section 3)
   - If **NO** → This is new external input (not an escape). Proceed to Resolution Path (Section 4)

3. **Set Source field** on Projects board:
   - Set `Source = "Support Ticket"`

**Responsible:** PM (Grant Howe in solo operator model)

**Time Budget:** Under 5 minutes

---

### 3. Escape Tracking

**When:** Ticket represents a production defect that passed through pipeline gates

**Actions:**
1. **Apply escape label:**
   ```bash
   gh issue edit <issue-number> --add-label "escape"
   ```

2. **Create escape event:** Use template in `learning/escapes/escape_event_template.md`
   - **File name:** `learning/escapes/YYYY-MM-DD-escape-<issue-number>.md`
   - **Link back to:**
     - Originating spec (which spec introduced this defect?)
     - Gate that should have caught it (Spec? Architecture? QA? Deploy?)
     - Root cause category (requirements gap, test gap, review gap, deployment gap)
   - **Document remediation:**
     - What pattern update prevents this in the future?
     - What checklist item was missing?
     - What test should have caught this?

3. **Update Projects board:**
   - Escape events are tracked separately from tickets
   - Escape rate = (escapes / total deployments) × 100

**Responsible:** PM with Learning Engine analysis

**Time Budget:** 15-20 minutes

**Example:**
```markdown
# Escape Event

escape_id: ESC-001
date: 2026-02-05
originating_spec: SPEC-002
gate_missed: QA Gate
root_cause: Test coverage gap (mobile nav not tested on small screens)

## What Escaped
Navigation menu does not collapse properly on screens < 480px width.

## Why It Escaped
- QA Gate checklist did not include mobile breakpoint testing below 768px
- Playwright tests included mobile nav, but only tested at 768px viewport
- Architecture review did not flag mobile responsiveness as critical path

## Remediation
- Added 480px viewport test to navigation.spec.js (SPEC-004)
- Updated QA Gate checklist to include "Test all documented breakpoints"
- Updated Architecture review to flag "mobile-first" patterns

## Prevention
- Pattern: Always test min, mid, and max breakpoints
- Checklist: QA Gate now includes "Viewport testing at 480px, 768px, 1024px"
```

---

### 4. Resolution Path Decision

**When:** After triage, PM decides how to resolve the ticket

**Decision Matrix:**

| Complexity | Resolution Path | Example |
|-----------|----------------|---------|
| **Trivial** | Fix inline, no spec | Typo, broken link, CSS tweak |
| **Standard** | Create spec, link to ticket | New form validation, page restructure |
| **Complex** | Create spec, architecture review | Multi-page feature, API integration |
| **Critical** | Create spec, external review | Payment flow, auth system, PII handling |

**Actions:**
1. **If Trivial:** Fix directly, reference ticket in commit message
   ```bash
   git commit -m "[SUPPORT-<issue-number>] Fix typo on About page

   Fixes typo reported in customer support ticket #12.

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   ```

2. **If Standard+:** Create spec, link back to ticket
   - Create `specs/SPEC-XXX-<description>.md`
   - In spec Business Context, reference: `originating_ticket: #<issue-number>`
   - In ticket, add comment: "Spec created: SPEC-XXX"
   - Spec flows through normal SDD pipeline

**Responsible:** PM

**Time Budget:** Immediate (Trivial) or 5-10 minutes (spec creation)

---

### 5. Implementation Tracking

**When:** Throughout spec lifecycle (if Standard+ tier)

**Actions:**
- Ticket remains OPEN until fix is deployed
- Ticket status mirrors linked spec status:
  - Spec in "Spec Gate" → Ticket in "Todo"
  - Spec in "Arch Gate" → Ticket in "In Progress"
  - Spec in "QA Gate" → Ticket in "In Progress"
  - Spec in "Deploy Gate" → Ticket in "In Progress"
  - Spec in "Done" → Ticket ready to close

**Responsible:** Automated (future) or manual status sync

---

### 6. Deployment Verification

**When:** Fix deployed to production

**Actions:**
1. **Verify fix:** Test the exact reproduction steps from the ticket
2. **Update ticket:** Add comment with deployment reference
   ```markdown
   ✅ **Deployed to production**

   - **Spec:** SPEC-XXX
   - **Deployment:** Commit abc1234 deployed on 2026-02-05
   - **Verification:** Tested reproduction steps, issue resolved

   Thank you for reporting this issue!
   ```

3. **Close ticket:** Set status to "Done"
4. **Notify customer:** (Future: automated email notification)

**Responsible:** PM or DevOps

**Time Budget:** 5 minutes

---

## Escape Rate Tracking

**Purpose:** Measure pipeline quality by tracking how many production defects escaped through gates

**Calculation:**
```
Escape Rate = (Number of Escapes / Total Deployments) × 100
```

**Target:** < 5% escape rate (industry standard for mature pipelines)

**Review Cadence:** Monthly

**View Escapes:**
- GitHub Projects board filter: `label:escape`
- Escape events directory: `learning/escapes/`

**Learning Loop:**
1. Each escape triggers an escape event
2. Escape event identifies gate failure and remediation
3. Remediation updates gate checklist or test coverage
4. Same defect cannot escape twice (pattern updated)

---

## Severity Response Times

| Severity | Initial Response | Resolution Target |
|----------|-----------------|-------------------|
| Critical | 1 hour | 4 hours |
| High | 4 hours | 24 hours |
| Medium | 24 hours | 1 week |
| Low | 1 week | Best effort |

**Note:** These are targets for solo operator model. Adjust based on team capacity.

---

## Support Ticket Lifecycle

```
Customer Report
     ↓
[Ticket Created] ← Template applied, type:support label
     ↓
[PM Triage] ← Severity validated, escape assessed, source set
     ↓
     ├→ [Escape?] → Create escape event, apply escape label
     │
     └→ [Resolution Path]
          ├→ Trivial: Fix inline, reference ticket
          └→ Standard+: Create spec, link to ticket
               ↓
          [Spec Pipeline] ← Spec → Arch → Impl → QA → Deploy
               ↓
     [Deployment Verification] ← Test reproduction steps
               ↓
     [Ticket Closed] ← Customer notified, metrics updated
```

---

## Non-Technical Stakeholder View

**Simple Explanation:**

1. **Customer reports issue** → We track it in our system
2. **We triage within 24 hours** → Assign severity, check if it escaped our process
3. **We decide how to fix it:**
   - Small fix? We fix it right away
   - Bigger fix? We write a plan (spec) and it goes through our quality process
4. **We deploy the fix** → Test it works, close the ticket, notify customer
5. **We learn from it** → If it was a defect that escaped, we update our process so it can't happen again

---

## Related Documentation

- [SDD Pipeline Overview](../governance/solo-operator-model.md)
- [Escape Event Template](../learning/escapes/escape_event_template.md)
- [GitHub Projects Board](https://github.com/users/GrantH-Geekbyte/projects/1)
- [CI/CD Integration](../governance/cicd-integration.md)

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-05 | Initial workflow documented (SPEC-005) |
