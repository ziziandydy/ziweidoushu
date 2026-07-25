# 每週自動策展觀點文系統 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立知識庫與 `/api/knowledge`、文章作者署名、「關於本站」頁、n8n 每週策展 workflow 設定文件，並停用每日量產與自動翻譯，以通過 AdSense 重審。

**Architecture:** repo 內新增知識庫 JS 資料模組（serverless bundler 可自動打包，不做 md 解析）與一支查詢 API；`blog_posts` 加 `author` 欄位並在前端與 JSON-LD 顯示；About 頁走 Next.js `app/[locale]/about`；n8n 端只給節點級設定文件。

**Tech Stack:** Next.js App Router、Vercel Serverless Functions（CommonJS `api/`）、@vercel/postgres、Jest（testMatch: `**/test/**/*.(test|spec).(ts|tsx|js)`）。

## Global Constraints

- 主要語言 zh-TW；About 頁需同時支援 en（可精簡版）。
- 作者署名預設值：`AI 紫微編輯室`（en: `AI Ziwei Editorial`）。不虛構人設。
- 生成模型規範寫入 n8n 文件：Claude Sonnet 等級，禁止 gpt-4o-mini。
- api/ 目錄為 CommonJS（`module.exports`），沿用 `lib/cors` 的 `setCorsHeaders`/`handleOptions` 模式。
- 每個 Task 完成即 commit，訊息結尾加 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 免責聲明字串（文章與 About 頁一致）：`本內容由 AI 輔助撰寫、經站方監督，僅供娛樂和文化學習參考。`

---

### Task 1: 知識庫資料模組與查詢函式

**Files:**
- Create: `lib/knowledge/entries.js`
- Create: `lib/knowledge/index.js`
- Test: `test/knowledge.test.js`

**Interfaces:**
- Produces: `searchKnowledge(tags: string[], limit?: number)` → `Array<{id, topic, tags, source, text}>`；`ALL_ENTRIES`（entries 陣列）。Task 2 的 API 會 require `../lib/knowledge`。

- [ ] **Step 1: 寫失敗測試**

```js
// test/knowledge.test.js
const { searchKnowledge, ALL_ENTRIES } = require('../lib/knowledge');

describe('knowledge base', () => {
    test('每條 entry 具備必要欄位且有出處', () => {
        expect(ALL_ENTRIES.length).toBeGreaterThanOrEqual(24);
        for (const e of ALL_ENTRIES) {
            expect(typeof e.id).toBe('string');
            expect(typeof e.topic).toBe('string');
            expect(Array.isArray(e.tags)).toBe(true);
            expect(e.tags.length).toBeGreaterThan(0);
            expect(typeof e.source).toBe('string');
            expect(e.source.length).toBeGreaterThan(0);
            expect(e.text.length).toBeGreaterThanOrEqual(120);
        }
    });

    test('id 不重複', () => {
        const ids = ALL_ENTRIES.map(e => e.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    test('依 tag 查詢財帛宮', () => {
        const results = searchKnowledge(['財帛宮']);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].tags).toContain('財帛宮');
    });

    test('多 tag 查詢依命中數排序且尊重 limit', () => {
        const results = searchKnowledge(['財帛宮', '化祿'], 3);
        expect(results.length).toBeLessThanOrEqual(3);
    });

    test('查無 tag 回傳空陣列', () => {
        expect(searchKnowledge(['不存在的標籤'])).toEqual([]);
        expect(searchKnowledge([])).toEqual([]);
    });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx jest test/knowledge.test.js`
Expected: FAIL（Cannot find module '../lib/knowledge'）

- [ ] **Step 3: 建立 entries.js（24 條知識條目）**

格式規範（每條皆須符合，Step 1 的測試會驗證）：

