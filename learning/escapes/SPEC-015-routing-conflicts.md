# Escape Event: SPEC-015 Google Analytics Routing Conflicts

escape_event:
  incident_id: INC-015-001
  date_discovered: 2026-02-08
  originated_from_spec: SPEC-015
  description: |
    After deploying GA4 integration, vercel.json routes configuration had
    conflicts that broke deployments. Multiple iterations required to fix:
    - Staging smoke tests failed with base URL configuration issues
    - Visual regression baselines needed updates
    - Route conflicts between existing config and GA4 requirements

    PR #30 had 8 commits fixing various issues before final merge.

  impact: |
    - Deployment blocked for ~7 hours (PR created 20:25, merged 04:05 next day)
    - Multiple failed CI runs
    - Staging environment issues
    - Visual regression test failures
    - Time cost: ~30-45 minutes troubleshooting routing issues

  gate_that_should_have_caught: architecture

  why_it_escaped:
    - Architecture review didn't catch potential vercel.json conflicts
    - GA4 is "observability" not "architecture" - minimized review depth
    - No checklist item for "check vercel.json compatibility"
    - Staging smoke tests caught it, but after merge attempt
    - Visual regression wasn't run locally before push

  root_cause_category: pattern_gap

  remediation:
    immediate_fix: |
      - Fixed vercel.json routes conflicts
      - Updated staging smoke test configuration
      - Regenerated visual regression baselines
      - All tests passing before final merge

    pattern_update: |
      When adding observability tools (GA4, analytics, monitoring):
      - Check for vercel.json or deployment config impacts
      - Verify no CSP or routing conflicts
      - Test staging deployment before production

    process_update: |
      Updated Architecture Gate requirements:
      - Observability changes still require config review
      - Add checklist: "Does this change affect vercel.json or deployment config?"
      - Add checklist: "Run visual regression tests locally if UI changes possible"
      - Staging deployment must succeed before promoting to production

  learning:
    - "Observability" changes can have infrastructure impacts
    - vercel.json conflicts are common with script additions
    - Visual regression should be checked locally before push
    - Staging environment is valuable - caught the issue before production
    - Don't minimize architecture review for "non-functional" changes

  time_cost: ~30-45 minutes troubleshooting + multiple CI runs

  prevention_checklist:
    - [ ] Check vercel.json for potential conflicts
    - [ ] Run visual regression tests locally if any UI/script changes
    - [ ] Test staging deployment before marking complete
    - [ ] Architecture review includes deployment config impact
    - [ ] CSP and routing rules verified for new scripts
