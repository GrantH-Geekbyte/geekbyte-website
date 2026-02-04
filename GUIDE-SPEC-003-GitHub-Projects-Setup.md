# SPEC-003 Implementation Guide
## Configure GitHub Projects as SDD Pipeline Board

**Spec:** SPEC-003 v1.1
**Date:** 2026-02-04
**Complexity:** Trivial (GitHub UI configuration only)
**Estimated Time:** 20-30 minutes

---

## Overview

This guide walks you through setting up a GitHub Project board to visualize the SDD pipeline with effort metrics tracking. The board will serve as both a pipeline tracker and a metrics dashboard for demonstrating SDD methodology ROI.

---

## Step 1: Create GitHub Project Board

1. Navigate to your GitHub repository: `https://github.com/[your-org]/[geekbyte-repo]`
2. Click **Projects** tab at the top
3. Click **New project** (green button)
4. Select **Board** layout
5. Name: `SDD Pipeline - GeekByte`
6. Description: `Spec-Driven Development pipeline tracker with effort metrics`
7. Click **Create project**

**Verification:** Board created with default columns (Todo, In Progress, Done)

---

## Step 2: Configure Pipeline Columns

Delete default columns and create 7 new columns matching the SDD pipeline:

### Delete Default Columns
1. Click **⋮** (three dots) on each default column
2. Select **Delete column**
3. Confirm deletion

### Create Pipeline Columns (in order)

Create each column by clicking **+ Add column** on the right:

1. **Draft**
   - Description: "Specs being written, not yet submitted for review"

2. **Spec Gate**
   - Description: "Awaiting PM review and approval"

3. **Arch Gate**
   - Description: "Awaiting architecture review (Standard+ tiers only)"

4. **QA Gate**
   - Description: "Awaiting QA verification (Standard+ tiers only)"

5. **Deploy Gate**
   - Description: "Awaiting deployment authorization (Standard+ tiers only)"

6. **Done**
   - Description: "Deployed to production"

7. **Rejected**
   - Description: "Rejected at gate - see notes for which gate and reason"

**Verification:** 7 columns visible in order from left to right

---

## Step 3: Create Labels

Navigate to **Issues** → **Labels** in your repository.

### Complexity Tier Labels

Create 4 tier labels:

1. **tier:trivial**
   - Color: `#808080` (gray)
   - Description: "Under 30 min, config-only, skip Arch/QA/Deploy gates"

2. **tier:standard**
   - Color: `#0969DA` (blue)
   - Description: "30-120 min, well-understood patterns, all gates"

3. **tier:complex**
   - Color: `#FB8500` (orange)
   - Description: "2-8 hours, architectural decisions, senior review"

4. **tier:critical**
   - Color: `#DC3545` (red)
   - Description: "Multi-day, auth/payments/PII, external reviewer required"

### Spec Type Labels

Create 4 type labels:

1. **type:feature**
   - Color: `#1D76DB` (blue)
   - Description: "New functionality"

2. **type:bugfix**
   - Color: `#D73A4A` (red)
   - Description: "Bug fix or correction"

3. **type:refactor**
   - Color: `#FEF2C0` (yellow)
   - Description: "Code restructuring without behavior change"

4. **type:infrastructure**
   - Color: `#5319E7` (purple)
   - Description: "Tooling, testing, deployment infrastructure"

**Verification:** 8 labels created (4 tiers + 4 types)

---

## Step 4: Configure Custom Fields

Return to your Project board. Click **⋮** (three dots) in top right → **Settings**.

Select **Custom fields** from left sidebar.

### Create Custom Fields

Click **+ New field** for each:

1. **Spec ID**
   - Type: Text
   - Description: "Spec file identifier (e.g., SPEC-002)"

2. **AI Time**
   - Type: Text
   - Description: "Total AI pipeline time (e.g., 68 min)"

3. **Human Estimate**
   - Type: Text
   - Description: "Estimated human effort (e.g., 12.5-16.5 hours)"

4. **Speedup Factor**
   - Type: Text
   - Description: "AI speedup vs human (e.g., 11-15x)"

5. **First Pass**
   - Type: Single select
   - Options:
     - `Yes` (green)
     - `No` (yellow)
   - Description: "Passed all gates on first attempt?"

**Verification:** 5 custom fields created and visible in field list

---

