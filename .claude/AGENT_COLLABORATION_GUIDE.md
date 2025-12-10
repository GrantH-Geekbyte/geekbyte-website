# Agent Collaboration Guide

## Introduction

This guide explains how to effectively use and coordinate the specialized agents in your Claude Code workspace. Each agent brings unique expertise, and understanding how they work together will help you deliver better results faster.

## Your Agent Team

### Design & Frontend
- **ui-designer** - Creates beautiful, accessible user interfaces and design systems
- **graphic-artist** - Visual design including color palettes, typography, icons, imagery, and brand visual identity
- **frontend-developer** - Builds robust React/Vue/Angular components with TypeScript

### Quality & Testing
- **qa-expert** - Comprehensive quality assurance, test strategy, and automation
- **test-automator** - Test automation engineering, CI/CD integration, and framework development
- **code-reviewer** - Code quality, security vulnerabilities, and best practices
- **error-detective** - Complex error analysis, pattern detection, and root cause discovery

### Security & Architecture
- **penetration-tester** - Ethical hacking, vulnerability assessment, and security testing
- **architect-reviewer** - System design validation, scalability, and architectural patterns

### Marketing & Content
- **marketing-copywriter** - Persuasive, conversion-focused marketing copy for tech businesses (headlines, CTAs, landing pages, brand messaging)

### Coordination & Orchestration
- **multi-agent-coordinator** - Complex workflow orchestration, inter-agent communication, and distributed system coordination

---

## How to Invoke Agents

Use the Task tool to invoke any agent:

```
I need the ui-designer to create a modern contact form design
```

Or for multiple agents in sequence:
```
I need the ui-designer to design a dashboard, then frontend-developer to implement it
```

---

## Common Workflows

### 1. New Feature Development

**Flow**: ui-designer → frontend-developer → code-reviewer → qa-expert

**Example**: "Add a new product gallery to the website"

```
Step 1: "ui-designer, create a responsive product gallery design"
→ Delivers: Design mockups, component specs, accessibility notes

Step 2: "frontend-developer, implement the product gallery from the design"
→ Delivers: React components, TypeScript interfaces, responsive CSS

Step 3: "code-reviewer, review the product gallery implementation"
→ Delivers: Security audit, code quality feedback, performance suggestions

Step 4: "qa-expert, create comprehensive tests for the product gallery"
→ Delivers: Test cases, automation scripts, quality metrics
```

### 2. Bug Investigation & Fix

**Flow**: error-detective → frontend-developer → qa-expert

**Example**: "Users reporting form submission errors"

```
Step 1: "error-detective, analyze form submission errors in the logs"
→ Delivers: Error patterns, root cause analysis, correlation data

Step 2: "frontend-developer, fix the form submission issues identified"
→ Delivers: Code fixes, improved error handling, validation updates

Step 3: "qa-expert, verify the fix and create regression tests"
→ Delivers: Test validation, regression suite, quality confirmation
```

### 3. Security Audit & Hardening

**Flow**: penetration-tester → code-reviewer → frontend-developer

**Example**: "Ensure our authentication is secure"

```
Step 1: "penetration-tester, audit our authentication system"
→ Delivers: Vulnerability assessment, exploit validation, remediation plan

Step 2: "code-reviewer, review authentication code for security issues"
→ Delivers: Code-level security analysis, OWASP compliance check

Step 3: "frontend-developer, implement security improvements"
→ Delivers: Hardened code, secure patterns, updated components
```

### 4. Performance Optimization

**Flow**: error-detective → frontend-developer → qa-expert

**Example**: "Website loading slowly"

```
Step 1: "error-detective, identify performance bottlenecks"
→ Delivers: Performance analysis, bottleneck identification, metrics

Step 2: "frontend-developer, optimize based on findings"
→ Delivers: Optimized components, lazy loading, code splitting

Step 3: "qa-expert, validate performance improvements"
→ Delivers: Performance tests, benchmarks, quality metrics
```

### 5. Design System Creation

**Flow**: ui-designer → frontend-developer → code-reviewer → qa-expert

**Example**: "Build a consistent design system"

```
Step 1: "ui-designer, create a comprehensive design system"
→ Delivers: Component library, design tokens, style guide

Step 2: "frontend-developer, implement the design system components"
→ Delivers: Reusable components, theme system, documentation

Step 3: "code-reviewer, review design system implementation"
→ Delivers: Code quality assessment, consistency check, best practices

Step 4: "qa-expert, create component testing strategy"
→ Delivers: Visual regression tests, accessibility tests, documentation
```

### 6. Architecture Review

**Flow**: architect-reviewer → code-reviewer → frontend-developer

