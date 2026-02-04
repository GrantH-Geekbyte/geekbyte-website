# Pipeline Monitoring

## Alert Thresholds

| Signal | Threshold | Action |
|--------|-----------|--------|
| Spec blocked >48 hours | Any | Resolve or document why |
| Gate review <2 min (Complex+) | Any | Process atrophy flag — re-review with fresh eyes |
| Escape rate >5% (30-day) | Exceeded | Emergency pattern review |
| First-pass rate <70% | 2+ weeks | Root cause analysis |
| >80% Trivial tier | Monthly | Check for under-classification |
| No learning events in 30 days | Monthly | Verify events are being captured |

## Weekly Self-Check (5 minutes)
1. Specs blocked? Why?
2. Escapes this week? Traced back?
3. Gate events worth logging?
4. Unnecessary friction anywhere?

## Monthly Review (30 minutes)
1. Tier distribution
2. Pattern library — add or deprecate?
3. Velocity trend
4. Process friction — simplify anything?
