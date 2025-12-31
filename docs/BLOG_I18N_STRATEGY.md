# Blog 多語言策略文件

## 概述

本文件說明 Blog 系統的多語言實作策略,包含資料庫設計、URL 結構、文章管理流程。

## 1. 資料庫 Schema

### 新增欄位

```sql
-- 語言欄位 (zh-TW 或 en)
language VARCHAR(10) DEFAULT 'zh-TW'

-- 翻譯關聯欄位 (指向原始文章)
translated_from UUID REFERENCES blog_posts(id)
```

### 索引

```sql
CREATE INDEX idx_blog_posts_language ON blog_posts(language);
CREATE INDEX idx_blog_posts_translated_from ON blog_posts(translated_from);
```

### 約束

```sql
ALTER TABLE blog_posts
ADD CONSTRAINT chk_blog_posts_language
CHECK (language IN ('zh-TW', 'en'));
```

## 2. URL 結構

### Blog 列表頁

- 中文: `/zh-TW/blog`
- 英文: `/en/blog`
- 標籤篩選: `/zh-TW/blog?tag=標籤名稱`
- 分頁: `/zh-TW/blog?page=2`

### Blog 文章頁

- 中文: `/zh-TW/blog/:slug`
- 英文: `/en/blog/:slug`

## 3. 文章建立策略

### 方案 A: 獨立文章 (✅ 推薦)

**特點:**
- 每種語言的文章完全獨立
- 不同語言可有不同的標題、內容、標籤
- AI 可針對目標語言優化內容

**資料庫範例:**

```json
// 中文文章
{
  "id": "uuid-1",
  "language": "zh-TW",
  "title": "紫微斗數十四主星詳解",
  "slug": "ziwei-14-major-stars",
  "content": "...",
  "tags": ["紫微星", "主星", "命理"]
}

// 英文文章 (獨立)
{
  "id": "uuid-2",
  "language": "en",
  "title": "Complete Guide to 14 Major Stars in Zi Wei Dou Shu",
  "slug": "ziwei-14-major-stars-guide",
  "content": "...",
  "tags": ["Purple Star", "Major Stars", "Astrology"]
}
```

### 方案 B: 主從翻譯 (可選)

**特點:**
- 一篇主文章 + 翻譯版本
- 使用 `translated_from` 欄位關聯

**資料庫範例:**

```json
// 原始中文文章
{
  "id": "uuid-1",
  "language": "zh-TW",
  "title": "紫微斗數十四主星詳解",
  "translated_from": null
}

// 英文翻譯
{
  "id": "uuid-2",
  "language": "en",
  "title": "Complete Guide to 14 Major Stars",
  "translated_from": "uuid-1"
}
```

## 4. AI 自動生成策略

### 推薦流程: 雙語同時生成

1. **生成提示詞範例:**

```
請生成一篇紫微斗數文章,主題為「十四主星」。

要求:
1. 同時生成繁體中文和英文兩個版本
2. 內容針對各語言讀者優化,不是直接翻譯
3. 中文版本注重文化底蘊和傳統術語
4. 英文版本需要解釋文化背景,用易懂的現代語言

輸出格式:
{
  "zh-TW": {
    "title": "...",
    "content": "...",
    "tags": ["tag1", "tag2"]
  },
  "en": {
    "title": "...",
    "content": "...",
    "tags": ["tag1", "tag2"]
  }
}
```

2. **儲存流程:**

```javascript
// 生成兩篇獨立文章
const zhPost = {
  language: 'zh-TW',
  title: response.zhTW.title,
  content: response.zhTW.content,
  tags: response.zhTW.tags,
  slug: generateSlug(response.zhTW.title),
  status: 'published'
};

const enPost = {
  language: 'en',
  title: response.en.title,
  content: response.en.content,
  tags: response.en.tags,
  slug: generateSlug(response.en.title),
  status: 'published'
};

// 可選: 設定關聯
enPost.translated_from = zhPost.id;
```

## 5. Slug 生成策略

