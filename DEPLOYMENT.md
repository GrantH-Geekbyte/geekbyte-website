# Deployment Guide

**GeekByte Website - Multi-Environment Deployment Process**

This document describes the deployment workflow for the GeekByte website, which uses a staging → production promotion model to reduce deployment risk.

---

## Deployment Environments

### Production
- **URL:** https://www.geekbyte.biz
- **Trigger:** Manual promotion via Vercel console or GitHub Release
- **Environment:** Production
- **Analytics:** Enabled
- **Robots.txt:** Allows all crawlers
- **Post-Deploy:** Smoke tests run automatically (SPEC-007)

### Staging
- **URL:** staging.geekbyte.biz (or Vercel preview URL)
- **Trigger:** Automatic on every commit to `main` branch
- **Environment:** Preview/Staging
- **Analytics:** Disabled (prevent staging traffic pollution)
- **Robots.txt:** Blocks all crawlers (use `robots-staging.txt`)
- **Post-Deploy:** Smoke tests run automatically (non-blocking)

### PR Previews
- **URL:** Auto-generated Vercel preview URLs
- **Trigger:** Automatic on every PR
- **Environment:** Preview
- **Purpose:** Visual review before merge
- **Cleanup:** Automatic after PR merge/close

---

## Deployment Flow

```
┌─────────────────────────────────────────────────┐
│ 1. Developer creates PR                         │
├─────────────────────────────────────────────────┤
│ → Vercel deploys PR to preview URL             │
│ → Preview URL posted in PR comments             │
│ → Stakeholders review preview                   │
│ → PR tests run (pr-tests.yml)                   │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│ 2. PR approved and merged to main               │
├─────────────────────────────────────────────────┤
│ → Vercel deploys to staging environment         │
│ → Staging smoke tests run (non-blocking)        │
│ → Slack notification (if tests fail)            │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│ 3. PM reviews staging deployment                │
├─────────────────────────────────────────────────┤
│ → Visual inspection of staging site             │
│ → Cross-browser testing (if needed)             │
│ → Form testing, layout verification             │
│ → Verify smoke test results in GitHub Actions   │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│ 4. PM promotes to production (MANUAL STEP)      │
├─────────────────────────────────────────────────┤
│ → Via Vercel console: "Promote to Production"   │
│ → Or via GitHub Release (see below)             │
│ → Production deployment triggered                │
│ → Post-deploy smoke tests run against prod      │
└─────────────────────────────────────────────────┘
```

---

## How to Review Staging

### 1. Find the Staging URL

**Option A: From GitHub Actions**
1. Go to the merged PR or commit on `main`
2. Check the "Staging Smoke Tests" workflow run
3. The staging URL is shown in the workflow summary

