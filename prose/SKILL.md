---
name: prose
description: OpenProse VM skill pack. Activate on any `prose` command, `.prose` files, or OpenProse mentions; orchestrates multi-agent workflows.
metadata:
  openclaw:
    emoji: "🪶"
    homepage: "https://www.prose.md"
---

# OpenProse Skill

OpenProse is a programming language for AI sessions. Treat the prose VM description as an execution system, not just reference prose. When the user asks to run or author `.prose`, you are acting as the OpenProse runtime.

## OpenClaw Runtime Mapping

- task spawning in the upstream spec maps to `sessions_spawn`
- file I/O maps to local read and write tools
- remote fetch maps to web fetch, or shell plus `curl` when POST is required

## When to Activate

Activate this skill when the user:

- uses any `prose` command such as `prose run`, `prose compile`, `prose update`, or `prose help`
- asks to run a `.prose` file
- mentions OpenProse or a prose program
- wants to orchestrate multiple AI agents from a script
- shows files with `session "..."` or `agent name:` syntax
- wants to create a reusable multi-agent workflow

## Single Skill Rule

There is only one skill: `prose`.

Do not invent separate skills like `prose-run`, `prose-compile`, or `prose-boot`. All prose commands route through this single skill.

## Command Routing

When a user invokes `prose <command>`, route based on intent:

| Command | Action |
| --- | --- |
| `prose help` | Load [help.md](./help.md) and guide the user |
| `prose run <file>` | Load [prose.md](./prose.md) and a state backend, then execute |
| `prose run <handle/slug>` | Resolve remotely, fetch, then execute |
| `prose compile <file>` | Load [compiler.md](./compiler.md) and validate |
| `prose update` | Run the migration flow in [migration.md](./migration.md) |
| `prose examples` | Show or run local examples when bundled, otherwise guide by known names |
| Other | Interpret from context and route to the closest prose workflow |

## Example Resolution

Examples may be bundled in `examples/` beside this skill. When the user references an example by name:

1. list locally bundled example files if they exist
2. match by partial name, keyword, or number
3. run the matching local file if present
4. if the local example pack is not bundled, use the known mapping below or remote registry resolution

Common example mappings:

| Keyword | Example |
| --- | --- |
| `hello`, `hello world` | `examples/01-hello-world.prose` |
| `gas town`, `gastown` | `examples/28-gas-town.prose` |
| `captain`, `chair` | `examples/29-captains-chair.prose` |
| `forge`, `browser` | `examples/37-the-forge.prose` |
| `parallel` | `examples/16-parallel-reviews.prose` |
| `pipeline` | `examples/21-pipeline-operations.prose` |
| `error`, `retry` | `examples/22-error-handling.prose` |

## Remote Programs

You can run a `.prose` program from:

- a direct `http://` or `https://` URL
- a registry shorthand like `handle/slug`
- a local file path

Resolution rules:

| Input | Resolution |
| --- | --- |
| Starts with `http://` or `https://` | Fetch directly |
| Contains `/` but no protocol | Resolve to `https://p.prose.md/{path}` |
| Otherwise | Treat as a local file path |

Apply the same rules to `use "..."` statements inside `.prose` files.

## File Locations

Do not search the user's workspace for OpenProse documentation files. Read them from this skill directory.

Skill-local files:

- [prose.md](./prose.md): VM semantics for running programs
- [help.md](./help.md): help, FAQs, onboarding
- [compiler.md](./compiler.md): compiler and validator guidance
- [state/filesystem.md](./state/filesystem.md): default state mode
- [state/in-context.md](./state/in-context.md): in-context state
- [state/sqlite.md](./state/sqlite.md): sqlite state
- [state/postgres.md](./state/postgres.md): postgres state
- [guidance/patterns.md](./guidance/patterns.md): authoring patterns
- [guidance/antipatterns.md](./guidance/antipatterns.md): authoring pitfalls

User project paths:

- `.prose/.env`
- `.prose/runs/`
- `.prose/agents/`
- `*.prose`

User-global path:

- `~/.prose/agents/`

## Core Documentation Loading

Use these loading rules:

| File | Purpose | When to Load |
| --- | --- | --- |
| `prose.md` | VM and interpreter | Always for `prose run` |
| `state/filesystem.md` | File-based state | Default with VM |
| `state/in-context.md` | In-context state | Only if user asks for `--in-context` |
| `state/sqlite.md` | SQLite state | Only if user asks for `--state=sqlite` |
| `state/postgres.md` | PostgreSQL state | Only if user asks for `--state=postgres` |
| `compiler.md` | Compiler and validator | Only for compile or validate requests |
| `guidance/patterns.md` | Authoring best practices | Only when writing new `.prose` files |
| `guidance/antipatterns.md` | Authoring pitfalls | Only when writing new `.prose` files |

Compiler context warning:

- `compiler.md` is large in the upstream pack
- only load compiler guidance when the user explicitly asks to compile or validate
- after compile-heavy work, recommend context cleanup before running programs

## State Modes

OpenProse supports these state approaches:

| Mode | When to Use | State Location |
| --- | --- | --- |
| `filesystem` | Default for complex programs, debugging, and resumption | `.prose/runs/{id}/` |
| `in-context` | Small programs with no persistence needs | Conversation history |
| `sqlite` | Experimental local queryable state | `.prose/runs/{id}/state.db` |
| `postgres` | Experimental concurrent or shared state | PostgreSQL |

Default:

- when running prose, load [prose.md](./prose.md) plus [state/filesystem.md](./state/filesystem.md)

Switching:

- if the user asks for `--in-context`, load [state/in-context.md](./state/in-context.md)
- if the user asks for `--state=sqlite`, verify `sqlite3` and then load [state/sqlite.md](./state/sqlite.md)
- if the user asks for `--state=postgres`, verify configuration and connectivity before loading [state/postgres.md](./state/postgres.md)

PostgreSQL safety:

- warn that `OPENPROSE_POSTGRES_URL` may be visible to subagent sessions and logs
- advise dedicated, limited-privilege database credentials
- if setup fails, offer filesystem state as fallback

## Authoring Guidance

When the user asks to write a new `.prose` file:

- load [guidance/patterns.md](./guidance/patterns.md)
- load [guidance/antipatterns.md](./guidance/antipatterns.md)

Do not load authoring guidance for normal runs or compile-only work.

## Execution

On the first OpenProse VM invocation in a session, display this banner:

```text
┌─────────────────────────────────────┐
│         ◇ OpenProse VM ◇            │
│       A new kind of computer        │
└─────────────────────────────────────┘
```

To execute a `.prose` file:

1. read [prose.md](./prose.md)
2. treat the conversation as VM memory
3. treat the available tools as the instruction set
4. spawn sessions when the program requires them
5. narrate execution state clearly
6. use judgment for open-ended markers and decisions

## Migration

For `prose update`, use [migration.md](./migration.md).

Check for legacy paths:

- `.prose/state.json -> .prose/.env`
- `.prose/execution/ -> .prose/runs/`

Create `.prose/agents/` if it is missing.

## Maintainer Notes

Legacy upstream names may still appear in prompts or docs. Map them like this:

| Legacy Name | Current Name |
| --- | --- |
| `docs.md` | `compiler.md` |
| `patterns.md` | `guidance/patterns.md` |
| `antipatterns.md` | `guidance/antipatterns.md` |
