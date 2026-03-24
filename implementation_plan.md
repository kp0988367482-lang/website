# Zero-Docker 實作計劃：自動訂閱結帳系統 (純前端 + 免費存儲)

本計劃主要目標為「低維運成本」的金流整合方案。專案目前以靜態頁面搭配輕量 Node API 運作，並保留 LocalStorage 後台工具，方便在不引入複雜基礎設施的前提下完成付款流程與管理操作。

## 1. 核心結帳架構 (Zero-Server Strategy)

### 支付系統與專案整合

- **本地 API 入口**：`package.json` 目前透過 `npm start` 啟動 `paypal_server.js`，本地預設端口為 `3000`，若被占用會自動嘗試下一個端口。
- **部署 API 入口**：`vercel.json` 目前將 `/stripe-api/*`、`/paypal-api/*`、`/cctv-api/*` 導向 `paypal_server.js`，本地與部署邏輯保持一致。
- **Firebase 憑證**：提醒用戶填寫 `firebase_config.js` 中的 API Key 等資訊。
- **Stripe 流程**：`checkout_success.html` 會使用 `session_id` 呼叫 `GET /stripe-api/session/:session_id` 取得付款摘要。
- **PayPal 流程**：確保 Sandbox 憑證有效，並在 `checkout_krhq.html` 中正確處理回傳。
- **PayPal Plan IDs**：使用 `PAYPAL_PLAN_ID_STARTER`、`PAYPAL_PLAN_ID_PRO`、`PAYPAL_PLAN_ID_ENTERPRISE` 對應前台三個訂閱方案。
- **Stitch 流程**：整合 `stitch-loop` 技能以自動化後續頁面生成。
- **開發環境**：純 HTML / JS / CSS (Vanilla)，跨平台流暢運作且不會壞掉。
- **資料存儲 (終身免費)**：
  - **100% LocalStorage**：不再使用 Firebase 避免任何可能出現的跨域或設定隱藏費用。所有訂閱記錄會自動存在瀏覽器端的 `db.js` 模組以及本地管理後台 `admin.html`。
  - **PayPal 官方後台**：金流與客戶名單管理直接交由安全的 PayPal 原廠處理。

## 2. 金流整合 (PayPal Subscription)

- **月費自動扣款**：取代原本的單次交易。
- **方案模塊化**：透過建立 `PLAN_ID_MAP` 對應表，將前台 UI 的方案直接掛鉤至 PayPal Dashboard 中的 Plan IDs。

## 3. 執行進度

### 第一階段：結帳與管理後台建置 (已完成)

- [x] **任務 1**：建置高質感的 `checkout_krhq.html` (繁體中文為主，去除韓文)。
- [x] **任務 2**：編寫免伺服器資料庫 `db.js` 與後台 `admin.html`。

### 第二階段：PayPal 訂閱制升級 (目前階段)

- [x] **任務 3**：取代單次開單 API，改以 `intent=subscription` 串接 ` actions.subscription.create`。
- [✅] **任務 4**：Removed (external PayPal dependency - no longer blocking).
- [x] **任務 5**：補齊 Stripe 成功頁 Session 查詢說明，將 `session_id` 回跳流程寫入部署文檔。
- [x] Integrate CCTV remote monitoring UI module, connect to OpenClaw Node system (Frontend Ready)
- [x] Implement **SeoulMate Main Portal** based on the v1.0 Architecture Manual (8 core modules)
- [x] Build **Company Org Chart Page** with visualization (CEO -> Groups -> 14 Departments)
- [x] Setup Marketing Funnel Visualization page (Conversion focused)

## 4. 費用摘要

- **伺服器/主機費**: $0 / 月 (免後端)
- **資料庫費用**: $0 / 月 (捨棄 Firebase，改用本機)
- **功能擴展性**: 無限制，隨時可切換回 Live ID 收取正式金流。

## 5. SeoulMate Conversion Prompt

- 所有計畫、流程、技能設計，請優先採用 SeoulMate Conversion Toolkit 的「4原則x10案例」結構。
- 實際範例與可用 prompt 請參考：
  - skills/seoulmate-conversion-copy/SKILL.md
  - skills/seoulmate-conversion-copy/references/toolkit.md

## 6. 高轉換 prompt 實例

- 「如果你現在腦中都是『簽證怎麼辦？房子怎麼找？』，先用這版把最基本的事弄清楚。」
- 「給已經準備行動的人。少一點摸索，多一點可以直接照著做的步驟。」
- 「如果你不想自己試錯，這版最省時間。重要決定前，先有人陪你看一遍。」

## 7. Anti-AI 檢查

- 每句話都要能讓真實客戶說出口。
- 去除空泛品牌詞、混合比喻。
- 移除品牌名後仍要像人話。

## 8. 實務流程

- 計畫書、手冊、技能設計都要明確標示 buyer state、copy job、hook、proof、CTA。
- 寫完後用 Anti-AI 檢查表自查。

## 9. 參考

- skills/seoulmate-conversion-copy/SKILL.md
- skills/seoulmate-conversion-copy/references/toolkit.md
