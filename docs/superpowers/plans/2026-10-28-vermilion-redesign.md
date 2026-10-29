# 朱砂視覺改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把全站視覺從紫藍漸層換成「朱砂」單一主色加墨色中性色的編輯式風格，換上無文字的命盤格標誌，首頁改成第一屏即可排盤，並統一 AI 參與程度的用詞為「AI 輔助、人工監督」。

**Architecture:** 在 `tailwind.config.js` 建立語意色票 `brand`（朱砂）與 `ink`（帶墨紫色調的中性色）取代 `zodiac`／紫／靛／漸層；在 `src/styles/input.css` 定義少量共用元件 class 避免各頁漂移；首頁表單用分頁暫存（sessionStorage）把資料交給 analysis 頁自動排盤；首頁「最新文章」在瀏覽器端呼叫既有 API，首頁維持靜態。analysis 本輪只換 token。全部在 `redesign/vermilion` 分支進行，每個 task 推分支用 Vercel Preview 驗證，合併由使用者決定。

**Tech Stack:** Next.js 16、React 19、Tailwind **3.4**（不遷移 v4；離線編譯 `npm run build:css` → `public/styles.css`，該檔被 git 追蹤）、`next/font`、sharp（已安裝）、新增 `@phosphor-icons/react`、Jest（`testEnvironment: 'node'`，測試放 `test/`）。

**Spec:** 定稿頁 https://claude.ai/artifact/Xx8Vq2Jb7mCr5fxVeMHwWn （主色選「朱砂」）與本計畫的「已定決策」。取代 `docs/purple-brand-retirement-plan.md`。

## 已定決策（2026-10-28，使用者確認）

| # | 項目 | 決定 |
|---|---|---|
| 0 | 主色 | 朱砂 |
| — | 標誌 | A 命盤格，無文字 |
| — | 首頁 | 第一屏文案加排盤表單；下半依序三步驟、最新文章、紫微斗數說明、常見問題、內容政策列 |
| — | 部落格 | 單欄列表、襯線標題、標籤收合；文章頁單欄、襯線標題 |
| 1 | 表單交接 | 存 sessionStorage，analysis 頁讀到即自動排盤；生日與姓名不進網址 |
| 2 | 姓名 | 首頁表單含姓名，與分析頁一致 |
| 3 | 最新文章 | 瀏覽器端呼叫既有 `GET /api/blog/list?limit=3&language=<locale>` |
| 4 | 首頁既有說明與 FAQ | 保留，改編輯式段落，放在最新文章之後 |
| 5 | 導覽列 | 新增「價格」連結；首頁不顯示「開始分析命盤」按鈕，其他頁照常 |
| 6 | 部落格標籤 | 依文章數取前 6 個，其餘收進「全部主題」 |
| 7 | 文章免責聲明 | 維持「經站方監督」，這次不動 |
| 8 | 首頁英文版 | 同版型，英文文案由 Claude 起草、使用者審 |

## Global Constraints

- **Vercel Hobby 上限 12 個 Function，`api/` 已佔 11。** 不得新增 `api/` 檔；不得在任何 layout／page 加 `generateStaticParams`、`dynamicParams`、`revalidate`；首頁不得改成伺服器端讀資料庫。每個 task 推分支後確認 Preview 部署成功才算完成（2026-10-28 踩過）。
- **不動：** `api/**`、n8n 與 `docs/n8n-weekly-blog-workflow.*`、金流邏輯、JSON-LD 內容、網址、既有導覽文字（只新增「價格」）、表單欄位名稱與驗證規則、GA4 事件名稱與觸發點（`chart_calculated` 仍在 analysis 頁觸發）、廣告位置與數量、`app/[locale]/layout.tsx` 裡的 GTM／AdSense／Groundhog 腳本與 `google-adsense-account` meta。
- **色彩：** 全站只有一個主色 `brand`，主色 `brand-600 #9C3D25`。禁止任何漸層與 `purple|violet|indigo|fuchsia|zodiac` class，禁止純黑。
- **色票（hex 照抄）：**
  `brand` 50 `#FBF2EF`、100 `#F5E0D9`、200 `#EBC0B2`、300 `#DC9580`、400 `#D9785E`、500 `#B54E33`、600 `#9C3D25`、700 `#80321F`、800 `#64281A`、900 `#4A1E14`；
  `ink` 50 `#F6F6F8`、100 `#ECECF0`、200 `#D9D9E0`、300 `#B9B9C4`、400 `#8C8C9B`、500 `#6A6A7A`、600 `#4E4E5C`、700 `#3A3A46`、800 `#26262F`、900 `#17171E`。
