# Blog API 多語言使用指南

本文件說明如何使用 Blog API 創建和管理多語言文章。

## API 端點總覽

| 方法 | 端點 | 說明 | 認證 |
|------|------|------|------|
| POST | `/api/blog/create` | 創建新文章 | ✅ 需要 |
| GET | `/api/blog/[id]` | 取得單篇文章 | ❌ 不需要 |
| PUT | `/api/blog/[id]` | 更新文章 | ✅ 需要 |
| DELETE | `/api/blog/[id]` | 刪除文章 | ✅ 需要 |
| GET | `/api/blog/list` | 取得文章列表 | ❌ 不需要 |

## 1. 創建多語言文章

### POST `/api/blog/create`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "文章標題",
  "content": "文章內容...",
  "tags": ["標籤1", "標籤2"],
  "status": "published",
  "language": "zh-TW",
  "translated_from": "uuid-of-original-post"
}
```

**參數說明:**

| 參數 | 類型 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| `title` 或 `titles` | string | ✅ | - | 文章標題 |
| `content` | string | ✅ | - | 文章內容 (支援 Markdown) |
| `tags` | array/string | ❌ | `[]` | 標籤陣列或逗號分隔字串 |
| `status` | string | ❌ | `"draft"` | 文章狀態: `"draft"` 或 `"published"` |
| `language` | string | ❌ | `"zh-TW"` | 語言代碼: `"zh-TW"` 或 `"en"` |
| `translated_from` | string (UUID) | ❌ | `null` | 原始文章的 UUID (如果這是翻譯版本) |

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "文章新增成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "文章標題",
    "slug": "wen-zhang-biao-ti",
    "content": "文章內容...",
    "tags": ["標籤1", "標籤2"],
    "status": "published",
    "language": "zh-TW",
    "translated_from": null,
    "published_at": "2025-12-31T10:30:00.000Z",
    "created_at": "2025-12-31T10:30:00.000Z",
    "updated_at": "2025-12-31T10:30:00.000Z",
    "url": "/zh-TW/blog/wen-zhang-biao-ti"
  }
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "error": "缺少必填欄位：title 或 content"
}
```

```json
{
  "success": false,
  "error": "translated_from 指向的原始文章不存在"
}
```

---

## 2. 創建多語言文章的策略

### 策略 A: 獨立文章 (推薦)

每種語言的文章完全獨立，不設定 `translated_from`。

**中文文章:**
```bash
curl -X POST https://aiziwei.online/api/blog/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "紫微斗數十四主星詳解",
    "content": "紫微斗數是中國傳統命理學...",
    "tags": ["紫微星", "主星", "命理"],
    "status": "published",
    "language": "zh-TW"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "slug": "ziwei-doushu-shisi-zhuxing-xiangjie",
    "language": "zh-TW",
    "url": "/zh-TW/blog/ziwei-doushu-shisi-zhuxing-xiangjie"
  }
}
```

**英文文章:**
```bash
curl -X POST https://aiziwei.online/api/blog/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Guide to 14 Major Stars in Zi Wei Dou Shu",
    "content": "Zi Wei Dou Shu is an ancient Chinese astrology...",
    "tags": ["Purple Star", "Major Stars", "Astrology"],
    "status": "published",
    "language": "en"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-2",
    "slug": "complete-guide-to-14-major-stars-in-zi-wei-dou-shu",
    "language": "en",
    "url": "/en/blog/complete-guide-to-14-major-stars-in-zi-wei-dou-shu"
  }
}
```

### 策略 B: 主從翻譯 (可選)

先創建原始文章，再創建翻譯版本並關聯。

**步驟 1: 創建原始中文文章**
```bash
curl -X POST https://aiziwei.online/api/blog/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "紫微斗數入門指南",
    "content": "...",
    "language": "zh-TW",
    "status": "published"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "language": "zh-TW"
  }
}
```

