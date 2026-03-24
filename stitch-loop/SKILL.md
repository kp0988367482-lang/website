---
name: stitch-loop
description: An autonomous "baton-passing" loop pattern for building websites iteratively using Stitch.
---

# Stitch Build Loop Skill

This skill teaches agents how to iteratively build a website using Stitch by following an autonomous loop pattern.

## Always Rules (Non-Negotiable)

These rules apply to every iteration.

1. Keep web design concerns in `DESIGN.md` and keep organization structure concerns out of design decisions.
2. Use `SITE.md` only for sitemap, page sequencing, and roadmap status.
3. Do not overwrite existing pages unless the baton explicitly requests a revision.
4. Require a checkable acceptance result before handoff.
5. End each handoff with exactly 3 candidate next steps/questions for the next iteration.
6. For page-level design review and validation, apply `skills/web-design-workflow/SKILL.md` as the execution wrapper.

## The Baton System

The loop is managed by a "baton" file named `next-prompt.md`. This file contains the instructions for the NEXT agent in the loop.

### Baton File Format (`next-prompt.md`)

```markdown
---
page: <filename-without-extension>
---
<Full Stitch Prompt>
```

## Execution Protocol

Follow these steps for every iteration in the loop:

1.  **Read the Baton**: Look for `next-prompt.md` in the root directory. Extract the `page` name and the prompt.
2.  **Verify Context**:
	- For visual/page design decisions, use `DESIGN.md` as the primary source of truth.
	- Use `SITE.md` only for page order, sitemap placement, and roadmap sequencing.
	- Do not pull company department hierarchy or org content into design decisions.
3.  **Generate Screen**: Call `generate_screen_from_text` using the prompt and the project ID from `STITCH.md`.
4.  **Export/Integrate**: Save the resulting HTML to the `site/` or `stitch_assets/` directory.
5.  **Update Site Map**: Add the new page to the sitemap in `SITE.md`.
6.  **Next Baton**: Generate a prompt for the *next* page on the roadmap and write it to `next-prompt.md`.
7.  **Hand Off**: Inform the user that the iteration is complete and the next task is ready in `next-prompt.md`.

## Gate Checklist (Must Pass In Order)

Use this gate flow for every loop run.

### Gate 1 - Context Check
- [ ] `DESIGN.md` reviewed for visual rules (color, typography, component style)
- [ ] `SITE.md` reviewed for sitemap and roadmap placement
- [ ] Scope boundary confirmed (no org-chart content in design output)

### Gate 2 - Build Check
- [ ] Target page generated from baton prompt
- [ ] Output saved to `stitch_assets/<page>.html` or intended target directory
- [ ] Basic responsive behavior verified (mobile and desktop layout integrity)

### Gate 3 - Consistency Check
- [ ] New page aligns with design tokens and tone
- [ ] New page is linked appropriately in sitemap context
- [ ] No unrelated files were modified

### Gate 4 - Handoff Check
- [ ] `next-prompt.md` updated with a valid, concrete next page prompt
- [ ] Handoff summary includes what changed and what was verified
- [ ] Handoff ends with exactly 3 next-step questions/options

## Scope Boundary (Important)

- **Web Design Scope**: layout, typography, color system, spacing, responsive behavior, components, and motion.
- **Information Architecture Scope**: sitemap/page relationships in `SITE.md`.
- **Not Design Scope**: company org charts, department structures, and internal governance modeling.
- If organization structure is requested, treat it as separate content work (for example `docs/manuals/company_structure.md` or dedicated org pages) and keep it decoupled from the design system.

## Handoff Output Format

At the end of each iteration, provide:
1. Changed files
2. Validation result by gate (pass/fail)
3. Risks or open assumptions
4. Exactly 3 next-step questions/options

## Project Documentation Requirements

To use this skill effectively, the project must have:
- `SITE.md`: High-level vision, Sitemap, and Roadmap.
- `DESIGN.md`: Visual identity, color palette, and typography.
- `STITCH.md`: Contains the current Stitch Project ID.
- `skills/web-design-workflow/SKILL.md`: Phase-based validation protocol for design tasks.
