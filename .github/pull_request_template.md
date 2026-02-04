# Pull Request

## Spec Reference

**Spec ID:** SPEC-XXX
**Spec File:** `specs/SPEC-XXX-description.md`
**Complexity Tier:** [Trivial | Standard | Complex | Critical]

## Brief Description

<!-- Provide a 1-3 sentence summary of what this PR does and why -->

## SDD Pipeline Checklist

Please confirm the following items have been completed:

- [ ] **Spec file created and linked** (SPEC-XXX in specs/)
- [ ] **Complexity tier assigned and justified** (documented in spec file)
- [ ] **Spec Gate approved** (documented in spec file Gate Log)
- [ ] **Architecture Gate reviewed** (Standard+ tiers, checklist in checklists/ARCH-SPEC-XXX.md)
- [ ] **Implementation follows spec requirements** (all FRs addressed)
- [ ] **All Playwright tests pass locally** (run `npm test`)
- [ ] **QA Gate criteria met** (Standard+ tiers, adequate test coverage)
- [ ] **Deployment plan documented** (Standard+ tiers, in spec or checklists/DEPLOY-SPEC-XXX.md)

## Breaking Changes

**Does this PR introduce breaking changes?** [Yes | No]

If yes, describe:
<!-- List any breaking changes, migration steps, or compatibility impacts -->

## Rollback Plan

**Is a rollback plan documented?** [Yes | No]

If yes, where:
<!-- Reference the location of the rollback plan (spec file, deployment checklist, etc.) -->

## Additional Notes

<!-- Any other context, screenshots, or information reviewers should know -->

---

**Process Note:** This PR follows the SDD v3.0 methodology. All gates must be approved before merge. See `governance/solo-operator-model.md` for details.
