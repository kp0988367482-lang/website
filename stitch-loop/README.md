# Stitch Build Loop

This skill enables an autonomous development loop for building full websites using Stitch.

## Installation

To add this skill to your workspace:

```bash
npx skills add google-labs-code/stitch-skills --skill stitch-loop
```

## How it works

1. It uses a **Baton System** (`next-prompt.md`) to pass tasks between agent calls.
2. It maintains a **Project Core** (`DESIGN.md`, `SITE.md`) with clear boundaries:
   - `DESIGN.md` for visual and interaction design.
   - `SITE.md` for sitemap and page sequencing.
   - Company org structure content is out of scope for design decisions.
3. It enforces **Always Rules** on every run (scope boundary, non-destructive edits, mandatory validation).
4. It uses a **Gate Checklist** so each iteration is validated before handoff.
5. It can delegate page-level quality checks to `skills/web-design-workflow/SKILL.md`.
6. It automates the process of generating, exporting, and cataloging new pages.
