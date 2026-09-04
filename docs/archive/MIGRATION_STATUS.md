# Migration 執行狀態檢查

## 快速驗證方法

### 方法 1: 使用 npm script (需要環境變數)

```bash
# 1. 確保有 .env.local 檔案 (包含 POSTGRES_URL 或 DATABASE_URL)
# 如果沒有，請執行:
vercel env pull .env.local

# 2. 執行驗證
npm run verify-migration
```

### 方法 2: 使用 Vercel Dashboard (最簡單,不需命令列)

1. 前往 https://vercel.com/dashboard
2. 選擇專案 **ziweidoushu**
3. 進入 **Storage** → 選擇 Postgres 資料庫
4. 點擊 **Query** 標籤
5. 複製以下 SQL 並執行:

#### 檢查欄位

```sql
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'blog_posts'
AND column_name IN ('language', 'translated_from')
ORDER BY column_name;
```

**預期結果 (Migration 成功):**
```
column_name      | data_type         | column_default | is_nullable
-----------------+-------------------+----------------+-------------
language         | character varying | 'zh-TW'        | YES
translated_from  | uuid              | NULL           | YES
```

如果看到這兩個欄位,表示 **Migration 已執行成功** ✅

#### 檢查索引

```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'blog_posts'
AND indexname LIKE 'idx_blog_posts_language%'
ORDER BY indexname;
```

**預期結果:**
```
indexname
---------------------------------
idx_blog_posts_language
idx_blog_posts_translated_from
```

#### 檢查約束

```sql
SELECT conname, pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'blog_posts'::regclass
AND conname = 'chk_blog_posts_language';
```

**預期結果:**
```
conname                  | definition
-------------------------+----------------------------------------
chk_blog_posts_language  | CHECK ((language::text = ANY (ARRAY['zh-TW'::character varying, 'en'::character varying]::text[])))
```

#### 檢查現有文章

```sql
SELECT
  COUNT(*) as total,
  COUNT(CASE WHEN language IS NULL THEN 1 END) as null_count,
  COUNT(CASE WHEN language = 'zh-TW' THEN 1 END) as zh_count,
  COUNT(CASE WHEN language = 'en' THEN 1 END) as en_count
FROM blog_posts;
```

**預期結果:**
- `total`: 總文章數
- `null_count`: 應該為 `0` (如果不是 0,請執行下方的修正 SQL)
- `zh_count`: 中文文章數量
- `en_count`: 英文文章數量

**如果 null_count > 0,執行修正:**

```sql
UPDATE blog_posts
SET language = 'zh-TW'
WHERE language IS NULL;
```

---

## Migration 狀態判斷

### ✅ Migration 已成功執行

如果您看到:
- ✅ `language` 和 `translated_from` 兩個欄位都存在
- ✅ 兩個索引都已建立
- ✅ 語言約束已建立
- ✅ 現有文章的 `language` 欄位都不是 NULL

**恭喜! Migration 已完成,您可以開始使用多語言 Blog API 了!**

查看使用指南: [docs/BLOG_API_MULTILINGUAL.md](docs/BLOG_API_MULTILINGUAL.md)

### ❌ Migration 尚未執行

如果您看到:
- ❌ 找不到 `language` 或 `translated_from` 欄位

**請執行 Migration:**

```bash
npm run migrate:002
```

或使用 Vercel Dashboard 執行:
[docs/DATABASE_MIGRATION_GUIDE.md](docs/DATABASE_MIGRATION_GUIDE.md)

### ⚠️ Migration 部分完成

如果您看到:
- ✅ 欄位存在
- ❌ 但索引或約束缺失

**重新執行 Migration (安全,不會重複建立):**

```bash
npm run migrate:002
```

---

## 測試 API 功能

Migration 執行成功後,測試多語言功能:

### 測試 1: 查詢中文文章列表

```bash
curl "https://aiziwei.online/api/blog/list?language=zh-TW"
```

**預期回應:**
```json
{
  "success": true,
  "data": {
    "posts": [...],
    "pagination": {...},
    "language": "zh-TW"
  }
}
```

### 測試 2: 查詢英文文章列表

```bash
curl "https://aiziwei.online/api/blog/list?language=en"
```

### 測試 3: 存取中文 Blog 頁面

在瀏覽器開啟:
```
https://aiziwei.online/zh-TW/blog
```

### 測試 4: 存取英文 Blog 頁面

在瀏覽器開啟:
```
https://aiziwei.online/en/blog
```

---

## 常見問題

### Q: 執行 npm run verify-migration 出現 "missing_connection_string" 錯誤

**原因:** 缺少資料庫連線環境變數

**解決方法:**
```bash
# 下載 Vercel 環境變數
vercel env pull .env.local

# 然後重新執行驗證
npm run verify-migration
```

### Q: 看到欄位已存在,但 null_count 不是 0

**原因:** 現有文章尚未設定語言

**解決方法:**

在 Vercel Dashboard Query 中執行:
```sql
UPDATE blog_posts
SET language = 'zh-TW'
WHERE language IS NULL;
```

### Q: 如何確認 API 已經支援多語言?

**方法 1:** 查看 API 原始碼
- [api/blog/[id].js](api/blog/[id].js) - 第 66-92 行應該有語言參數處理
- [api/blog/list.js](api/blog/list.js) - 第 35-44 行應該有語言參數處理

**方法 2:** 直接測試 API
```bash
curl "https://aiziwei.online/api/blog/list?language=en"
```

如果回應中包含 `"language": "en"`,表示 API 已支援多語言 ✅

---

## 下一步

Migration 完成後:

1. ✅ **創建雙語文章** - 查看 [BLOG_API_MULTILINGUAL.md](docs/BLOG_API_MULTILINGUAL.md)
2. ✅ **測試語言切換** - 在前端測試 `/zh-TW/blog` 和 `/en/blog`
3. ✅ **配置 n8n 工作流** - 自動生成雙語內容

---

**最後更新:** 2025-12-31
