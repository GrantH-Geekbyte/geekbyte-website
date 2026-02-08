# SPEC-015: Google Analytics 4 Setup Instructions

## Overview
This document provides step-by-step instructions for completing the GA4 setup after the code has been deployed.

## Step 1: Create GA4 Property

1. **Log in to Google Analytics**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Use the Google account you want to manage this property

2. **Create a new GA4 Property**
   - Click "Admin" (gear icon in bottom left)
   - In the "Property" column, click "Create Property"
   - Property name: **GeekByte Website**
   - Reporting time zone: Select your timezone
   - Currency: USD
   - Click "Next"

3. **Configure Property Details**
   - Business information:
     - Industry category: Technology / Professional Services
     - Business size: Select appropriate option
   - Click "Next"

4. **Set Business Objectives** (optional)
   - Select relevant objectives or skip
   - Click "Create"

## Step 2: Create Web Data Stream

1. **Add Data Stream**
   - After creating property, you'll be prompted to add a data stream
   - Select "Web"

2. **Configure Web Stream**
   - Website URL: `https://geekbyte.biz`
   - Stream name: **GeekByte Production**
   - Click "Create stream"

3. **Copy Measurement ID**
   - After creating the stream, you'll see the Measurement ID
   - Format: `G-XXXXXXXXXX` (starts with G- followed by 9-10 characters)
   - **IMPORTANT: Copy this ID - you'll need it in Step 3**

4. **Enable Enhanced Measurement** (recommended)
   - In the web stream details, scroll to "Enhanced measurement"
   - Toggle it ON if not already enabled
   - This automatically tracks:
     - Page views
     - Scrolls
     - Outbound clicks
     - Site search
     - Video engagement
     - File downloads

## Step 3: Update Website Code

1. **Find and Replace Measurement ID**
   - Open each of these HTML files:
     - `index.html`
     - `about.html`
     - `contact.html`
     - `services/fractional-cto.html`
     - `services/board-advisory.html`
     - `services/growth-advisory.html`
     - `campaigns/ai-ceo-brief.html`