**Option B: From Vercel Dashboard**
1. Log into [Vercel Dashboard](https://vercel.com)
2. Navigate to the GeekByte project
3. Find the latest deployment with environment "Preview" or "Staging"
4. Click "Visit" to open the staging site

**Option C: Staging Subdomain**
- Direct URL: `https://staging.geekbyte.biz` (if configured)

### 2. Review Checklist

Review the staging deployment before promoting to production:

- [ ] **Visual inspection:** All pages render correctly
- [ ] **Navigation:** All links work, no 404s
- [ ] **Forms:** Contact form validates and submits (test with dummy data)
- [ ] **Responsive design:** Test on mobile, tablet, desktop viewports
- [ ] **Cross-browser:** Test in Chrome, Firefox, Safari (if critical change)
- [ ] **Content accuracy:** Marketing copy, service descriptions are correct
- [ ] **SEO metadata:** Page titles, descriptions, OG tags are correct
- [ ] **Analytics:** Verify analytics are disabled on staging (no staging traffic in production metrics)
- [ ] **Smoke test results:** Check GitHub Actions for staging smoke test pass/fail

### 3. Common Issues to Check

- CSS breaks or layout shifts
- Missing images or assets
- Incorrect environment variables
- Form submission endpoints
- Analytics tracking codes
- robots.txt configuration (staging should block crawlers)

---

## How to Promote Staging to Production

### Option 1: Vercel Console (Recommended)

1. Log into [Vercel Dashboard](https://vercel.com)
2. Navigate to the GeekByte project
3. Find the staging deployment you want to promote
4. Click **"Promote to Production"** button
5. Confirm the promotion
6. Wait for production deployment to complete (~2 minutes)
7. Verify post-deploy smoke tests pass on production

### Option 2: GitHub Release (Alternative)

1. Create a new release on GitHub:
   ```bash
   gh release create v1.x.x --title "Release v1.x.x" --notes "Description of changes"
   ```
2. Vercel will automatically deploy the release tag to production
3. Wait for deployment and verify smoke tests

### Option 3: Vercel CLI (Advanced)

```bash
# Promote a specific deployment to production
vercel promote <deployment-url> --scope geekbyte
```

---

## How to Handle Staging Deployment Failures

### If Staging Smoke Tests Fail

**Note:** Staging test failures do NOT block production promotion (manual approval gate is primary safety mechanism).

1. **Review test artifacts:**
   - Go to GitHub Actions → "Staging Smoke Tests" workflow
   - Download test report artifact
   - Check Playwright report for failure details

2. **Diagnose the issue:**
   - Is this a real bug or a flaky test?
   - Does the failure reproduce locally?
   - Is it environment-specific (staging vs production config)?

3. **Fix the issue:**
   - If bug: Create new PR with fix
   - If flaky test: Update test to be more stable
   - If environment config: Update Vercel environment variables

4. **Re-deploy:**
   - Merge the fix PR to `main`
   - Wait for staging deployment
   - Verify staging tests pass
   - Promote to production

### If Production Deployment Fails

1. **Check post-deploy smoke tests:**
   - Go to GitHub Actions → "Post-Deploy Smoke Tests" workflow
   - Review failure details

2. **Rollback immediately:**
   ```bash
   # Revert the merge commit on main
   git revert <commit-sha>
   git push origin main
   ```
   - Staging will redeploy with previous working version
   - Promote reverted staging to production

3. **Fix and re-deploy:**
   - Create hotfix PR with proper fix
   - Merge to `main`
   - Review staging
   - Promote to production

---

## Environment Variable Management

### Staging Environment Variables

Set in Vercel Dashboard → Project Settings → Environment Variables → Preview:

```env
ENVIRONMENT=staging
ANALYTICS_ENABLED=false
BASE_URL=https://staging.geekbyte.biz
```

### Production Environment Variables

Set in Vercel Dashboard → Project Settings → Environment Variables → Production:

```env
ENVIRONMENT=production
ANALYTICS_ENABLED=true
BASE_URL=https://www.geekbyte.biz
```

### How to Update Environment Variables

1. Log into [Vercel Dashboard](https://vercel.com)
2. Navigate to Project Settings → Environment Variables
3. Select the environment (Production, Preview, Development)
4. Add or edit variables
5. Redeploy for changes to take effect

**Security Note:** Never commit secrets or API keys to git. Always use Vercel's encrypted environment variable storage.

---

## Deployment Checklist

Use this checklist when deploying significant changes:

### Pre-Deployment
- [ ] PR tests pass on GitHub Actions
- [ ] Code reviewed and approved
- [ ] PR merged to `main`

### Staging Review
- [ ] Staging deployment completes successfully
- [ ] Staging smoke tests pass (or failures explained)
- [ ] Manual visual review completed
- [ ] Cross-browser testing completed (if needed)
- [ ] Forms and interactive elements tested

### Production Promotion
- [ ] PM approval obtained for production promotion
- [ ] Staging review checklist completed
- [ ] Production promotion triggered (Vercel console or GitHub release)
- [ ] Production deployment completes successfully
- [ ] Post-deploy smoke tests pass on production
- [ ] Live site verified at https://www.geekbyte.biz

### Post-Deployment
- [ ] Smoke test results reviewed
- [ ] Stakeholders notified (if significant change)
- [ ] Deployment documented in release notes
- [ ] Any issues or escape events logged

---

## Troubleshooting

### Staging URL Not Accessible

**Problem:** staging.geekbyte.biz returns 404 or DNS error

**Solution:**
1. Verify DNS is configured for staging subdomain
2. Check Vercel domain settings
3. Use Vercel preview URL as fallback (found in Vercel dashboard)

### Staging Smoke Tests Not Running

**Problem:** GitHub Actions workflow not triggered after deployment

**Solution:**
1. Verify Vercel webhook is configured in GitHub repo settings
2. Check workflow logs for trigger conditions (deployment_status event)
3. Ensure Vercel deployment environment is not "Production"

### Production Deployment Not Triggering

**Problem:** Promotion button in Vercel doesn't deploy to production

**Solution:**
1. Verify production domain is configured correctly
2. Check Vercel project settings → Git → Production Branch is set to `main`
3. Try GitHub Release method as alternative

### Environment Variables Not Applied

**Problem:** Analytics still enabled on staging or disabled on production

**Solution:**
1. Verify environment variables are set in correct environment scope (Preview vs Production)
2. Redeploy after changing variables (environment changes don't auto-redeploy)
3. Check vercel.json for any conflicting env settings

---

## Related Documentation

- **SPEC-010:** Multi-Environment Deployments (Staging + Production)
- **SPEC-007:** CI/CD Pipeline Integration
- **SPEC-008:** Automated Issue Creation on Smoke Test Failure
- **Vercel Documentation:** https://vercel.com/docs

---

**Questions?** Contact Grant Howe (grant@geekbyte.biz)
