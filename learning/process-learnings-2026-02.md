# SDD Process Learnings - February 2026

**Period:** Feb 5-9, 2026
**Specs Analyzed:** SPEC-014, SPEC-015, SPEC-016, SPEC-017, SPEC-019
**Total Escaped Defects:** 4 major incidents
**Total Time Cost:** ~4 hours of unplanned work

---

## Executive Summary

Analysis of 5 specs (SPEC-014 through SPEC-019) revealed systematic gaps in SDD v3.0 gate enforcement. Four major escaped defects reached production, costing ~4 hours in remediation and causing user-facing failures. Primary root causes: premature implementation before architecture validation, insufficient gate enforcement, and missing process automation.

**Key Finding:** Gates existed but were not enforced consistently, particularly for "Trivial" and "Standard" tier specs where review was minimized or skipped.

**Impact:**
- AI Speedup actual: 1.5-2.5x (vs 3-5x target)
- User-facing failures: Contact form broken 12+ hours
- Process gaps: 7 identified, 7 remediated

---

## Escaped Defects Analysis

### INC-015-001: vercel.json Routing Conflicts (SPEC-015)

**What Happened:**
GA4 script integration caused vercel.json routing conflicts. Multiple CI failures, staging deployment issues, visual regression test failures.

**Time Cost:** ~30-45 minutes troubleshooting + multiple CI runs

**Gate That Failed:** Architecture Review
- "Observability" changes minimized as non-architectural
- No checklist item for deployment config impact
- vercel.json compatibility not verified

**Root Cause:** Pattern gap - observability changes dismissed as non-impactful

**Process Fix Implemented:**
- Architecture Review now mandatory for ALL observability integrations
- Added checklist: "Does this change affect vercel.json or deployment config?"
- Staging deployment must succeed before production promotion

**Prevention Checklist Added:**
```
- [ ] Check vercel.json for potential conflicts
- [ ] Run visual regression tests locally if any UI/script changes
- [ ] Test staging deployment before marking complete
- [ ] Architecture review includes deployment config impact
```

---

### INC-019-001: Vercel Forms Assumption (SPEC-019)

**What Happened:**
Spec based on incorrect assumption that Vercel has "Vercel Forms" feature (like Netlify Forms). Feature doesn't exist. Implementation began without verification. Required complete pivot to serverless function approach.

**Time Cost:** ~2 hours (30m wrong implementation + 90m pivot + troubleshooting)

**Gate That Failed:** Spec Gate + Architecture Review
- Third-party feature claim not verified with documentation
- Architecture Review skipped for "Trivial" tier
- No requirement to provide documentation links

**Root Cause:** Spec gap - assumed vendor features without verification

**Process Fix Implemented:**
- Spec Gate now requires documentation links for third-party feature claims
- Architecture Review CANNOT be skipped for third-party integrations
- "Trivial" tier only applies AFTER architectural validation confirms approach

**Prevention Checklist Added:**
```
- [ ] Third-party feature verified in vendor documentation
- [ ] Documentation link included in spec
- [ ] Architecture review completed BEFORE implementation starts
- [ ] If pivoting approach, update spec with new approach
```

---

### INC-019-002: FormData vs JSON Parsing Bug (SPEC-019)

**What Happened:**
Browser submitted FormData (multipart/form-data), but serverless function expected JSON. Curl tests with URL-encoded data passed, masking the issue. Form broken in production for 12+ hours. Multiple user test failures before root cause identified.

**Time Cost:** ~90 minutes debugging + 4 PR cycles

**Gate That Failed:** QA Gate
- Testing only via curl (URL-encoded), not browser (FormData)
- No browser-based test in QA checklist
- Asked user to test multiple times before verifying deployment
- Playwright mocks didn't catch real API behavior difference

**Root Cause:** Gate failure - insufficient test coverage, premature user testing

**Process Fix Implemented:**
- QA Gate now requires browser testing for ALL forms
- Verify deployment succeeded via Vercel dashboard before asking user to test
- Updated .claude/qa-checklist.md with browser testing requirement
- For forms: Test both automated (Playwright mocked) AND manual (real browser)