```js
// lib/knowledge/entries.js
// 紫微斗數知識庫：以中州派（王亭之）理論架構為本。
// 每條 entry：id（kebab-case）、topic、tags（含主 tag + 相關 tag）、
// source（理論出處書名）、text（150–300 字繁中論述，站方整理撰寫，非原文抄錄）。
module.exports = [
    {
        id: 'palace-caibo',
        topic: '財帛宮',
        tags: ['財帛宮', '財運', '金錢觀'],
        source: '王亭之《中州派紫微斗數》理論架構',
        text: '財帛宮主一生財富的取得方式與金錢觀，而非單純的財富多寡。中州派強調財帛宮須與福德宮對照：財帛宮見祿存、化祿主財源穩定，但若福德宮不安，縱有財亦難享。觀察財帛宮時應同時參看命宮三方四正，判斷求財手段與性格是否相配；星曜組合吉者，宜順勢而為，凶者反主橫發橫破，須以守成為要。',
    },
    {
        id: 'sihua-hualu',
        topic: '化祿',
        tags: ['化祿', '四化', '財運', '機遇'],
        source: '王亭之《中州派紫微斗數》理論架構',
        text: '化祿為四化之首，主機遇、順遂與資源匯聚，落於何宮即表示該領域易得助力。中州派提醒化祿非單純「有錢」，而是「緣分與流通」：化祿在財帛主財源通暢，在夫妻主感情有緣，在官祿主事業得人和。化祿最忌與化忌同宮沖照，主先得後失；論斷時須看祿之來源（生年祿或流年祿）以分辨長期格局與短期運勢。',
    },
    // …其餘 22 條，依下方清單撰寫，格式與上兩條完全相同
];
```

其餘 22 條的 id / topic / 主 tag 清單（實作者依上述格式與字數逐條撰寫，source 一律為 `王亭之《中州派紫微斗數》理論架構`）：

| id | topic | 必含 tags |
|---|---|---|
| palace-ming | 命宮 | 命宮, 性格, 格局 |
| palace-xiongdi | 兄弟宮 | 兄弟宮, 人際 |
| palace-fuqi | 夫妻宮 | 夫妻宮, 感情, 婚姻 |
| palace-zinv | 子女宮 | 子女宮, 親子 |
| palace-jie | 疾厄宮 | 疾厄宮, 健康 |
| palace-qianyi | 遷移宮 | 遷移宮, 外出, 職場 |
| palace-jiaoyou | 交友宮 | 交友宮, 人際, 職場 |
| palace-guanlu | 官祿宮 | 官祿宮, 事業, 職場 |
| palace-tianzhai | 田宅宮 | 田宅宮, 不動產, 財運 |
| palace-fude | 福德宮 | 福德宮, 心理, 精神生活 |
| palace-fumu | 父母宮 | 父母宮, 長輩 |
| stars-zifu | 紫微天府星系 | 紫微, 天府, 領導, 主星 |
| stars-shapolang | 殺破狼格局 | 七殺, 破軍, 貪狼, 變動, 主星 |
| stars-jiyue | 機月同梁格局 | 天機, 太陰, 天同, 天梁, 穩定, 主星 |
| stars-riyue | 日月星系 | 太陽, 太陰, 巨門, 主星 |
| sihua-huaquan | 化權 | 化權, 四化, 權力, 事業 |
| sihua-huake | 化科 | 化科, 四化, 名聲, 貴人 |
| sihua-huaji | 化忌 | 化忌, 四化, 阻礙, 執念 |
| pattern-sanfang | 三方四正 | 三方四正, 格局, 論斷方法 |
| pattern-dayun | 大限流年 | 大限, 流年, 運勢, 論斷方法 |
| pattern-miaoxian | 星曜廟陷 | 廟旺, 落陷, 星曜亮度, 論斷方法 |
| pattern-jiekong | 空劫煞星 | 地空, 地劫, 煞星, 化解 |

- [ ] **Step 4: 建立 index.js 查詢函式**

```js
// lib/knowledge/index.js
const ALL_ENTRIES = require('./entries');

/**
 * 依 tags 查詢知識條目，依命中 tag 數多→少排序。
 * @param {string[]} tags
 * @param {number} limit
 */
function searchKnowledge(tags, limit = 5) {
    if (!Array.isArray(tags) || tags.length === 0) return [];
    const wanted = tags.map(t => String(t).trim()).filter(Boolean);
    return ALL_ENTRIES
        .map(entry => ({
            entry,
            hits: entry.tags.filter(t => wanted.includes(t)).length,
        }))
        .filter(x => x.hits > 0)
        .sort((a, b) => b.hits - a.hits)
        .slice(0, limit)
        .map(x => x.entry);
}

module.exports = { searchKnowledge, ALL_ENTRIES };
```

