# Filesystem State

This is the default OpenProse state mode.

## When to Use

- multi-step programs
- resumable workflows
- debugging or inspection after a run

## State Location

- `.prose/runs/{id}/`

## Notes

- prefer this mode unless the user explicitly asks for another one
- project-scoped agents live under `.prose/agents/`
