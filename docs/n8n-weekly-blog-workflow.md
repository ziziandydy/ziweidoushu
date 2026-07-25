# n8n 每週策展觀點文 Workflow 設定指南

取代原每日發文 workflow。每週一產出一篇「外部時事策展 × 紫微斗數知識庫」的原創觀點文，附引用來源與署名，自動發布後寄摘要供站長抽查。

## 總覽

```
Schedule Trigger（週一 09:00）
  → RSS Read ×3 → Merge
  → Code：去重過濾（近 7 天、同網域 ≤2、上限 15 篇）
  → HTTP：GET /api/blog/list（近 10 篇標題）
  → LLM：選題（輸出 topic / angle / knowledge_tags / selected_sources）
  → HTTP：GET /api/knowledge（知識庫條目）
  → LLM：寫作（1,800–2,500 字，含參考資料與免責聲明）
  → Code：品質閘門 ──不過──→ 回寫作重試一次 ──仍不過──→ Email 失敗通知（終止）
  → HTTP：POST /api/blog/create（發布）
  → Email：成功摘要
```

模型規範：選題與寫作節點一律使用 **Claude Sonnet 等級或以上**（如 `claude-sonnet-5`）。**禁止使用 gpt-4o-mini** 等輕量模型。

## Node 1：Schedule Trigger

- 類型：Schedule Trigger
- Rule：Every Week → Monday → 09:00
- Timezone：`Asia/Taipei`（在 workflow settings 設定）

## Node 2：RSS 蒐集（RSS Read × 4 → Merge）

四個 RSS Read 節點，URL 分別為：

1. `https://news.google.com/rss/search?q=紫微斗數&hl=zh-TW&gl=TW&ceid=TW:zh-Hant`
2. `https://news.google.com/rss/search?q=運勢%20命理&hl=zh-TW&gl=TW&ceid=TW:zh-Hant`
3. `https://feeds.feedburner.com/ettoday/fortune`（ETtoday 運勢分類，單一媒體直連）
4. `https://www.bing.com/news/search?q=運勢%20命理&format=RSS`（Bing News 聚合，與 Google 排序邏輯互補）

四路接進一個 **Merge** 節點（mode: Append，numberInputs: 4）。

已測試淘汰的來源（2026-07 驗證）：Yahoo 奇摩與 PTT 的 RSS 已不存在；udn RSS feed 的標題與日期中繼資料損壞（pubDate 全為 1970），會被 7 天過濾器整批排除。

## Node 3：Code — 去重過濾

類型：Code（Run Once for All Items），貼上：

```javascript
const now = Date.now();
const sevenDays = 7 * 24 * 60 * 60 * 1000;
const perDomain = {};
const seen = new Set();
const out = [];

for (const item of $input.all()) {
  const j = item.json;
  const link = j.link || '';
  const title = (j.title || '').trim();
  const pub = new Date(j.pubDate || j.isoDate || 0).getTime();
  if (!link || !title) continue;
  if (!pub || now - pub > sevenDays) continue;          // 只留近 7 天
  if (seen.has(title)) continue;                         // 標題去重
  let domain = '';
  try { domain = new URL(link).hostname; } catch (e) { continue; }
  perDomain[domain] = (perDomain[domain] || 0) + 1;
  if (perDomain[domain] > 2) continue;                   // 同網域最多 2 篇
  seen.add(title);
  out.push({ json: {
    title,
    link,
    snippet: (j.contentSnippet || j.content || '').slice(0, 300),
    pubDate: j.pubDate || j.isoDate,
  }});
  if (out.length >= 15) break;                           // 上限 15 篇
}

if (out.length < 3) {
  throw new Error(`候選文章不足（${out.length} 篇），本週跳過`);
}
return out;
```

## Node 4：HTTP — 取近期已發文標題

- Method：GET
- URL：`https://aiziwei.online/api/blog/list?limit=10&language=zh-TW`
- 後接一個 Code 節點把 `posts[].title` 抽成陣列備用：

```javascript
const posts = $input.first().json.data?.posts || $input.first().json.posts || [];
return [{ json: { recentTitles: posts.map(p => p.title) } }];
```

## Node 5：LLM — 選題

模型：Claude Sonnet 等級。System prompt：

```
你是「AI 紫微斗數」網站的內容主編。你會收到一批近期外部文章候選與本站近期已發文標題。
任務：挑選一個值得從紫微斗數角度評論的主題。

規則：
1. 新主題不得與近期已發文標題語意重複（連相似的切角都不行，例如已寫過「財帛宮×財富焦慮」就不得再選任何「宮位×財富焦慮」變形）。
2. 優先挑有真實時事討論度、且能自然連結紫微斗數概念的主題。
3. knowledge_tags 只能從下列詞彙表選 3–5 個：
   命宮, 兄弟宮, 夫妻宮, 子女宮, 財帛宮, 疾厄宮, 遷移宮, 交友宮, 官祿宮, 田宅宮, 福德宮, 父母宮,
   紫微, 天府, 七殺, 破軍, 貪狼, 天機, 太陰, 天同, 天梁, 太陽, 巨門,
   化祿, 化權, 化科, 化忌, 四化,
   三方四正, 大限, 流年, 廟旺, 落陷, 煞星, 格局, 論斷方法,
   財運, 感情, 婚姻, 職場, 事業, 健康, 人際, 心理, 精神生活, 化解
4. selected_sources 從候選中挑 2–4 篇真正會在文中回應的文章。

只輸出 JSON，格式：
{"topic": "主題名", "angle": "一句話說明切入觀點", "knowledge_tags": ["..."], "selected_sources": [{"title": "...", "link": "..."}]}
```

