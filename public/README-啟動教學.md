# 專案啟動教學

## 1. 安裝 Node.js 與 npm
- 建議使用 [Node.js 官方網站](https://nodejs.org/) 下載安裝。
- macOS 用戶可用 Homebrew：
  ```sh
  brew install node
  ```

## 2. 安裝專案依賴
- 在終端機進入專案根目錄，執行：
  ```sh
  npm install
  ```

## 3. 啟動本地開發伺服器
- 在專案根目錄執行：
  ```sh
  npm run dev
  ```
- 預設網址為 http://localhost:3000 或 http://localhost:3001

## 4. 常見問題
- 若遇到 port 被占用，請關閉其他佔用 3000 埠的程式。
- 若 npm 指令失敗，請確認 node_modules 是否存在，或重新執行 `npm install`。