## Step 5: Configure Table View

1. In your Project board, click **View** dropdown (top left, next to board name)
2. Click **+ New view**
3. Select **Table** layout
4. Name: `Metrics Table`
5. Click **Create view**

### Configure Table Columns

In the table view, click **+** icon to add columns. Add these fields in order:

1. Title (default, already present)
2. Status (default column for board status)
3. Labels
4. Spec ID (custom field)
5. AI Time (custom field)
6. Human Estimate (custom field)
7. Speedup Factor (custom field)
8. First Pass (custom field)

Resize columns as needed for readability.

**Verification:** Table view shows 8 columns with clear headers

---

## Step 6: Create Issue Template

Navigate to repository **Settings** → **Options** → scroll to **Features** → **Issues** → **Set up templates**.

1. Click **Add template** → **Custom template**
2. Template name: `SDD Feature Spec`
3. Template content:

```markdown
---
name: SDD Feature Spec
about: Spec-Driven Development feature specification
title: '[SPEC-XXX] '
labels: 'tier:standard, type:feature'
assignees: ''
---

## Spec Information

**Spec File:** `specs/SPEC-XXX-short-description.md`
**Complexity Tier:** (Select: Trivial / Standard / Complex / Critical)
**Type:** (Select: Feature / Bugfix / Refactor / Infrastructure)

## Brief Description

[One-sentence description of what this spec delivers]

## Links

- Spec file: [specs/SPEC-XXX-short-description.md](./specs/SPEC-XXX-short-description.md)
- Architecture checklist: (if Standard+ tier)
- QA checklist: (if Standard+ tier)
- Deployment checklist: (if Standard+ tier)

## Pipeline Status

- [ ] Spec written
- [ ] Spec Gate: Approved
- [ ] Architecture Gate: (Approved / Skipped)
- [ ] Implementation complete
- [ ] QA Gate: (Approved / Skipped)
- [ ] Deployment Gate: (Approved / Skipped)
- [ ] Deployed to production

## Effort Metrics

**AI Time:** (fill after completion)
**Human Estimate:** (fill after completion)
**Speedup Factor:** (fill after completion)
**First Pass:** (Yes / No)
```

4. Click **Propose changes** → **Commit changes**

**Verification:** Template appears when creating new issue with "SDD Feature Spec" option

---

## Step 7: Migrate Existing Specs

Create issues for SPEC-001 and SPEC-002 to populate the board with reference data.

### SPEC-001: Fix About Page 404

1. Navigate to **Issues** → **New issue**
2. Select **SDD Feature Spec** template
3. Fill in:
   - Title: `[SPEC-001] Fix About Page 404`
   - Spec File: `specs/SPEC-001-fix-about-page.md`
   - Complexity Tier: Trivial
   - Type: Bugfix
   - Labels: Add `tier:trivial`, `type:bugfix`
4. Update pipeline status (all checkboxes checked)
5. Fill effort metrics (from SPEC-001):
   - AI Time: `30-35 min`
   - Human Estimate: `5-6.5 hours`
   - Speedup Factor: `~10x`
   - First Pass: `No` (implemented outside SDD pipeline)
6. Click **Submit new issue**
7. **Add to Project:** Select `SDD Pipeline - GeekByte`
8. **Move to column:** Done
9. **Set custom fields:**
   - Spec ID: `SPEC-001`
   - AI Time: `30-35 min`
   - Human Estimate: `5-6.5 hours`
   - Speedup Factor: `~10x`
   - First Pass: `No`

### SPEC-002: Add Playwright Test Framework

1. Navigate to **Issues** → **New issue**
2. Select **SDD Feature Spec** template
3. Fill in:
   - Title: `[SPEC-002] Add Playwright Test Framework`
   - Spec File: `specs/SPEC-002-add-playwright-tests.md`
   - Complexity Tier: Standard
   - Type: Infrastructure
   - Labels: Add `tier:standard`, `type:infrastructure`
4. Update pipeline status (all checkboxes checked)
5. Fill effort metrics (from SPEC-002):
   - AI Time: `68 min`
   - Human Estimate: `12.5-16.5 hours`
   - Speedup Factor: `11-15x`
   - First Pass: `No` (QA Gate required mobile nav fix)
