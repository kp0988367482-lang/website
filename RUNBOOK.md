# Codex CLI 使用手冊

## Codex CLI features
Overview of functionality in the Codex terminal client

Codex supports workflows beyond chat. Use this guide to learn what each one unlocks and when to use it.

### Running in interactive mode

Codex launches into a full-screen terminal UI that can read your repository, make edits, and run commands as you iterate together. Use it whenever you want a conversational workflow where you can review Codex’s actions in real time.

`codex`

You can also specify an initial prompt on the command line.

`codex "Explain this codebase to me"`

Once the session is open, you can:

*   Send prompts, code snippets, or screenshots (see image inputs) directly into the composer.
*   Watch Codex explain its plan before making a change, and approve or reject steps inline.
*   Read syntax-highlighted markdown code blocks and diffs in the TUI, then use `/theme` to preview and save a preferred theme.
*   Use `/clear` to wipe the terminal and start a fresh chat, or press `Ctrl+L` to clear the screen without starting a new conversation.
*   Use `/copy` to copy the latest completed Codex output. If a turn is still running, Codex copies the most recent finished output instead of in-progress text.
*   Navigate draft history in the composer with Up/Down; Codex restores prior draft text and image placeholders.
*   Press `Ctrl+C` or use `/exit` to close the interactive session when you’re done.

### Resuming conversations

Codex stores your transcripts locally so you can pick up where you left off instead of repeating context. Use the resume subcommand when you want to reopen an earlier thread with the same repository state and instructions.

*   `codex resume` launches a picker of recent interactive sessions. Highlight a run to see its summary and press Enter to reopen it.
*   `codex resume --all` shows sessions beyond the current working directory, so you can reopen any local run.
*   `codex resume --last` skips the picker and jumps straight to your most recent session from the current working directory (add --all to ignore the current working directory filter).
*   `codex resume <SESSION_ID>` targets a specific run. You can copy the ID from the picker, /status, or the files under `~/.codex/sessions/`.

Non-interactive automation runs can resume too:

`codex exec resume --last "Fix the race conditions you found"`
`codex exec resume 7f9f9a2e-1b3c-4c7a-9b0e-.... "Implement the plan"`

Each resumed run keeps the original transcript, plan history, and approvals, so Codex can use prior context while you supply new instructions. Override the working directory with `--cd` or add extra roots with `--add-dir` if you need to steer the environment before resuming.

### Models and reasoning

For most tasks in Codex, gpt-5.4 is the recommended model. It brings the industry-leading coding capabilities of gpt-5.3-codex to OpenAI’s flagship frontier model, combining frontier coding performance with stronger reasoning, native computer use, and broader professional workflows. For extra fast tasks, ChatGPT Pro subscribers have access to the GPT-5.3-Codex-Spark model in research preview.

Switch models mid-session with the `/model` command, or specify one when launching the CLI.

`codex --model gpt-5.4`

Learn more about the models available in Codex.

### Feature flags

Codex includes a small set of feature flags. Use the features subcommand to inspect what’s available and to persist changes in your configuration.

`codex features list`
`codex features enable unified_exec`
`codex features disable shell_snapshot`

`codex features enable <feature>` and `codex features disable <feature>` write to `~/.codex/config.toml`. If you launch Codex with `--profile`, Codex stores the change in that profile rather than the root configuration.

### Subagents

Use Codex subagent workflows to parallelize larger tasks. For setup, role configuration (`[agents]` in `config.toml`), and examples, see Subagents.

Codex only spawns subagents when you explicitly ask it to. Because each subagent does its own model and tool work, subagent workflows consume more tokens than comparable single-agent runs.

### Image inputs

Attach screenshots or design specs so Codex can read image details alongside your prompt. You can paste images into the interactive composer or provide files on the command line.

`codex -i screenshot.png "Explain this error"`

`codex --image img1.png,img2.jpg "Summarize these diagrams"`

Codex accepts common formats such as PNG and JPEG. Use comma-separated filenames for two or more images, and combine them with text instructions to add context.