- **紅色撞色規則：** 主色是紅，錯誤狀態不能只靠顏色。所有錯誤訊息一律「圖示（Phosphor `WarningCircle`）加文字」，錯誤色用 `#B42318`（比主色更正紅），並搭配錯誤框線。命盤星曜亮度的紅色分級（`red-400`）保留不動。
- **形狀：** 按鈕與輸入框 `rounded-lg`（8px），卡片與容器 `rounded-xl`（12px），語言切換與頭像 `rounded-full`。
- **字型：** `next/font/google` 自架。Noto Sans TC（400、500、700）用於介面與內文；Noto Serif TC（600）只用於部落格列表標題、首頁最新文章標題、文章頁標題。`display: 'swap'`。
- **圖示：** emoji 一律移除（含翻譯字串裡的）；改用 Phosphor，**一律逐一引入**：client 元件 `@phosphor-icons/react/dist/csr/<Icon>`、Server Component `@phosphor-icons/react/dist/ssr/<Icon>`。從套件根目錄引入在本專案 `moduleResolution: nodenext` 下型別解析不到，而 `next.config.js` 的 `ignoreBuildErrors: true` 會把錯誤藏起來，每個 task 都要跑 `npx tsc --noEmit -p .` 確認 `.next/` 以外沒有錯誤。不得手繪 SVG 圖示（標誌除外）。
- **互動：** 按鈕與連結有 hover、`active:scale-[0.98]`、`focus-visible` 外框；動畫只用 CSS `transform`／`opacity`，尊重 `prefers-reduced-motion`。
- **用詞：** 頁面說明統一「AI 輔助、人工監督」（英文 `AI-assisted, human-supervised`）。文章免責聲明 `本內容由 AI 輔助撰寫、經站方監督，僅供娛樂和文化學習參考` 不得更動。繁中「——」是正常標點。
- **範圍外：** 深色模式；analysis 版面重設計（本輪只 token）；NavBar 語言切換永遠連到 `/blog`（既有問題）；`api/blog/list.js` 接受公開的 `status`／`includeAll` 參數，可讀到草稿與已下架文章（既有安全問題，改版後另開任務）。

## Review Focus

1. `public/styles.css` 沒重編或沒提交 → 頁面無樣式：Tailwind 只輸出頁面實際用到的 class（`@layer components` 也一樣），所以從 Task 3 起，每個 task 都要確認該 task 新用到的 class（如 `.btn-primary`、`.bg-brand-600`）已出現在 `public/styles.css`。
2. 首頁交接資料殘留或被重複使用（重新整理 analysis 頁又自動排一次、換人填卻沿用舊資料）：`takeBirthInput()` 讀完即刪除，測試釘住。
3. sessionStorage 不可用（隱私模式、被封鎖）時首頁表單不能壞掉：存取包 try/catch，失敗時退回導向 analysis 頁讓使用者重填，測試釘住。
4. 最新文章 API 失敗或回傳空陣列：區塊顯示「所有文章」連結而非空白或錯誤，Task 5 驗證。
5. 手機 375px 導覽列（多了「價格」）溢出：逐頁截圖確認單行。
6. 錯誤訊息與主色混淆：analysis 表單故意漏填，確認錯誤訊息有圖示加文字。

---

### Task 0: 分支與改前基準

**Files:**
- Create: `docs/redesign/baseline-urls.md`

- [ ] **Step 1:** 從 `main` 建立 `redesign/vermilion`。
- [ ] **Step 2:** 網址清單：`/zh-TW`、`/en`、`/zh-TW/pricing`、`/en/pricing`、`/zh-TW/analysis`、`/zh-TW/blog`、`/en/blog`、一篇中文與一篇英文文章、`/zh-TW/about`、`/zh-TW/privacy-policy`、`/foo/bar`（404）、`/payment-success.html`、`/payment-failed.html`。
- [ ] **Step 3:** 以 headless Chrome 透過 CDP（`Emulation.setDeviceMetricsOverride`，375 寬時 `mobile: true`）對清單各截 1440 與 375 寬的整頁圖存到 session scratchpad `before/`。**不要用 `--window-size=375`**：桌面 Chrome 視窗有最小寬度，版面會以約 500px 排版後被裁切，看起來像溢出但其實不是。記錄 `grep -rn "經站方監督" app docs/n8n-weekly-blog-workflow.md | wc -l` 作為基準。analysis 結果頁需要互動，改用瀏覽器手動截一張。
- [ ] **Step 4:** Commit 計畫與網址清單。

