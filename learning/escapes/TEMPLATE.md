# Escape Event Template — Copy and rename to ESC-INC-NNN.md

escape_event:
  incident_id: INC-[ID]
  date_discovered: YYYY-MM-DD
  originated_from_spec: SPEC-[ID]
  description: What happened in production
  impact: Who was affected and how
  gate_that_should_have_caught: [spec | architecture | qa | deployment]
  why_it_escaped:
    - Reason 1
    - Reason 2
  root_cause_category: [spec_gap | pattern_gap | gate_failure | novel_issue]
  remediation:
    immediate_fix: What was done
    pattern_update: Pattern change needed (if any)
    process_update: Process change needed (if any)
