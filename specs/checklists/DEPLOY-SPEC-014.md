# Deployment Checklist: SPEC-014

**Spec:** Remove Email Gate from CEO Brief Campaign
**Tier:** Standard
**Priority:** P2 (High)
**Date:** 2026-02-07

---

## Gate Status

- [x] **Spec Gate:** Approved (Grant) - Feature Spec created and validated
- [x] **Arch Gate:** Approved (Grant) - No architectural concerns
- [x] **QA Gate:** Approved (Grant) - All tests passing (188 tests, including 6 new download button tests)

---

## Pre-Deployment Verification

- [x] PR #27 tests passing on GitHub Actions
- [x] Visual regression tests passing (18 screenshots across 3 viewports)
- [x] All affected test files updated:
  - [x] Deleted `campaign-form.spec.js` (279 lines)
  - [x] Created `campaign-download.spec.js` (46 lines)
  - [x] Updated `pages.spec.js` campaign test
  - [x] Updated `responsive.spec.js` mobile test
- [x] Learning event documented ([learning/escapes/SPEC-014-missing-test-update.md](../../learning/escapes/SPEC-014-missing-test-update.md))
- [x] QA checklist updated with "Test Coverage Impact" section

---

## Deployment Strategy

### Multi-Environment Promotion Model

Per [DEPLOYMENT.md](../../DEPLOYMENT.md):

```
PR Merge → Staging (auto) → Manual Review → Production (manual promotion)
```

### Steps

1. **Merge PR #27** to `main` branch
   - Triggers automatic Vercel staging deployment
   - Staging smoke tests run automatically (non-blocking)

2. **Review Staging Deployment**
   - [ ] Staging URL accessible
   - [ ] Download button visible and functional
   - [ ] PDF downloads correctly
   - [ ] No form present on campaign page
   - [ ] Visual inspection passes
   - [ ] Staging smoke tests pass

3. **Promote to Production** (Manual)
   - [ ] Via Vercel Console: "Promote to Production" button
   - [ ] Production deployment completes
   - [ ] Post-deploy smoke tests pass on production

---

## Rollback Procedure

If issues detected post-deployment:

1. **Immediate Rollback:**
   ```bash
   git revert <merge-commit-sha>
   git push origin main
   ```
   - Staging redeploys with previous version
   - Promote reverted staging to production

2. **Vercel Rollback (Alternative):**
   - In Vercel Dashboard → Deployments
   - Find previous working deployment
   - Click "Promote to Production"

---

## Post-Deployment Verification

### Staging Checks
- [ ] Campaign page loads: https://staging.geekbyte.biz/campaigns/ai-ceo-brief.html
- [ ] Download button present and visible
- [ ] Download button has correct PDF path
- [ ] PDF downloads successfully when clicked
- [ ] No form elements present
- [ ] Page content matches design (simplified copy)
- [ ] Mobile responsive (test at 375px width)
- [ ] Analytics tracking code present (gtag download event)

### Production Checks (After Promotion)
- [ ] Campaign page loads: https://www.geekbyte.biz/campaigns/ai-ceo-brief.html
- [ ] Download button present and visible
- [ ] PDF downloads successfully
- [ ] No console errors in browser DevTools
- [ ] Cross-browser check (Chrome, Firefox, Safari if available)
- [ ] Mobile responsive on actual device

---

## Monitoring

- [ ] Check GitHub Actions for post-deploy smoke test results
- [ ] Monitor for any error reports or user feedback
- [ ] Verify analytics tracking (if GA4 is configured per SPEC-015)

---

## Effort Comparison

### AI Time (Actual)
- **Implementation:** ~20 minutes (HTML/CSS/JS changes, test updates)
- **Issue Discovery:** ~30 minutes (test timeout diagnosis, fixing 3 test files)
- **Learning Capture:** ~10 minutes (escape event documentation, QA checklist update)
- **Total:** ~60 minutes

### Human Estimate
- **Implementation:** ~30 minutes (remove form, add button, update tests)
- **Testing:** ~15 minutes (run tests locally, debug failures)
- **Deployment:** ~10 minutes (merge PR, verify staging, promote production)
- **Total:** ~55 minutes

### Assumptions
- Human developer familiar with codebase and test framework
- No unexpected issues during deployment
- Staging review takes ~5 minutes manual inspection
- Production promotion is one-click via Vercel Console

---

## Risk Assessment

**Risk Level:** Low

**Rationale:**
- Simple content change (remove form, add download link)
- No backend changes
- No database migrations
- Fully reversible (rollback via git revert)
- Comprehensive test coverage (188 tests passing)
- Visual regression tests confirm no layout breaks

**Mitigation:**
- Staging review before production promotion
- Automated smoke tests on production post-deploy
- Fast rollback procedure (< 5 minutes)

---

## Notes

- This deployment removes a lead capture mechanism, which impacts marketing funnel
- Trade-off: Prioritize content distribution over email collection
- Future SPEC may re-add optional email signup (non-gated)
- PDF path: `campaigns/downloads/AI_Transformation_Executive_Brief_Geekbyte.pdf` (verified exists, 254 KB)

---

**Deployment Prepared By:** Claude (SDD Deployment Agent)
**Awaiting Authorization From:** Grant Howe
