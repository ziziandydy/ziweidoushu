# 資料庫 Migration 執行指南

本文件說明如何執行資料庫 migration，特別是 Blog 多語言支援的 migration。

## 目錄

1. [方法 1: 使用 npm script (最簡單)](#方法-1-使用-npm-script-最簡單)
2. [方法 2: Vercel Dashboard (無需命令列)](#方法-2-vercel-dashboard-無需命令列)
3. [方法 3: 使用 Vercel CLI](#方法-3-使用-vercel-cli)
4. [驗證 Migration 是否成功](#驗證-migration-是否成功)
5. [常見問題](#常見問題)

---

## 方法 1: 使用 npm script (最簡單)

這是最簡單的方法，只需一個命令：

```bash
npm run migrate:002
```

### 執行步驟：

1. 確保您的 `.env.local` 檔案包含 `DATABASE_URL`
2. 在專案根目錄執行：
   ```bash
   npm run migrate:002
   ```
3. 看到 `✅ Migration completed successfully!` 即表示成功

### 執行結果範例：

```
🚀 Starting migration...
📄 Reading file: scripts/migrations/002-add-language-to-blog-posts.sql
🔄 Executing migration...
  ➜ Executing: ALTER TABLE blog_posts...
  ➜ Executing: ALTER TABLE blog_posts...
  ➜ Executing: CREATE INDEX...
  ➜ Executing: CREATE INDEX...
  ➜ Executing: UPDATE blog_posts...
  ➜ Executing: ALTER TABLE blog_posts...
✅ Migration completed successfully!

📊 Verifying changes...
✅ New columns added:
  - language: character varying (default: 'zh-TW')
  - translated_from: uuid (default: NULL)

✅ Indexes created:
  - idx_blog_posts_language
  - idx_blog_posts_translated_from

✅ Constraint created:
  - chk_blog_posts_language: CHECK ((language IN ('zh-TW', 'en')))
```

---

## 方法 2: Vercel Dashboard (無需命令列)

如果您不熟悉命令列工具，可以使用 Vercel 的網頁介面：

### 執行步驟：

1. **登入 Vercel Dashboard**
   - 前往 https://vercel.com/dashboard
   - 登入您的帳號

2. **進入專案的資料庫**
   - 選擇專案 `ziweidoushu`
   - 點擊左側選單的 **Storage**
   - 選擇您的 Postgres 資料庫

3. **開啟 Query 編輯器**
   - 點擊上方的 **Query** 標籤
   - 您會看到一個 SQL 編輯器

4. **複製並執行 SQL**
   - 開啟檔案 `scripts/migrations/002-add-language-to-blog-posts.sql`
   - 複製所有 SQL 內容
   - 貼到 Vercel 的 Query 編輯器
   - 點擊 **Run Query** 按鈕

5. **確認執行成功**
   - 檢查右側的執行結果
   - 應該看到 `Query completed successfully`

### 優點：
- 不需要安裝任何命令列工具
- 視覺化介面，容易理解
- 可以即時看到執行結果

### 缺點：
- 需要手動複製貼上 SQL
- 無法自動驗證結果

---

## 方法 3: 使用 Vercel CLI

適合熟悉命令列的開發者：

### 前置準備：

```bash
# 1. 安裝 Vercel CLI (如果尚未安裝)
npm install -g vercel

# 2. 登入 Vercel
vercel login

# 3. 連結到專案
vercel link
```

### 執行 Migration：

#### 選項 A: 使用環境變數

```bash
# 1. 下載環境變數
vercel env pull .env.local

# 2. 使用 psql 執行 migration (需要先安裝 PostgreSQL 客戶端)
psql $(grep DATABASE_URL .env.local | cut -d '=' -f2-) -f scripts/migrations/002-add-language-to-blog-posts.sql
```

#### 選項 B: 使用 Node.js script

```bash
# 直接執行 migration script
npm run migrate:002
```

---

## 驗證 Migration 是否成功

### 方法 1: 使用 Vercel Dashboard

1. 進入 **Storage** → **Query**
2. 執行以下 SQL 檢查欄位：

```sql
-- 檢查新增的欄位
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'blog_posts'
AND column_name IN ('language', 'translated_from')
ORDER BY column_name;
```

預期結果：
```
column_name      | data_type         | column_default
-----------------+-------------------+------------------
language         | character varying | 'zh-TW'
translated_from  | uuid              | NULL
```

3. 檢查索引：

```sql
-- 檢查索引
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'blog_posts'
AND indexname LIKE 'idx_blog_posts_language%'
ORDER BY indexname;
```

預期結果：
```
indexname                           | indexdef
------------------------------------+------------------------------------------
idx_blog_posts_language             | CREATE INDEX ... ON blog_posts USING ...
idx_blog_posts_translated_from      | CREATE INDEX ... ON blog_posts USING ...
```

4. 檢查約束：

```sql
-- 檢查語言約束
SELECT conname, pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'blog_posts'::regclass
AND conname = 'chk_blog_posts_language';
```

預期結果：
```
conname                  | definition
-------------------------+----------------------------------------
chk_blog_posts_language  | CHECK ((language IN ('zh-TW', 'en')))
```

### 方法 2: 測試 API

執行 migration 後，測試 API 是否正常運作：

```bash
# 測試取得中文文章列表
curl "https://aiziwei.online/api/blog/list?language=zh-TW"

# 測試取得英文文章列表
curl "https://aiziwei.online/api/blog/list?language=en"
```

---

## 常見問題

### Q1: 執行 migration 時出現 "relation does not exist" 錯誤

**原因:** `blog_posts` 表格不存在

**解決方法:**
1. 確認您連接到正確的資料庫
2. 檢查 `DATABASE_URL` 環境變數是否正確
3. 先執行基礎的表格建立 migration

### Q2: 出現 "column already exists" 錯誤

**原因:** Migration 已經執行過了

**解決方法:**
- 這是正常的，表示 migration 已經完成
- SQL 中使用了 `IF NOT EXISTS`，所以重複執行是安全的

### Q3: 約束 (constraint) 建立失敗

**錯誤訊息:**
```
ERROR: constraint "chk_blog_posts_language" already exists
```

**解決方法:**
- 約束已經存在，可以忽略此錯誤
- 或者先刪除舊約束：
  ```sql
  ALTER TABLE blog_posts DROP CONSTRAINT IF EXISTS chk_blog_posts_language;
  ```
  然後重新執行 migration

### Q4: 如何回滾 (rollback) migration？

如果需要回滾此 migration：

```sql
-- 刪除約束
ALTER TABLE blog_posts DROP CONSTRAINT IF EXISTS chk_blog_posts_language;

-- 刪除索引
DROP INDEX IF EXISTS idx_blog_posts_language;
DROP INDEX IF EXISTS idx_blog_posts_translated_from;

-- 刪除欄位
ALTER TABLE blog_posts DROP COLUMN IF EXISTS language;
ALTER TABLE blog_posts DROP COLUMN IF EXISTS translated_from;
```

### Q5: npm run migrate:002 顯示 "Cannot find module '@vercel/postgres'"

**解決方法:**
```bash
# 安裝依賴
npm install
```

### Q6: 執行後現有文章看不到了

**原因:** 現有文章的 `language` 欄位為 NULL

**解決方法:**
Migration 中已經包含更新語句，應該會自動設定為 `zh-TW`。如果沒有，手動執行：

```sql
UPDATE blog_posts
SET language = 'zh-TW'
WHERE language IS NULL;
```

---

## Migration 檔案說明

Migration 檔案位置: `scripts/migrations/002-add-language-to-blog-posts.sql`

### 主要變更：

1. **新增欄位:**
   - `language VARCHAR(10) DEFAULT 'zh-TW'` - 文章語言
   - `translated_from UUID` - 翻譯來源文章 ID (可選)

2. **新增索引:**
   - `idx_blog_posts_language` - 加速語言篩選查詢
   - `idx_blog_posts_translated_from` - 加速翻譯關聯查詢

3. **新增約束:**
   - `chk_blog_posts_language` - 確保語言只能是 'zh-TW' 或 'en'

4. **更新現有資料:**
   - 將所有現有文章的 `language` 設定為 `zh-TW`

---

## 下一步

Migration 執行成功後，您就可以：

1. 使用 API 創建多語言文章
2. 在前端切換語言查看不同語言的文章列表
3. 查看 [BLOG_API_MULTILINGUAL.md](./BLOG_API_MULTILINGUAL.md) 了解如何使用多語言 API

---

## 技術支援

如果遇到任何問題：

1. 檢查 [常見問題](#常見問題) 部分
2. 查看 migration script 的執行日誌
3. 在 Vercel Dashboard 中檢查資料庫狀態
4. 參考 [BLOG_I18N_STRATEGY.md](./BLOG_I18N_STRATEGY.md) 了解完整策略

---

**最後更新:** 2025-12-31
**Migration 版本:** 002
