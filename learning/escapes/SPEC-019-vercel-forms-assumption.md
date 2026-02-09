# Escape Event: SPEC-019 Vercel Forms Assumption

escape_event:
  incident_id: INC-019-001
  date_discovered: 2026-02-09
  originated_from_spec: SPEC-019
  description: |
    SPEC-019 was written based on incorrect assumption that Vercel had a native
    "Vercel Forms" feature similar to Netlify Forms. This feature doesn't exist.
    Spec passed through Spec Gate and implementation began before architectural
    validation. Implementation failed with 405 Method Not Allowed, requiring
    complete pivot to serverless function approach.

  impact: |
    - ~30 minutes wasted implementing non-existent feature
    - PR #32 merged with incorrect approach, then reverted
    - Additional ~90 minutes to pivot to serverless function + Resend
    - Total time impact: ~2 hours added to SPEC-019 timeline
    - User frustration with multiple failed attempts

  gate_that_should_have_caught: spec

  why_it_escaped:
    - Architecture Review was skipped/rushed for "Trivial" tier spec
    - Spec Gate did not verify feasibility of claimed Vercel feature
    - No requirement to check vendor documentation before assuming feature exists
    - AI made assumption based on pattern matching (Netlify Forms → Vercel Forms)

  root_cause_category: spec_gap

  remediation:
    immediate_fix: |
      - Pivoted to Vercel serverless function with Resend API
      - Created api/contact.js with proper email handling
      - Updated tests to mock /api/contact endpoint
      - PR #33 implemented correct approach

    pattern_update: |
      None - serverless function pattern is correct approach for Vercel.
      Documented in api/README.md.

    process_update: |
      Updated gate requirements (.claude/gate-requirements.md):
      - Spec Gate MUST verify third-party feature claims with documentation
      - Architecture Review CANNOT be skipped for "Trivial" tier if new integration
      - Add checklist item: "If spec mentions third-party service feature,
        provide documentation link confirming feature exists"
      - Downgrade to Trivial only AFTER architectural validation confirms approach

  learning:
    - Never assume vendor features exist without verification
    - Architecture review is mandatory for ANY third-party integration
    - "Trivial" tier doesn't mean skip validation - it means validation is quick
    - When in doubt, search vendor docs first before writing spec

  time_cost: ~2 hours (30m wrong implementation + 90m pivot + troubleshooting)

  prevention_checklist:
    - [ ] Third-party feature verified in vendor documentation
    - [ ] Documentation link included in spec
    - [ ] Architecture review completed BEFORE implementation starts
    - [ ] If pivoting approach, create new spec or update existing with new approach