**Prevention Checklist Added:**
```
- [ ] Curl test passes with actual API endpoint
- [ ] Browser test completed before asking user to test
- [ ] Deployment verified complete via Vercel dashboard
- [ ] For forms: Test both automated (Playwright) and manual (browser)
- [ ] Check Content-Type headers match what API expects
```

---

### INC-019-003: API Key Exposure (SPEC-019)

**What Happened:**
User posted Resend API key directly in conversation when asked about environment variables. Security warning came AFTER exposure, not before. Key revoked and regenerated.

**Time Cost:** ~15 minutes (revoke + regenerate + reconfigure)

**Gate That Failed:** Process gap - no proactive security guidance

**Root Cause:** Process gap - reactive security warning instead of proactive

**Process Fix Implemented:**
- Never ask users for API keys directly
- Frame questions as "Have you set it in Vercel?" not "What is it?"
- Proactive security warning BEFORE any key-related questions
- Updated api/README.md with security warning
- .env.example created with placeholder values only

**Prevention Checklist Added:**
```
- [ ] Spec includes security warning about API keys
- [ ] Documentation shows placeholder values, never real keys
- [ ] Instructions say "set in environment variables" not "provide the key"
- [ ] Proactive security warning before any key-related questions
- [ ] .env.example created with clear placeholders
```

---

## Common Patterns Across Escapes

### 1. Gate Enforcement Inconsistency

**Pattern:** Gates were skipped or minimized for "Trivial" and "Standard" tier specs

**Evidence:**
- SPEC-019: Architecture Review skipped for "Trivial" tier
- SPEC-015: Architecture Review minimized for "observability" change
- SPEC-014: Test coverage escaped due to rushed implementation

**Impact:** 3 out of 4 escapes directly tied to skipped/minimized reviews

**Fix:** Gate requirements now enforce mandatory reviews regardless of tier

---

### 2. Testing Before Deployment Verification

**Pattern:** Repeatedly asked user to test before confirming deployment succeeded

**Evidence:**
- SPEC-019: "still fails. i just dont know why you keep asking me to test it when its not deployed"
- SPEC-019: Multiple test cycles due to deployment not completing

**Impact:** User frustration, wasted testing time, incorrect root cause diagnosis

**Fix:** Always verify deployment via Vercel dashboard before user testing

---

### 3. Curl vs Browser Testing Gap

**Pattern:** Curl tests passed but browser tests failed due to different data formats

**Evidence:**
- SPEC-019: Curl with URL-encoded data passed, browser with FormData failed
- Playwright mocks didn't catch the difference

**Impact:** 12+ hours of broken contact form in production

**Fix:** Mandatory browser testing for forms, not just automated/curl tests

---

### 4. Premature Implementation

**Pattern:** Implementation started before architecture validation completed

**Evidence:**
- SPEC-019: Implemented "Vercel Forms" before verifying feature exists
- SPEC-015: Deployment issues not caught until after merge

**Impact:** Wasted implementation time, required pivot or rework

**Fix:** Architecture Gate must complete BEFORE implementation begins

---

### 5. Time Tracking Not Enforced

**Pattern:** Specs deployed without updating status or recording actual times

**Evidence:**
- SPEC-019: Remained "status: draft" after deployment
- SPEC-015, SPEC-016: "TBD" values for AI times
- No gate enforcement blocking deployment without time data

**Impact:** Incomplete data for AI speedup measurement, unclear spec status

**Fix:** Deployment Gate now blocks without complete time tracking and status update

---

## Process Improvements Implemented

### 1. Gate Requirements Document Created

**File:** `.claude/gate-requirements.md`

Comprehensive gate enforcement covering:
- Time tracking mandatory at each gate (estimates at Spec, actuals at QA/Deploy)
- Spec status update required at Deployment Gate
- Third-party feature verification at Spec Gate
- Browser testing requirement at QA Gate
- Deployment verification before user testing

