---
page: member-dashboard-v2
---
# Member Dashboard v2 — SeoulMate 會員中心強化版

Rebuild `member.html` into a full-featured member dashboard. The current version is minimal. This new version should feel like a real SaaS product dashboard.

## Visual Identity
- **Background**: #0a0a0a, same dark brand system as pricing.html / index.html
- **Accent**: #ff2a5f (pink) for pro features, #facc15 (gold) for elite, #00e5ff (cyan) for data
- **Fonts**: Bebas Neue (section titles), Inter (body), DM Mono (stats/numbers)
- **Style**: Sidebar layout on desktop, bottom tab-bar on mobile

## Current State
- `member.html` exists but only shows basic welcome info and plan badge
- `db.js` available: `FutureDB.getSession()`, `FutureDB.getUserOrders()`, `FutureDB.getInquiries()`

## Page Layout

### Sidebar / Nav Tabs
- 總覽 Overview (default)
- 我的方案 My Plan
- 訂單記錄 Orders
- 我的諮詢 My Inquiries
- 設定 Settings

### 1. 總覽 Overview
- Welcome header: "歡迎回來, {name}" (read from FutureDB session)
- Plan badge (Starter / Pro / Elite) with expiry date
- 快速統計: 訂閱天數 / 訂單數 / 累積諮詢次數
- 快速入口按鈕: CCTV 後台 / AI 指揮中心 / 聯絡顧問 / 比較中心

### 2. 我的方案 My Plan
- Current plan card with all included features (check/cross list)
- Upgrade CTA if on Starter or Pro
- Next billing date (default estimate: 30 days from session.loginAt)

### 3. 訂單記錄 Orders
- Table: 日期 / 方案 / 金額 / 狀態
- Reads from `FutureDB.getUserOrders(session.email)`
- Empty state: "尚無訂單，立即升級方案"

### 4. 我的諮詢 My Inquiries
- Table: 提交日期 / 類別 / 狀態 (pending/replied/closed)
- Reads from `sm_inquiries` filtered by contact (email or name)
- Empty state: "尚未提交諮詢" + CTA to contact-expert.html

### 5. 設定 Settings
- Display name (read-only from session)
- Email (read-only)
- Logout button → calls `FutureDB.endSession()` then redirect to login.html
- Danger zone: Clear local data

## Technical Requirements
- Use TailwindCSS CDN + Google Fonts
- Read session with `FutureDB.getSession()` on load; redirect to `login.html` if null
- All user data rendered with `textContent` (XSS safe)
- LocalStorage-only (no server calls)
- Mobile responsive (tab bar at bottom on small screens)