### Task 1: 色票、字型、共用元件與「紫色閘門」

**Files:**
- Create: `scripts/check-palette.js`
- Modify: `package.json`、`tailwind.config.js`、`src/styles/input.css`、`app/[locale]/layout.tsx`

**Interfaces:**
- Produces: 色票 `brand-*`、`ink-*`、`danger`（`#B42318`）；`font-sans`／`font-serif` 對應 CSS 變數 `--font-sans`、`--font-serif`；共用 class `.btn-primary`、`.btn-secondary`、`.surface`、`.field`、`.link`、`.field-error`。

- [ ] **Step 1:** 寫 `scripts/check-palette.js`：掃 `app/`、`src/`、`public/*.html`，出現 `purple|violet|indigo|fuchsia|zodiac`、`bg-gradient`、`from-`／`via-`／`to-` 漸層 class、`#9333ea`、`#a855f7` 即列出並 exit 1。`package.json` 加 `"check:palette"`。
- [ ] **Step 2:** 執行，預期失敗並列出約 20 個檔案。
- [ ] **Step 3:** `tailwind.config.js` 移除 `zodiac`、覆寫的 `blue`、`china`，加入 `brand`、`ink`、`danger`；`fontFamily.sans`／`serif` 指向 CSS 變數。
- [ ] **Step 4:** `input.css` 刪 `.gradient-text`；在 `@layer components` 定義共用 class（主按鈕 `bg-brand-600 hover:bg-brand-700 text-white rounded-lg`，`.field-error` 為 `border-danger` 加錯誤文字樣式）；`body` 改 `bg-ink-50 text-ink-800`。
- [ ] **Step 5:** `layout.tsx` 以 `next/font/google` 載入兩個字型並把變數掛到 `<html>`，`<body>` 移除漸層。`npm i @phosphor-icons/react`。
- [ ] **Step 6:** `npm run build:css`，確認 `public/styles.css` 的 `body` 規則已是 `ink-50` 底色與 `var(--font-sans)`（新 class 要等頁面用到才會被編入）；`npm run build` 成功，路由分類不變。
- [ ] **Step 7:** Commit `feat(design): vermilion tokens, fonts and palette gate`（閘門此時仍失敗，Task 10 要求通過）。

### Task 2: 命盤格標誌、favicon 與分享圖

**Files:**
- Create: `public/logo-mark.svg`、`scripts/build-og.js`
- Modify: `public/favicon.svg`、`public/og-image.svg`、`public/og-image.png`

**Interfaces:**
- Produces: `logo-mark.svg`（完整版，viewBox `0 0 32 32`）與 `favicon.svg`（≤24px 簡化版）；圖形與定稿頁 `#a`／`#a-sm` symbol 相同，星點色 `brand-600`、線條 `ink-900`。**檔案網址不變**。

- [ ] **Step 1:** 依定稿頁的 symbol 產出兩個 SVG（把 `var(--mark-star)`、`currentColor` 換成實際色碼）。
- [ ] **Step 2:** `og-image.svg`：標誌放大置左，右側「AI 紫微斗數」與 `Zi Wei Dou Shu`，底色 `ink-50`。
- [ ] **Step 3:** `scripts/build-og.js` 用 sharp 輸出 1200×630 `og-image.png`；開圖確認。
- [ ] **Step 4:** Commit `feat(brand): wordless chart mark, favicon and og image`。

### Task 3: 導覽列與外殼

**Files:**
- Modify: `app/components/NavBar.tsx`、`app/[locale]/layout.tsx`、`app/global-not-found.tsx`

- [ ] **Step 1:** NavBar 以 `logo-mark.svg` 取代現有圖示；新增「價格」（`/${locale}/pricing`，英文 `Pricing`）；用 `usePathname()` 判斷是否為首頁（`/${locale}` 或 `/${locale}/`），首頁不渲染「開始分析命盤」按鈕；語言切換改 `ink` 中性色；桌機單行、高度 ≤ 72px，行動版漢堡選單也加「價格」。
- [ ] **Step 2:** `global-not-found.tsx` 與 layout 殘留色改 token。
- [ ] **Step 3:** `build:css`、`build`、推分支、Preview 成功；375px 不溢出。Commit `feat(design): navbar and shell`。

