# Markdown 顯示說明

## 1. 將 markdown 檔案放入 public/ 目錄
- 例如：`public/SKILL.md`、`public/toolkit.md`

## 2. 建立 html 顯示頁面
- 參考：`public/seoulmate-skill.html`
- 使用 marked.js 讀取並渲染 markdown

```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<div id="content"></div>
<script>
  fetch('/public/SKILL.md')
    .then(r => r.text())
    .then(md => { document.getElementById('content').innerHTML = marked.parse(md); });
</script>
```

## 3. 注意事項
- fetch 路徑需正確對應 markdown 檔案位置。
- public/ 目錄下的檔案可直接用網址存取。
