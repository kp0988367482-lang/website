# OpenProse Compiler

Use this file only when the user asks to compile or validate a `.prose` program.

## Purpose

- validate structure before execution
- catch obvious routing, composition, or reference errors
- help the user decide whether to run immediately or revise first

## Guidance

- keep compile work separate from runtime work when possible
- after compile-heavy work, recommend context cleanup before a full run
- if a program depends on remote `use` targets, validate their resolution path as part of compile feedback
