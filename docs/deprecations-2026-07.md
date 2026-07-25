# 2026-07 停用項目

## 每日自動發文（n8n）
- 舊的每日發文 workflow 於 n8n 後台停用（手動操作，見 docs/n8n-weekly-blog-workflow.md 上線核對清單）。
- 原因：AdSense 判定低價值內容的主因（模板化、標題重複、無引用無署名）。
- 取代方案：每週策展觀點文 workflow（docs/n8n-weekly-blog-workflow.md）。

## 自動翻譯（兩處）
- `scripts/batch-translate.js`：已加防呆，預設拒絕執行；需人工審校流程時以 `FORCE_TRANSLATE=1` 執行。
- `api/blog/[id].js` 的 `autoTranslateToEnglish`（發文/發布時自動建英文版）：預設停用；需要時設環境變數 `AUTO_TRANSLATE=1` 重新啟用。
- 原因：未經人工審校的機器翻譯屬 Google 定義的低價值內容。
- 後續：中文線穩定後再評估「人工審校後發布」的英文版流程。