- [ ] **Step 5: 執行測試確認通過**

Run: `npx jest test/knowledge.test.js`
Expected: PASS（5 tests）

- [ ] **Step 6: Commit**

```bash
git add lib/knowledge test/knowledge.test.js
git commit -m "feat(knowledge): add ziwei knowledge base module with tag search"
```

---

### Task 2: `/api/knowledge` 查詢端點

**Files:**
- Create: `api/knowledge.js`
- Test: `test/api-knowledge.test.js`

**Interfaces:**
- Consumes: `searchKnowledge` from `lib/knowledge`（Task 1）
- Produces: `GET /api/knowledge?tags=財帛宮,化祿&limit=5` → `{ success: true, count, entries: [{id, topic, tags, source, text}] }`；tags 缺失時 400。n8n workflow（Task 6 文件）呼叫此端點。

- [ ] **Step 1: 寫失敗測試（mock req/res 直接呼叫 handler）**

```js
// test/api-knowledge.test.js
const handler = require('../api/knowledge');

function mockRes() {
    const res = {
        headers: {},
        statusCode: null,
        body: null,
        setHeader(k, v) { this.headers[k] = v; },
        status(code) { this.statusCode = code; return this; },
        json(obj) { this.body = obj; return this; },
        end() { return this; },
    };
    return res;
}

describe('GET /api/knowledge', () => {
    test('依 tags 回傳條目', async () => {
        const res = mockRes();
        await handler({ method: 'GET', query: { tags: '財帛宮' }, headers: {} }, res);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBeGreaterThan(0);
        expect(res.body.entries[0].tags).toContain('財帛宮');
    });

    test('缺少 tags 回傳 400', async () => {
        const res = mockRes();
        await handler({ method: 'GET', query: {}, headers: {} }, res);
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('非 GET 回傳 405', async () => {
        const res = mockRes();
        await handler({ method: 'POST', query: {}, headers: {} }, res);
        expect(res.statusCode).toBe(405);
    });

    test('limit 生效', async () => {
        const res = mockRes();
        await handler({ method: 'GET', query: { tags: '財帛宮,化祿,四化', limit: '2' }, headers: {} }, res);
        expect(res.body.entries.length).toBeLessThanOrEqual(2);
    });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx jest test/api-knowledge.test.js`
Expected: FAIL（Cannot find module '../api/knowledge'）

- [ ] **Step 3: 實作端點**

```js
// api/knowledge.js
/**
 * Vercel Serverless Function - Knowledge Base Search
 * API Route: GET /api/knowledge?tags=財帛宮,化祿&limit=5
 * Authentication: Public (no auth required)
 */

const { searchKnowledge } = require('../lib/knowledge');
const { setCorsHeaders, handleOptions } = require('../lib/cors');

module.exports = async function handler(req, res) {
    setCorsHeaders(req, res);
    if (handleOptions(req, res)) return;

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: '只允許 GET 請求' });
    }

    const { tags, limit = '5' } = req.query;
    if (!tags) {
        return res.status(400).json({ success: false, error: '缺少 tags 參數，例：?tags=財帛宮,化祿' });
    }

    const tagList = String(tags).split(',').map(t => t.trim()).filter(Boolean);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 5, 1), 10);
    const entries = searchKnowledge(tagList, limitNum);

    return res.status(200).json({ success: true, count: entries.length, entries });
};
```

- [ ] **Step 4: 執行測試確認通過**

Run: `npx jest test/api-knowledge.test.js`
Expected: PASS（4 tests）

- [ ] **Step 5: Commit**

```bash
git add api/knowledge.js test/api-knowledge.test.js
git commit -m "feat(api): add /api/knowledge tag search endpoint"
```

---

### Task 3: blog_posts 加 author 欄位（migration + API + lib）

**Files:**
- Create: `scripts/migrations/004-add-author-to-blog-posts.sql`
- Modify: `scripts/init-db.sql`（blog_posts CREATE TABLE 內加欄位）
- Modify: `api/blog/[id].js`（兩處 INSERT、PUT 更新、GET 回傳）
- Modify: `api/blog/list.js`（各 SELECT 加 author）
- Modify: `app/lib/blog.ts`（type + 兩處 list SELECT 加 author）