**Enforcement:** Self-enforced by Grant with AI agent structured review

---

### 2. Learning Events System Established

**Files:** `learning/escapes/SPEC-*.md`

Documented 4 escaped defects with:
- Incident ID, date, impact analysis
- Gate that should have caught it
- Root cause category
- Remediation (immediate + process updates)
- Prevention checklist

**Value:** Systematic capture of failures for process improvement

---

### 3. Time Tracking Standardized

**Updated:** SPEC-015, SPEC-016, SPEC-019 with actual times

All specs now include:
```markdown
| Stage | AI Time (Actual) | Human Estimate | Human Breakdown |
|-------|------------------|----------------|-----------------|
| **Spec Writing** | [actual] | [estimate] | [detailed breakdown] |
| **Architecture Review** | [actual] | [estimate] | [detailed breakdown] |
| **Implementation + Test** | [actual] | [estimate] | [detailed breakdown] |
| **Deployment** | [actual] | [estimate] | [detailed breakdown] |
| **Total** | [sum] | [sum] | **AI Speedup: [ratio]** |
```

**Enforcement:** Required at Spec Gate (estimates) and Deployment Gate (actuals)

---

### 4. QA Checklist Enhanced

**File:** `.claude/qa-checklist.md`

Added requirements:
- Browser-based testing for forms (not just curl)
- Verify deployment complete before user testing
- Test coverage impact analysis (identify affected test files)

---

### 5. Spec Status Management

**Added to Deployment Gate:**
- Spec status must be "deployed" (not "draft")
- deployed_date required in spec header
- Version bump if implementation differs from spec

**Status values defined:**
- `draft` - Spec written, not implemented
- `in_progress` - Implementation started
- `deployed` - In production
- `deprecated` - Replaced by newer spec

---

## Quantified Impact

### Time Cost of Escaped Defects

| Incident | Time Cost | Impact |
|----------|-----------|---------|
| INC-015-001 (Routing) | 30-45 min | CI failures, staging issues |
| INC-019-001 (Assumption) | ~2 hours | Wrong implementation, pivot required |
| INC-019-002 (FormData) | ~90 min | 12h production outage, 4 PRs |
| INC-019-003 (API Key) | ~15 min | Security exposure, key rotation |
| **Total** | **~4 hours** | **User-facing failures, rework** |

### AI Speedup: Estimated vs Actual

| Spec | Estimated Speedup | Actual Speedup | Variance | Reason |
|------|------------------|----------------|----------|--------|
| SPEC-015 | 3x | 1.5-2x | -40-50% | Escaped defects (routing, staging tests) |
| SPEC-016 | 3x | 2-2.5x | -17-25% | Investigation work (lower speedup expected) |
| SPEC-019 | 3x | 1.5x | -50% | Major escaped defects (4 incidents) |
| **Average** | **3x** | **1.8x** | **-40%** | **Gate failures caused 40% speedup loss** |

**Key Insight:** Escaped defects reduced AI speedup by ~40% compared to estimates. Proper gate enforcement critical to achieving target speedup.

---

## Recommendations for SDD Development

### 1. Automate Gate Enforcement

**Current State:** Self-enforced with AI agent review
**Gap:** Manual checklist review, easy to skip items
**Recommendation:** Create automated gate checker script

**Proposed:**
```bash
# .claude/bin/check-gate.sh
#!/bin/bash
# Checks if spec meets gate requirements before approval

SPEC_FILE=$1
GATE=$2  # spec | arch | qa | deploy

case $GATE in
  spec)
    # Check for human estimates, FRs, ACs, complexity tier
    ;;
  deploy)
    # Check for "status: deployed", deployed_date, all actual times filled
    ;;
esac
```

**Benefit:** Prevents gate approval without meeting requirements

---

### 2. Pre-commit Hook for Time Tracking

**Problem:** Specs committed with "TBD" values or "draft" status
**Solution:** Git pre-commit hook to warn about incomplete specs