**步驟 2: 創建英文翻譯並關聯**
```bash
curl -X POST https://aiziwei.online/api/blog/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beginner Guide to Zi Wei Dou Shu",
    "content": "...",
    "language": "en",
    "status": "published",
    "translated_from": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }'
```

---

## 3. 取得文章列表 (支援多語言篩選)

### GET `/api/blog/list`

**Query Parameters:**

| 參數 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `page` | number | `1` | 頁碼 |
| `limit` | number | `10` | 每頁筆數 |
| `tag` | string | `null` | 標籤篩選 |
| `status` | string | `"published"` | 文章狀態 |
| `language` | string | `"zh-TW"` | 語言篩選: `"zh-TW"` 或 `"en"` |
| `includeAll` | boolean | `false` | 包含所有狀態 (admin 用) |

**範例:**

```bash
# 取得繁體中文文章 (第 1 頁)
curl https://aiziwei.online/api/blog/list?language=zh-TW&page=1&limit=10

# 取得英文文章 (第 1 頁)
curl https://aiziwei.online/api/blog/list?language=en&page=1&limit=10

# 取得特定標籤的中文文章
curl https://aiziwei.online/api/blog/list?language=zh-TW&tag=紫微星
```

**Response:**

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid-1",
        "title": "紫微斗數十四主星詳解",
        "excerpt": "紫微斗數是中國傳統命理學...",
        "slug": "ziwei-doushu-shisi-zhuxing-xiangjie",
        "tags": ["紫微星", "主星"],
        "status": "published",
        "language": "zh-TW",
        "published_at": "2025-12-31T10:30:00.000Z",
        "url": "/zh-TW/blog/ziwei-doushu-shisi-zhuxing-xiangjie"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    },
    "language": "zh-TW"
  }
}
```

---

## 4. 取得單篇文章

### GET `/api/blog/[id]`

支援使用 `slug` 或 `UUID` 查詢文章。

**範例:**

```bash
# 使用 slug 查詢
curl https://aiziwei.online/api/blog/ziwei-14-major-stars

# 使用 UUID 查詢
curl https://aiziwei.online/api/blog/550e8400-e29b-41d4-a716-446655440000
```

**注意:** 此端點目前不支援語言參數，會返回符合條件的已發布文章 (任何語言)。

---

## 5. AI 自動生成雙語文章範例

使用 AI 同時生成中英文兩個版本的文章。

**AI 提示詞範例:**

```
請生成一篇紫微斗數文章,主題為「財帛宮詳解」。

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

**處理 AI 回應並創建文章:**

```javascript
// 假設 AI 返回的結果存在 aiResponse 中
const { 'zh-TW': zhPost, en: enPost } = aiResponse;

// 創建中文文章
const zhResponse = await fetch('https://aiziwei.online/api/blog/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: zhPost.title,
    content: zhPost.content,
    tags: zhPost.tags,
    status: 'published',
    language: 'zh-TW'
  })
});

const zhData = await zhResponse.json();
console.log('中文文章已創建:', zhData.data.url);

// 創建英文文章 (可選: 關聯到中文文章)
const enResponse = await fetch('https://aiziwei.online/api/blog/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: enPost.title,
    content: enPost.content,
    tags: enPost.tags,
    status: 'published',
    language: 'en',
    translated_from: zhData.data.id // 可選: 關聯到中文文章
  })
});

const enData = await enResponse.json();
console.log('英文文章已創建:', enData.data.url);
```

---

## 6. n8n 工作流範例

如果您使用 n8n 自動化創建文章,以下是配置範例:

**Node 1: AI 生成雙語內容 (OpenAI Node)**
- Model: `gpt-4o`
- Prompt: (同上述 AI 提示詞)
- Output: JSON 格式

**Node 2: 創建中文文章 (HTTP Request Node)**
- Method: `POST`
- URL: `https://aiziwei.online/api/blog/create`
- Headers:
  - `Authorization`: `Bearer {{$credentials.blogApiToken}}`
  - `Content-Type`: `application/json`