**Example**: "Plan scalable architecture for new features"

```
Step 1: "architect-reviewer, evaluate our frontend architecture"
→ Delivers: Architecture assessment, scalability analysis, recommendations

Step 2: "code-reviewer, audit current code against architecture standards"
→ Delivers: Technical debt analysis, refactoring priorities

Step 3: "frontend-developer, implement architectural improvements"
→ Delivers: Refactored code, improved patterns, updated structure
```

### 7. Marketing & Landing Page Creation

**Flow**: marketing-copywriter → graphic-artist → ui-designer → frontend-developer → qa-expert

**Example**: "Create a high-converting landing page for our new service"

```
Step 1: "marketing-copywriter, create compelling copy for the landing page"
→ Delivers: Headlines, value propositions, CTAs, body copy with variations

Step 2: "graphic-artist, create visual assets and design direction"
→ Delivers: Color palette, typography, icons, hero imagery, visual style guide

Step 3: "ui-designer, design the landing page using copy and visual assets"
→ Delivers: Visual design, layout, component specs with copy placement

Step 4: "frontend-developer, implement the landing page"
→ Delivers: Responsive components, animations, form integration

Step 5: "qa-expert, test the landing page for functionality and accessibility"
→ Delivers: Test results, accessibility audit, performance metrics
```

### 8. Brand Visual Identity Creation

**Flow**: graphic-artist → ui-designer → frontend-developer → code-reviewer

**Example**: "Establish a cohesive visual identity for the website"

```
Step 1: "graphic-artist, create comprehensive visual identity system"
→ Delivers: Color palette, typography system, icon style, imagery direction

Step 2: "ui-designer, translate visual identity into UI components"
→ Delivers: Design tokens, component library specs, style guide

Step 3: "frontend-developer, implement the design system"
→ Delivers: CSS custom properties, component styles, responsive implementation

Step 4: "code-reviewer, review for consistency and best practices"
→ Delivers: Code quality feedback, accessibility compliance check
```

### 9. Website Content Refresh

**Flow**: marketing-copywriter → code-reviewer → frontend-developer

**Example**: "Update homepage messaging to better communicate our value"

```
Step 1: "marketing-copywriter, rewrite homepage copy for better conversion"
→ Delivers: Updated headlines, taglines, CTAs, testimonial positioning

Step 2: "code-reviewer, review current content implementation"
→ Delivers: Content structure analysis, SEO considerations

Step 3: "frontend-developer, implement the new content"
→ Delivers: Updated HTML, proper heading hierarchy, structured data
```

### 10. Complex Multi-Agent Project

**Flow**: multi-agent-coordinator → (parallel agents) → qa-expert

**Example**: "Complete website overhaul requiring multiple specialists"

```
Step 1: "multi-agent-coordinator, plan the workflow for website redesign"
→ Delivers: Workflow plan, agent assignments, dependency graph, timeline

Step 2: Execute parallel workstreams:
   - "marketing-copywriter, create all new website copy"
   - "ui-designer, create new design system"
   - "architect-reviewer, plan technical architecture"
→ Delivers: Copy deck, design specs, architecture plan

Step 3: "frontend-developer, implement based on all inputs"
→ Delivers: Complete implementation

Step 4: "qa-expert, comprehensive testing of entire site"
→ Delivers: Full test suite, quality certification
```

---

## Agent Collaboration Matrix

This matrix shows which agents work best together:

| Primary Agent | Best Paired With | Purpose |
|---------------|------------------|---------|
| graphic-artist | ui-designer | Visual Identity → UI Design |
| graphic-artist | marketing-copywriter | Visual Assets → Marketing Materials |
| graphic-artist | frontend-developer | Design Specs → Implementation |
| ui-designer | frontend-developer | Design → Implementation |
| frontend-developer | code-reviewer | Implementation → Quality Check |
| code-reviewer | qa-expert | Code Quality → Testing |
| qa-expert | error-detective | Testing → Bug Analysis |
| qa-expert | test-automator | Manual Testing → Automation |
| error-detective | frontend-developer | Bug Analysis → Fixes |
| penetration-tester | code-reviewer | Security Testing → Code Security |
| architect-reviewer | code-reviewer | Architecture → Code Standards |
| architect-reviewer | frontend-developer | Architecture → Implementation |
| marketing-copywriter | ui-designer | Copy → Visual Design |
| marketing-copywriter | frontend-developer | Copy → Implementation |
| multi-agent-coordinator | all agents | Workflow Planning → Parallel Execution |
| test-automator | qa-expert | Framework Setup → Test Strategy |

---

## Best Practices

