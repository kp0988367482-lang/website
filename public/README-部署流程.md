# 部署流程

## 1. Vercel 部署
- 註冊 [Vercel](https://vercel.com/)，綁定 GitHub 專案。
- push 代碼到 GitHub，Vercel 會自動建置與部署。
- 靜態檔案（public/ 目錄）會自動公開。

## 2. GitHub Pages 部署（僅靜態網頁）
- 將 html、css、js、md 檔案放入 docs/ 或 public/。
- 在 GitHub 設定 Pages 來源為 main 分支的 docs/ 或 public/。

## 3. 注意事項
- GitHub Pages 不支援 Node.js 後端。
- Vercel 支援 serverless function，可處理 webhook、API 等。
