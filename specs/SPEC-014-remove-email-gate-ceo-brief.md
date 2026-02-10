# Feature Specification

**spec_id:** SPEC-014
**title:** Remove Email Gate from CEO Brief Campaign Page
**version:** 1.0
**status:** draft
**complexity_tier:** standard

## Business Context

**requester:** Grant Howe, Managing Partner
**business_goal:** Remove lead capture friction from CEO Brief campaign page. Current email gate creates barrier to content distribution. Decision to prioritize thought leadership reach over email list growth at this stage.
**success_metrics:**
- Broader distribution of CEO Brief content
- Easier sharing with prospects
- Reduced download friction

**priority:** P2 (marketing optimization, non-urgent)

## Requirements

### Functional Requirements

**FR-1:** Remove email capture form elements from `/campaigns/ai-ceo-brief.html`:
- Name field
- Email field
- Company field
- Role dropdown
- Quarterly insights checkbox
- "Get the Brief Now" submit button

**FR-2:** Replace form with direct download button:
- "Download Now" button in same visual location
- Direct link to CEO Brief PDF (no email required)
- Maintains GeekByte brand styling and visual prominence

**FR-3:** Update "Get Your Copy Now" section copy:
- Remove "Enter your details below and get immediate access"
- Remove "No sales pitch. No follow-up calls."
- Keep "Just battle-tested insights from 4 PE exits and 27+ portfolio transformations"
- Simplified call-to-action focused on download action

**FR-4:** Remove form disclaimer text:
- Remove "Your information is never shared or sold..." paragraph

**FR-5:** Preserve all other page content:
- Page structure and layout
- Headline and subheadline
- "What's Inside This Brief" section with all bullet points
- Header/footer/navigation
- Credentials badges (4 exits, 27+ M&A, CTO/SVP)

### Non-Functional Requirements

**NFR-1:** PDF hosted in publicly accessible location
**NFR-2:** Download button maintains GeekByte brand styling and visual hierarchy
**NFR-3:** Page remains responsive across mobile/tablet/desktop
**NFR-4:** No broken links or console errors after form removal

## Acceptance Criteria

**AC-1:** Given the CEO Brief campaign page, when a user visits `/campaigns/ai-ceo-brief.html`, then no email capture form is present

**AC-2:** Given the CEO Brief campaign page, when a user clicks "Download Now" button, then the CEO Brief PDF downloads directly or opens in browser (no email required)

**AC-3:** Given the "Get Your Copy Now" section, when copy is reviewed, then messaging focuses on download action without references to email submission or data privacy

**AC-4:** Given the CEO Brief campaign page, when content is reviewed, then all page content outside the form area is preserved (headline, What's Inside section, credentials)

**AC-5:** Given the CEO Brief campaign page, when accessed on mobile/tablet/desktop, then layout is fully responsive and download button is prominent

## Scope

### In Scope
- Remove email capture form
- Replace with "Download Now" button
- Update "Get Your Copy Now" section messaging
- Ensure PDF is publicly accessible
- Test download functionality across browsers

### Out of Scope
- Analytics/tracking implementation (handled in SPEC-016)
- Redesign of page layout or visual hierarchy
- A/B testing of button placement or copy variants
- Email list migration or cleanup
- CEO Brief PDF content updates

## Dependencies

**DEP-1:** CEO Brief PDF (already hosted on site - implementation will locate and link)
**DEP-2:** Existing campaign page: `/campaigns/ai-ceo-brief.html`

## Tier Justification

**rationale:** Standard tier selected for functional change to existing marketing page. Limited scope (remove form, add download button), moderate business impact (changes lead generation approach). No architectural complexity, no data changes, straightforward implementation.

**escalation_triggers_checked:**
- Authentication/authorization: N/A
- Payment/financial data: N/A
- PII/PHI: N/A (removing PII collection)
- External integration: N/A (removing form integration)
- Database schema change: N/A
- Core domain model: N/A