**Interfaces:**
- Produces: `blog_posts.author VARCHAR(100) NOT NULL DEFAULT 'AI 紫微編輯室'`；`BlogPost` type 加 `author: string`；`POST /api/blog/create` 接受選填 `author`。Task 4 前端與 Task 6 n8n 文件依賴此欄位。

- [ ] **Step 1: 建 migration**

```sql
-- scripts/migrations/004-add-author-to-blog-posts.sql
-- 為文章加入作者署名欄位（E-E-A-T：文章需有署名）
ALTER TABLE blog_posts
    ADD COLUMN IF NOT EXISTS author VARCHAR(100) NOT NULL DEFAULT 'AI 紫微編輯室';

-- 既有文章統一補上預設署名（DEFAULT 已涵蓋，此行確保 NULL 舊資料也被填）
UPDATE blog_posts SET author = 'AI 紫微編輯室' WHERE author IS NULL OR author = '';
```

同步在 `scripts/init-db.sql` 的 blog_posts CREATE TABLE 中、`slug VARCHAR(500) UNIQUE NOT NULL` 之後加一行：

```sql
    slug VARCHAR(500) UNIQUE NOT NULL,
    author VARCHAR(100) NOT NULL DEFAULT 'AI 紫微編輯室'
```

- [ ] **Step 2: 對資料庫執行 migration**

Run（沿用 003 的執行模式，repo 有 `scripts/run-migration-003.js` 可複製為 `scripts/run-migration-004.js`，只改檔名字串）:
`node scripts/run-migration-004.js`
Expected: 輸出成功訊息；驗證 `SELECT author FROM blog_posts LIMIT 1` 有值。

- [ ] **Step 3: API 帶上 author**

`api/blog/[id].js`：
- 兩處 `INSERT INTO blog_posts (title, slug, content, tags, status, published_at, language, translated_from)` 改為欄位列表加 `author`，VALUES 對應加 `${author || 'AI 紫微編輯室'}`；POST body 解構加 `author`。
- PUT 更新：允許更新 `author`（沿用其他欄位的更新模式）。

`api/blog/list.js` 與 `app/lib/blog.ts`：所有明列欄位的 SELECT（list.js 各查詢、blog.ts 兩處 `SELECT id, title, ...`）加上 `author`。`getBlogPost` 用 `SELECT *` 不需改。

`app/lib/blog.ts` type 加欄位：

```ts
export type BlogPost = {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
    published_at: Date;
    updated_at?: Date;
    created_at: Date;
    slug: string;
    language: string;
    author: string;
};
```

- [ ] **Step 4: 驗證**

Run: `npx tsc --noEmit` → Expected: 無新增錯誤（若 repo 原有錯誤，僅確認未新增）。
Run: `curl -s "http://localhost:3000/api/blog/list?limit=1" | grep author`（或部署後對 prod 驗證）→ Expected: 回應含 `"author":"AI 紫微編輯室"`。本地無 DB 時此步移至部署後驗證，並在 PR/commit note 註明。

- [ ] **Step 5: Commit**

```bash
git add scripts/migrations/004-add-author-to-blog-posts.sql scripts/run-migration-004.js scripts/init-db.sql api/blog/ app/lib/blog.ts
git commit -m "feat(blog): add author column with default byline"
```

---

### Task 4: 文章頁顯示署名 + JSON-LD author

**Files:**
- Modify: `app/components/blog/BlogPost.tsx`（日期附近，約 line 53）
- Modify: `app/[locale]/blog/[slug]/page.tsx`（jsonLd author，line 43–47）

**Interfaces:**
- Consumes: `post.author`（Task 3）

- [ ] **Step 1: BlogPost.tsx 加署名**

在 `<time …>{formatDate(…)}</time>` 的同一個 meta 區塊內、time 元素之前插入（沿用該處既有 className 風格）：

```tsx
<span className="text-sm font-medium">
    ✍️ {post.author || (lang === 'en' ? 'AI Ziwei Editorial' : 'AI 紫微編輯室')}
</span>
```

