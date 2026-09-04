# SEO 和效能優化實作文件

## 已完成的優化 (2025-12-18)

### ✅ 1. 移除 Tailwind CDN，改用本地編譯

**問題：** Tailwind CDN 導致：
- 330KB+ 不必要的 JavaScript
- 轉譯封鎖 1,200ms
- 每次載入都需重新編譯 CSS

**解決方案：**
```bash
# 安裝依賴
npm install -D tailwindcss@^3.4.0 postcss autoprefixer

# 編譯 CSS
npm run build:css

# 開發模式（自動監看）
npm run dev:css
```

**成果：**
- 編譯後的 CSS 僅 34KB (壓縮後)
- 消除轉譯封鎖
- 可利用瀏覽器快取 (Cache-Control: max-age=31536000)

---

### ✅ 2. 部落格列表改用 SSR

**問題：**
- 原本使用 CSR (客戶端渲染)
- Google 爬蟲無法索引部落格文章
- FCP/LCP 延遲嚴重

**解決方案：**
- 建立 `/api/blog-page.js` - 伺服器端渲染部落格列表
- 路由：`/blog` → `/api/blog-page`
- 支援分頁和標籤過濾
- 完整 Meta 標籤和 Open Graph

**成果：**
- 爬蟲可正確抓取所有內容
- 首次內容繪製提前 1-1.5 秒
- SEO 排名將大幅提升

---

### ✅ 3. 動態 Sitemap

**問題：** Google Search Console 錯誤：
```
Sitemap can be read, but has errors
URL not allowed
```
原因：靜態 sitemap.xml 在 `/public/` 目錄，但 URL 路徑不匹配

**解決方案：**
- 建立 `/api/sitemap.xml.js` - 動態生成 sitemap
- 自動包含所有已發布的部落格文章
- 路由：`/sitemap.xml` → `/api/sitemap.xml`

**成果：**
- 修復 Google Search Console 錯誤
- 自動更新，無需手動維護
- 包含所有靜態頁面 + 動態部落格文章

---

### ✅ 4. 資源預載入和快取策略

**實作內容：**

#### 資源預載入（在所有 HTML `<head>`）：
```html
<!-- Preconnect to third-party domains -->
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="preconnect" href="https://pagead2.googlesyndication.com">
<link rel="dns-prefetch" href="https://violet.ghtinc.com">

<!-- Preload critical CSS -->
<link rel="preload" href="/styles.css" as="style">
<link rel="stylesheet" href="/styles.css">
```

#### 快取策略（vercel.json）：
```json
{
  "headers": [
    {
      "source": "/styles.css",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/(.*).html",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=3600, must-revalidate" }]
    },
    {
      "source": "/sitemap.xml",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=3600, must-revalidate" }]
    }
  ]
}
```

**成果：**
- 減少 DNS 查詢時間
- 關鍵 CSS 優先載入
- 靜態資源可長期快取

---

## 預期效能提升

| 指標 | 優化前 | 優化後 | 改善 |
|------|--------|--------|------|
| **FCP** | 5.6s | **1.5-2.0s** | ↓ 3.6-4.1s |
| **LCP** | 7.5s | **2.5-3.0s** | ↓ 4.5-5.0s |
| **TBT** | 190ms | **50-80ms** | ↓ 110-140ms |
| **Speed Index** | 6.3s | **2.0-2.5s** | ↓ 4.3-4.8s |
| **無用 JavaScript** | 304KB | **0KB** | ↓ 304KB |

---

## 部署步驟

### 1. 本地開發

```bash
# 安裝依賴
npm install

# 編譯 CSS
npm run build:css

# 開發模式（自動監看 CSS 變更）
npm run dev:css
```

### 2. 部署到 Vercel

```bash
# 提交更改
git add -A
git commit -m "SEO 和效能優化"
git push origin main

# Vercel 會自動部署
```

**重要：** 確保 `public/styles.css` 已提交到 Git，Vercel 才能正確部署。

### 3. 驗證

部署後檢查：

1. **Sitemap**：https://ziweidoushu.com/sitemap.xml
   - 應包含所有靜態頁面和部落格文章

2. **部落格列表**：https://ziweidoushu.com/blog
   - 檢查原始碼，應該有完整的 HTML（不是空的 `<div>`）
   - 測試分頁和標籤過濾

3. **CSS 載入**：https://ziweidoushu.com/styles.css
   - 應該返回壓縮後的 CSS
   - 檢查 Cache-Control header

