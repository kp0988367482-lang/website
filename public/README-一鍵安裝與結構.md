# 一鍵安裝與資料夾結構自動建立

## 1. 推薦資料夾結構
```
/public         # 靜態資源（圖片、md、html）
/css            # 樣式表
/assets         # 圖片、字體等
/views          # EJS 模板
/routes         # Node.js 路由
.env            # 環境變數（API 金鑰等）
```

## 2. 一鍵安裝腳本（macOS/Linux 範例）
```sh
mkdir -p public css assets views routes
npm init -y
```

## 3. 注意事項
- 請勿將敏感資訊（如金流金鑰）寫在程式碼中，應放在 .env。
- 結構可依實際需求調整。