### Task 4: analysis 換 token 與交接讀取

**Files:**
- Create: `app/lib/birthHandoff.ts`、`test/birthHandoff.test.ts`
- Modify: `app/[locale]/analysis/AnalysisClient.tsx`、`app/[locale]/analysis/components/{AnalysisForm,DestinyChart,DetailedAnalysis,QASection,StarAnalysis}.tsx`

**Interfaces:**
- Produces: `type BirthInput = { name: string; gender: string; calendarType: string; birthYear: string; birthMonth: string; birthDay: string; birthHour: string; isLeapMonth: boolean }`（欄位與 `AnalysisForm` 送出的物件相同）；`saveBirthInput(input: BirthInput, storage?: Storage): boolean`、`takeBirthInput(storage?: Storage): BirthInput | null`。鍵名 `aiziwei:birth-input`。

- [ ] **Step 1: 寫失敗的測試** `test/birthHandoff.test.ts`（以假的 Storage 物件注入）：
  - `saveBirthInput` 後 `takeBirthInput` 回傳相同物件；
  - 第二次 `takeBirthInput` 回傳 `null`（讀完即刪，Review Focus 2）；
  - 存入格式錯誤的 JSON 時回傳 `null` 且不拋錯；
  - storage 的 `setItem`／`getItem` 拋錯時，`saveBirthInput` 回傳 `false`、`takeBirthInput` 回傳 `null`（Review Focus 3）。
- [ ] **Step 2:** `npm test -- birthHandoff`，預期失敗。
- [ ] **Step 3:** 實作 `app/lib/birthHandoff.ts`（storage 參數預設 `window.sessionStorage`，在 `typeof window === 'undefined'` 時直接回傳 `false`／`null`）。
- [ ] **Step 4:** 測試通過。
- [ ] **Step 5:** `AnalysisClient` 掛載時呼叫 `takeBirthInput()`，有資料就走與表單送出相同的計算路徑（同一個函式，因此 `chart_calculated` 照常觸發一次）；沒有資料則維持現狀。
- [ ] **Step 6:** 各元件 `purple-*`／`blue-*`／漸層換 `brand-*`／`ink-*`；按鈕、輸入框改共用 class；性別、曆法、步驟指示改同一個主色；`AnalysisForm` 錯誤訊息改「Phosphor `WarningCircle` 加文字」（Review Focus 6）；`StarAnalysis` 亮度分級顏色保留。
- [ ] **Step 7:** 本機走完整流程（填表、命盤、星曜、解析、問答）；Commit `feat(design): analysis tokens and birth input handoff`。

### Task 5: 首頁

**Files:**
- Create: `app/components/home/HomeBirthForm.tsx`（client）、`app/components/home/LatestPosts.tsx`（client）
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: Task 4 的 `saveBirthInput`、`BirthInput`；`AnalysisForm` 現有的年份、時辰選項資料（抽成共用常數或直接 import，不複製一份）。

- [ ] **Step 1:** `HomeBirthForm`：欄位與順序同定稿（姓名、性別、曆法、年月日、時辰、農曆時的閏月），驗證規則與 `AnalysisForm` 相同；送出時 `saveBirthInput()` 後 `router.push('/${locale}/analysis')`；若 `saveBirthInput` 回傳 `false`，仍導向 analysis（使用者在那裡重填）。
- [ ] **Step 2:** `LatestPosts`：`fetch('/api/blog/list?limit=3&language=' + locale)`，渲染三篇（第一篇大標加摘要，後兩篇只有標題與日期）；載入中顯示同尺寸骨架；失敗或空陣列只顯示「所有文章」連結（Review Focus 4）。
- [ ] **Step 3:** `page.tsx` 依定稿重組：hero（標題、副標、免費與付費兩個事實、右側表單）、三步驟、最新文章、「關於紫微斗數」（由來、為什麼中州派）、常見問題（`<dl>`，**現有 6 題全部保留**，定稿頁只畫了 3 題）、內容政策列。移除置中 hero、膠囊、三張彩色卡片、所有 emoji，以及底部「準備好探索您的命運嗎」行動區塊（與首屏表單同目的）；該區塊的服務免責聲明「本服務僅供娛樂和文化學習參考，不應作為重要決策的依據」原文移到內容政策列保留。
- [ ] **Step 4: 用詞。** 中文 `card3p` 與「網站上的文章是誰寫的」答案、英文對應兩處，改為 AI 輔助撰寫、人工監督、文末附引用來源、「王老師」為編輯筆名（與 About 一致）。
- [ ] **Step 5: 英文版。** 依同版型起草英文文案（含時辰說明如 `Zi hour, 11 pm to 1 am`），**先交給使用者審，審過才 commit 英文字串**。
- [ ] **Step 6:** `generateMetadata` 與 JSON-LD 不動；確認首頁 build 結果仍為靜態（`●`），否則停下回報。
- [ ] **Step 7:** Preview 驗證兩語系、桌機與手機；Commit `feat(design): homepage with birth form and latest posts`。