### Syntax highlighting and themes

The TUI syntax-highlights fenced markdown code blocks and file diffs so code is easier to scan during reviews and debugging.

Use `/theme` to open the theme picker, preview themes live, and save your selection to `tui.theme` in `~/.codex/config.toml`. You can also add custom `.tmTheme` files under `$CODEX_HOME/themes` and select them in the picker.

### Running local code review

Type `/review` in the CLI to open Codex’s review presets. The CLI launches a dedicated reviewer that reads the diff you select and reports prioritized, actionable findings without touching your working tree. By default it uses the current session model; set `review_model` in `config.toml` to override.

*   **Review against a base branch** lets you pick a local branch; Codex finds the merge base against its upstream, diffs your work, and highlights the biggest risks before you open a pull request.
*   **Review uncommitted changes** inspects everything that’s staged, not staged, or not tracked so you can address issues before committing.
*   **Review a commit** lists recent commits and has Codex read the exact change set for the SHA you choose.
*   **Custom review instructions** accepts your own wording (for example, “Focus on accessibility regressions”) and runs the same reviewer with that prompt.

Each run shows up as its own turn in the transcript, so you can rerun reviews as the code evolves and compare the feedback.

### Web search

Codex ships with a first-party web search tool. For local tasks in the Codex CLI, Codex enables web search by default and serves results from a web search cache. The cache is an OpenAI-maintained index of web results, so cached mode returns pre-indexed results instead of fetching live pages. This reduces exposure to prompt injection from arbitrary live content, but you should still treat web results as untrusted. If you are using `--yolo` or another full access sandbox setting, web search defaults to live results. To fetch the most recent data, pass `--search` for a single run or set `web_search = "live"` in Config basics. You can also set `web_search = "disabled"` to turn the tool off.

You’ll see `web_search` items in the transcript or `codex exec --json` output whenever Codex looks something up.

### Running with an input prompt

When you just need a quick answer, run Codex with a single prompt and skip the interactive UI.

`codex "explain this codebase"`

Codex will read the working directory, craft a plan, and stream the response back to your terminal before exiting. Pair this with flags like `--path` to target a specific directory or `--model` to dial in the behavior up front.

### Shell completions

Speed up everyday usage by installing the generated completion scripts for your shell:

`codex completion bash`
`codex completion zsh`
`codex completion fish`

Run the completion script in your shell configuration file to set up completions for new sessions. For example, if you use `zsh`, you can add the following to the end of your `~/.zshrc` file:

```sh
# ~/.zshrc
eval "$(codex completion zsh)"
```

Start a new session, type `codex`, and press `Tab` to see the completions. If you see a `command not found: compdef` error, add `autoload -Uz compinit && compinit` to your `~/.zshrc` file before the `eval "$(codex completion zsh)"` line, then restart your shell.

### Approval modes

Approval modes define how much Codex can do without stopping for confirmation. Use `/permissions` inside an interactive session to switch modes as your comfort level changes.

*   **Auto (default)** lets Codex read files, edit, and run commands within the working directory. It still asks before touching anything outside that scope or using the network.
*   **Read-only** keeps Codex in a consultative mode. It can browse files but won’t make changes or run commands until you approve a plan.
*   **Full Access** grants Codex the ability to work across your machine, including network access, without asking. Use it sparingly and only when you trust the repository and task.

Codex always surfaces a transcript of its actions, so you can review or roll back changes with your usual `git` workflow.

### Scripting Codex

Automate workflows or wire Codex into your existing scripts with the `exec` subcommand. This runs Codex non-interactively, piping the final plan and results back to `stdout`.

`codex exec "fix the CI failure"`

Combine `exec` with shell scripting to build custom workflows, such as automatically updating changelogs, sorting issues, or enforcing editorial checks before a PR ships.

### Working with Codex cloud

The `codex cloud` command lets you triage and launch Codex cloud tasks without leaving the terminal. Run it with no arguments to open an interactive picker, browse active or finished tasks, and apply the changes to your local project.