### 選項 1: 語言無關 (UUID-based)
```
slug: "550e8400-e29b-41d4-a716-446655440000"
```
- 優點: 保證唯一,跨語言一致
- 缺點: 對 SEO 不友善

### 選項 2: 包含語言標識
```
zh-TW: "ziwei-14-major-stars-zh"
en: "ziwei-14-major-stars-en"
```
- 優點: SEO 友善,清晰區分
- 缺點: 需要確保唯一性

### 選項 3: 語言特定關鍵字 (✅ 推薦)
```
zh-TW: "ziwei-shisi-zhuxing-xiangjie"
en: "complete-guide-14-major-stars-ziwei"
```
- 優點: 最佳 SEO,自然語言
- 缺點: 需要更複雜的 slug 生成邏輯

## 6. 查詢邏輯

### Blog 列表頁

```javascript
// 從 URL locale 參數判斷語言
const language = (req.query.locale === 'en') ? 'en' : 'zh-TW';

// 篩選該語言的文章
WHERE status = 'published' AND language = ${language}
```

### Blog 文章頁

```javascript
// 從 URL locale 參數判斷語言
const language = (req.query.locale === 'en') ? 'en' : 'zh-TW';

// 查詢該語言的文章
WHERE slug = ${slug} AND language = ${language} AND status = 'published'
```

## 7. SEO 優化

### Hreflang 標籤

```html
<!-- Blog 列表頁 -->
<link rel="alternate" hreflang="zh-TW" href="https://aiziwei.online/zh-TW/blog">
<link rel="alternate" hreflang="en" href="https://aiziwei.online/en/blog">
<link rel="alternate" hreflang="x-default" href="https://aiziwei.online/zh-TW/blog">

<!-- Blog 文章頁 -->
<link rel="alternate" hreflang="zh-TW" href="https://aiziwei.online/zh-TW/blog/slug">
<link rel="alternate" hreflang="en" href="https://aiziwei.online/en/blog/slug">
```

### Canonical URLs

```html
<!-- 中文版本 -->
<link rel="canonical" href="https://aiziwei.online/zh-TW/blog/slug">

<!-- 英文版本 -->
<link rel="canonical" href="https://aiziwei.online/en/blog/slug">
```

## 8. 管理後台建議

### 新增文章介面

```
[ ] 文章語言: ○ 繁體中文  ○ English

[ ] 標題: ________________

[ ] 內容: [Markdown Editor]

[ ] 標籤: [Tag Input]

[ ] 關聯翻譯 (可選): [Select from posts]

[發布] [儲存草稿]
```

### AI 輔助功能

```
[🤖 AI 自動生成雙語版本]
- 點擊後同時生成中英文兩個版本
- 可以個別編輯調整
```

## 9. 實作檢查清單

- [x] 資料庫 migration script
- [x] blog-page.js 支援 locale 參數
- [x] blog-page.js 翻譯字串
- [ ] [slug].js 支援 locale 參數
- [ ] [slug].js 翻譯字串
- [ ] 執行資料庫 migration
- [ ] 測試中英文 blog 列表頁
- [ ] 測試中英文 blog 文章頁
- [ ] AI 生成雙語文章腳本
- [ ] 管理後台語言選擇

## 10. 注意事項

### 內容策略

1. **不要單純翻譯**: 英文版應針對國際讀者優化,解釋文化背景
2. **標籤本地化**: 中文標籤用中文,英文標籤用英文
3. **圖片 ALT**: 根據語言提供不同的 ALT 文字

### 技術考量

1. **Slug 唯一性**: 需確保同語言下 slug 唯一
2. **分頁一致性**: 不同語言文章數量可能不同
3. **標籤篩選**: 標籤按語言分開

### SEO 最佳實踐

1. **完整的 hreflang**: 每頁都要有完整的語言替代標籤
2. **獨立 sitemap**: 考慮為每種語言生成獨立的 sitemap
3. **URL 一致性**: 保持 URL 結構清晰一致
