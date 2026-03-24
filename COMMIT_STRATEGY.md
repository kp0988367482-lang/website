# Git Commit Strategy

## 你已經完成的改動總結

本次改進包含 3 個領域的變更，建議分組提交以保持歷史清晰：

---

## 📋 推薦提交分組

### 第 1 組：環境檢查與診斷系統
**Scope**: DevOps / Build Tools  
**Files**:
- `.env.example` (NEW)
- `.gitignore` (NEW)
- `scripts/check-env.js` (NEW)
- `package.json` (UPDATED - added npm scripts)

**提交訊息**:
```
feat: add environment validation system

- Add .env.example with all required and optional variables
- Add check-env.js script to validate configuration
- Add npm scripts: `npm run check-env`, `npm run doctor`
- Add .gitignore to exclude node_modules, .env, .DS_Store
- Improves development experience and reduces setup errors
```

**命令**:
```bash
cd "/Users/tsaishiangen/Desktop/무제 폴더"
git add .env.example .gitignore scripts/ package.json
git commit -m "feat: add environment validation system"
```

---

### 第 2 組：伺服器穩定性與埠管理
**Scope**: Server / Infrastructure  
**Files**:
- `paypal_server.js` (UPDATED - port fallback logic)

**提交訊息**:
```
fix: add automatic port fallback and improve server resilience

- Implement isPortAvailable() check before listening
- Auto-retry on next available port (3000-3009) if port in use
- Improve Stripe redirect URL handling with fallback logic
- Prevents EADDRINUSE crashes and improves reliability
```

**命令**:
```bash
cd "/Users/tsaishiangen/Desktop/무제 폴더"
git add paypal_server.js
git commit -m "fix: add automatic port fallback and improve server resilience"
```

---

### 第 3 組：CCTV 監控系統與 OpenClaw 整合
**Scope**: Features / Monitoring  
**Files**:
- `paypal_server.js` (UPDATED - add CCTV API endpoints)
- `OPENCLAW_INTEGRATION.md` (NEW)

**提交訊息**:
```
feat: add CCTV monitoring API and OpenClaw integration framework

- Add /cctv-api/* endpoints (health, sensors, events, status)
- Implement fallback CCTV data for dashboard
- Add OPENCLAW_API_URL support for real backend integration
- Add OPENCLAW_INTEGRATION.md with setup guide and roadmap
- Ready for WebSocket and real-time alerts (future)
```

**命令**:
```bash
cd "/Users/tsaishiangen/Desktop/무제 폴더"
git add paypal_server.js OPENCLAW_INTEGRATION.md
git commit -m "feat: add CCTV monitoring API and OpenClaw integration framework"
```

---

## 📊 預期結果

執行完上述 3 個提交後：
- ✅ 環境診斷系統完整可用
- ✅ 伺服器從不穩定變穩定
- ✅ CCTV 儀表板有實際 API 支撐
- ✅ 為 OpenClaw 整合預留了擴展空間
- ✅ Git 歷史清晰，易於追蹤和回滾

---

## 🚀 驗證步驟

執行提交前，先驗證一切正常：

```bash
# 環境檢查
npm run check-env

# 測試 CCTV API
curl http://localhost:3000/cctv-api/health

# 檢查 git 狀態
git status
```

---

## 🎯 不提交的檔案

以下檔案保留到次數提交或本地開發：
- `MyLittleProject/**` (其他專案)
- `stitch_assets/*` (現有 HTML - 已有變更但非本次重點)
- `.DS_Store` (非代碼文件)
- `node_modules/` (已忽略)