### Task 6: 定價頁

**Files:**
- Modify: `app/[locale]/pricing/page.tsx`

- [ ] **Step 1:** 依定稿：兩欄對齊、推薦方案主色實底、移除 emoji 與黃色徽章、勾選改 Phosphor。文字、價格、metadata、JSON-LD 一字不動。
- [ ] **Step 2:** Preview 驗證，Commit `feat(design): pricing`。

### Task 7: 部落格列表與文章頁

**Files:**
- Modify: `app/lib/blog.ts`（標籤查詢）、`app/components/blog/BlogList.tsx`、`app/components/blog/BlogPost.tsx`

**Interfaces:**
- Produces: `getBlogPosts()` 回傳的 `allTags` 依文章數由多到少排序（SQL 改為 `GROUP BY tag ORDER BY COUNT(*) DESC, tag`），型別仍為 `string[]`。

- [ ] **Step 1:** `blog.ts` 標籤查詢改排序；`BlogList` 預設只顯示前 6 個，「全部主題」展開其餘（client 狀態，不改 `?tag=` 行為）；目前選中的標籤若不在前 6 個，也要顯示在預設列中。
- [ ] **Step 2:** 列表改無卡片單欄、標題 `font-serif`；四個 `AdUnit` 的位置與數量不變。
- [ ] **Step 3:** 文章頁：單欄、標題 `font-serif`、作者列移除 ✍️、內文 `prose` 用 `ink-800`；`AdSidebarRight` 與內文 `AdUnit` 不動；免責聲明不動。
- [ ] **Step 4:** Preview 驗證兩語系，Commit `feat(design): blog list and post`。

### Task 8: About、隱私政策

- [ ] **Step 1:** `about`、`privacy-policy` 頁換 token 與共用 class，內容不動。Commit `feat(design): about and privacy`。

### Task 9: 靜態頁與遺留頁

**Files:**
- Modify: `public/payment-success.html`、`public/payment-failed.html`、`public/admin-login.html`、`public/admin-dashboard.html`
- Delete: `public/blog.html`

- [ ] **Step 1:** 確認 `/sitemap.xml` 不含 `blog.html` 後刪除（已確認程式與 `vercel.json` 無引用）。
- [ ] **Step 2:** 其餘四頁只換 class 與色碼，不動金流參數、表單、GTM 呼叫與導向網址。
- [ ] **Step 3:** `build:css`。Commit `feat(design): static pages, remove legacy blog.html`。

### Task 10: 驗收

**Files:**
- Modify: `docs/purple-brand-retirement-plan.md`（標註已由本計畫取代）

- [ ] **Step 1:** `npm run check:palette` exit 0。
- [ ] **Step 2:** `npm run build:css && npm run build && npm test` 全過；首頁仍為 `●`。
- [ ] **Step 3:** `git diff main --stat -- api docs/n8n-weekly-blog-workflow.json docs/n8n-weekly-blog-workflow.md` 為空；「經站方監督」計數與基準相同。
- [ ] **Step 4:** 推分支、Preview 成功；Task 0 清單重截比對；首頁與文章頁 Lighthouse 看 LCP、CLS；GTM 與 AdSense 腳本在、`<html lang>` 正確。
- [ ] **Step 5:** 最強模型做一次整支分支審查；結果與截圖比對交使用者，**由使用者決定是否合併**。合併後重抓 Facebook／Twitter 分享圖快取、看 Search Console、更新 vault。
