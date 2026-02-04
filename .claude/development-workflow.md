# Geekbyte Development Workflow

## Mandatory Process for All Changes

This document defines the required workflow for all changes to the Geekbyte website. Following this process ensures quality, consistency, and proper review before deployment.

---

## Content Creation & Updates

### Rule: All Marketing Content MUST Go Through marketing-copywriter Agent

Any content intended for public-facing pages (landing pages, campaigns, homepage, service pages, etc.) must be reviewed and optimized by the marketing-copywriter agent.

**This includes:**
- Headlines and titles
- Taglines and value propositions
- Call-to-action (CTA) text
- Landing page copy
- Service descriptions
- Meta descriptions and OG tags
- Email copy
- Social media preview text

**Process:**

1. **Draft Content** (optional)
   - You may draft initial content yourself

2. **Marketing Review** (required)
   ```
   Task: marketing-copywriter agent
   Prompt: "Review and optimize this [headline/landing page/CTA] for [target audience].
           Current content: [paste content]
           Goal: [conversion goal]"
   ```

3. **Implementation**
   - Use the copywriter's recommendations
   - Implement the optimized content

4. **QA** (see below)
   - Verify content displays correctly
   - Check meta tags
   - Test on mobile

**Why this matters:**
- Marketing copy directly impacts conversion rates
- Professional copywriting improves clarity and persuasiveness
- Consistent brand voice across all touchpoints
- Better SEO and social media performance

---

## Quality Assurance (QA) Process

### Rule: ALL Changes Must Be QA'd Before Commit

No exceptions. Every change must pass through the QA checklist before `git commit`.

**QA Checklist Location:** `.claude/qa-checklist.md`

**Minimum QA Requirements:**

### For Content/Copy Changes:
- [ ] Spelling and grammar verified
- [ ] Links tested (internal and external)
- [ ] Meta tags updated (title, description, OG tags)
- [ ] Mobile responsive display checked
- [ ] Accessibility (headings, alt text)

### For Form Changes:
- [ ] Form submission tested
- [ ] Validation working (required fields, email format)
- [ ] Error handling working
- [ ] Success message displays
- [ ] Data actually received (check Formspree dashboard)

### For Visual/Design Changes:
- [ ] Mobile responsive (test at 768px, 375px)
- [ ] All breakpoints working
- [ ] Images loading
- [ ] No layout breaks
- [ ] CSS variables defined

### For All Changes:
- [ ] No console errors
- [ ] Assets load correctly
- [ ] Links resolve
- [ ] Cross-browser compatibility (if applicable)

**Process:**

1. **Make Changes** - Implement your feature/fix

2. **Run QA Checklist** - Go through every relevant item in `.claude/qa-checklist.md`

3. **Document Results** - Note what was tested in commit message

4. **Only Then Commit** - No commits without QA

**Example Commit Message with QA:**
```
Update campaign title to include "AI" for clarity

- Changed "Fighter Jets" to "AI Fighter Jets"
- Updated title tag and OG tags
- QA: Verified meta tags, tested mobile responsive, checked link preview

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## Full Feature Development Workflow

For adding new features or pages, follow this complete workflow:

### 1. Planning Phase
- Define requirements clearly
- Identify which agents will be needed
- Outline expected deliverables

### 2. Content Phase (if applicable)
**Agent:** marketing-copywriter

**For:** Headlines, CTAs, value propositions, landing page copy

**Deliverable:** Conversion-optimized copy with variations

### 3. Design Phase (if applicable)
**Agent:** ui-designer or graphic-artist

**For:** Visual layout, components, brand assets

**Deliverable:** Design specs, mockups, component breakdown

### 4. Implementation Phase
**Agent:** frontend-developer (or manual implementation)

**For:** Building the actual feature

**Deliverable:** Working code, integrated components

### 5. Code Review Phase (for complex features)
**Agent:** code-reviewer

**For:** Security, performance, code quality

**Deliverable:** Review report with recommendations

### 6. Fix Phase (if needed)
**Agent:** frontend-developer

**For:** Addressing issues from code review

**Deliverable:** Updated, improved code

### 7. QA Phase (MANDATORY)
**Person:** You (following qa-checklist.md)

**For:** Verifying everything works

**Deliverable:** Completed QA checklist

### 8. Commit & Push
**Only after QA passes**

---

## Campaign Landing Page Workflow

Special workflow for campaign pages (most common use case):

```
┌─────────────────────────────────────────────┐
│ 1. Draft Content                            │
│    - Outline key points                     │
│    - Identify target audience               │
│    - Define conversion goal                 │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ 2. Marketing Copywriter Review (REQUIRED)  │
│    Agent: marketing-copywriter              │
│    - Optimize headline                      │
│    - Improve value propositions             │
│    - Strengthen CTAs                        │
│    - Create meta descriptions               │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ 3. Implementation                           │
│    - Create HTML with optimized copy       │
│    - Style for conversion                   │
│    - Add form integration                   │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ 4. QA (REQUIRED)                            │
│    - Test form submission                   │
│    - Verify meta tags                       │
│    - Check mobile responsive                │
│    - Validate links                         │
│    - Test LinkedIn preview                  │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ 5. Commit & Push                            │
│    - Document QA in commit message          │
│    - Push to production                     │
└─────────────────────────────────────────────┘
```

---

## Common Mistakes to Avoid

### ❌ DON'T:
- Skip the marketing-copywriter for "small" content changes
- Commit without running QA checklist
- Assume content is "good enough" without professional review
- Push to production without testing
- Forget to update meta tags when changing page titles
- Skip mobile testing

### ✅ DO:
- Always use marketing-copywriter for public-facing content
- Complete full QA checklist before every commit
- Test forms end-to-end (submit and verify receipt)
- Check LinkedIn/social previews before announcing
- Document QA steps in commit messages
- Test on mobile devices or responsive mode

---

## Exceptions & Edge Cases

### When can you skip marketing-copywriter?
- Internal documentation (this file, README files)
- Code comments
- Git commit messages
- Configuration files
- Bug fix copy that doesn't change user-facing messaging

### When can you skip parts of QA?
- Never. Run the full checklist appropriate to your change type.
- If a section doesn't apply (e.g., no forms in your change), mark it N/A.

---

## Process Violations

If you realize you skipped a step:

1. **Stop** - Don't continue with next steps
2. **Go back** - Complete the missed step
3. **Re-verify** - Run QA again if needed
4. **Amend or new commit** - Fix properly

**Example:**
```
"I just committed content without marketing review"

1. Create new branch
2. Run marketing-copywriter agent
3. Implement their suggestions
4. Run QA checklist
5. Commit properly with QA documentation
```

---

## Success Criteria

You're following the workflow correctly when:

✓ All public content has been reviewed by marketing-copywriter
✓ Every commit includes QA notes
✓ No production bugs from skipped testing
✓ Forms always work on first deploy
✓ Social media previews always look correct
✓ Mobile experience is consistently good

---

## Quick Reference

**Before writing any content:**
→ Will users see this? → YES → Use marketing-copywriter agent

**Before every commit:**
→ Open `.claude/qa-checklist.md`
→ Complete relevant sections
→ Document in commit message

**Before every push:**
→ Ask: "Did I run QA?"
→ If no: Stop and run QA
→ If yes: Proceed with push

---

## Questions?

- **"Is this content public-facing?"** - If users/customers see it, yes.
- **"Do I really need QA for this tiny change?"** - Yes. Tiny changes cause bugs too.
- **"Can I batch QA multiple changes?"** - No. QA each change separately before committing.
- **"What if I'm in a hurry?"** - This process IS the fast way. Skipping creates more work.

