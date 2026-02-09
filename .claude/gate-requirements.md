# SDD Gate Requirements - GeekByte Website

**Purpose:** Define mandatory requirements for each SDD gate to ensure process compliance and data collection.

**Version:** 1.0
**Last Updated:** 2026-02-09

---

## Time Tracking Requirements

### Why Time Tracking Matters

Accurate time tracking enables:
1. **AI Speedup Measurement:** Quantify actual productivity gains from AI assistance
2. **Estimation Improvement:** Build historical data to improve future estimates
3. **Process Optimization:** Identify bottlenecks and inefficiencies
4. **Business Case:** Demonstrate ROI of AI-assisted development
5. **Learning:** Understand where escaped defects add hidden costs

### Mandatory Time Tracking Fields

Every spec **MUST** include an "Effort Comparison" section with:

| Stage | AI Time (Actual) | Human Estimate | Human Breakdown |
|-------|------------------|----------------|-----------------|
| **Spec Writing** | [Actual time] | [Estimate] | [Detailed breakdown] |
| **Architecture Review** | [Actual time] | [Estimate] | [Detailed breakdown] |
| **Implementation + Test** | [Actual time] | [Estimate] | [Detailed breakdown] |
| **Deployment** | [Actual time] | [Estimate] | [Detailed breakdown] |
| **Total** | [Sum] | [Sum] | **AI Speedup: [Ratio]** |

**Fields:**
- **AI Time (Actual):** Time spent with AI assistance (use "TBD" until completed)
- **Human Estimate:** Estimated time for mid-level engineer without AI
- **Human Breakdown:** Detailed task breakdown explaining the estimate
- **AI Speedup:** Ratio of Human Estimate / AI Time Actual

---

## Gate 1: Spec Gate

### Purpose
Validate that the Feature Spec is complete, clear, and ready for architecture review.

### Time Tracking Requirements

**Before Spec Gate Approval:**

- [x] Spec includes "Effort Comparison" section
- [x] **Human Estimate** filled in for all stages
- [x] **Human Breakdown** documented with task-level detail
- [x] **AI Time (Actual)** set to "TBD" (will be filled later)
- [x] Estimates reviewed for reasonableness (sanity check)

**Checklist:**
```markdown
## Effort Comparison

| Stage | AI Time (Actual) | Human Estimate | Human Breakdown |
|-------|------------------|----------------|-----------------|
| **Spec Writing** | TBD | [X hours] | [Detailed breakdown] |
| **Architecture Review** | TBD | [X hours] | [Detailed breakdown] |
| **Implementation + Test** | TBD | [X hours] | [Detailed breakdown] |
| **Deployment** | TBD | [X hours] | [Detailed breakdown] |
| **Total** | TBD | [Sum] | **AI Speedup: TBD** |
```

**Rejection Criteria:**
- Missing "Effort Comparison" section
- Human estimates not provided
- Estimates lack detailed breakdown
- Estimates appear unrealistic (too high/low for complexity tier)

---

## Gate 2: Architecture Gate

### Purpose
Validate architectural soundness and alignment with patterns.

### Time Tracking Requirements

**At Architecture Gate:**
- [x] Architecture review **actual** time recorded in spec
- [x] Update "AI Time (Actual)" for "Architecture Review" row
- [x] Note any architectural decisions that impacted estimates

**Example:**
```markdown
| **Architecture Review** | 15 min | 45-60 min | Read spec (10m), validate patterns (5m) |
```

---

## Gate 3: QA Gate

### Purpose
Validate implementation quality, test coverage, and readiness for deployment.

### Time Tracking Requirements

**Before QA Gate Approval:**

- [x] **Implementation + Test** actual time recorded
- [x] Escaped defects documented with time cost
- [x] Test iterations and debugging time included
- [x] **Spec Writing** actual time updated (if retroactive spec)

**Escaped Defect Documentation:**

If escaped defects occurred, add a section documenting:
```markdown
**Escaped Defects:**
1. **[Defect Name]:** [Description] - Added [X min/hours] to implementation
2. **[Defect Name]:** [Description] - Added [X min/hours] to implementation

**Time Impact:** Total [X hours] added to Implementation + Test stage
```

