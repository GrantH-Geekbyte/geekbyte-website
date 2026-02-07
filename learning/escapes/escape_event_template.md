# Escape Event Template

**Instructions:** Copy this template to create a new escape event file named:
`YYYY-MM-DD-escape-<issue-number>.md`

---

# Escape Event

**escape_id:** ESC-XXX
**date:** YYYY-MM-DD
**support_ticket:** #<issue-number>
**originating_spec:** SPEC-XXX (which spec introduced this defect?)
**gate_missed:** Spec Gate / Architecture Gate / QA Gate / Deploy Gate
**root_cause_category:** Requirements Gap / Test Coverage Gap / Review Gap / Deployment Verification Gap
**severity:** Critical / High / Medium / Low

## What Escaped

**Description:**
Describe the production defect that was discovered. Be specific about:
- What functionality is broken?
- What is the user impact?
- How was it discovered? (customer report, internal monitoring, etc.)

**Reproduction Steps:**
1. Step one
2. Step two
3. Observe defect

**Expected Behavior:**
What should happen?

**Actual Behavior:**
What actually happens?

---

## Why It Escaped

**Gate Analysis:**
Which gate should have caught this defect?

**Checklist Gap:**
Was there a missing item in the gate checklist?

**Test Coverage Gap:**
Was there a missing test case?

**Review Gap:**
Was the code/architecture/spec reviewed properly?

**Process Gap:**
Was a process step skipped or executed incorrectly?

---

## Root Cause (5 Whys)

1. **Why did the defect occur?**
   - Answer

2. **Why wasn't it caught during implementation?**
   - Answer

3. **Why wasn't it caught during the [Gate Name] Gate?**
   - Answer

4. **Why does our process allow this gap?**
   - Answer

5. **What systemic issue enables this?**
   - Answer

**Root Cause:**
The fundamental reason this defect escaped (e.g., "No checklist item for testing edge case X")

---

## Remediation Actions

### Immediate Fix
- [ ] Fix deployed to production
- [ ] Spec: SPEC-XXX (if created)
- [ ] Commit: abc1234
- [ ] Deployed: YYYY-MM-DD
- [ ] Verified: Yes / No

### Pattern Updates
- [ ] Gate checklist updated (specify which gate, which item added)
- [ ] Test coverage added (specify which test file, which scenarios)
- [ ] Documentation updated (specify which doc, what change)
- [ ] Architecture pattern documented (if applicable)

### Prevention Measures
List specific actions to prevent this same defect class from escaping again:

1. **Checklist Update:**
   - Gate: [Which gate]
   - New item: "[Exact checklist item text]"

2. **Test Coverage:**
   - Test file: [Which spec file]
   - New test: "[Test description]"

3. **Documentation:**
   - Doc file: [Which file]
   - Update: "[What was added/changed]"

4. **Process Change:**
   - Process: [Which process]
   - Change: "[What changed]"

---

## Impact Assessment

**Customer Impact:**
- How many customers affected?
- What was the severity of the impact?
- How long was the defect in production?

**Business Impact:**
- Revenue impact (if any)
- Reputation impact
- Support burden (how many tickets generated?)

**Escape Cost:**
Estimate of time/resources spent:
- Time to discover: X hours
- Time to triage: X hours
- Time to fix: X hours
- Time to deploy: X hours
- **Total:** X hours (vs. Y hours if caught at [Gate])

**Cost Multiplier:**
Escaping [Gate Name] multiplied remediation cost by Nx

---

## Verification

**Prevention Verified:**
- [ ] Checklist items tested (create similar defect, verify new checklist catches it)
- [ ] Test coverage verified (break similar functionality, verify test fails)
- [ ] Pattern documented (team can reference this for similar scenarios)

**Learning Captured:**
- [ ] Escape event documented (this file)
- [ ] Team notified (if team model)
- [ ] Pattern added to gate documentation
- [ ] Escape rate metric updated

---

## Related Documentation

- Support Ticket: #<issue-number>
- Originating Spec: SPEC-XXX
- Fix Spec (if different): SPEC-YYY
- Gate Checklist Updated: [Link to checklist file]
- Test File Updated: [Link to test file]

---

## Escape Event Owner

**Name:** [PM or team lead who owns the escape analysis]
**Date Analyzed:** YYYY-MM-DD
**Reviewed By:** [Architect/QA lead if team model]

---

## Template Version

Version: 1.0
Last Updated: 2026-02-05
Defined in: SPEC-005
