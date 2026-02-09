# Escape Event: SPEC-019 FormData vs JSON Parsing Bug

escape_event:
  incident_id: INC-019-002
  date_discovered: 2026-02-09
  originated_from_spec: SPEC-019
  description: |
    Contact form submitting FormData (multipart/form-data) but serverless function
    expected JSON or URL-encoded data. Vercel's `req.body` parser doesn't automatically
    handle FormData from browser. Resulted in 500 Internal Server Error in production.

    Curl tests with URL-encoded data succeeded, masking the issue. User tested
    in browser and got 500 error. Required updating js/main.js to convert FormData
    to JSON before sending.

  impact: |
    - Contact form broken in production for ~12 hours (deployed 05:19, fixed 16:12)
    - Multiple failed user test attempts
    - User frustration: "still fails. i just dont know why you keep asking me to test it when its not deployed"
    - 4 separate PRs required to fix (PRs #32-35)
    - Time cost: ~90 minutes debugging + multiple deploy cycles

  gate_that_should_have_caught: qa

  why_it_escaped:
    - Testing only done via curl with URL-encoded data, not browser FormData
    - No browser-based test in QA checklist before production deployment
    - Asked user to test multiple times before verifying deployment succeeded
    - Did not verify actual browser behavior matched curl behavior
    - Playwright tests mock the endpoint, so didn't catch real API behavior

  root_cause_category: gate_failure

  remediation:
    immediate_fix: |
      Updated js/main.js to convert FormData to JSON:
      ```javascript
      const formData = new FormData(contactForm);
      const jsonData = Object.fromEntries(formData.entries());
      fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      ```
      Deployed in PR #35, verified working in production.

    pattern_update: |
      Updated contact form pattern:
      - ALWAYS convert FormData to JSON before sending to serverless functions
      - Document in api/contact.js comments why JSON is used
      - Add JSDoc to explain FormData conversion

    process_update: |
      Updated QA Gate requirements:
      - MANDATORY: Test in actual browser (not just curl) before marking QA complete
      - Add to .claude/qa-checklist.md: "Test form submission in browser before production"
      - Verify deployment completed BEFORE asking user to test
      - Use `curl` to verify API endpoint, THEN ask user to test in browser
      - For forms: Test with both curl AND browser-based submission

  learning:
    - Curl tests don't catch all issues - browser behavior can differ
    - FormData vs JSON is a common gotcha with serverless functions
    - Never ask user to test before verifying deployment succeeded
    - Playwright mocks hide real API integration issues
    - Need both unit tests (mocked) AND integration tests (real API)

  time_cost: ~90 minutes debugging + 4 PR cycles + user frustration

  prevention_checklist:
    - [ ] Curl test passes with actual API endpoint
    - [ ] Browser test completed before asking user to test
    - [ ] Deployment verified complete via Vercel dashboard
    - [ ] For forms: Test both automated (Playwright) and manual (browser)
    - [ ] Check Content-Type headers match what API expects
