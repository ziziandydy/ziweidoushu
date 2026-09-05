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
  → Code：審查素材（擷取正文）→ LLM：文筆審查（natural/reasons）
  → Code：品質閘門（含 AI 文筆審查結果）──不過──→ 回寫作重試一次 ──仍不過──→ Email 失敗通知（終止）
  → HTTP：POST /api/blog/create（發布）
  → Email：成功摘要
```

**2026-09-04 新增「AI 文筆審查」關卡**：原本的品質閘門只檢查字數/引用/免責聲明/標題去重，不會檢查文章讀起來像不像 AI 寫的。現在寫作完成後會先過一道獨立的 LLM 審查（見 Node 8.5），把「natural: false」也算進品質閘門的失敗條件，跟其他檢查共用同一次重寫機會。

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
const perSource = {};
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
  // n8n Code 沙盒沒有 URL 類別，用 regex 解析網域
  const m = link.match(/^https?:\/\/([^\/]+)/i);
  if (!m) continue;
  let source = m[1].toLowerCase();
  // Google/Bing News 是轉址網域，改用標題尾端的媒體名當來源
  if (source.indexOf('news.google.com') !== -1 || source.indexOf('bing.com') !== -1) {
    const parts = title.split(' - ');
    if (parts.length > 1) source = parts[parts.length - 1].trim();
  }
  perSource[source] = (perSource[source] || 0) + 1;
  if (perSource[source] > 2) continue;                   // 同來源最多 2 篇
  seen.add(title);
  out.push({ json: {
    title,
    link,
    snippet: String(j.contentSnippet || j.content || '').slice(0, 300),
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

> 以上一樣是設計初版，實際 JSON 用的是下面 2026-09-05 更新後的 system prompt，且「王老師寫作」「王老師重寫」兩個節點共用同一份。

### 2026-09-05 更新：拿掉四段式結構指令，改成單一論證線

全站文章 AI 味大審計（見部落格系統相關記憶）後追出根因：舊版 prompt 的規則 4 白紙黑字寫「文章結構：時事引入 → 紫微斗數觀點解析 → 給讀者的具體建議 → 結語」，等於直接教模型套公式——不管換哪個模型執行這句指令都會產生機械式條列，實測換用更強的 GPT-4o 套舊 prompt 一樣 0% 通過文筆審查。

新版 prompt 把規則 4 改成「全文只圍繞一個具體切角展開一條連貫論證，不要切成固定分段公式，也不要把知識庫查到的每個宮位都輪流講一遍」，並附上一段本站真正過關文章的開頭當 few-shot 語氣範例，另外限制「依王亭之...理論架構」這句出處說明全文不超過 2 次。完整新版內容見 JSON 檔案裡「王老師寫作」節點的 `responses.values[0].content`。

**實測結果**：純靠改 prompt 不能保證每次都過（合成測試題目跑 GPT-4o 還是被抓到用「總結來看」規避「綜上所述」），但真實執行中已經出現第一次生成就直接通過品質閘門、不用觸發重寫的案例。改 prompt 之後，品質閘門+重寫機制仍是必要的安全網，兩次都沒過就正確地「這週不發文」，發文頻率可能因此偶爾中斷，這是品質優先的正常代價，不代表系統壞掉。

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

> 以上是原始設計版本的簡化程式碼。實際匯入的 `n8n-weekly-blog-workflow.json` 中，「品質閘門」節點會額外讀取 Node 8.5 的審查結果、並改用 `$('王老師寫作')` 取回文章全文（因為中間多插了兩個節點）；以 JSON 檔案的版本為準。

## Node 8.5：AI 文筆審查（2026-09-04 新增）

品質閘門原本只檢查字數/引用/免責聲明/標題去重，不會檢查文章讀起來像不像 AI 寫的——這是造成部落格內容被 Google 判定「低價值/自動生成」疑慮的其中一個缺口。新增兩個節點插在「王老師寫作」與「品質閘門」之間（重寫分支同樣在「王老師重寫」與「品質閘門（重寫後）」之間插一組）：

**Code — 審查素材**：從上一個 LLM 節點的原始輸出擷取 `content` 純文字，去掉 JSON 外殼，方便下一個節點直接讀取全文。

**LLM — 文筆審查**（模型與寫作節點相同，一樣不能帶 `temperature` 參數）：

System prompt：
```
你是嚴格的中文編輯，專門抓文章裡的「機器味」。收到一篇命理觀點文章全文，
請判斷它讀起來是否像人寫的，而非罐頭 AI 文章。