You can also start a task directly from the terminal:

`codex cloud exec --env ENV_ID "Summarize open bugs"`

Add `--attempts` (1–4) to request best-of-N runs when you want Codex cloud to generate more than one solution. For example, `codex cloud exec --env ENV_ID --attempts 3 "Summarize open bugs"`.

Environment IDs come from your Codex cloud configuration—use `codex cloud` and press `Ctrl+O` to choose an environment or the web dashboard to confirm the exact value. Authentication follows your existing CLI login, and the command exits non-zero if submission fails so you can wire it into scripts or CI.

### Slash commands

Slash commands give you quick access to specialized workflows like `/review`, `/fork`, or your own reusable prompts. Codex ships with a curated set of built-ins, and you can create custom ones for team-specific tasks or personal shortcuts.

See the slash commands guide to browse the catalog of built-ins, learn how to author custom commands, and understand where they live on disk.

### Prompt editor

When you’re drafting a longer prompt, it can be easier to switch to a full editor and then send the result back to the composer.

In the prompt input, press `Ctrl+G` to open the editor defined by the `VISUAL` environment variable (or `EDITOR` if `VISUAL` isn’t set).

### Model Context Protocol (MCP)

Connect Codex to more tools by configuring Model Context Protocol servers. Add STDIO or streaming HTTP servers in `~/.codex/config.toml`, or manage them with the `codex mcp` CLI commands—Codex launches them automatically when a session starts and exposes their tools next to the built-ins. You can even run Codex itself as an MCP server when you need it inside another agent.

See Model Context Protocol for example configurations, supported auth flows, and a more detailed guide.

### Tips and shortcuts

*   Type `@` in the composer to open a fuzzy file search over the workspace root; press `Tab` or `Enter` to drop the highlighted path into your message.
*   Press `Enter` while Codex is running to inject new instructions into the current turn, or press `Tab` to queue a follow-up prompt for the next turn.
*   Prefix a line with `!` to run a local shell command (for example, `!ls`). Codex treats the output like a user-provided command result and still applies your approval and sandbox settings.
*   Tap `Esc` twice while the composer is empty to edit your previous user message. Continue pressing `Esc` to walk further back in the transcript, then hit `Enter` to fork from that point.
*   Launch Codex from any directory using `codex --cd <path>` to set the working root without running `cd` first. The active path appears in the TUI header.
*   Expose more writable roots with `--add-dir` (for example, `codex --cd apps/frontend --add-dir ../backend --add-dir ../shared`) when you need to coordinate changes across more than one project.
*   Make sure your environment is already set up before launching Codex so it doesn’t spend tokens probing what to activate. For example, source your Python virtual environment (or other language environments), start any required daemons, and export the environment variables you expect to use ahead of time.

## Codex SDK
Programmatically control local Codex agents

If you use Codex through the Codex CLI, the IDE extension, or Codex Web, you can also control it programmatically.

Use the SDK when you need to:

*   Control Codex as part of your CI/CD pipeline
*   Create your own agent that can engage with Codex to perform complex engineering tasks
*   Build Codex into your own internal tools and workflows
*   Integrate Codex within your own application

### TypeScript library

The TypeScript library provides a way to control Codex from within your application that is more comprehensive and flexible than non-interactive mode.

Use the library server-side; it requires Node.js 18 or later.

#### Installation

To get started, install the Codex SDK using npm:

`npm install @openai/codex-sdk`

#### Usage

Start a thread with Codex and run it with your prompt.

```typescript
import { Codex } from "@openai/codex-sdk";

const codex = new Codex();
const thread = codex.startThread();
const result = await thread.run(
  "Make a plan to diagnose and fix the CI failures"
);

console.log(result);
```

Call `run()` again to continue on the same thread, or resume a past thread by providing a thread ID.

```typescript
// running the same thread
const result = await thread.run("Implement the plan");

console.log(result);

// resuming past thread

const threadId = "<thread-id>";
const thread2 = codex.resumeThread(threadId);
const result2 = await thread2.run("Pick up where you left off");

console.log(result2);
```