2. **Replace Placeholder**
   - Find: `G-XXXXXXXXXX` (appears twice in each file's `<head>` section)
   - Replace with: Your actual Measurement ID from Step 2.3
   - Example:
     ```html
     <!-- Before -->
     <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
     <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-XXXXXXXXXX', {
         'anonymize_ip': true
       });
     </script>

     <!-- After (example with G-ABC123XYZ9) -->
     <script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ9"></script>
     <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-ABC123XYZ9', {
         'anonymize_ip': true
       });
     </script>
     ```

3. **Remove TODO Comments** (optional)
   - Delete the line: `<!-- TODO: Replace G-XXXXXXXXXX with actual Measurement ID from GA4 -->`

4. **Commit and Deploy**
   - Commit changes with message: `[SPEC-015] Add GA4 Measurement ID`
   - Push to GitHub
   - Vercel will auto-deploy

## Step 4: Configure Privacy Settings

1. **Enable IP Anonymization** (already configured in code)
   - The code includes `'anonymize_ip': true` - no additional action needed
   - This is already compliant with privacy best practices

2. **Set Data Retention** (optional but recommended)
   - In GA4 Admin > Data Settings > Data Retention
   - Event data retention: 14 months (maximum for standard GA4)
   - Click "Save"

3. **Google Signals** (optional)
   - In GA4 Admin > Data Settings > Data Collection
   - Toggle "Google signals data collection" if you want cross-device tracking
   - Note: May require additional consent in some jurisdictions

## Step 5: Test GA4 Implementation

### Using GA4 Real-Time Reports (Easiest Method)

1. **Open Real-Time Report**
   - In GA4, go to Reports > Real-time
   - Keep this window open

2. **Visit Your Website**
   - Open a new browser tab/window
   - Visit https://geekbyte.biz
   - Navigate to different pages (services, contact, etc.)

3. **Verify Events Appear**
   - In Real-time report, you should see:
     - Active users (should show "1" or more)
     - Page views as you navigate
     - Event counts increasing

4. **Test Custom Events**
   - Visit a service page (e.g., `/services/fractional-cto.html`)
     - Should fire `view_service` event with parameter `service_name: fractional_cto`
   - Click a CTA button (e.g., "Schedule a Call")
     - Should fire `cta_click` event
   - Submit contact form (on contact.html)
     - Should fire `form_submit` event with `form_name: contact_form`
   - Download campaign PDF (on /campaigns/ai-ceo-brief.html)
     - Should fire `form_submit` event with `form_name: campaign_form`

### Using GA4 DebugView (Advanced Method)

1. **Install GA4 Debug Extension**
   - Chrome: Install "Google Analytics Debugger" extension
   - Or add `?debug_mode=true` to any URL

2. **Open DebugView**
   - In GA4, go to Admin > DebugView
   - Keep this window open

3. **Visit Website with Debug Mode**
   - Visit site with extension enabled or `?debug_mode=true` parameter
   - You'll see detailed event stream with all parameters

4. **Verify Event Structure**
   - Check that events have correct names and parameters:
     - `page_view` - automatic
     - `view_service` - with `service_name` parameter
     - `form_submit` - with `form_name` and `form_location` parameters
     - `cta_click` - with `cta_text` and `cta_location` parameters

## Step 6: Verify Production Data Flow

1. **Wait 24-48 Hours**
   - GA4 real-time data appears within minutes
   - Standard reports populate within 24-48 hours

2. **Check Standard Reports**
   - Go to Reports > Engagement > Pages and screens
   - Should see traffic to all pages (index.html, services, contact, etc.)
   - Go to Reports > Engagement > Events
   - Should see custom events: `form_submit`, `view_service`, `cta_click`

3. **Verify Event Parameters**
   - In Events report, click on an event name (e.g., `view_service`)
   - Should see parameter values (e.g., `service_name: fractional_cto`)

## Troubleshooting

### No Data Appearing in Real-Time

1. **Check Measurement ID**
   - Verify you replaced ALL instances of `G-XXXXXXXXXX` in all 7 HTML files
   - Measurement ID should match exactly (case-sensitive)

2. **Check Browser Console**
   - Open browser DevTools (F12)
   - Look for JavaScript errors
   - Should NOT see errors about `gtag` or `dataLayer`

3. **Check Network Tab**
   - In DevTools Network tab, filter by "gtag" or "google-analytics"
   - Should see requests to `www.googletagmanager.com` and `www.google-analytics.com`

4. **Disable Ad Blockers**
   - Ad blockers may prevent GA4 from loading
   - Test in incognito mode or with blockers disabled

### Events Not Firing

1. **Check `window.gtag` Availability**
   - Open browser console
   - Type: `typeof gtag`
   - Should return: "function"
   - If "undefined", gtag script didn't load (see "No Data Appearing" above)

2. **Check Event Parameters**
   - Custom events use `if (window.gtag)` checks - graceful degradation
   - Events won't fire if gtag script is blocked, but site will function normally

## Custom Events Reference

For future reference, here are the custom events implemented:

### `form_submit`
- **Triggers:** Contact form submission (contact.html), Campaign download (ai-ceo-brief.html)
- **Parameters:**
  - `form_name`: "contact_form" or "campaign_form"
  - `form_location`: "contact_page" or "ai_ceo_brief"

### `view_service`
- **Triggers:** Service page load (fractional-cto.html, board-advisory.html, growth-advisory.html)
- **Parameters:**
  - `service_name`: "fractional_cto", "board_advisory", or "growth_advisory"

### `cta_click`
- **Triggers:** Click on primary/secondary CTA buttons or contact links
- **Parameters:**
  - `cta_text`: Button text content (e.g., "Schedule a Call", "Get in Touch")
  - `cta_location`: Page title where button was clicked

### `download`
- **Triggers:** Campaign PDF download (ai-ceo-brief.html)
- **Parameters:**
  - `event_category`: "CEO Brief"
  - `event_label`: "AI Transformation Executive Brief"

## Next Steps After Setup

1. **Create Custom Reports** (optional)
   - Go to Explore > Create new exploration
   - Build reports for service page engagement, form conversions, etc.

2. **Set Up Goals/Conversions** (recommended)
   - Go to Admin > Events
   - Mark `form_submit` as a conversion event
   - This will track conversions in GA4 reports

3. **Link to Google Search Console** (recommended)
   - Go to Admin > Product links > Search Console links
   - Link your verified Search Console property
   - Enables search query data in GA4

4. **Update Documentation**
   - Add Measurement ID to CLAUDE.md (see SPEC-015 spec for recommended format)

## Support Resources

- **GA4 Help Center:** https://support.google.com/analytics
- **GA4 Setup Guide:** https://support.google.com/analytics/answer/9304153
- **Event Tracking Guide:** https://developers.google.com/analytics/devguides/collection/ga4/events
- **DebugView Guide:** https://support.google.com/analytics/answer/7201382

---

**Last Updated:** 2026-02-08 (SPEC-015 implementation)
