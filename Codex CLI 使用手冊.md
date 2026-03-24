# Codex CLI 使用手冊

Codex CLI 提供了除聊天之外的更多工作流程。本指南將幫助您了解每個工作流程的功能以及何時使用它們。

## 主要功能

### 互動模式 (Interactive mode)

通過 `codex` 命令啟動一個全螢幕終端使用者介面，您可以在其中與 Codex 進行迭代，讀取您的儲存庫、進行編輯和執行命令。

- **啟動:**
  ```bash
  codex
  ```
- **帶有初始提示啟動:**
  ```bash
  codex "請向我解釋這個程式碼庫"
  ```
- **功能:**
  - 發送提示、程式碼片段或螢幕截圖。
  - 在變更前審查並批准 Codex 的計畫。
  - 閱讀語法高亮的 markdown 程式碼塊和差異。
  - 使用 `/theme` 預覽和儲存主題。
  - 使用 `/clear` 或 `Ctrl+L` 清除螢幕。
  - 使用 `/copy` 複製最新的輸出。
  - 使用 `Up/Down` 導航草稿歷史。
  - 使用 `Ctrl+C` 或 `/exit` 關閉會話。

### 恢復對話 (Resuming conversations)

Codex 會將您的對話記錄儲存在本機，以便您可以從上次中斷的地方繼續。

- `codex resume`: 啟動一個最近互動會話的選擇器。
- `codex resume --all`: 顯示當前工作目錄之外的會話。
- `codex resume --last`: 直接跳到最近的會話。
- `codex resume <SESSION_ID>`: 定位到特定的會話。

### 模型與推理 (Models and reasoning)

建議使用 `gpt-5.4` 模型。對於超快任務，ChatGPT Pro 訂閱者可以使用 `GPT-5.3-Codex-Spark` 模型。

- **切換模型:**
  - 在會話中使用 `/model` 命令。
  - 啟動時指定: `codex --model gpt-5.4`。

### 功能旗標 (Feature flags)

使用 `features` 子命令來檢查可用功能並持久化變更。

- `codex features list`: 列出可用功能。
- `codex features enable <feature>`: 啟用功能。
- `codex features disable <feature>`: 禁用功能。

### 子代理 (Subagents)

使用子代理工作流程來並行處理較大的任務。Codex 僅在您明確要求時才會生成子代理。

### 圖片輸入 (Image inputs)

附加螢幕截圖或設計規格，以便 Codex 可以讀取圖片詳細資訊。

- **指令行:**
  ```bash
  codex -i screenshot.png "解釋這個錯誤"
  codex --image img1.png,img2.jpg "總結這些圖表"
  ```

### 語法高亮与主題 (Syntax highlighting and themes)

TUI 會對 markdown 程式碼塊和檔案差異進行語法高亮。

- 使用 `/theme` 打開主題選擇器，預覽並儲存您的選擇。

### 本機程式碼審查 (Running local code review)

在 CLI 中輸入 `/review` 以打開 Codex 的審查預設。

- **審查選項:**
  - **Review against a base branch**: 根據基礎分支審查。
  - **Review uncommitted changes**: 審查未提交的變更。
  - **Review a commit**: 審查特定提交。
  - **Custom review instructions**: 使用自訂指令進行審查。

### 網頁搜尋 (Web search)

Codex 預設啟用網頁搜尋，並從快取中提供結果。

- 使用 `--search` 進行即時搜尋。
- 在設定檔中設定 `web_search = "live"`。
- 設定 `web_search = "disabled"` 來禁用此功能。

### 使用輸入提示執行 (Running with an input prompt)

當您只需要一個快速答案時，可以執行帶有單一提示的 Codex 並跳過互動式 UI。

```bash
codex "解釋這個程式碼庫"
```

### Shell 自動完成 (Shell completions)

為您的 shell 安裝自動完成腳本以加快日常使用。

```bash
codex completion bash
codex completion zsh
codex completion fish
```

### 批准模式 (Approval modes)

定義 Codex 在未經確認的情況下可以執行多少操作。

- **Auto (預設)**: 允許在工作目錄內讀取檔案、編輯和執行命令。
- **Read-only**: 只能瀏覽檔案，未經批准不會進行變更。
- **Full Access**: 授予 Codex 在您的機器上工作的能力，包括網路存取，而無需詢問。

### 編寫 Codex 指令碼 (Scripting Codex)

使用 `exec` 子命令自動化工作流程或將 Codex 連接到您現有的腳本中。

```bash
codex exec "修復 CI 失敗"
```

### 使用 Codex cloud (Working with Codex cloud)

`codex cloud` 命令讓您可以在終端中分流和啟動 Codex cloud 任務。

- `codex cloud`: 打開互動式選擇器。
- `codex cloud exec --env ENV_ID "總結開放的錯誤"`: 直接從終端啟動任務。

### 斜線指令 (Slash commands)

快速存取專門的工作流程，如 `/review`、`/fork` 或您自己的可重用提示。

### 提示編輯器 (Prompt editor)

在提示輸入中，按 `Ctrl+G` 打開由 `VISUAL` 或 `EDITOR` 環境變數定義的編輯器。

### 模型內容協議 (Model Context Protocol - MCP)

通過配置 MCP 伺服器將 Codex 連接到更多工具。

### 提示與捷徑 (Tips and shortcuts)

- `@`: 在編輯器中打開檔案模糊搜尋。
- `Enter`: 在 Codex 執行時注入新指令。
- `!`: 執行本地 shell 命令 (例如 `!ls`)。
- `Esc` (兩次): 編輯上一條使用者訊息。
- `codex --cd <path>`: 從任何目錄啟動 Codex 並設定工作根目錄。
- `--add-dir`: 公開更多可寫的根目錄。

---

## Codex SDK

您可以以程式設計方式控制本地 Codex 代理。

### TypeScript 函式庫

- **安裝:**
  ```bash
  npm install @openai/codex-sdk
  ```
- **用法:**
  ```typescript
  import { Codex } from "@openai/codex-sdk";

  const codex = new Codex();
  const thread = codex.startThread();
  const result = await thread.run(
    "制定一個計畫來診斷和修復 CI 失敗"
  );

  console.log(result);

  // 繼續執行同一線程
  const result2 = await thread.run("執行計畫");
  console.log(result2);

  // 恢復過去的線程
  const threadId = "<thread-id>";
  const thread2 = codex.resumeThread(threadId);
  const result3 = await thread2.run("從你離開的地方繼續");
  console.log(result3);
  ```

---

## 子代理 (Subagents)

Codex 可以通過並行生成專門的代理來執行子代理工作流程，然後將它們的結果收集到一個回應中。

### 自訂代理

您可以通過在 `~/.codex/agents/` (個人代理) 或 `.codex/agents/` (專案範圍的代理) 下添加獨立的 TOML 檔案來定義自己的自訂代理。

**自訂代理檔案結構:**

- `name` (string, 必需): 代理名稱。
- `description` (string, 必需): 關於何時使用此代理的說明。
- `developer_instructions` (string, 必需): 定義代理行為的核心指令。
- `nickname_candidates` (string[], 可選): 顯示暱稱的池。