**Checklist:**
- [x] All actual times recorded up to QA Gate
- [x] Escaped defects documented with time impact
- [x] Estimates vs actuals variance noted if >50%
- [x] Learning events created for major overruns

**Rejection Criteria:**
- Implementation time not recorded
- Tests not passing (blocks QA gate anyway)
- Major time variance (>2x estimate) without explanation

---

## Gate 4: Deployment Gate

### Purpose
Validate production readiness and successful deployment.

### Time Tracking Requirements

**Before Deployment Gate Approval:**

- [x] **ALL** actual times filled in (no "TBD" remaining)
- [x] **Total** row calculated with sum of actuals
- [x] **AI Speedup** ratio calculated (Human Estimate / AI Actual)
- [x] Post-deployment notes added (if deployment issues occurred)

**Final Effort Comparison Example:**
```markdown
| Stage | AI Time (Actual) | Human Estimate | Human Breakdown |
|-------|------------------|----------------|-----------------|
| **Spec Writing** | 20 min | 1.5-2 hours | [Breakdown] |
| **Architecture Review** | 15 min | 45-60 min | [Breakdown] |
| **Implementation + Test** | 2.5 hours | 3-4 hours | [Breakdown] |
| **Deployment** | 20 min | 15-20 min | [Breakdown] |
| **Total** | 3 hours 25 min | 5.5-7 hours | **AI Speedup: 1.7-2x** |
```

**Checklist:**
- [x] No "TBD" values remain
- [x] All times are actual measurements (not estimates)
- [x] Speedup ratio calculated and documented
- [x] Major variances explained in notes

**Rejection Criteria:**
- Any "TBD" values remaining
- Missing actual times
- Speedup ratio not calculated
- Deployment time not recorded

---

## Enforcement Process

### Who Enforces Gates (Solo Operator)

All gates are self-enforced by Grant with AI agent structured review:
1. **Grant** reviews gate checklist
2. **AI Agent** provides structured review based on gate requirements
3. **Grant** approves/rejects based on checklist completion

### Gate Rejection

If a gate is rejected due to missing time tracking:
1. Stop work on current stage
2. Fill in missing time tracking data
3. Re-submit for gate approval
4. Document any delays caused by missing data

### Retroactive Specs

For specs created retroactively (documenting completed work):
- Reconstruct actual times from git history, PR timestamps, conversation logs
- Mark as "retroactive" in spec header
- Use "best estimate" if exact times cannot be reconstructed
- Note: Retroactive specs should be rare - work should flow through pipeline

---

## Time Tracking Tools

### Data Sources for Actual Times

1. **Git commit timestamps:** First commit to last commit for a spec
2. **PR timestamps:** PR created to PR merged
3. **Conversation logs:** Claude Code conversation duration
4. **Manual tracking:** Use timer or time logs during work

### Calculating AI Time

**Include:**
- Spec writing time (actual time spent, not PR duration if overnight)
- Implementation time (including debugging, testing, fixing)
- Code review time
- Deployment time (including troubleshooting)
- Escaped defect remediation time

**Exclude:**
- Waiting for CI/CD (automated processes)
- User response time (when waiting for user input)
- Unrelated work or context switching

### Example Calculation

```
SPEC-019 Contact Form:
- PR #32: 15 min (wrong approach)
- PR #33: 9 min (correct approach)
- PR #34: 7 min (domain fix)
- PR #35: 5 min (JSON fix)
- Conversation troubleshooting: ~3 hours (reviewing logs, debugging)
- Total: ~3.75 hours
```

---

## Success Metrics

**Process Compliance:**
- 100% of specs have complete time tracking by Deployment Gate
- 100% of Spec Gates verify Human Estimates are present
- 100% of QA Gates verify Implementation actuals are recorded

**Data Quality:**
- <10% of specs have "best estimate" vs actual measurement
- Time tracking data used for quarterly ROI analysis
- Learning events reference time impact of escaped defects

---

## Revision History

- v1.0 (2026-02-09): Initial gate requirements created. Enforces time tracking at all gates.