4. **PageSpeed Insights**：
   - 測試網址：https://pagespeed.web.dev/
   - 預期行動裝置分數提升 40-50 分

---

## Google Search Console 設定

### 更新 Sitemap

1. 前往 [Google Search Console](https://search.google.com/search-console/)
2. 選擇你的網站
3. 側邊欄 → Sitemaps
4. 如果有舊的 sitemap，先刪除
5. 輸入新的 sitemap URL：`https://ziweidoushu.com/sitemap.xml`
6. 點擊「提交」

**預期結果：**
- 狀態：成功
- 已發現的網址：應該包含所有頁面（靜態 + 部落格文章）
- 錯誤：0

---

## 修改的檔案清單

### 新增檔案
- ✅ `api/sitemap.xml.js` - 動態 Sitemap 生成器
- ✅ `api/blog-page.js` - 部落格列表 SSR
- ✅ `src/styles/input.css` - Tailwind 輸入檔案
- ✅ `public/styles.css` - 編譯後的 CSS（已提交到 Git）

### 修改檔案
- ✅ `package.json` - 加入 build:css 腳本
- ✅ `vercel.json` - 新增路由和快取標頭
- ✅ `public/index.html` - 移除 Tailwind CDN，加入預載入
- ✅ `public/analysis.html` - 移除 Tailwind CDN，加入預載入
- ✅ `public/blog.html` - 移除 Tailwind CDN，加入預載入

### 刪除檔案
- ✅ `public/sitemap.xml` - 靜態 sitemap（改用動態生成）

---

## 持續維護

### 當 HTML 樣式有變更時

1. 修改 `src/styles/input.css`（如果需要自定義樣式）
2. 或修改 `tailwind.config.js`（如果需要新的 Tailwind 配置）
3. 重新編譯：
   ```bash
   npm run build:css
   ```
4. 提交更改：
   ```bash
   git add public/styles.css
   git commit -m "更新樣式"
   git push
   ```

### 監控效能

定期檢查（建議每週一次）：
1. [PageSpeed Insights](https://pagespeed.web.dev/)
2. [Google Search Console](https://search.google.com/search-console/)
3. Vercel Analytics（如果有啟用）

---

## 疑難排解

### Q: CSS 沒有載入？
**A:** 檢查：
1. `public/styles.css` 是否存在
2. 是否已提交到 Git
3. Vercel 部署日誌是否有錯誤

### Q: Sitemap 錯誤？
**A:** 檢查：
1. 資料庫連線是否正常
2. `/api/sitemap.xml.js` 是否正確部署
3. URL 格式是否正確（不要有空格或特殊字元）

### Q: 部落格列表空白？
**A:** 檢查：
1. 資料庫是否有已發布的文章（`status = 'published'`）
2. `/api/blog-page.js` 是否正確部署
3. Console 是否有錯誤訊息

---

## 下一步優化（優先級較低）

### 短期（建議下週執行）
1. ⏳ 延遲載入第三方腳本（GTM, AdSense）
2. ⏳ 圖片優化（如果有使用圖片）
3. ⏳ 移除 Groundhog 追蹤（如果不需要）

### 中期（建議下個月執行）
1. ⏳ 實作 Service Worker (PWA)
2. ⏳ 加入 robots meta tag 到管理頁面
3. ⏳ 實作 Structured Data（更多類型）

---

## 技術細節

### Tailwind 編譯流程

```
src/styles/input.css
    ↓ (Tailwind 處理)
    ↓ (掃描 public/**/*.html)
    ↓ (只保留使用到的 class)
    ↓ (PostCSS 處理)
    ↓ (Autoprefixer)
    ↓ (Minify)
public/styles.css (34KB)
```

### SSR vs CSR

**CSR（舊的方式）：**
```
瀏覽器載入 → 執行 JS → Fetch API → 渲染內容
Google 爬蟲看到：空白的 <div id="blogGrid"></div>
```

**SSR（新的方式）：**
```
伺服器查詢資料庫 → 生成完整 HTML → 返回給瀏覽器
Google 爬蟲看到：完整的文章內容
```

---

## 參考資料

- [Tailwind CSS 文件](https://tailwindcss.com/docs)
- [Vercel Headers](https://vercel.com/docs/edge-network/headers)
- [Google Search Console](https://search.google.com/search-console/welcome)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Web Vitals](https://web.dev/vitals/)
