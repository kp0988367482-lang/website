# OpenProse Migration

Use this file for `prose update`.

## Legacy Paths

| Legacy | Current | Notes |
| --- | --- | --- |
| `.prose/state.json` | `.prose/.env` | convert JSON to `key=value` lines |
| `.prose/execution/` | `.prose/runs/` | rename directory |

## Steps

1. check for `.prose/state.json`
2. if present, convert JSON to `.env` format
3. write `.prose/.env`
4. delete the old `.prose/state.json`
5. rename `.prose/execution/` to `.prose/runs/` if present
6. create `.prose/agents/` if missing

## Output

Report each migration step clearly.

If nothing needs migration, say the workspace is already up to date.