### 1. **Start with Context**
Give agents clear context about what you're trying to achieve:

**Good**: "ui-designer, create a mobile-friendly contact form for our B2B website with fields for company name, email, and message"

**Poor**: "ui-designer, make a form"

### 2. **Sequential vs. Parallel**
- **Sequential**: When one agent needs output from another
  ```
  ui-designer designs → frontend-developer implements → qa-expert tests
  ```

- **Parallel**: When agents can work independently
  ```
  qa-expert reviews tests + code-reviewer audits security (simultaneously)
  ```

### 3. **Provide Agent Outputs**
When moving between agents, reference previous work:
```
"frontend-developer, implement this contact form. The ui-designer created
specs in /designs/contact-form-specs.md"
```

### 4. **Be Specific About Scope**
Help agents focus:
- "Review only the authentication module"
- "Focus on mobile responsiveness"
- "Prioritize security over performance"

### 5. **Iterate Based on Feedback**
Agents often provide recommendations - use them:
```
code-reviewer identifies 3 security issues
→ frontend-developer fixes those specific issues
→ code-reviewer validates the fixes
```

---

## Common Scenarios & Solutions

### "I need to add a new page to the website"

**Recommended Flow**:
1. **ui-designer**: Design the page layout and components
2. **frontend-developer**: Implement the page
3. **code-reviewer**: Review code quality and security
4. **qa-expert**: Test functionality and accessibility

### "Users are experiencing errors"

**Recommended Flow**:
1. **error-detective**: Analyze error patterns and find root cause
2. **frontend-developer**: Implement fixes
3. **qa-expert**: Verify fix and add regression tests

### "Is our website secure?"

**Recommended Flow**:
1. **penetration-tester**: Conduct security assessment
2. **code-reviewer**: Review code for vulnerabilities
3. **frontend-developer**: Implement security improvements
4. **qa-expert**: Validate security measures

### "We need better performance"

**Recommended Flow**:
1. **error-detective**: Identify performance bottlenecks
2. **frontend-developer**: Optimize code and assets
3. **qa-expert**: Benchmark and validate improvements

### "Planning a major redesign"

**Recommended Flow**:
1. **architect-reviewer**: Evaluate current architecture
2. **ui-designer**: Create new design system
3. **frontend-developer**: Implement redesign
4. **code-reviewer**: Ensure code quality
5. **qa-expert**: Comprehensive testing

### "We need better marketing copy"

**Recommended Flow**:
1. **marketing-copywriter**: Audit existing copy and create new messaging
2. **ui-designer**: Adjust designs to highlight new copy
3. **frontend-developer**: Implement content updates
4. **qa-expert**: Verify display and accessibility

### "Large project with multiple workstreams"

**Recommended Flow**:
1. **multi-agent-coordinator**: Plan workflow and agent assignments
2. **Execute parallel workstreams** (design, copy, architecture)
3. **frontend-developer**: Integrate all outputs
4. **qa-expert**: Comprehensive testing

### "Need automated testing for CI/CD"

**Recommended Flow**:
1. **qa-expert**: Define test strategy and requirements
2. **test-automator**: Build automation framework
3. **code-reviewer**: Review test code quality
4. **qa-expert**: Validate coverage and effectiveness

---

## Agent Communication Tips

### What Agents Need to Know

**graphic-artist** needs:
- Brand guidelines (if existing)
- Target audience and preferences
- Mood/style direction (modern, playful, corporate, etc.)
- Color preferences or restrictions
- Output format requirements
- Platform specifications (web, print, social)

**ui-designer** needs:
- Target audience
- Brand guidelines
- Accessibility requirements
- Device/browser support

**frontend-developer** needs:
- Design specifications
- API contracts
- Browser/device targets
- Performance requirements

**code-reviewer** needs:
- Review scope
- Priority areas (security, performance, etc.)
- Coding standards
- Compliance requirements

**qa-expert** needs:
- Features to test
- Acceptance criteria
- Test environment details
- Quality standards

**error-detective** needs:
- Error descriptions
- Log file locations
- System architecture
- Recent changes

**penetration-tester** needs:
- Scope and authorization
- Target systems
- Testing constraints
- Compliance requirements

**architect-reviewer** needs:
- System requirements
- Scale expectations
- Technology constraints
- Business goals

**marketing-copywriter** needs:
- Target audience and personas
- Product/service details
- Brand voice guidelines
- Desired action (CTA goal)
- Competitive positioning
- Customer pain points

**multi-agent-coordinator** needs:
- Project scope and requirements
- Available agents and their capabilities
- Dependencies between tasks
- Priority order
- Timeline constraints (if any)
- Resource limitations