若該元件的 post prop type 未含 author，同步補上 `author?: string`。

- [ ] **Step 2: jsonLd author 改用署名 + 掛 About 頁**

`app/[locale]/blog/[slug]/page.tsx` 的 `author` 區塊改為：

```ts
author: {
    '@type': 'Organization',
    name: post.author || (isEn ? 'AI Ziwei Editorial' : 'AI 紫微編輯室'),
    url: `https://aiziwei.online/${params.locale}/about`,
},
```

- [ ] **Step 3: 驗證**

Run: `npx tsc --noEmit` → Expected: 無新增錯誤。
Run: `npm run dev` 後開 `http://localhost:3000/zh-TW/blog` 點任一篇 → Expected: 文章 meta 區顯示「✍️ AI 紫微編輯室」。

- [ ] **Step 4: Commit**

```bash
git add app/components/blog/BlogPost.tsx "app/[locale]/blog/[slug]/page.tsx"
git commit -m "feat(blog): show author byline on post page and JSON-LD"
```

---

### Task 5: 「關於本站」頁 + 導覽/sitemap/redirect

**Files:**
- Create: `app/[locale]/about/page.tsx`
- Modify: `app/components/NavBar.tsx`（加 About 連結）
- Modify: `vercel.json`（改 `/about` redirect）
- Modify: `api/page.js`（sitemap staticPages 加 about）

**Interfaces:**
- Produces: 路由 `/zh-TW/about`、`/en/about`。Task 4 的 jsonLd author.url 指向此頁。

- [ ] **Step 1: 建立 About 頁**

```tsx
// app/[locale]/about/page.tsx
export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const isEn = locale === 'en';
    return {
        title: isEn ? 'About | AI Zi Wei Dou Shu' : '關於本站 | AI 紫微斗數',
        description: isEn
            ? 'Who we are, our methodology, and our content policy.'
            : '認識 AI 紫微斗數：站點宗旨、理論方法與內容政策。',
    };
}

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const isEn = locale === 'en';

    if (isEn) {
        return (
            <main className="max-w-3xl mx-auto px-4 py-12 prose">
                <h1>About AI Zi Wei Dou Shu</h1>
                <p>AI Zi Wei Dou Shu (aiziwei.online) combines the Zhongzhou school of Zi Wei Dou Shu (Purple Star Astrology) with AI analysis to help readers explore this Chinese metaphysical tradition.</p>
                <h2>Methodology</h2>
                <p>Our analysis follows the Zhongzhou school framework (based on Wang Tingzhi&apos;s classical works). Our in-house knowledge base of classical principles guides every AI-generated analysis and article.</p>
                <h2>Content policy</h2>
                <p>Blog articles are AI-assisted, human-supervised, and cite their references. All content is for entertainment and cultural learning purposes only — it is not professional advice.</p>
                <h2>Author</h2>
                <p><strong>AI Ziwei Editorial</strong> — the site&apos;s editorial byline. Articles are drafted with AI assistance from curated sources and our knowledge base, then reviewed by the site operator.</p>
                <h2>Contact</h2>
                <p>Email: andismtu@gmail.com · <a href="https://forms.gle/KnwbQqyRGBVFqBPQ6">Support form</a> · <a href="/privacy-policy">Privacy policy</a></p>
            </main>
        );
    }

    return (
        <main className="max-w-3xl mx-auto px-4 py-12 prose">
            <h1>關於本站</h1>
            <p>AI 紫微斗數（aiziwei.online）結合中州派紫微斗數理論與 AI 技術，提供命盤分析工具與命理知識內容，希望讓更多人以現代方式認識這門傳統學問。</p>
            <h2>理論方法</h2>
            <p>本站以中州派（王亭之體系）為理論根據，站內建有整理自經典論述的知識庫，AI 分析與部落格文章皆以此為依據產出，並標明理論出處。</p>
            <h2>內容政策</h2>
            <p>部落格文章由 AI 輔助撰寫、經站方監督，撰寫時參考外部公開文章並於文末附上引用來源。本內容由 AI 輔助撰寫、經站方監督，僅供娛樂和文化學習參考，不構成專業建議。</p>
            <h2>作者</h2>
            <p><strong>AI 紫微編輯室</strong> — 本站的編輯署名。文章由 AI 依據策展素材與知識庫起草，站長定期抽查與修正。</p>
            <h2>聯絡我們</h2>
            <p>Email：andismtu@gmail.com · <a href="https://forms.gle/KnwbQqyRGBVFqBPQ6">支援表單</a> · <a href="/privacy-policy">隱私政策</a></p>
        </main>
    );
}
```

