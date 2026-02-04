# Feature Specification

spec_id: SPEC-004
title: Calibrate Playwright Test Assertions
version: 1.0
status: draft
complexity_tier: trivial
last_updated: 2026-02-04

## Business Context

requester: Grant Howe, Managing Partner
business_goal: SPEC-002 delivered a working Playwright test framework with 175 tests.
  84.6% pass (148 tests), but 26 tests fail due to overly strict assertions or
  test/site mismatches (not actual bugs). Calibrating these tests ensures the
  framework provides accurate signal vs noise.
success_metrics:
  - 100% test pass rate after calibration
  - Zero false positives (tests failing when site works correctly)
  - Test assertions match actual site behavior
priority: P3 (quality improvement — tests work, just need tuning)

## Requirements

### Functional Requirements

- [FR-1]: SEO tests calibrated (20 failures)
  - Title length validation: Adjust threshold from strict <70 chars to <90 chars warning
  - Meta description: Add missing descriptions OR adjust test to allow empty on specific pages
  - OG image URL regex: Allow query parameters (e.g., `?v=3` cache busting)
- [FR-2]: Navigation tests calibrated (3 failures)
  - Update test to match actual navigation structure
  - Verify service dropdown links match actual implementation
- [FR-3]: Page content tests calibrated (3 failures)
  - Adjust content assertions to match actual page structure
  - Remove overly specific selectors that break on minor changes

### Non-Functional Requirements

- [NFR-1]: Calibration completes in under 30 minutes total effort
- [NFR-2]: Changes preserve test intent (don't just delete failing tests)
- [NFR-3]: Calibrated tests provide clear failure messages when they DO fail

## Acceptance Criteria

- [AC-1]: Given the test suite, when run against localhost, then 100% of tests pass
- [AC-2]: Given SEO tests, when checking pages, then title length allows 70-90 char range
- [AC-3]: Given SEO tests, when checking OG images, then query parameters don't cause failures
- [AC-4]: Given navigation tests, when checking nav structure, then tests match actual site nav
- [AC-5]: Given page content tests, when checking structure, then tests use resilient selectors

## Scope

### In Scope
- Adjust test assertions in 3 spec files: seo.spec.js, navigation.spec.js, pages.spec.js
- Update test thresholds and regex patterns
- Verify 100% pass rate after changes

### Out of Scope
- Adding new tests
- Changing site functionality to match tests (tests adapt to site, not vice versa)
- Performance optimization
- CI/CD integration

## Dependencies

- [DEP-1]: SPEC-002 implementation complete (satisfied — tests exist)
- [DEP-2]: Test failure analysis from QA-SPEC-002.md (satisfied — 26 failures documented)

## Tier Justification

rationale: Trivial tier. Adjusting test assertions only — no new code, no architecture,
  no production changes. Simple find-and-replace in test files. Well-understood task.
escalation_triggers_checked:
  - Authentication/authorization: No
  - Payment/financial data: No
  - PII/PHI handling: No
  - New external integration: No
  - Database schema change: No
  - Core domain model: No
  - New architectural pattern: No

---

## Gate Log

| Gate | Reviewer | Date | Decision | Evidence |
|------|----------|------|----------|----------|
| Spec | Pending | | | |
| Architecture | Skip (Trivial) | | | |
| QA | Skip (Trivial) | | | |
| Deploy | Skip (Trivial) | | | |

## Effort Comparison

| Stage | AI Time | Human Estimate | Human Breakdown |
|-------|---------|----------------|-----------------|
| **Spec Writing** | _pm-spec agent_ | _pm-spec agent_ | _Itemized_ |
| **Architecture Review** | Skip (Trivial) | Skip (Trivial) | — |
| **Implementation + Test** | _implementer-tester agent_ | _implementer-tester agent_ | _Itemized_ |
| **Deployment** | Skip (Trivial) | Skip (Trivial) | — |
| **Total** | | | |

### Assumptions
_Each agent states assumptions with their estimate._