- Body:
```json
{
  "title": "{{$json.zh-TW.title}}",
  "content": "{{$json.zh-TW.content}}",
  "tags": "{{$json.zh-TW.tags}}",
  "status": "published",
  "language": "zh-TW"
}
```

**Node 3: 創建英文文章 (HTTP Request Node)**
- Method: `POST`
- URL: `https://aiziwei.online/api/blog/create`
- Headers: (同 Node 2)
- Body:
```json
{
  "title": "{{$json.en.title}}",
  "content": "{{$json.en.content}}",
  "tags": "{{$json.en.tags}}",
  "status": "published",
  "language": "en",
  "translated_from": "{{$node.Node2.json.data.id}}"
}
```

---

## 7. 重要注意事項

### Slug 生成規則

- Slug 在**同一語言**下必須唯一
- 不同語言可以有相同的 slug
- 系統會自動將標題轉換為 slug
- 如果 slug 重複,會自動加上數字後綴 (`-1`, `-2`, ...)

**範例:**
```
zh-TW: "紫微斗數入門" → slug: "ziwei-doushu-rumen"
en: "Zi Wei Dou Shu Introduction" → slug: "zi-wei-dou-shu-introduction"
```

如果在同語言下創建相同標題:
```
第一篇: "紫微斗數入門" → "ziwei-doushu-rumen"
第二篇: "紫微斗數入門" → "ziwei-doushu-rumen-1"
第三篇: "紫微斗數入門" → "ziwei-doushu-rumen-2"
```

### 語言驗證

- 只支援 `zh-TW` 和 `en`
- 無效的語言代碼會自動降級為 `zh-TW`
- 資料庫層級有 CHECK 約束確保資料完整性

### 標籤處理

支援三種格式:
```javascript
// 1. JSON 陣列 (推薦)
"tags": ["標籤1", "標籤2"]

// 2. JSON 字串
"tags": "[\"標籤1\", \"標籤2\"]"

// 3. 逗號分隔字串
"tags": "標籤1,標籤2,標籤3"
```

### 認證

創建、更新、刪除文章需要 Bearer Token 認證:
```
Authorization: Bearer YOUR_API_TOKEN
```

---

## 8. 錯誤處理

| HTTP Status | 錯誤訊息 | 說明 |
|-------------|----------|------|
| 400 | `缺少必填欄位：title 或 content` | 缺少必填參數 |
| 400 | `translated_from 指向的原始文章不存在` | 無效的 translated_from UUID |
| 401 | `未授權` | 缺少或無效的 Authorization header |
| 404 | `文章不存在` | 找不到指定的文章 |
| 405 | `不支援的請求方法` | 使用錯誤的 HTTP 方法 |
| 500 | `伺服器錯誤：...` | 伺服器內部錯誤 |

---

## 9. 資料庫遷移

在使用多語言功能前,請確保已執行資料庫遷移:

```bash
psql $DATABASE_URL -f scripts/migrations/002-add-language-to-blog-posts.sql
```

此遷移會:
- 新增 `language` 欄位 (預設 `zh-TW`)
- 新增 `translated_from` 欄位 (可選關聯)
- 創建索引 (`idx_blog_posts_language`, `idx_blog_posts_translated_from`)
- 新增語言驗證約束 (`chk_blog_posts_language`)

---

## 10. 常見問題 (FAQ)

**Q: 可以修改已創建文章的語言嗎?**
A: 目前 API 不支援修改語言欄位,建議創建新文章並刪除舊文章。

**Q: 如何查詢某篇文章的所有翻譯版本?**
A: 目前需要自行記錄 `translated_from` 關係,未來版本可能會新增專門的查詢端點。

**Q: Slug 可以手動指定嗎?**
A: 目前不支援,Slug 會根據標題自動生成。

**Q: 可以創建簡體中文版本嗎?**
A: 目前僅支援 `zh-TW` 和 `en`,如需其他語言請聯繫開發團隊。

---

## 版本歷史

- **v1.0** (2025-12-31): 初始版本,支援 zh-TW 和 en 雙語
