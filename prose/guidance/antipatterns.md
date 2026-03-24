# OpenProse Antipatterns

Use this file when writing a new `.prose` file.

## Avoid

- loading compile-heavy context when the task is only to run
- using persistent state for tiny one-shot tasks that fit in-context
- hiding credentials or remote dependencies without explanation
- splitting work into too many sessions when direct execution would be clearer