For more details, check out the TypeScript repo.

## Subagents
Use subagents and custom agents in Codex

Codex can run subagent workflows by spawning specialized agents in parallel and then collecting their results in one response. This can be particularly helpful for complex tasks that are highly parallel, such as codebase exploration or implementing a multi-step feature plan.

With subagent workflows, you can also define your own custom agents with different model configurations and instructions depending on the task.

For the concepts and tradeoffs behind subagent workflows, including context pollution, context rot, and model-selection guidance, see Subagent concepts.

### Availability

Current Codex releases enable subagent workflows by default.

Subagent activity is currently surfaced in the Codex app and CLI. Visibility in the IDE Extension is coming soon.

Codex only spawns subagents when you explicitly ask it to. Because each subagent does its own model and tool work, subagent workflows consume more tokens than comparable single-agent runs.

### Typical workflow

Codex handles orchestration across agents, including spawning new subagents, routing follow-up instructions, waiting for results, and closing agent threads.

When many agents are running, Codex waits until all requested results are available, then returns a consolidated response.

Codex only spawns a new agent when you explicitly ask it to do so.

To see it in action, try the following prompt on your project:

> I would like to review the following points on the current PR (this branch vs main). Spawn one agent per point, wait for all of them, and summarize the result for each point.
> 1.  Security issue
> 2.  Code quality
> 3.  Bugs
> 4.  Race
> 5.  Test flakiness
> 6.  Maintainability of the code

### Managing subagents

*   Use `/agent` in the CLI to switch between active agent threads and inspect the ongoing thread.
*   Ask Codex directly to steer a running subagent, stop it, or close completed agent threads.

### Approvals and sandbox controls

Subagents inherit your current sandbox policy.

In interactive CLI sessions, approval requests can surface from inactive agent threads even while you are looking at the main thread. The approval overlay shows the source thread label, and you can press `o` to open that thread before you approve, reject, or answer the request.

In non-interactive flows, or whenever a run can’t surface a fresh approval, an action that needs new approval fails and Codex surfaces the error back to the parent workflow.

Codex also reapplies the parent turn’s live runtime overrides when it spawns a child. That includes sandbox and approval choices you set interactively during the session, such as `/approvals` changes or `--yolo`, even if the selected custom agent file sets different defaults.

You can also override the sandbox configuration for individual custom agents, such as explicitly marking one to work in read-only mode.

### Custom agents

Codex ships with built-in agents:

*   **default**: general-purpose fallback agent.
*   **worker**: execution-focused agent for implementation and fixes.
*   **explorer**: read-heavy codebase exploration agent.

To define your own custom agents, add standalone TOML files under `~/.codex/agents/` for personal agents or `.codex/agents/` for project-scoped agents.

Each file defines one custom agent. Codex loads these files as configuration layers for spawned sessions, so custom agents can override the same settings as a normal Codex session config. That can feel heavier than a dedicated agent manifest, and the format may evolve as authoring and sharing mature.

Every standalone custom agent file must define:

*   `name`
*   `description`
*   `developer_instructions`

Optional fields such as `nickname_candidates`, `model`, `model_reasoning_effort`, `sandbox_mode`, `mcp_servers`, and `skills.config` inherit from the parent session when you omit them.

### Global settings

Global subagent settings still live under `[agents]` in your configuration.

| Field | Type | Required | Purpose |
| :--- | :--- | :--- | :--- |
| `agents.max_threads` | number | No | Concurrent open agent thread cap. |
| `agents.max_depth` | number | No | Spawned agent nesting depth (root session starts at 0). |
| `agents.job_max_runtime_seconds` | number | No | Default timeout per worker for `spawn_agents_on_csv` jobs. |

**Notes:**

