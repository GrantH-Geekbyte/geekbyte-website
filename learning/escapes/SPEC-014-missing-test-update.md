# Escape Event: SPEC-014 - Missing Test File Update

**Date:** 2026-02-07
**Spec:** SPEC-014 (Remove Email Gate from CEO Brief Campaign)
**Tier:** Standard
**Escape Stage:** Implementer-Tester → PR Tests (GitHub Actions)

---

## What Happened

When implementing SPEC-014 (removing email capture form from campaign page), we:
- ✅ Removed form HTML from `campaigns/ai-ceo-brief.html`
- ✅ Removed form JavaScript (validation, Formspree integration)
- ✅ Added direct download button for PDF
- ❌ **Failed to identify and update dependent test file** `tests/e2e/campaign-form.spec.js`

**Result:** PR #27 tests timed out (10+ minute limit exceeded). The test file contained 279 lines with 20+ tests checking for form elements that no longer existed.

---

## Root Cause Analysis

### Why It Escaped

1. **Missing Checklist Item:** QA checklist had no explicit step to "identify and update affected test files when removing/modifying features"

2. **Implementation Focus:** Developer focused on:
   - Removing feature code
   - Adding replacement code
   - Visual/functional correctness

   But did NOT consider:
   - Which test files cover this feature?
   - Do those tests need updating or removal?

3. **Test Suite Structure:** Test file naming (`campaign-form.spec.js`) was clear, but we didn't actively search for dependent tests during implementation

### Where the Gate Failed

**Gate:** Implementer-Tester (QA Phase)
**Responsible Agent:** `sdd/implementer-tester.md`

The agent should have:
1. Identified that a major feature (email form) was being removed
2. Searched for test files covering that feature
3. Updated or removed dependent test files before marking implementation complete

---

## Impact

- **Severity:** Low (caught by automated tests, no production impact)
- **Time Cost:** ~30 minutes to diagnose, fix, and document
- **PR Delay:** PR #27 blocked until test fix applied
- **Discovery:** Automated CI (good - caught before merge)

---

## Corrective Actions

### Immediate Fix ✅
- Deleted obsolete test file `tests/e2e/campaign-form.spec.js` (279 lines)
- Created replacement `tests/e2e/campaign-download.spec.js` (46 lines) for download button
- Committed and pushed to PR #27

### Process Updates

#### 1. Update QA Checklist Template ✅
Add new section to `.claude/qa-checklist.md`:

```markdown
### Test Coverage Impact
- [ ] Identify test files covering modified/removed features
- [ ] Update or remove affected test files
- [ ] Verify no orphaned test fixtures or mocks
- [ ] Run full test suite locally before pushing
```

#### 2. Update Implementer-Tester Agent Prompt
Add explicit step to `sdd/implementer-tester.md`:

> **Before marking implementation complete:**
> - For removed features: Search for and update/remove dependent test files
> - For modified features: Update test assertions to match new behavior
> - Run full test suite locally to catch missing updates

---

## Pattern Analysis

This is a **common mistake** when removing features:
- Developers focus on removing production code
- Tests are "out of sight, out of mind" until CI fails

**Similar vulnerabilities:**
- Removing API endpoints → orphaned integration tests
- Renaming functions → stale unit tests
- Changing data structures → broken fixture files

**General principle:** When removing code, always search for:
1. Tests that cover it
2. Fixtures/mocks that depend on it
3. Documentation that references it

---

## Validation

✅ PR #27 tests now pass with updated test file
✅ New test coverage appropriate for simplified feature (download button)
✅ No regression in other test files

---

## Notes

- This was caught by automated CI before merge (working as intended)
- Solo operator benefit: Grant authored spec, implementation, AND identified the issue - tight feedback loop
- Documentation captures learning for future similar changes

---

**Status:** Resolved
**Documented By:** Claude (SDD Learning Engine)
**Reviewed By:** Grant Howe