（若 repo 未裝 Tailwind typography plugin 導致 `prose` 無效果，改用簡單的 `space-y-4` + heading className，以現有頁面樣式為準。）

- [ ] **Step 2: NavBar 加連結**

`app/components/NavBar.tsx`：在 translations 物件加 `about: 'ℹ️ About'`（en）/ `about: 'ℹ️ 關於'`（zh-TW），宣告 `const aboutHref = \`/${locale}/about\`;`，並在 blog Link 之後比照 blogHref 的 Link 樣式加一個 About Link。

- [ ] **Step 3: vercel.json redirect 修正**

把現有：

```json
{ "source": "/about", "destination": "/#about", "permanent": false }
```

改為：

```json
{ "source": "/about", "destination": "/zh-TW/about", "permanent": false }
```

- [ ] **Step 4: sitemap 加 about**

`api/page.js` 的 `staticPages` 陣列加：

```js
{ url: '/zh-TW/about', changefreq: 'monthly', priority: 0.5 },
{ url: '/en/about', changefreq: 'monthly', priority: 0.5 },
```

- [ ] **Step 5: 驗證**

Run: `npm run dev` 開 `http://localhost:3000/zh-TW/about` 與 `/en/about` → Expected: 頁面正常渲染、NavBar 有「關於」。
Run: `npx tsc --noEmit` → Expected: 無新增錯誤。

- [ ] **Step 6: Commit**

```bash
git add "app/[locale]/about" app/components/NavBar.tsx vercel.json api/page.js
git commit -m "feat(about): add about page with content policy and byline"
```

---

### Task 6: n8n 每週策展 workflow 設定文件

**Files:**
- Create: `docs/n8n-weekly-blog-workflow.md`

**Interfaces:**
- Consumes: `GET /api/blog/list`、`GET /api/knowledge`（Task 2）、`POST /api/blog/create`（含 auth 與 `author` 欄位，Task 3）

- [ ] **Step 1: 撰寫文件**

文件必須包含以下全部章節（不得留 TBD）：

1. **總覽圖**：Cron → RSS 蒐集 → 去重過濾 → 取近期已發文 → LLM 選題 → 知識庫檢索 → LLM 寫作 → 品質閘門 →（失敗重試一次→仍失敗通知）→ 發布 → Email 摘要。
2. **Node 1 Schedule Trigger**：每週一 09:00 Asia/Taipei。
3. **Node 2 RSS 蒐集**（RSS Read × 3，合併）：
   - `https://news.google.com/rss/search?q=紫微斗數&hl=zh-TW&gl=TW&ceid=TW:zh-Hant`
   - `https://news.google.com/rss/search?q=運勢 命理&hl=zh-TW&gl=TW&ceid=TW:zh-Hant`
   - `https://news.google.com/rss/search?q=占星 星座 運勢&hl=zh-TW&gl=TW&ceid=TW:zh-Hant`