檢查重點（命中任一項明顯問題就判定 natural=false）：
1. 是否只有空泛的正確廢話（例如「凡事都要謹慎面對」這種放諸四海皆準、沒有具體判斷的話），
   缺乏具體、可驗證的觀點
2. 是否使用「首先、其次、最後、總之、不僅如此、值得注意的是、綜上所述」等 AI 陳腔濫調轉折詞
3. 段落結構是否重複單調（例如每段都套用同一種「現象 → 星曜理論 → 建議」公式三次以上）
4. 是否有破折號（—）或 Emoji 堆疊
5. 語氣是否像教科書條列，而非自然口語

reasons 請具體引用原文片段，讓作者知道要改哪裡；natural=true 時 reasons 給空陣列即可。
```

User message：`{{ $json.content }}`（審查素材節點的輸出）

結構化輸出：`{ "natural": boolean, "reasons": string[] }`

品質閘門讀到 `review.natural === false` 時，會把 `AI 文筆審查未通過：<reasons>` 加進 `errors`，跟其他檢查共用同一次重寫機會——重寫分支若再次沒過，一樣會拋錯終止並寄失敗通知，不會自動發布沒過關的文章。

> ⚠️ **2026-09-05 真實測試踩到的雷**：「文筆審查」節點跟「王老師寫作」一樣，是 `@n8n/n8n-nodes-langchain.openAi` 節點，原始輸出一樣包在 `output[0].content[0].text` 裡面，**不是**扁平的 `{natural, reasons}`。第一版「品質閘門」程式碼直接寫 `const review = $input.first().json;`，忘了解開這層包裝，導致 `review.natural` 永遠是 `undefined`、判斷式恆為 false，關卡形同虛設——實測時「文筆審查」正確判定一篇文章 `natural: false` 並列出具體問題，但「品質閘門」還是回報 `passed: true` 讓文章發布了。現在的版本已修正為跟解析 `a`（文章本體）一樣，先 `let review = $input.first().json.output[0].content[0].text;` 解開再 `JSON.parse`。**日後只要修改這兩個 Code 節點，務必記得這一層包裝**，不要只測「有沒有報錯」，要實際跑一次確認 `natural: false` 真的會被 `errors` 抓到。

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

## 2026-09-04 更新「AI 文筆審查」後的重新匯入步驟

因為這次改動在「王老師寫作」和「王老師重寫」後面各插了兩個節點，並改寫了兩個「品質閘門」節點的程式碼，**不能只複製貼上單一節點**，需要整包重新匯入：

1. 在 n8n 開啟「紫微策展週刊 1.0」，**先把整個 workflow 另存一份備份**（Download / Export，或另開分頁保留舊版畫布）。
2. 用最新的 `n8n-weekly-blog-workflow.json` 執行 Import（會建立新節點：審查素材、文筆審查、審查素材（重寫後）、文筆審查（重寫後），並覆蓋「品質閘門」「品質閘門（重寫後）」的程式碼）。
3. **比對已知雷點**：匯入若把既有節點改名（加「1」後綴），所有 Code 節點裡 `$('節點名稱')` 的硬編碼引用都要逐一打開檢查有沒有跟著失聯（尤其是「品質閘門」新增的 `$('王老師寫作')`、「品質閘門（重寫後）」的 `$('王老師重寫')`，以及原本就有的 `$('選題素材')`）。
4. 「文筆審查」「文筆審查（重寫後）」兩個 OpenAI 節點匯入後要重新綁定 Credential（`OpenAi account`），並確認**沒有**帶 `temperature` 參數（gpt-5.6-luna 不支援）。
5. 手動 Execute 一次，確認「文筆審查」有正常輸出 `{natural, reasons}`，且刻意寫一段套版感很重的文字測試 `natural: false` 時「品質閘門」真的會擋下來、觸發重寫。
6. 全部確認後記得在右上角點 **Publish**（存檔不等於生效）。
