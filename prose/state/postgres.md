# PostgreSQL State

Use this mode only when the user explicitly asks for `--state=postgres`.

## Security Warning

`OPENPROSE_POSTGRES_URL` may be visible to subagent sessions and logs.

Advise:

- dedicated database
- limited-privilege credentials

## Requirements

- `psql` CLI
- a running PostgreSQL server
- `OPENPROSE_POSTGRES_URL` in `.prose/.env` or the environment

## Verification

Before using this mode:

1. check for `OPENPROSE_POSTGRES_URL`
2. verify `psql "$OPENPROSE_POSTGRES_URL" -c "SELECT 1"`

If verification fails, explain setup steps and offer filesystem state as fallback.
