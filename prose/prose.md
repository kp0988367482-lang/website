# OpenProse VM

This local document is the execution guide for OpenProse runs in this skill bundle.

## Execution Model

- Treat the conversation as VM memory.
- Treat tool calls as the instruction set.
- Spawn a new session whenever the program requires a new session block.
- Track progress with clear narration such as current position, bindings, and success or failure transitions.
- Use judgment when the program contains open-ended instructions or evaluation markers.

## Default State

Use filesystem state unless the user explicitly requests another state mode.

## Runtime Behavior

- Remote dependencies should be resolved before execution.
- `use` statements should follow the same remote resolution rules as top-level `prose run`.
- When execution requires external state or services, validate them before continuing.