**test-automator** needs:
- Test framework preferences
- CI/CD pipeline details
- Coverage requirements
- Browser/device targets
- Performance thresholds

---

## Troubleshooting Agent Collaboration

### Problem: "Agent doesn't have enough context"
**Solution**: Provide more background information about your project, existing code, and specific requirements.

### Problem: "Agents are duplicating work"
**Solution**: Clearly define each agent's scope and reference previous agent outputs.

### Problem: "Not sure which agent to use"
**Solution**: Start with the agent closest to your need:
- Visual identity/branding/assets → **graphic-artist**
- UI/UX design → **ui-designer**
- Code implementation → **frontend-developer**
- Code problems → **code-reviewer** or **error-detective**
- Testing strategy → **qa-expert**
- Test automation → **test-automator**
- Security → **penetration-tester**
- Architecture → **architect-reviewer**
- Marketing copy → **marketing-copywriter**
- Complex multi-agent projects → **multi-agent-coordinator**

### Problem: "Agent recommendations conflict"
**Solution**: Use **architect-reviewer** to make final architectural decisions, or ask for clarification on trade-offs.

---

## Quick Reference Commands

### Design & Build
```
"graphic-artist, create [color palette/typography/icons/visual assets] for [project/page]"
"graphic-artist, establish visual identity for [brand/website]"
"ui-designer, create a [component] design with [requirements]"
"frontend-developer, implement [feature] with [specifications]"
```

### Review & Quality
```
"code-reviewer, review [files/feature] focusing on [security/performance/quality]"
"qa-expert, create tests for [feature]"
"test-automator, build automated test suite for [feature/component]"
```

### Debug & Fix
```
"error-detective, analyze [error/issue] in [system/logs]"
"frontend-developer, fix [specific issue]"
```

### Security & Architecture
```
"penetration-tester, assess security of [feature/system]"
"architect-reviewer, evaluate [architecture/design decisions]"
```

### Marketing & Content
```
"marketing-copywriter, write [headlines/CTAs/landing page copy] for [product/service]"
"marketing-copywriter, create value proposition for [target audience]"
"marketing-copywriter, rewrite [page/section] for better conversion"
```

### Coordination
```
"multi-agent-coordinator, plan workflow for [complex project]"
"multi-agent-coordinator, orchestrate parallel execution of [tasks]"
"multi-agent-coordinator, manage dependencies between [agents/tasks]"
```

---

## Tips for Maximum Efficiency

1. **Plan your workflow** - Think about which agents you'll need before starting
2. **Keep agents informed** - Share relevant files, designs, and previous agent outputs
3. **Iterate in cycles** - Design → Build → Review → Test → Refine
4. **Document decisions** - Keep track of agent recommendations and decisions made
5. **Learn from patterns** - Notice which agent combinations work best for your projects

---

## Example: Complete Feature Development

**Task**: "Add a user profile page with avatar upload"

### Step-by-Step Workflow

```markdown
1. DESIGN PHASE
   Agent: ui-designer
   Request: "Create a user profile page design with avatar upload,
            name, email, and bio fields. Make it mobile-friendly."
   Output: Design specs, component breakdown, accessibility notes

2. IMPLEMENTATION PHASE
   Agent: frontend-developer
   Request: "Implement the user profile page based on ui-designer's specs.
            Use React with TypeScript."
   Output: React components, API integration, responsive layout

3. CODE REVIEW PHASE
   Agent: code-reviewer
   Request: "Review the user profile implementation focusing on security
            (especially file upload) and code quality."
   Output: Security recommendations, code quality feedback, refactoring suggestions

4. FIX & IMPROVE PHASE
   Agent: frontend-developer
   Request: "Address the security and quality issues identified by code-reviewer."
   Output: Updated code with security improvements

5. TESTING PHASE
   Agent: qa-expert
   Request: "Create comprehensive tests for the user profile page including
            file upload validation and accessibility."
   Output: Test suite, automation scripts, quality report

6. SECURITY VALIDATION
   Agent: penetration-tester
   Request: "Test the avatar upload feature for security vulnerabilities."
   Output: Security assessment, vulnerability report (if any), recommendations
```

---

## Conclusion

Effective agent collaboration is about:
- **Understanding each agent's strengths**
- **Planning logical workflows**
- **Providing clear context**
- **Iterating based on feedback**
- **Building quality into every step**

By following these patterns and best practices, you'll create better software faster while maintaining high quality, security, and user experience standards.

---

## Questions?

If you're unsure which agent to use or how to structure a workflow, just ask! Claude can help you plan the right agent sequence for any task.