4. **Node 3 Code（去重過濾）**：完整 JS 程式碼——保留近 7 天、同網域最多 2 篇、只取 `{title, link, snippet, pubDate}`、上限 15 篇。
5. **Node 4 HTTP**：`GET https://aiziwei.online/api/blog/list?limit=10&language=zh-TW`，取 `posts[].title`。
6. **Node 5 LLM 選題**：模型 Claude Sonnet 等級。完整 prompt（文件中原文給出），要求：從候選挑一個主題角度、輸出 JSON `{topic, angle, knowledge_tags: [3-5 個 tag], selected_sources: [2-4 篇 {title, link}]}`、主題不得與近 10 篇標題語意重複。tag 詞彙表限定為 Task 1 表格中的 tags。
7. **Node 6 HTTP**：`GET https://aiziwei.online/api/knowledge?tags={{knowledge_tags.join(',')}}&limit=5`。
8. **Node 7 LLM 寫作**：完整 prompt 原文，硬性要求：1,800–2,500 字繁中、以知識庫條目為理論根據並標明 source 書名、文末「## 參考資料」列出 selected_sources 連結、只引用不改寫轉載、結尾固定免責聲明（Global Constraints 的字串）、輸出 JSON `{title, content, tags, slug}`（slug 為英數-連字號）。
9. **Node 8 Code（品質閘門）**：完整 JS——content ≥ 1,800 字、含「## 參考資料」且連結數 ≥ 2、含免責聲明字串、title 與近 10 篇任一標題的重合字元比例 < 60%。未過 → 回 Node 7 重試一次；再未過 → 走 Node 10 通知並終止。
10. **Node 9 HTTP 發布**：`POST https://aiziwei.online/api/blog/create`，headers 含 auth（沿用現行 n8n 每日 workflow 的認證設定），body `{title, content, tags, status: 'published', language: 'zh-TW', author: 'AI 紫微編輯室', slug}`。
11. **Node 10 Email**：成功→寄標題+連結+引用來源清單；失敗→寄錯誤原因。收件人 ziziandydy@gmail.com。
12. **上線核對清單**：關閉舊的每日 workflow、跑一次手動測試、確認文章頁署名與參考資料區塊正常。

- [ ] **Step 2: 自我檢查**

核對文件對照本計畫 API 介面：endpoint 路徑、參數名（`tags`、`limit`、`language`）、author 預設值一致。

- [ ] **Step 3: Commit**

```bash
git add docs/n8n-weekly-blog-workflow.md
git commit -m "docs(n8n): add weekly curated blog workflow setup guide"
```

---

### Task 7: 停用每日量產與自動翻譯

**Files:**
- Modify: `scripts/batch-translate.js`（加執行防呆）
- Create: `docs/deprecations-2026-07.md`

**Interfaces:** 無（收尾任務）。

- [ ] **Step 1: batch-translate 加防呆**

在 `scripts/batch-translate.js` 檔案開頭（`require('dotenv')` 之前）加：

```js
// 2026-07-25 起停用：未經審校的機翻內容屬 AdSense 低價值內容（見 docs/deprecations-2026-07.md）。
if (process.env.FORCE_TRANSLATE !== '1') {
    console.error('batch-translate 已停用。確定要跑請設 FORCE_TRANSLATE=1（僅限人工審校流程）。');
    process.exit(1);
}
```

- [ ] **Step 2: 建立停用說明文件**

```markdown
# 2026-07 停用項目

## 每日自動發文（n8n）
- 舊的每日發文 workflow 於 n8n 後台停用（手動操作，見 docs/n8n-weekly-blog-workflow.md 上線核對清單）。
- 原因：AdSense 判定低價值內容的主因（模板化、標題重複、無引用無署名）。
- 取代方案：每週策展觀點文 workflow。

## scripts/batch-translate.js（自動翻譯）
- 已加防呆，預設拒絕執行；需人工審校流程時以 FORCE_TRANSLATE=1 執行。
- 原因：未經人工審校的機器翻譯屬 Google 定義的低價值內容。
- 後續：中文線穩定後再評估人工審校的英文版流程。
```

- [ ] **Step 3: 驗證**

Run: `node scripts/batch-translate.js` → Expected: 印出停用訊息並 exit code 1。

- [ ] **Step 4: Commit**

```bash
git add scripts/batch-translate.js docs/deprecations-2026-07.md
git commit -m "chore: disable batch-translate and document daily workflow deprecation"
```

---

## 完成後驗收（對照 spec）

1. `npx jest` 全數通過。
2. `curl "https://aiziwei.online/api/knowledge?tags=財帛宮"` 回傳含 source 的條目。
3. 文章頁顯示署名；`/zh-TW/about` 上線且在 NavBar 與 sitemap。
4. `docs/n8n-weekly-blog-workflow.md` 可照步驟建出 workflow。
5. 站長於 n8n 後台關閉每日 workflow（人工步驟，Email 通知設定完成後執行）。