User message（用 expression 帶入）：

```
候選文章：
{{ JSON.stringify($('Code去重過濾').all().map(i => i.json)) }}

近期已發文標題：
{{ JSON.stringify($('Code取標題').first().json.recentTitles) }}
```

後接 Code 節點解析 JSON 輸出（若模型輸出含 ```json 圍欄要先剝除）。

## Node 6：HTTP — 知識庫檢索

- Method：GET
- URL：`https://aiziwei.online/api/knowledge?tags={{ $json.knowledge_tags.join(',') }}&limit=5`
- 回傳 `{ success, count, entries: [{id, topic, tags, source, text}] }`

## Node 7：LLM — 寫作

模型：Claude Sonnet 等級。System prompt：

```
你是「AI 紫微斗數」網站的專欄作者，署名「王老師」。以繁體中文寫一篇策展觀點文。

硬性要求：
1. 字數 1,800–2,500 字（不含標題）。
2. 以提供的知識庫條目為理論根據；引用其論點時標明出處（例：依王亭之《中州派紫微斗數》理論架構）。
3. 對 selected_sources 的外部文章「引用並評論」，不得改寫轉載其內容；文中提及時自然帶出。
4. 文章結構：時事引入 → 紫微斗數觀點解析（用知識庫理論）→ 給讀者的具體建議 → 結語。
5. 文末依序加兩個區塊：
   ## 參考資料
   - [來源標題](連結)（selected_sources 每篇一行）
   最後一行固定免責聲明：本內容由 AI 輔助撰寫、經站方監督，僅供娛樂和文化學習參考。
6. 標題不得使用與近期已發文相似的句式。
7. slug 用英文小寫與連字號（例：liuyue-career-transits-guide）。

只輸出 JSON：
{"title": "...", "content": "Markdown 全文", "tags": ["3-5 個中文 tag"], "slug": "..."}
```

User message：

```
主題：{{ $json.topic }}
切角：{{ $json.angle }}
外部來源：{{ JSON.stringify($json.selected_sources) }}
知識庫條目：{{ JSON.stringify($('HTTP知識庫').first().json.entries) }}
近期已發文標題：{{ JSON.stringify($('Code取標題').first().json.recentTitles) }}
```

## Node 8：Code — 品質閘門

```javascript
const a = $input.first().json;   // {title, content, tags, slug}
const recent = $('Code取標題').first().json.recentTitles || [];
const errors = [];

const len = (a.content || '').replace(/\s/g, '').length;
if (len < 1800) errors.push(`字數不足：${len} < 1800`);

if (!/## 參考資料/.test(a.content)) errors.push('缺少「## 參考資料」區塊');
const linkCount = (a.content.match(/\[.+?\]\(https?:\/\/.+?\)/g) || []).length;
if (linkCount < 2) errors.push(`參考連結不足：${linkCount} < 2`);

if (!a.content.includes('本內容由 AI 輔助撰寫、經站方監督，僅供娛樂和文化學習參考')) {
  errors.push('缺少免責聲明');
}

// 標題與近 10 篇的字元重合比例 < 60%
function overlap(s1, s2) {
  const set1 = new Set(s1.split(''));
  const same = s2.split('').filter(c => set1.has(c)).length;
  return same / Math.max(s2.length, 1);
}
for (const t of recent) {
  if (overlap(t, a.title) >= 0.6) { errors.push(`標題與近期文章過近：${t}`); break; }
}

if (errors.length) {
  return [{ json: { passed: false, errors, article: a } }];
}
return [{ json: { passed: true, article: a } }];
```

後接 **IF** 節點（`{{ $json.passed }}` is true）：
- true → Node 9 發布
- false → 回 Node 7 重試（用 IF + 一個「retryCount」旗標實作，僅重試一次；n8n 可在 Node 7 前加 Set 節點記 `retry = ($json.retry || 0) + 1`，`retry > 1` 時走 Node 10 失敗通知並終止）。

## Node 9：HTTP — 發布

- Method：POST
- URL：`https://aiziwei.online/api/blog/create`
- Authentication：沿用原每日 workflow 的 Bearer Token credential（`Authorization: Bearer <token>`）
- Body（JSON）：

```json
{
  "title": "={{ $json.article.title }}",
  "content": "={{ $json.article.content }}",
  "tags": "={{ $json.article.tags }}",
  "status": "published",
  "language": "zh-TW",
  "author": "王老師",
  "slug": "={{ $json.article.slug }}"
}
```

註：`author` 欄位已於 2026-07-25 加入 API；未帶時預設即為「王老師」。

## Node 10：Email 通知

收件人：`ziziandydy@gmail.com`

- **成功**（接在 Node 9 之後）：主旨 `【AI紫微】本週文章已發布：{{ $json.data.title }}`，內文含文章連結 `https://aiziwei.online{{ $json.data.url }}` 與參考來源清單。
- **失敗**（品質閘門兩次未過或任一節點 error）：主旨 `【AI紫微】本週文章未發布`，內文列出 `errors`。另在 workflow Settings → Error Workflow 掛一個寄信 workflow，涵蓋非預期錯誤。

## 上線核對清單

- [ ] **關閉舊的每日發文 workflow**（Deactivate，不要刪除，保留紀錄）。
- [ ] 新 workflow 手動 Execute 一次，確認每個節點輸出正常。
- [ ] 檢查發布的測試文章：署名顯示「王老師」、文末有「## 參考資料」與免責聲明。
- [ ] 測試文章確認後可保留或刪除（admin 後台）。
- [ ] Activate 新 workflow，確認 timezone 為 Asia/Taipei。
