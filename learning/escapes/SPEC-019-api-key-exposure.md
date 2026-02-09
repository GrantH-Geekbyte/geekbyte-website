# Escape Event: SPEC-019 API Key Exposure in Conversation

escape_event:
  incident_id: INC-019-003
  date_discovered: 2026-02-09
  originated_from_spec: SPEC-019
  description: |
    User posted Resend API key directly in conversation when asked about
    environment variables. Key was exposed in conversation history.

    Sequence:
    1. AI asked: "Do you have the RESEND_API_KEY?"
    2. User posted: "re_ccCwKVAX_2SqMSis4N1rZ8HUj2np2JJ8V"
    3. AI warned about exposure AFTER key was already shared
    4. User revoked old key and created new one

  impact: |
    - Resend API key exposed in conversation (revoked immediately)
    - 15 minutes to revoke and regenerate key
    - Low security impact (internal email tool, not customer-facing)
    - Could have been worse if key had broader permissions

  gate_that_should_have_caught: spec

  why_it_escaped:
    - No proactive warning about API key security BEFORE asking user
    - User naturally assumed they should provide the key when asked
    - Conversation context didn't emphasize "set it in Vercel, don't share it here"
    - Security warning came AFTER exposure, not before

  root_cause_category: process_gap

  remediation:
    immediate_fix: |
      - Warned user about exposure immediately
      - User revoked API key via Resend dashboard
      - User created new API key
      - New key set in Vercel environment variables
      - Old key invalidated

    pattern_update: |
      Updated API key handling pattern:
      - NEVER ask user to provide API keys directly
      - Always instruct: "Set it in Vercel Environment Variables"
      - Provide step-by-step without asking for the value
      - If user shares key, warn immediately and instruct to revoke

    process_update: |
      Updated Spec Writing requirements:
      - When spec involves API keys, include security warning in spec
      - Add to api/README.md: "Never share API keys in conversations"
      - Create .env.example with placeholder values, never real keys
      - Update PM-Spec agent to proactively warn about API key security

  learning:
    - Always warn about API key security BEFORE asking about them
    - Frame questions as "Have you set it in Vercel?" not "What is it?"
    - Users will naturally share secrets if you ask - don't ask
    - Security guidance should be proactive, not reactive
    - Even internal-only keys should be treated as sensitive

  time_cost: ~15 minutes (revoke, regenerate, re-configure)

  prevention_checklist:
    - [ ] Spec includes security warning about API keys
    - [ ] Documentation shows placeholder values, never real keys
    - [ ] Instructions say "set in environment variables" not "provide the key"
    - [ ] Proactive security warning before any key-related questions
    - [ ] .env.example created with clear placeholders
