# SQLite State

Use this mode only when the user explicitly asks for `--state=sqlite`.

## Requirements

- `sqlite3` CLI available

## When to Use

- local queryable state
- atomic writes
- flexible schema needs without external infrastructure

## Fallback

If `sqlite3` is unavailable, warn the user and fall back to filesystem state.