*   `agents.max_threads` defaults to `6` when you leave it unset.
*   `agents.max_depth` defaults to `1`, which allows a direct child agent to spawn but prevents deeper nesting.
*   `agents.job_max_runtime_seconds` is optional. When you leave it unset, `spawn_agents_on_csv` falls back to its per-call default timeout of 1800 seconds per worker.
*   If a custom agent `name` matches a built-in agent such as `explorer`, your custom agent takes precedence.

### Custom agent file schema

| Field | Type | Required | Purpose |
| :--- | :--- | :--- | :--- |
| `name` | string | Yes | Agent name Codex uses when spawning or referring to this agent. |
| `description` | string | Yes | Human-facing guidance for when Codex should use this agent. |
| `developer_instructions` | string | Yes | Core instructions that define the agent’s behavior. |
| `nickname_candidates` | string[] | No | Optional pool of display nicknames for spawned agents. |

You can also include other supported `config.toml` keys in a custom agent file, such as `model`, `model_reasoning_effort`, `sandbox_mode`, `mcp_servers`, and `skills.config`.

Codex identifies the custom agent by its `name` field. Matching the filename to the agent name is the simplest convention, but the `name` field is the source of truth.

#### Display nicknames

Use `nickname_candidates` when you want Codex to assign more readable display names to spawned agents. This is especially helpful when you run many instances of the same custom agent and want the UI to show distinct labels instead of repeating the same agent name.

Nicknames are presentation-only. Codex still identifies and spawns the agent by its `name`.

Nickname candidates must be a non-empty list of unique names. Each nickname can use ASCII letters, digits, spaces, hyphens, and underscores.

**Example:**

```toml
name = "reviewer"
description = "PR reviewer focused on correctness, security, and missing tests."
developer_instructions = """
Review code like an owner.
Prioritize correctness, security, behavior regressions, and missing test coverage.
"""
nickname_candidates = ["Atlas", "Delta", "Echo"]
```

In practice, the Codex app and CLI can show the nicknames where agent activity appears, while the underlying agent type stays `reviewer`.

### Example custom agents

The best custom agents are narrow and opinionated. Give each one clear job, a tool surface that matches that job, and instructions that keep it from drifting into adjacent work.

#### Example 1: PR review

This pattern splits review across three focused custom agents:

*   **pr_explorer** maps the codebase and gathers evidence.
*   **reviewer** looks for correctness, security, and test risks.
*   **docs_researcher** checks framework or API documentation through a dedicated MCP server.

Project config (`.codex/config.toml`):

```toml
[agents]
max_threads = 6
max_depth = 1
```

`.codex/agents/pr-explorer.toml`:

```toml
name = "pr_explorer"
description = "Read-only codebase explorer for gathering evidence before changes are proposed."
model = "gpt-5.3-codex-spark"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"
developer_instructions = """
Stay in exploration mode.
Trace the real execution path, cite files and symbols, and avoid proposing fixes unless the parent agent asks for them.
Prefer fast search and targeted file reads over broad scans.
"""
```

`.codex/agents/reviewer.toml`:

```toml
name = "reviewer"
description = "PR reviewer focused on correctness, security, and missing tests."
model = "gpt-5.4"
model_reasoning_effort = "high"
sandbox_mode = "read-only"
developer_instructions = """
Review code like an owner.
Prioritize correctness, security, behavior regressions, and missing test coverage.
Lead with concrete findings, include reproduction steps when possible, and avoid style-only comments unless they hide a real bug.
"""
```

`.codex/agents/docs-researcher.toml`:

```toml
name = "docs_researcher"
description = "Documentation specialist that uses the docs MCP server to verify APIs and framework behavior."
model = "gpt-5.3-codex-spark"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"
developer_instructions = """
Use the docs MCP server to confirm APIs, options, and version-specific behavior.
Return concise answers with links or exact references when available.
Do not make code changes.
"""

[mcp_servers.openaiDeveloperDocs]
url = "https://developers.openai.com/mcp"
```

This setup works well for prompts like:

> Review this branch against main. Have pr_explorer map the affected code paths, reviewer find real risks, and docs_researcher verify the framework APIs that the patch relies on.

#### Process CSV batches with subagents (experimental)

