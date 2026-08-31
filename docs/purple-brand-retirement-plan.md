# 紫色主色系退場計畫

狀態：**已規劃、尚未執行**
觸發條件：AdSense 審核通過、廣告開始正常運作後才啟動。在那之前不動任何 code。
建立日期：2026-08-31

## 背景

taste-skill 視覺審查發現全站主色（紫→藍漸層 `purple-600` → `blue-600`）是典型的「AI 產出網站」色彩慣性（LILA RULE）。經盤點，紫色目前已經是這個網站的品牌識別本體，不是可替換的裝飾色，換色是一次品牌識別重塑，不是 CSS 變數置換。

## 影響範圍盤點

| 層級 | 具體位置 | 說明 |
|---|---|---|
| 品牌識別本體 | `public/favicon.svg`、`public/og-image.svg`（社群分享縮圖）、`theme-color` meta（3 個檔案） | 網站最外層識別，換色等於重新設計 logo 跟社群卡片圖 |
| 共用元件 | `gradient-text`（logo 文字漸層，定義在 `src/styles/input.css`）、`.text-gradient-primary`/`.text-gradient-gold`（`tailwind.config.js` 自訂 plugin） | 全站 logo 文字都吃這個 class |
| Tailwind 色票 | `tailwind.config.js` 的 `zodiac` 色階（50-900，數值幾乎完全複製 Tailwind 內建 `purple`） | 專案自訂命名色階，換色需決定新色階叫什麼名字、要不要保留 `zodiac` 這個語意命名 |
| 使用範圍 | **19 個檔案、130+ 處 `purple-*` class**（Next.js app 10 個 + 舊版靜態 html 9 個） | 新舊兩套系統要同批改完，否則品牌不一致 |
| 編譯管線 | `public/styles.css` 是獨立 `npm run build:css` 離線編譯，不吃 Next.js build | 換色後務必記得重新編譯——2026-08-31 手機導覽列改版就因漏編譯導致元件塌陷 |

### 檔案清單

**Next.js app（10 個，Phase 2）**
- `app/components/NavBar.tsx`
- `app/[locale]/page.tsx`
- `app/components/blog/BlogList.tsx`
- `app/components/blog/BlogPost.tsx`
- `app/[locale]/analysis/components/QASection.tsx`
- `app/[locale]/analysis/components/DestinyChart.tsx`
- `app/[locale]/analysis/components/DetailedAnalysis.tsx`
- `app/[locale]/analysis/components/StarAnalysis.tsx`
- `app/[locale]/analysis/components/AnalysisForm.tsx`
- `app/[locale]/analysis/AnalysisClient.tsx`

**舊版靜態 HTML（9 個，Phase 3）**
- `public/pricing.html`
- `public/privacy-policy.html`
- `public/index.html`
- `public/blog.html`
- `public/admin-dashboard.html`
- `public/admin-login.html`
- `public/payment-success.html`
- `public/payment-failed.html`

## 執行階段

### Phase 0：品牌決策（工程開始前必須先定案，不是工程任務）
- 新主色系選哪個方向。可從 taste-skill 報告列的替代色系挑一個，避免落回 AI 常見的米色+黃銅組合：
  - Cold Luxury（銀灰＋鉻＋煙灰）
  - Forest（深綠＋骨白＋琥珀點綴）
  - Black and Tan（真近黑＋暖褐，高對比無米色）
  - Cobalt + Cream（單一飽和藍對比中性色）
  - Terracotta + Slate（暖赭對冷灰）
  - 純單色 + 單一飽和跳色（離白＋離黑＋一個亮色）
- 新 logo / favicon / OG 分享圖：重畫還是只換色不換造型
- `zodiac` 色階要不要保留這個命名，還是連名字一起換

### Phase 1：品牌資產
- `public/favicon.svg`、`public/og-image.svg` 重新輸出
- 3 個檔案的 `theme-color` meta tag
- `tailwind.config.js` 的 `zodiac` 色階、`.text-gradient-primary`/`.text-gradient-gold`
- `src/styles/input.css` 的 `.gradient-text`

### Phase 2：Next.js 正式站
上列 10 個檔案。優先做，因為是流量入口。

### Phase 3：舊版靜態 HTML
上列 9 個檔案。admin/payment 頁面使用者較少看到，但漏改會很明顯（新舊視覺混雜），一定要跟 Phase 2 同批完成，不能分批上線。

### Phase 4：重新編譯 + 驗收
- 跑 `npm run build:css`（`public/**/*.html` 有在 Tailwind content 掃描範圍內，但仍要每次手動重跑確認）
- 逐頁截圖比對：首頁、analysis、部落格列表/文章、pricing、privacy-policy、about
- 社群分享卡片：Facebook/Twitter 連結預覽有快取，換完 OG 圖後可能要手動觸發重新抓取（Facebook Sharing Debugger / Twitter Card Validator），否則舊圖會殘留一陣子

## 風險

1. **品牌識別斷裂**：紫色與「紫微」斗數命名本身有語意連結（紫微星），換色需要有意識決定新的識別邏輯，不是單純換個順眼顏色
2. **一致性風險最高**：19 個檔案分散在 Next.js app、舊靜態頁、內部管理後台、金流成功/失敗頁，漏改一處就會出現兩套視覺同時存在
3. **技術難度不高**：都是 Tailwind utility class（如 `purple-600`），機械性 find/replace 可行，風險主要在「改不改得乾淨」與品牌決策本身，不在程式碼複雜度
4. **編譯陷阱**：`public/styles.css` 獨立編譯的架構容易讓新 class 沒編譯進去而視覺塌陷（已有前例），Phase 4 的重新編譯與截圖驗收不可省略

## 執行前檢查清單

- [ ] AdSense 已通過審核，廣告穩定運作一段時間
- [ ] Phase 0 品牌決策已拍板（新色系、新品牌資產方向、`zodiac` 命名去留）
- [ ] 確認沒有其他站內大改動同時進行（避免多個改版風險疊加）