**Proposed:**
```bash
# .git/hooks/pre-commit
# Warn if committing spec with TBD or draft status

if git diff --cached --name-only | grep -q "specs/SPEC-.*\.md"; then
  if git diff --cached | grep -q "status: draft"; then
    echo "WARNING: Committing spec with status: draft"
    echo "Update status before deployment"
  fi
fi
```

---

### 3. Deployment Checklist Automation

**Problem:** Forgot to verify deployment before asking user to test
**Solution:** Automated deployment verification script

**Proposed:**
```bash
# .claude/bin/verify-deployment.sh
# Verifies Vercel deployment succeeded before marking complete

COMMIT_SHA=$(git rev-parse HEAD)
DEPLOYMENT_URL=$(vercel inspect $COMMIT_SHA --token=$VERCEL_TOKEN | grep "url")

if [ -z "$DEPLOYMENT_URL" ]; then
  echo "ERROR: Deployment not found for commit $COMMIT_SHA"
  exit 1
fi

echo "✅ Deployment verified: $DEPLOYMENT_URL"
```

---

### 4. Learning Event Template Automation

**Problem:** Manual creation of learning events, inconsistent format
**Solution:** CLI tool to generate learning event from incident

**Proposed:**
```bash
# .claude/bin/create-learning-event.sh
# Usage: create-learning-event.sh SPEC-019 "Vercel Forms Assumption"

SPEC_ID=$1
TITLE=$2
INC_ID="${SPEC_ID/SPEC/INC}-$(date +%03d)"

# Generate template with pre-filled fields
cat > "learning/escapes/${SPEC_ID}-${TITLE// /-}.md" <<EOF
# Escape Event: ${TITLE}

escape_event:
  incident_id: ${INC_ID}
  date_discovered: $(date +%Y-%m-%d)
  originated_from_spec: ${SPEC_ID}
  ...
EOF
```

---

### 5. AI Speedup Tracking Dashboard

**Problem:** No visibility into aggregate AI speedup across specs
**Solution:** Dashboard showing speedup trends, escaped defect impact

**Proposed Data:**
- Total specs with complete time tracking
- Average AI speedup (actual vs estimate)
- Escaped defect cost over time
- Gate approval rates (% specs passing each gate first time)

**Implementation:** Markdown report generated from spec YAML frontmatter

---

## Conclusion

Analysis of 5 specs revealed **systematic gate enforcement gaps** causing **4 escaped defects** and **~4 hours of unplanned work**. Primary issues:

1. **Gate skipping for lower-tier specs** (Trivial/Standard)
2. **Testing before deployment verification** (repeated user frustration)
3. **Insufficient test coverage** (curl passed, browser failed)
4. **Premature implementation** (before architecture validation)

**Process improvements implemented:**
- Comprehensive gate requirements document
- Time tracking enforcement at all gates
- Spec status management (draft → deployed)
- Learning events system for escaped defects
- Enhanced QA checklist (browser testing, deployment verification)

**Results:**
- All implemented specs (1-17, 19) now have complete time tracking
- 4 learning events documented with prevention checklists
- Gate enforcement prevents future status/time tracking gaps
- Actual AI speedup: 1.5-2.5x (vs 3x estimated)

**Key Takeaway:** Gates existed but weren't enforced consistently. Enforcement is critical to achieving target AI speedup and preventing escaped defects.

---

## Metrics Summary

**Specs Analyzed:** 19 total (17 deployed, 1 draft, 1 supplementary doc)
**Escaped Defects:** 4 (3 from SPEC-019, 1 from SPEC-015)
**Time Cost:** ~4 hours unplanned remediation work
**AI Speedup:** 1.5-2.5x actual (vs 3x estimated)
**Speedup Loss:** ~40% due to escaped defects
**Process Improvements:** 7 implemented (gate requirements, learning system, etc.)
**Prevention Checklists:** 4 created (1 per escaped defect)

**Conclusion:** Process improvements reduce future escaped defects, targeting 3-5x AI speedup with proper gate enforcement.