This workflow is experimental and may change as subagent support evolves. Use `spawn_agents_on_csv` when you have many similar tasks that map to one row per work item. Codex reads the CSV, spawns one worker subagent per row, waits for the full batch to finish, and exports the combined results to CSV.

This works well for repeated audits such as:

*   reviewing one file, package, or service per row
*   checking a list of incidents, PRs, or migration targets
*   generating structured summaries for many similar inputs

The tool accepts:

*   `csv_path` for the source CSV
*   `instruction` for the worker prompt template, using `{column_name}` placeholders
*   `id_column` when you want stable item ids from a specific column
*   `output_schema` when each worker should return a JSON object with a fixed shape
*   `output_csv_path`, `max_concurrency`, and `max_runtime_seconds` for job control

Each worker must call `report_agent_job_result` exactly once. If a worker exits without reporting a result, Codex marks that row with an error in the exported CSV.

**Example prompt:**

> Create `/tmp/components.csv` with columns `path`,`owner` and one row per frontend component.
>
> Then call `spawn_agents_on_csv` with:
> *   `csv_path`: `/tmp/components.csv`
> *   `id_column`: `path`
> *   `instruction`: "Review {path} owned by {owner}. Return JSON with keys `path`, `risk`, `summary`, and `follow_up` via `report_agent_job_result`."
> *   `output_csv_path`: `/tmp/components-review.csv`
> *   `output_schema`: an object with required string fields `path`, `risk`, `summary`, and `follow_up`

When you run this through `codex exec`, Codex shows a single-line progress update on `stderr` while the batch is running. The exported CSV includes the original row data plus metadata such as `job_id`, `item_id`, `status`, `last_error`, and `result_json`.

**Related runtime settings:**

*   `agents.max_threads` caps how many agent threads can stay open concurrently.
*   `agents.job_max_runtime_seconds` sets the default per-worker timeout for CSV fan-out jobs. A per-call `max_runtime_seconds` override takes precedence.
*   `sqlite_home` controls where Codex stores the SQLite-backed state used for agent jobs and their exported results.

#### Example 2: Frontend integration debugging

This pattern is useful for UI regressions, flaky browser flows, or integration bugs that cross application code and the running product.

Project config (`.codex/config.toml`):

```toml
[agents]
max_threads = 6
max_depth = 1
```

`.codex/agents/code-mapper.toml`:

```toml
name = "code_mapper"
description = "Read-only codebase explorer for locating the relevant frontend and backend code paths."
model = "gpt-5.3-codex-spark"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"
developer_instructions = """
Map the code that owns the failing UI flow.
Identify entry points, state transitions, and likely files before the worker starts editing.
"""
```

`.codex/agents/browser-debugger.toml`:

```toml
name = "browser_debugger"
description = "UI debugger that uses browser tooling to reproduce issues and capture evidence."
model = "gpt-5.4"
model_reasoning_effort = "high"
sandbox_mode = "workspace-write"
developer_instructions = """
Reproduce the issue in the browser, capture exact steps, and report what the UI actually does.
Use browser tooling for screenshots, console output, and network evidence.
Do not edit application code.
"""

[mcp_servers.chrome_devtools]
url = "http://localhost:3000/mcp"
startup_timeout_sec = 20
```

`.codex/agents/ui-fixer.toml`:

```toml
name = "ui_fixer"
description = "Implementation-focused agent for small, targeted fixes after the issue is understood."
model = "gpt-5.3-codex-spark"
model_reasoning_effort = "medium"
developer_instructions = """
Own the fix once the issue is reproduced.
Make the smallest defensible change, keep unrelated files untouched, and validate only the behavior you changed.
"""

[[skills.config]]
path = "/Users/me/.agents/skills/docs-editor/SKILL.md"
enabled = false
```

This setup works well for prompts like:

> Investigate why the settings modal fails to save. Have `browser_debugger` reproduce it, `code_mapper` trace the responsible code path, and `ui_fixer` implement the smallest fix once the failure mode is clear.
