# Migration Guide: Adding SDD to Your Existing GeekByte Project

## What This Does

Adds the SDD pipeline ON TOP of your existing agents. Nothing gets deleted
or overwritten. Your 12 specialist agents keep working exactly as they do now.

## What Changes

```
BEFORE (your current repo):
geekbyte.biz/
├── .claude/agents/
│   ├── architect-reviewer.md      ← KEEP (no changes)
│   ├── code-reviewer.md           ← KEEP
│   ├── error-detective.md         ← KEEP
│   ├── frontend-developer.md      ← KEEP
│   ├── graphic-artist.md          ← KEEP
│   ├── marketing-copywriter.md    ← KEEP
│   ├── multi-agent-coordinator.md ← KEEP
│   ├── penetration-tester.md      ← KEEP
│   ├── qa-expert.md               ← KEEP
│   ├── test-automator.md          ← KEEP
│   ├── ui-designer.md             ← KEEP
│   └── README.md                  ← KEEP
├── index.html
├── about.html
├── contact.html
├── services/
├── css/
├── js/
└── images/

AFTER (with SDD added):
geekbyte.biz/
├── CLAUDE.md                       ← ADD (project context for all agents)
├── .claude/agents/
│   ├── sdd/                        ← ADD (new subdirectory)
│   │   ├── pm-spec.md
│   │   ├── architect-review.md
│   │   ├── implementer-tester.md
│   │   ├── deployment.md
│   │   └── learning-engine.md
│   ├── architect-reviewer.md       ← KEEP (unchanged)
│   ├── code-reviewer.md            ← KEEP
│   ├── error-detective.md          ← KEEP
│   ├── frontend-developer.md       ← KEEP
│   ├── graphic-artist.md           ← KEEP
│   ├── marketing-copywriter.md     ← KEEP
│   ├── multi-agent-coordinator.md  ← KEEP
│   ├── penetration-tester.md       ← KEEP
│   ├── qa-expert.md                ← KEEP
│   ├── test-automator.md           ← KEEP
│   ├── ui-designer.md              ← KEEP
│   └── README.md                   ← KEEP
├── governance/                     ← ADD
│   ├── solo-operator-model.md
│   ├── tier-selection-guidelines.md
│   ├── escalation-protocols.md
│   └── pipeline-monitoring.md
├── patterns/                       ← ADD
│   ├── spec/
│   ├── architecture/
│   ├── qa/
│   ├── deployment/
│   └── README.md
├── specs/                          ← ADD
│   └── SPEC-001-fix-about-page.md
├── checklists/                     ← ADD (empty, populated per spec)
├── learning/                       ← ADD
│   ├── events/TEMPLATE.md
│   └── escapes/TEMPLATE.md
├── metrics/                        ← ADD
│   └── velocity-baseline.md
├── index.html                      ← KEEP (unchanged)
├── about.html                      ← KEEP
├── contact.html                    ← KEEP
├── services/                       ← KEEP
├── css/                            ← KEEP
├── js/                             ← KEEP
└── images/                         ← KEEP
```

## Step-by-Step Migration

### Step 1: Unzip into your repo root
Unzip the geekbyte-sdd-pipeline.zip contents into your project root.
This creates the new directories and CLAUDE.md alongside your existing files.

### Step 2: Move the SDD agents into place
The zip contains `.claude/agents/sdd/` — copy this entire `sdd/` folder into
your existing `.claude/agents/` directory so it sits alongside your current agents.

### Step 3: Place CLAUDE.md at the repo root
The CLAUDE.md file goes at the root of your project. This is the master context
file that both SDD pipeline agents and your existing specialist agents can reference.

### Step 4: Verify nothing broke
- Your existing agents should still work exactly as before
- The new SDD agents are in their own `sdd/` subdirectory
- No existing files were modified

### Step 5: Fill in TBDs in CLAUDE.md
Confirm or update:
- Hosting provider
- Any CI/CD pipeline details
- Anything else that's project-specific

### Step 6: Run SPEC-001 through the pipeline
This is your first test. Use the SDD pipeline to fix the About page 404.

## If Something Goes Wrong

The migration only ADDS files. It doesn't modify any existing file. If anything
breaks, you can safely delete:
- `.claude/agents/sdd/` (the entire subdirectory)
- `CLAUDE.md`
- `governance/`
- `patterns/`
- `specs/`
- `checklists/`
- `learning/`
- `metrics/`

And you're back to exactly where you started.