6. Click **Submit new issue**
7. **Add to Project:** Select `SDD Pipeline - GeekByte`
8. **Move to column:** Done
9. **Set custom fields:**
   - Spec ID: `SPEC-002`
   - AI Time: `68 min`
   - Human Estimate: `12.5-16.5 hours`
   - Speedup Factor: `11-15x`
   - First Pass: `No`

**Verification:** 2 issues visible in Done column with all custom fields populated

---

## Step 8: Test Filtering and Views

### Test Board View
1. Click on board view
2. Verify 7 columns visible
3. Verify 2 issues in Done column
4. Click on SPEC-002 issue → verify labels and custom fields display correctly

### Test Table View
1. Switch to Metrics Table view
2. Verify 8 columns visible
3. Verify SPEC-001 and SPEC-002 rows show all metrics
4. Sort by "AI Time" → verify sorting works
5. Filter by `tier:standard` → should show only SPEC-002

### Test Label Filtering
1. In board view, click **Filter** (top right)
2. Select `tier:trivial` → should show only SPEC-001
3. Select `tier:standard` → should show only SPEC-002
4. Clear filters

**Verification:** All views, sorting, and filtering work correctly

---

## Step 9: Create SPEC-003 and SPEC-004 Issues

Optional: Add issues for the remaining specs in your backlog.

### SPEC-003: This Spec (GitHub Projects Setup)

1. Create issue: `[SPEC-003] Configure GitHub Projects as SDD Pipeline Board`
2. Labels: `tier:trivial`, `type:infrastructure`
3. Move to: Done (after completing this guide)
4. Custom fields:
   - Spec ID: `SPEC-003`
   - AI Time: (fill after completion)
   - Human Estimate: (fill after completion)
   - Speedup Factor: (fill after completion)
   - First Pass: `Yes`

### SPEC-004: Calibrate Test Assertions

1. Create issue: `[SPEC-004] Calibrate Playwright Test Assertions`
2. Labels: `tier:trivial`, `type:infrastructure`
3. Move to: Draft or Spec Gate (depending on current status)
4. Custom fields: Leave blank until completed

---

## Final Verification Checklist

- [ ] Board has 7 columns in correct order
- [ ] 8 labels created (4 tiers + 4 types)
- [ ] 5 custom fields created (Spec ID, AI Time, Human Estimate, Speedup Factor, First Pass)
- [ ] Table view configured with 8 columns
- [ ] Issue template "SDD Feature Spec" available
- [ ] SPEC-001 and SPEC-002 migrated with full metrics
- [ ] Filtering by tier label works correctly
- [ ] Table view sorting works correctly
- [ ] Board is readable and demo-ready

---

## Usage Notes

### Adding New Specs

1. Create issue using "SDD Feature Spec" template
2. Fill in spec file path and basic info
3. Add appropriate tier and type labels
4. Add to project (auto-added if in template config)
5. Starts in Draft column
6. Move through columns as it passes gates
7. Fill in effort metrics when completed

### Moving Cards

- Drag and drop between columns as specs progress through gates
- Update custom fields when effort data is available
- Mark "First Pass" as No if spec required rework at any gate

### Demo Strategy

For stakeholder demos:
1. Start with **Board view** to show pipeline flow
2. Switch to **Table view** to show effort metrics
3. Filter by tier to show complexity distribution
4. Highlight specific specs (like SPEC-002) to show detailed metrics
5. Emphasize speedup factor column for ROI demonstration

---

## Troubleshooting

**Custom fields not visible on cards:**
- Click card → scroll down → custom fields appear below description
- In table view, custom fields are columns

**Labels not filtering correctly:**
- Ensure labels are added to issues, not just in template
- Use Filter button (not search) to filter by label

**Table view missing columns:**
- Click + icon in table header to add columns
- Drag column headers to reorder

**Issue template not appearing:**
- Check .github/ISSUE_TEMPLATE/ directory exists
- Verify template YAML front matter is valid
- Refresh GitHub page

---

## Next Steps

After completing this setup:

1. **Update SPEC-003:** Mark as deployed, fill effort metrics
2. **Demo:** Test the board with a stakeholder view
3. **SPEC-004:** Execute test calibration spec and track on this board
4. **Automation (future):** Consider GitHub Actions to auto-move cards based on git commits

---

**Implementation Complete:** Board ready for SDD pipeline tracking and stakeholder demos.
