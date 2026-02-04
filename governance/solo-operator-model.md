# Solo Operator Gate Model — GeekByte Website

## The Problem

SDD v3.0 states: "Gate owners cannot approve their own specs (no self-review)."
When one person (Grant) is the PM, architect, developer, QA, and ops lead, every
gate is a self-review.

## The Solution: Specialist Agents as Structured Reviewers

This project has 12 specialist agents that provide deep domain expertise. These
agents serve as the "second eyes" at each gate, producing structured reviews that
Grant then applies human judgment to.

The two-step process at each gate:

1. **SDD pipeline agent orchestrates a structured review** — invoking specialist
   agents to evaluate the artifact against patterns, checklists, and the spec.
   This surfaces concerns, gaps, and questions that a solo reviewer might miss.

2. **Grant provides documented human judgment** — reviewing the agents' output
   and making the approval decision with written reasoning. The discipline:
   Grant must respond to each concern raised, even if the response is
   "acknowledged, accepted because [reason]."

## Gate Assignments

| Gate | SDD Pipeline Agent | Specialist Agents Invoked | Grant's Role |
|------|-------------------|--------------------------|-------------|
| Spec Approval | sdd/pm-spec | marketing-copywriter (content specs) | Confirm business intent, approve tier |
| Architecture Review | sdd/architect-review | architect-reviewer, penetration-tester | Review risks, confirm feasibility |
| QA Verification | sdd/implementer-tester | frontend-developer, qa-expert, test-automator, code-reviewer | Verify test adequacy, manual checks |
| Deployment Auth | sdd/deployment | (none currently) | Authorize release, confirm rollback |

## Evidence of Engagement

The key discipline: Grant's approval must include specific responses to
agent-raised concerns. This is not a rubber stamp.

| Tier | Evidence Required |
|------|-------------------|
| Trivial | One-line rationale in commit message |
| Standard | Documented responses to agent concerns (inline in spec or checklist) |
| Complex | Full written responses to all agent concerns |
| Critical | Full responses + 24-hour waiting period + external second reviewer |

## When to Get External Review

Mandatory:
- Any Critical tier spec (payments, auth, PII)
- First implementation of a new architectural pattern
- Annual pipeline audit

Recommended:
- Any spec where Grant is uncertain after agent review
- Major framework or platform decisions

## Process Atrophy Prevention

- **Weekly self-audit:** Re-read one past approval. Would it convince a skeptic?
- **Escape accountability:** Trace production issues back through the pipeline honestly
- **Tier discipline:** Track distribution monthly. >80% Trivial = something's wrong
- **Learning events still happen:** Gate modifications get logged even solo
