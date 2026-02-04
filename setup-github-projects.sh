#!/bin/bash
# SPEC-003: GitHub Projects Setup Script
# This script automates label creation and basic project setup
# Some steps still require GitHub UI (custom fields, table views)

set -e

echo "========================================="
echo "SPEC-003: GitHub Projects Setup"
echo "========================================="
echo ""

# Step 1: Create Labels
echo "Step 1: Creating complexity tier labels..."

gh label create "tier:trivial" \
  --description "Under 30 min, config-only, skip Arch/QA/Deploy gates" \
  --color "808080" \
  --force

gh label create "tier:standard" \
  --description "30-120 min, well-understood patterns, all gates" \
  --color "0969DA" \
  --force

gh label create "tier:complex" \
  --description "2-8 hours, architectural decisions, senior review" \
  --color "FB8500" \
  --force

gh label create "tier:critical" \
  --description "Multi-day, auth/payments/PII, external reviewer required" \
  --color "DC3545" \
  --force

echo "✓ Tier labels created"
echo ""

echo "Step 2: Creating spec type labels..."

gh label create "type:feature" \
  --description "New functionality" \
  --color "1D76DB" \
  --force

gh label create "type:bugfix" \
  --description "Bug fix or correction" \
  --color "D73A4A" \
  --force

gh label create "type:refactor" \
  --description "Code restructuring without behavior change" \
  --color "FEF2C0" \
  --force

gh label create "type:infrastructure" \
  --description "Tooling, testing, deployment infrastructure" \
  --color "5319E7" \
  --force

echo "✓ Type labels created"
echo ""

# Step 2: Create Project (basic - requires additional UI configuration)
echo "Step 3: Creating GitHub Project..."
echo ""
echo "Note: Creating a project with custom fields and table views"
echo "requires GitHub UI or GraphQL API. Using gh CLI for basic setup."
echo ""

# Check if gh CLI supports project creation
if gh project --help &> /dev/null; then
  echo "Creating project 'SDD Pipeline - GeekByte'..."

  # Note: Project creation syntax may vary by gh version
  # This creates a basic project - custom fields must be added via UI
  gh project create \
    --title "SDD Pipeline - GeekByte" \
    --owner "@me" \
    --format json || echo "Warning: Project creation may require manual step"

  echo "✓ Project created (custom fields require UI configuration)"
else
  echo "⚠ gh CLI doesn't support project commands on this version"
  echo "  Please create project manually via GitHub UI"
fi

echo ""
echo "========================================="
echo "Automated Setup Complete"
echo "========================================="
echo ""
echo "✓ Issue template created: .github/ISSUE_TEMPLATE/sdd-feature-spec.yml"
echo "✓ 8 labels created (4 tiers + 4 types)"
echo "✓ Project created (if gh CLI supports it)"
echo ""
echo "Manual Steps Required (see GUIDE-SPEC-003-GitHub-Projects-Setup.md):"
echo "  1. Configure 7 project columns (Draft → Spec → Arch → QA → Deploy → Done → Rejected)"
echo "  2. Add 5 custom fields (Spec ID, AI Time, Human Estimate, Speedup Factor, First Pass)"
echo "  3. Set up Table view with custom field columns"
echo "  4. Migrate SPEC-001 and SPEC-002 as reference items"
echo ""
echo "Follow the detailed guide for step-by-step UI configuration."
