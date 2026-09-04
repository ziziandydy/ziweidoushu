# 部落格系統實施計劃

**專案**: AI 紫微斗數網站 - 部落格功能擴展
**日期**: 2025-12-16
**目標**: 新增部落格區塊、後台管理平台、Blog API (Bearer Authentication)

---

## 📋 目錄

1. [功能需求總覽](#功能需求總覽)
2. [技術架構設計](#技術架構設計)
3. [資料庫方案選擇](#資料庫方案選擇)
4. [詳細實施步驟](#詳細實施步驟)
5. [API 規格設計](#api-規格設計)
6. [後台管理介面設計](#後台管理介面設計)
7. [前台部落格介面設計](#前台部落格介面設計)
8. [安全性考量](#安全性考量)
9. [部署與測試](#部署與測試)
10. [未來擴展建議](#未來擴展建議)

---

## 🎯 功能需求總覽

### 1. 前台部落格區塊
- 顯示部落格文章列表（分頁）
- 文章詳細頁面（支援 Markdown 渲染）
- 標籤分類與篩選
- SEO 優化（Meta 標籤、結構化數據）
- 響應式設計（延續現有 UI 風格）

### 2. 後台管理平台
- 管理員登入系統（Bearer Token 認證）
- 文章 CRUD 操作介面
  - 新增文章（標題、內容、標籤）
  - 編輯文章
  - 刪除文章
  - 草稿/發布狀態管理
- Markdown 編輯器（即時預覽）
- 文章列表管理

### 3. Blog API（Bearer Authentication）
- **POST /api/blog/create** - 建立文章（需認證）
- **GET /api/blog/list** - 取得文章列表（公開）
- **GET /api/blog/:id** - 取得單篇文章（公開）
- **PUT /api/blog/:id** - 更新文章（需認證）
- **DELETE /api/blog/:id** - 刪除文章（需認證）
- **POST /api/auth/login** - 管理員登入

#### 預期 API Input 格式（來自 n8n webhook）
```json
{
  "headers": {
    "authorization": "Bearer YOUR_TOKEN",
    "content-type": "application/json"
  },
  "body": {
    "titles": "武曲星在辛丑日（農曆2025年12月26日）運勢解析",
    "content": "**運勢評分：★★★★☆（4/5）**\n\n今日辛丑日...",
    "tags": "[\"紫微斗數\", \"AI\", \"武曲\"]"
  }
}
```

---

## 🏗️ 技術架構設計

### 技術棧選擇

| 層級 | 技術選擇 | 理由 |
|------|---------|------|
| **前端** | HTML + Tailwind CSS + Vanilla JS | 延續現有技術棧，保持一致性 |
| **後端** | Vercel Serverless Functions (Node.js 24.x) | 現有架構，無需額外伺服器 |
| **資料庫** | **Vercel Postgres** (推薦) 或 MongoDB Atlas | 與 Vercel 原生整合，Serverless 友善 |
| **認證** | JWT (Bearer Token) | 無狀態認證，適合 Serverless |
| **Markdown 渲染** | marked.js + DOMPurify | 輕量且安全的 Markdown 解析 |
| **編輯器** | SimpleMDE 或 EasyMDE | 簡單易用的 Markdown 編輯器 |

### 系統架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                        前台使用者                            │
│                     (blog.html, blog/:id)                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │  Blog API     │ (公開 GET)
         │  /api/blog/*  │
         └───────┬───────┘
                 │
                 ▼
         ┌───────────────┐
         │ Vercel        │
         │ Postgres DB   │
         └───────────────┘
                 ▲
                 │
         ┌───────┴───────┐
         │  Blog API     │ (認證 POST/PUT/DELETE)
         │  /api/blog/*  │ + Bearer Token 驗證
         └───────┬───────┘
                 │
                 ▼
┌────────────────┴────────────────────────────────────────────┐
│                     管理員 (兩種方式)                        │
│  1. 後台介面 (admin.html) - JWT 登入                        │
│  2. n8n Webhook - 固定 Bearer Token                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 💾 資料庫方案選擇

### 方案比較

| 方案 | 優點 | 缺點 | 推薦度 |
|------|------|------|--------|
| **Neon (via Vercel)** | • Vercel 原生整合<br>• Scale to Zero<br>• 低延遲<br>• 免費方案 512MB<br>• 資料庫分支功能 | • 供應商鎖定<br>• 容量較小 | ⭐⭐⭐⭐⭐ |
| **Supabase** | • 開源<br>• 內建認證<br>• 免費 500MB + 1GB Storage<br>• 完整 Dashboard | • 需學習新工具<br>• 額外複雜度 | ⭐⭐⭐⭐ |
| **MongoDB Atlas** | • 靈活的 Schema<br>• 免費 512MB<br>• 多雲支援 | • 需額外配置<br>• 冷啟動延遲 | ⭐⭐⭐ |

### 最終選擇：**Neon Postgres (透過 Vercel Marketplace)**

**2025 年更新**：Vercel 已將 Postgres 服務轉移至 Neon。現在透過 Vercel Storage > Postgres 可一鍵啟用 Neon 資料庫。

**理由**：
1. ✅ 與現有 Vercel 部署環境完美整合
2. ✅ Scale to Zero 節省成本（閒置時不計費）
3. ✅ 低延遲、高效能（同機房）
4. ✅ 自動備份與擴展
5. ✅ 簡單的環境變數配置（自動注入）
6. ✅ 免費 512MB 對部落格系統足夠（可存 170,000+ 篇文章）

### 資料庫 Schema 設計

#### 表 1: `blog_posts` (文章表)

| 欄位 | 類型 | 說明 | 索引 |
|------|------|------|------|
| `id` | UUID | 主鍵，自動生成 | PRIMARY KEY |
| `title` | VARCHAR(500) | 文章標題 | - |
| `content` | TEXT | Markdown 內容 | - |
| `tags` | JSONB | 標籤陣列 `["tag1", "tag2"]` | GIN Index |
| `status` | ENUM | `draft`, `published` | INDEX |
| `created_at` | TIMESTAMP | 建立時間 | INDEX |
| `updated_at` | TIMESTAMP | 更新時間 | - |
| `published_at` | TIMESTAMP | 發布時間（nullable） | INDEX |
| `slug` | VARCHAR(500) | URL slug（自動生成） | UNIQUE INDEX |

#### 表 2: `admin_users` (管理員表)

| 欄位 | 類型 | 說明 | 索引 |
|------|------|------|------|
| `id` | UUID | 主鍵 | PRIMARY KEY |
| `username` | VARCHAR(100) | 管理員帳號 | UNIQUE INDEX |
| `password_hash` | VARCHAR(255) | bcrypt 雜湊密碼 | - |
| `email` | VARCHAR(255) | 電子郵件 | UNIQUE INDEX |
| `created_at` | TIMESTAMP | 建立時間 | - |

#### 表 3: `api_tokens` (API Token 表)

| 欄位 | 類型 | 說明 | 索引 |
|------|------|------|------|
| `id` | UUID | 主鍵 | PRIMARY KEY |
| `token` | VARCHAR(500) | Bearer Token | UNIQUE INDEX |
| `description` | VARCHAR(255) | Token 用途說明 | - |
| `created_at` | TIMESTAMP | 建立時間 | - |
| `expires_at` | TIMESTAMP | 過期時間（nullable） | - |
| `is_active` | BOOLEAN | 是否啟用 | INDEX |

### SQL 初始化腳本

```sql
-- 建立文章表
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    slug VARCHAR(500) UNIQUE NOT NULL
);

-- 建立索引
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN (tags);

-- 建立管理員表
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立 API Token 表
CREATE TABLE api_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(500) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_api_tokens_token ON api_tokens(token);
CREATE INDEX idx_api_tokens_active ON api_tokens(is_active);

-- 插入預設管理員 (密碼: admin123 - 記得修改！)
-- bcrypt hash for 'admin123' (rounds=10)
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@ziweidoushu.com');

-- 插入預設 API Token (用於 n8n)
INSERT INTO api_tokens (token, description, is_active) VALUES
('ziwei_n8n_bearer_token_change_me_in_production', 'n8n Webhook Token', true);
```

---

## 📝 詳細實施步驟

### 階段 1: 資料庫設置 (1-2 小時)

#### 步驟 1.1: 在 Vercel 建立 Postgres 資料庫
```bash
# 方法 1: 通過 Vercel Dashboard
1. 登入 Vercel Dashboard
2. 進入專案 > Storage > Create Database
3. 選擇 Postgres
4. 選擇地區 (建議: San Francisco - 與 Serverless Functions 同區)
5. 建立資料庫

# 方法 2: 通過 Vercel CLI
vercel link
vercel env pull .env.local
```

#### 步驟 1.2: 設定環境變數
在 Vercel Dashboard > Settings > Environment Variables 新增：

```bash
# Vercel Postgres (自動生成)
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."

# JWT Secret (自行生成)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# API Bearer Token (用於 n8n)
BLOG_API_BEARER_TOKEN="ziwei_n8n_bearer_token_change_me_in_production"
```

#### 步驟 1.3: 執行資料庫初始化
建立 `scripts/init-db.js`:

```javascript
const { sql } = require('@vercel/postgres');

async function initDatabase() {
  try {
    // 執行上面的 SQL 初始化腳本
    await sql`/* SQL 腳本內容 */`;
    console.log('✅ 資料庫初始化成功！');
  } catch (error) {
    console.error('❌ 資料庫初始化失敗:', error);
  }
}

initDatabase();
```

執行：
```bash
node scripts/init-db.js
```

---

### 階段 2: 後端 API 開發 (4-6 小時)

#### 步驟 2.1: 安裝必要套件

```bash
npm install @vercel/postgres bcryptjs jsonwebtoken slugify
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

更新 `package.json`:
```json
{
  "dependencies": {
    "@vercel/postgres": "^0.10.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "slugify": "^1.6.6",
    "ecpay_aio_nodejs": "^1.2.2",
    "util": "^0.12.5"
  }
}
```

#### 步驟 2.2: 建立工具函數

建立 `api/utils/auth.js`:
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sql } = require('@vercel/postgres');

// 驗證 Bearer Token (兩種方式)
async function verifyBearerToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }

  const token = authHeader.substring(7);

  // 方法 1: 檢查是否為固定 API Token (n8n)
  const apiToken = await sql`
    SELECT * FROM api_tokens
    WHERE token = ${token} AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
  `;

  if (apiToken.rows.length > 0) {
    return { type: 'api_token', token: apiToken.rows[0] };
  }

  // 方法 2: 驗證 JWT Token (後台登入)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { type: 'jwt', user: decoded };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// 生成 JWT Token
function generateJWT(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// 驗證密碼
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// 雜湊密碼
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

module.exports = {
  verifyBearerToken,
  generateJWT,
  verifyPassword,
  hashPassword
};
```

建立 `api/utils/cors.js`:
```javascript
const allowedOrigins = [
  'https://ziweidoushu.vercel.app',
  'https://ziweidoushy.vercel.app',
  'http://localhost:8080',
  'http://localhost:3000'
];

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res);
    res.status(200).end();
    return true;
  }
  return false;
}

module.exports = { setCorsHeaders, handleOptions };
```

#### 步驟 2.3: 實作 Blog API

建立 `api/blog/create.js`:
```javascript
/**
 * Vercel Serverless Function - Create Blog Post
 * API Route: POST /api/blog/create
 * Authentication: Bearer Token (JWT or API Token)
 */

const { sql } = require('@vercel/postgres');
const slugify = require('slugify');
const { verifyBearerToken } = require('../utils/auth');
const { setCorsHeaders, handleOptions } = require('../utils/cors');

module.exports = async function handler(req, res) {
  console.log('📝 Blog Create API');

  setCorsHeaders(req, res);
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允許 POST 請求' });
  }

  try {
    // 1. 驗證 Bearer Token
    const authHeader = req.headers.authorization;
    const auth = await verifyBearerToken(authHeader);
    console.log('✅ 認證成功:', auth.type);

    // 2. 解析請求 body
    const { titles, content, tags, status = 'published' } = req.body;

    // 3. 驗證必要欄位
    if (!titles || !content) {
      return res.status(400).json({
        success: false,
        error: '缺少必要欄位: titles 和 content'
      });
    }

    // 4. 處理標籤 (支援 JSON 字串或陣列)
    let tagsArray = [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          tagsArray = JSON.parse(tags);
        } catch (e) {
          tagsArray = tags.split(',').map(t => t.trim());
        }
      } else if (Array.isArray(tags)) {
        tagsArray = tags;
      }
    }

    // 5. 生成 slug
    const baseSlug = slugify(titles, {
      lower: true,
      strict: true,
      locale: 'zh'
    });

    // 確保 slug 唯一性
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await sql`
        SELECT id FROM blog_posts WHERE slug = ${slug}
      `;
      if (existing.rows.length === 0) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 6. 插入資料庫
    const result = await sql`
      INSERT INTO blog_posts (title, content, tags, status, slug, published_at)
      VALUES (
        ${titles},
        ${content},
        ${JSON.stringify(tagsArray)}::jsonb,
        ${status},
        ${slug},
        ${status === 'published' ? new Date() : null}
      )
      RETURNING *
    `;

    const newPost = result.rows[0];

    console.log('✅ 文章建立成功:', newPost.id);

    return res.status(201).json({
      success: true,
      message: '文章建立成功',
      data: {
        id: newPost.id,
        title: newPost.title,
        slug: newPost.slug,
        status: newPost.status,
        url: `https://ziweidoushu.vercel.app/blog/${newPost.slug}`,
        created_at: newPost.created_at
      }
    });

  } catch (error) {
    console.error('❌ 建立文章失敗:', error);

    if (error.message.includes('token')) {
      return res.status(401).json({
        success: false,
        error: '認證失敗：' + error.message
      });
    }

    return res.status(500).json({
      success: false,
      error: '伺服器錯誤：' + error.message
    });
  }
};
```

建立 `api/blog/list.js`:
```javascript
/**
 * Vercel Serverless Function - List Blog Posts
 * API Route: GET /api/blog/list
 * Authentication: Public (no auth required)
 */

const { sql } = require('@vercel/postgres');
const { setCorsHeaders, handleOptions } = require('../utils/cors');

module.exports = async function handler(req, res) {
  console.log('📚 Blog List API');

  setCorsHeaders(req, res);
  if (handleOptions(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: '只允許 GET 請求' });
  }

  try {
    // 取得查詢參數
    const {
      page = 1,
      limit = 10,
      tag = null,
      status = 'published'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // 建立 SQL 查詢
    let query;
    let countQuery;

    if (tag) {
      // 按標籤篩選
      query = await sql`
        SELECT id, title, content, tags, status, created_at, published_at, slug,
               LEFT(content, 200) as excerpt
        FROM blog_posts
        WHERE status = ${status} AND tags @> ${JSON.stringify([tag])}::jsonb
        ORDER BY published_at DESC, created_at DESC
        LIMIT ${parseInt(limit)} OFFSET ${offset}
      `;

      countQuery = await sql`
        SELECT COUNT(*) as total
        FROM blog_posts
        WHERE status = ${status} AND tags @> ${JSON.stringify([tag])}::jsonb
      `;
    } else {
      // 全部文章
      query = await sql`
        SELECT id, title, content, tags, status, created_at, published_at, slug,
               LEFT(content, 200) as excerpt
        FROM blog_posts
        WHERE status = ${status}
        ORDER BY published_at DESC, created_at DESC
        LIMIT ${parseInt(limit)} OFFSET ${offset}
      `;

      countQuery = await sql`
        SELECT COUNT(*) as total
        FROM blog_posts
        WHERE status = ${status}
      `;
    }

    const posts = query.rows;
    const total = parseInt(countQuery.rows[0].total);
    const totalPages = Math.ceil(total / parseInt(limit));

    return res.status(200).json({
      success: true,
      data: {
        posts: posts.map(post => ({
          ...post,
          url: `/blog/${post.slug}`
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('❌ 取得文章列表失敗:', error);
    return res.status(500).json({
      success: false,
      error: '伺服器錯誤：' + error.message
    });
  }
};
```

建立 `api/blog/[id].js`:
```javascript
/**
 * Vercel Serverless Function - Blog Post Operations
 * API Routes:
 *   - GET /api/blog/[id] - Get single post (public)
 *   - PUT /api/blog/[id] - Update post (auth required)
 *   - DELETE /api/blog/[id] - Delete post (auth required)
 */

const { sql } = require('@vercel/postgres');
const { verifyBearerToken } = require('../utils/auth');
const { setCorsHeaders, handleOptions } = require('../utils/cors');
const slugify = require('slugify');

module.exports = async function handler(req, res) {
  console.log(`📄 Blog [${req.method}] API`);

  setCorsHeaders(req, res);
  if (handleOptions(req, res)) return;

  // 從 URL 取得 ID (slug 或 UUID)
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: '缺少文章 ID' });
  }

  try {
    if (req.method === 'GET') {
      return await handleGet(id, res);
    } else if (req.method === 'PUT') {
      return await handleUpdate(id, req, res);
    } else if (req.method === 'DELETE') {
      return await handleDelete(id, req, res);
    } else {
      return res.status(405).json({ error: '不支援的請求方法' });
    }
  } catch (error) {
    console.error(`❌ Blog [${req.method}] 錯誤:`, error);
    return res.status(500).json({
      success: false,
      error: '伺服器錯誤：' + error.message
    });
  }
};

// GET - 取得單篇文章 (公開)
async function handleGet(id, res) {
  // 支援 slug 或 UUID
  const result = await sql`
    SELECT * FROM blog_posts
    WHERE (slug = ${id} OR id::text = ${id})
    AND status = 'published'
  `;

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: '文章不存在'
    });
  }

  const post = result.rows[0];

  return res.status(200).json({
    success: true,
    data: post
  });
}

// PUT - 更新文章 (需認證)
async function handleUpdate(id, req, res) {
  // 驗證認證
  const authHeader = req.headers.authorization;
  await verifyBearerToken(authHeader);

  const { title, content, tags, status } = req.body;

  // 建立更新欄位
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (title !== undefined) {
    updates.push(`title = $${paramCount++}`);
    values.push(title);

    // 更新 slug
    const newSlug = slugify(title, { lower: true, strict: true, locale: 'zh' });
    updates.push(`slug = $${paramCount++}`);
    values.push(newSlug);
  }

  if (content !== undefined) {
    updates.push(`content = $${paramCount++}`);
    values.push(content);
  }

  if (tags !== undefined) {
    updates.push(`tags = $${paramCount++}::jsonb`);
    values.push(JSON.stringify(Array.isArray(tags) ? tags : JSON.parse(tags)));
  }

  if (status !== undefined) {
    updates.push(`status = $${paramCount++}`);
    values.push(status);

    if (status === 'published') {
      updates.push(`published_at = NOW()`);
    }
  }

  updates.push(`updated_at = NOW()`);
  values.push(id);

  const query = `
    UPDATE blog_posts
    SET ${updates.join(', ')}
    WHERE id::text = $${paramCount} OR slug = $${paramCount}
    RETURNING *
  `;

  const result = await sql.query(query, values);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: '文章不存在'
    });
  }

  return res.status(200).json({
    success: true,
    message: '文章更新成功',
    data: result.rows[0]
  });
}

// DELETE - 刪除文章 (需認證)
async function handleDelete(id, req, res) {
  // 驗證認證
  const authHeader = req.headers.authorization;
  await verifyBearerToken(authHeader);

  const result = await sql`
    DELETE FROM blog_posts
    WHERE id::text = ${id} OR slug = ${id}
    RETURNING id, title
  `;

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: '文章不存在'
    });
  }

  return res.status(200).json({
    success: true,
    message: '文章刪除成功',
    data: result.rows[0]
  });
}
```

建立 `api/auth/login.js`:
```javascript
/**
 * Vercel Serverless Function - Admin Login
 * API Route: POST /api/auth/login
 */

const { sql } = require('@vercel/postgres');
const { verifyPassword, generateJWT } = require('../utils/auth');
const { setCorsHeaders, handleOptions } = require('../utils/cors');

module.exports = async function handler(req, res) {
  console.log('🔐 Admin Login API');

  setCorsHeaders(req, res);
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允許 POST 請求' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: '請提供帳號和密碼'
      });
    }

    // 查詢管理員
    const result = await sql`
      SELECT * FROM admin_users
      WHERE username = ${username}
    `;

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: '帳號或密碼錯誤'
      });
    }

    const user = result.rows[0];

    // 驗證密碼
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: '帳號或密碼錯誤'
      });
    }

    // 生成 JWT Token
    const token = generateJWT(user);

    return res.status(200).json({
      success: true,
      message: '登入成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
    });

  } catch (error) {
    console.error('❌ 登入失敗:', error);
    return res.status(500).json({
      success: false,
      error: '伺服器錯誤：' + error.message
    });
  }
};
```

---

### 階段 3: 前台部落格介面 (3-4 小時)

#### 步驟 3.1: 建立部落格列表頁面

建立 `public/blog.html`:

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary Meta Tags -->
    <title>紫微斗數 AI 部落格 | 命理知識分享</title>
    <meta name="description" content="探索紫微斗數的奧秘，AI 生成的命理知識文章，涵蓋每日運勢、星曜解析、命理教學等內容。">
    <meta name="keywords" content="紫微斗數部落格,命理文章,AI命理,每日運勢,星曜解析">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="紫微斗數 AI 部落格">
    <meta property="og:description" content="探索紫微斗數的奧秘，AI 生成的命理知識文章">

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        .blog-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .blog-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(147, 51, 234, 0.15);
        }
        .tag-badge {
            transition: background-color 0.2s ease;
        }
        .tag-badge:hover {
            background-color: #7c3aed;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-purple-50 via-white to-purple-50 min-h-screen">

    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <a href="/" class="text-2xl font-bold text-purple-600">AI 紫微斗數</a>
                <span class="text-gray-400">|</span>
                <span class="text-lg text-gray-600">部落格</span>
            </div>
            <nav class="flex space-x-6">
                <a href="/" class="text-gray-600 hover:text-purple-600">首頁</a>
                <a href="/analysis" class="text-gray-600 hover:text-purple-600">命盤計算</a>
                <a href="/blog" class="text-purple-600 font-semibold">部落格</a>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-12">

        <!-- Page Title -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">紫微斗數 AI 部落格</h1>
            <p class="text-lg text-gray-600">探索命理智慧，每日更新運勢與星曜解析</p>
        </div>

        <!-- Tag Filter -->
        <div id="tagFilter" class="flex flex-wrap justify-center gap-2 mb-8">
            <!-- 動態生成標籤 -->
        </div>

        <!-- Loading State -->
        <div id="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p class="mt-4 text-gray-600">載入文章中...</p>
        </div>

        <!-- Blog Posts Grid -->
        <div id="blogGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 hidden">
            <!-- 動態生成文章卡片 -->
        </div>

        <!-- Empty State -->
        <div id="emptyState" class="text-center py-12 hidden">
            <p class="text-xl text-gray-500">目前沒有文章</p>
        </div>

        <!-- Pagination -->
        <div id="pagination" class="flex justify-center items-center space-x-4 mt-12 hidden">
            <!-- 動態生成分頁 -->
        </div>

    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-16">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2025 AI 紫微斗數. All rights reserved.</p>
            <div class="mt-4 space-x-6">
                <a href="/privacy-policy" class="hover:text-purple-400">隱私政策</a>
                <a href="/pricing" class="hover:text-purple-400">價格方案</a>
            </div>
        </div>
    </footer>

    <script>
        // API 基礎 URL
        const API_BASE = '/api/blog';

        // 狀態
        let currentPage = 1;
        let currentTag = null;

        // 初始化
        document.addEventListener('DOMContentLoaded', () => {
            loadBlogPosts();
        });

        // 載入部落格文章
        async function loadBlogPosts(page = 1, tag = null) {
            currentPage = page;
            currentTag = tag;

            const loading = document.getElementById('loading');
            const blogGrid = document.getElementById('blogGrid');
            const emptyState = document.getElementById('emptyState');
            const pagination = document.getElementById('pagination');

            // 顯示載入狀態
            loading.classList.remove('hidden');
            blogGrid.classList.add('hidden');
            emptyState.classList.add('hidden');
            pagination.classList.add('hidden');

            try {
                let url = `${API_BASE}/list?page=${page}&limit=9`;
                if (tag) url += `&tag=${encodeURIComponent(tag)}`;

                const response = await fetch(url);
                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error);
                }

                const { posts, pagination: paginationData } = result.data;

                // 隱藏載入狀態
                loading.classList.add('hidden');

                if (posts.length === 0) {
                    emptyState.classList.remove('hidden');
                    return;
                }

                // 渲染文章
                renderBlogPosts(posts);
                renderPagination(paginationData);
                renderTagFilter(posts);

                blogGrid.classList.remove('hidden');
                if (paginationData.totalPages > 1) {
                    pagination.classList.remove('hidden');
                }

            } catch (error) {
                console.error('載入文章失敗:', error);
                loading.innerHTML = '<p class="text-red-500">載入失敗，請稍後再試</p>';
            }
        }

        // 渲染文章卡片
        function renderBlogPosts(posts) {
            const blogGrid = document.getElementById('blogGrid');
            blogGrid.innerHTML = posts.map(post => `
                <article class="blog-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                         onclick="window.location.href='/blog/${post.slug}'">
                    <div class="p-6">
                        <h2 class="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                            ${escapeHtml(post.title)}
                        </h2>
                        <p class="text-gray-600 mb-4 line-clamp-3">
                            ${extractPlainText(post.excerpt)}...
                        </p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${post.tags.map(tag => `
                                <span class="tag-badge px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                                      onclick="event.stopPropagation(); loadBlogPosts(1, '${tag}')">
                                    ${escapeHtml(tag)}
                                </span>
                            `).join('')}
                        </div>
                        <div class="flex justify-between items-center text-sm text-gray-500">
                            <span>${formatDate(post.published_at || post.created_at)}</span>
                            <span class="text-purple-600 font-semibold">閱讀更多 →</span>
                        </div>
                    </div>
                </article>
            `).join('');
        }

        // 渲染分頁
        function renderPagination(paginationData) {
            const pagination = document.getElementById('pagination');
            const { page, totalPages, hasPrev, hasNext } = paginationData;

            pagination.innerHTML = `
                <button onclick="loadBlogPosts(${page - 1}, currentTag)"
                        class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        ${!hasPrev ? 'disabled' : ''}>
                    上一頁
                </button>
                <span class="text-gray-700">第 ${page} / ${totalPages} 頁</span>
                <button onclick="loadBlogPosts(${page + 1}, currentTag)"
                        class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        ${!hasNext ? 'disabled' : ''}>
                    下一頁
                </button>
            `;
        }

        // 渲染標籤過濾器
        function renderTagFilter(posts) {
            const tagFilter = document.getElementById('tagFilter');
            const allTags = new Set();
            posts.forEach(post => {
                post.tags.forEach(tag => allTags.add(tag));
            });

            tagFilter.innerHTML = `
                <button onclick="loadBlogPosts(1, null)"
                        class="px-4 py-2 rounded-full ${!currentTag ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border'} hover:bg-purple-500 hover:text-white">
                    全部
                </button>
                ${Array.from(allTags).map(tag => `
                    <button onclick="loadBlogPosts(1, '${tag}')"
                            class="px-4 py-2 rounded-full ${currentTag === tag ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border'} hover:bg-purple-500 hover:text-white">
                        ${escapeHtml(tag)}
                    </button>
                `).join('')}
            `;
        }

        // 工具函數
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function extractPlainText(markdown) {
            return markdown.replace(/[#*_`\[\]]/g, '').substring(0, 150);
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    </script>

</body>
</html>
```

#### 步驟 3.2: 建立文章詳細頁面

建立 `public/blog/[slug].html` (使用 Vercel 動態路由):

**注意**: Vercel 靜態檔案不支援動態路由，需要使用 Serverless Function。

建立 `api/blog/page/[slug].js`:

```javascript
/**
 * Vercel Serverless Function - Render Blog Post Page
 * API Route: GET /blog/[slug]
 */

const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  const { slug } = req.query;

  try {
    const result = await sql`
      SELECT * FROM blog_posts
      WHERE slug = ${slug} AND status = 'published'
    `;

    if (result.rows.length === 0) {
      return res.status(404).send(render404Page());
    }

    const post = result.rows[0];
    return res.status(200).send(renderBlogPage(post));

  } catch (error) {
    console.error('渲染文章頁面失敗:', error);
    return res.status(500).send('<h1>伺服器錯誤</h1>');
  }
};

function renderBlogPage(post) {
  return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(post.title)} | AI 紫微斗數部落格</title>
    <meta name="description" content="${escapeHtml(extractPlainText(post.content).substring(0, 160))}">
    <meta property="og:title" content="${escapeHtml(post.title)}">
    <meta property="og:description" content="${escapeHtml(extractPlainText(post.content).substring(0, 160))}">
    <meta property="og:type" content="article">
    <meta property="article:published_time" content="${post.published_at}">

    <link rel="icon" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>

    <style>
        .prose { max-width: 65ch; }
        .prose h1 { font-size: 2em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; }
        .prose h2 { font-size: 1.5em; font-weight: bold; margin-top: 1.5em; margin-bottom: 0.5em; }
        .prose h3 { font-size: 1.25em; font-weight: bold; margin-top: 1.25em; margin-bottom: 0.5em; }
        .prose p { margin-bottom: 1em; line-height: 1.75; }
        .prose ul, .prose ol { margin-left: 1.5em; margin-bottom: 1em; }
        .prose li { margin-bottom: 0.5em; }
        .prose strong { font-weight: bold; }
        .prose em { font-style: italic; }
        .prose code { background: #f3f4f6; padding: 0.2em 0.4em; border-radius: 0.25em; }
        .prose pre { background: #1f2937; color: #f3f4f6; padding: 1em; border-radius: 0.5em; overflow-x: auto; }
    </style>
</head>
<body class="bg-gray-50">

    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" class="text-2xl font-bold text-purple-600">AI 紫微斗數</a>
            <nav class="flex space-x-6">
                <a href="/" class="text-gray-600 hover:text-purple-600">首頁</a>
                <a href="/blog" class="text-gray-600 hover:text-purple-600">部落格</a>
            </nav>
        </div>
    </header>

    <!-- Article -->
    <article class="max-w-4xl mx-auto px-4 py-12">

        <!-- Title -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">${escapeHtml(post.title)}</h1>

        <!-- Meta -->
        <div class="flex items-center space-x-4 text-gray-500 mb-8">
            <span>${formatDate(post.published_at || post.created_at)}</span>
            <span>•</span>
            <div class="flex space-x-2">
                ${post.tags.map(tag => `
                    <a href="/blog?tag=${encodeURIComponent(tag)}"
                       class="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full hover:bg-purple-200">
                        ${escapeHtml(tag)}
                    </a>
                `).join('')}
            </div>
        </div>

        <!-- Content -->
        <div id="content" class="prose prose-lg max-w-none bg-white rounded-lg shadow-sm p-8">
            <!-- Markdown will be rendered here -->
        </div>

        <!-- Back Link -->
        <div class="mt-12 text-center">
            <a href="/blog" class="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                ← 返回部落格列表
            </a>
        </div>

    </article>

    <script>
        // 渲染 Markdown
        const content = ${JSON.stringify(post.content)};
        const html = marked.parse(content);
        const clean = DOMPurify.sanitize(html);
        document.getElementById('content').innerHTML = clean;
    </script>

</body>
</html>
  `;
}

function render404Page() {
  return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>文章不存在 | AI 紫微斗數</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen">
    <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p class="text-xl text-gray-600 mb-8">找不到此文章</p>
        <a href="/blog" class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            返回部落格
        </a>
    </div>
</body>
</html>
  `;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function extractPlainText(markdown) {
  return markdown.replace(/[#*_`\[\]]/g, '');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
```

更新 `vercel.json` 加入路由：

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/",
      "destination": "/public/index.html"
    },
    {
      "source": "/analysis",
      "destination": "/public/analysis.html"
    },
    {
      "source": "/privacy-policy",
      "destination": "/public/privacy-policy.html"
    },
    {
      "source": "/payment-success",
      "destination": "/public/payment-success.html"
    },
    {
      "source": "/payment-failed",
      "destination": "/public/payment-failed.html"
    },
    {
      "source": "/pricing",
      "destination": "/public/pricing.html"
    },
    {
      "source": "/blog",
      "destination": "/public/blog.html"
    },
    {
      "source": "/blog/:slug",
      "destination": "/api/blog/page/:slug"
    }
  ]
}
```

---

### 階段 4: 後台管理介面 (4-5 小時)

#### 步驟 4.1: 建立後台登入頁面

建立 `public/admin/login.html`:

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>管理員登入 | AI 紫微斗數</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="icon" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-purple-100 to-purple-50 min-h-screen flex items-center justify-center">

    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-purple-600 mb-2">後台管理</h1>
            <p class="text-gray-600">AI 紫微斗數部落格系統</p>
        </div>

        <form id="loginForm" class="space-y-6">
            <div>
                <label class="block text-gray-700 font-semibold mb-2">帳號</label>
                <input type="text" id="username" required
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>

            <div>
                <label class="block text-gray-700 font-semibold mb-2">密碼</label>
                <input type="password" id="password" required
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            </div>

            <div id="errorMessage" class="hidden text-red-500 text-sm"></div>

            <button type="submit" id="loginBtn"
                    class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                登入
            </button>
        </form>

        <div class="mt-6 text-center">
            <a href="/" class="text-purple-600 hover:underline">返回首頁</a>
        </div>
    </div>

    <script>
        const loginForm = document.getElementById('loginForm');
        const errorMessage = document.getElementById('errorMessage');
        const loginBtn = document.getElementById('loginBtn');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            errorMessage.classList.add('hidden');
            loginBtn.textContent = '登入中...';
            loginBtn.disabled = true;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error);
                }

                // 儲存 Token
                localStorage.setItem('adminToken', result.data.token);
                localStorage.setItem('adminUser', JSON.stringify(result.data.user));

                // 導向後台
                window.location.href = '/admin';

            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.classList.remove('hidden');
                loginBtn.textContent = '登入';
                loginBtn.disabled = false;
            }
        });
    </script>

</body>
</html>
```

#### 步驟 4.2: 建立後台管理主頁面

建立 `public/admin/index.html`:

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>後台管理 | AI 紫微斗數</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="icon" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://unpkg.com/easymde/dist/easymde.min.css">
    <script src="https://unpkg.com/easymde/dist/easymde.min.js"></script>
</head>
<body class="bg-gray-50">

    <!-- Header -->
    <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-purple-600">部落格後台管理</h1>
            <div class="flex items-center space-x-4">
                <span id="adminUsername" class="text-gray-600"></span>
                <button onclick="logout()" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    登出
                </button>
            </div>
        </div>
    </header>

    <!-- Main -->
    <main class="max-w-7xl mx-auto px-4 py-8">

        <!-- Action Buttons -->
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-800">文章管理</h2>
            <button onclick="showEditor()" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                ➕ 新增文章
            </button>
        </div>

        <!-- Posts List -->
        <div id="postsList" class="bg-white rounded-lg shadow">
            <!-- 動態生成 -->
        </div>

    </main>

    <!-- Editor Modal -->
    <div id="editorModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8">
            <div class="flex justify-between items-center p-6 border-b">
                <h3 id="editorTitle" class="text-2xl font-bold text-gray-800">新增文章</h3>
                <button onclick="hideEditor()" class="text-gray-500 hover:text-gray-700 text-3xl">&times;</button>
            </div>

            <form id="editorForm" class="p-6 space-y-4">
                <input type="hidden" id="editingPostId">

                <div>
                    <label class="block text-gray-700 font-semibold mb-2">標題</label>
                    <input type="text" id="postTitle" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                </div>

                <div>
                    <label class="block text-gray-700 font-semibold mb-2">內容 (Markdown)</label>
                    <textarea id="postContent"></textarea>
                </div>

                <div>
                    <label class="block text-gray-700 font-semibold mb-2">標籤 (逗號分隔)</label>
                    <input type="text" id="postTags" placeholder="例如: 紫微斗數, AI, 運勢"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                </div>

                <div>
                    <label class="block text-gray-700 font-semibold mb-2">狀態</label>
                    <select id="postStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="draft">草稿</option>
                        <option value="published">發布</option>
                    </select>
                </div>

                <div id="editorError" class="hidden text-red-500"></div>

                <div class="flex space-x-4">
                    <button type="submit" id="saveBtn" class="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
                        儲存
                    </button>
                    <button type="button" onclick="hideEditor()" class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                        取消
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // 全域變數
        let easyMDE;
        let posts = [];
        const adminToken = localStorage.getItem('adminToken');
        const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

        // 檢查登入狀態
        if (!adminToken) {
            window.location.href = '/admin/login.html';
        }

        // 顯示管理員名稱
        document.getElementById('adminUsername').textContent = adminUser.username || '管理員';

        // 初始化
        document.addEventListener('DOMContentLoaded', () => {
            loadPosts();
        });

        // 載入文章列表
        async function loadPosts() {
            try {
                const response = await fetch('/api/blog/list?status=published&limit=100', {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                });

                const result = await response.json();
                if (!result.success) throw new Error(result.error);

                posts = result.data.posts;
                renderPostsList();

            } catch (error) {
                console.error('載入文章失敗:', error);
                if (error.message.includes('token')) {
                    logout();
                }
            }
        }

        // 渲染文章列表
        function renderPostsList() {
            const postsList = document.getElementById('postsList');

            if (posts.length === 0) {
                postsList.innerHTML = '<p class="p-8 text-center text-gray-500">目前沒有文章</p>';
                return;
            }

            postsList.innerHTML = `
                <table class="w-full">
                    <thead class="bg-gray-50 border-b">
                        <tr>
                            <th class="px-6 py-3 text-left text-gray-700">標題</th>
                            <th class="px-6 py-3 text-left text-gray-700">標籤</th>
                            <th class="px-6 py-3 text-left text-gray-700">狀態</th>
                            <th class="px-6 py-3 text-left text-gray-700">日期</th>
                            <th class="px-6 py-3 text-right text-gray-700">操作</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        ${posts.map(post => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4">
                                    <div class="font-semibold text-gray-800">${escapeHtml(post.title)}</div>
                                    <div class="text-sm text-gray-500">/blog/${post.slug}</div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex flex-wrap gap-1">
                                        ${post.tags.map(tag => `
                                            <span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">${escapeHtml(tag)}</span>
                                        `).join('')}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="px-3 py-1 rounded-full text-xs ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                                        ${post.status === 'published' ? '已發布' : '草稿'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600">
                                    ${formatDate(post.published_at || post.created_at)}
                                </td>
                                <td class="px-6 py-4 text-right space-x-2">
                                    <button onclick="editPost('${post.id}')" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                                        編輯
                                    </button>
                                    <button onclick="deletePost('${post.id}', '${escapeHtml(post.title)}')" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                                        刪除
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        // 顯示編輯器
        function showEditor(post = null) {
            const modal = document.getElementById('editorModal');
            const title = document.getElementById('editorTitle');
            const form = document.getElementById('editorForm');

            // 初始化 Markdown 編輯器
            if (!easyMDE) {
                easyMDE = new EasyMDE({
                    element: document.getElementById('postContent'),
                    spellChecker: false,
                    placeholder: '請輸入文章內容 (支援 Markdown)...'
                });
            }

            if (post) {
                title.textContent = '編輯文章';
                document.getElementById('editingPostId').value = post.id;
                document.getElementById('postTitle').value = post.title;
                easyMDE.value(post.content);
                document.getElementById('postTags').value = post.tags.join(', ');
                document.getElementById('postStatus').value = post.status;
            } else {
                title.textContent = '新增文章';
                form.reset();
                document.getElementById('editingPostId').value = '';
                easyMDE.value('');
                document.getElementById('postStatus').value = 'published';
            }

            modal.classList.remove('hidden');
        }

        // 隱藏編輯器
        function hideEditor() {
            document.getElementById('editorModal').classList.add('hidden');
            document.getElementById('editorError').classList.add('hidden');
        }

        // 編輯文章
        function editPost(postId) {
            const post = posts.find(p => p.id === postId);
            if (post) showEditor(post);
        }

        // 儲存文章
        document.getElementById('editorForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const postId = document.getElementById('editingPostId').value;
            const title = document.getElementById('postTitle').value;
            const content = easyMDE.value();
            const tags = document.getElementById('postTags').value.split(',').map(t => t.trim()).filter(t => t);
            const status = document.getElementById('postStatus').value;

            const saveBtn = document.getElementById('saveBtn');
            const errorDiv = document.getElementById('editorError');

            saveBtn.textContent = '儲存中...';
            saveBtn.disabled = true;
            errorDiv.classList.add('hidden');

            try {
                const url = postId ? `/api/blog/${postId}` : '/api/blog/create';
                const method = postId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken}`
                    },
                    body: JSON.stringify({
                        titles: title,
                        title,
                        content,
                        tags,
                        status
                    })
                });

                const result = await response.json();
                if (!result.success) throw new Error(result.error);

                hideEditor();
                loadPosts();

            } catch (error) {
                errorDiv.textContent = error.message;
                errorDiv.classList.remove('hidden');
                saveBtn.textContent = '儲存';
                saveBtn.disabled = false;
            }
        });

        // 刪除文章
        async function deletePost(postId, title) {
            if (!confirm(`確定要刪除文章「${title}」嗎？此操作無法復原。`)) {
                return;
            }

            try {
                const response = await fetch(`/api/blog/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                });

                const result = await response.json();
                if (!result.success) throw new Error(result.error);

                alert('文章刪除成功');
                loadPosts();

            } catch (error) {
                alert('刪除失敗：' + error.message);
            }
        }

        // 登出
        function logout() {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/admin/login.html';
        }

        // 工具函數
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    </script>

</body>
</html>
```

更新 `vercel.json` 加入管理後台路由：

```json
{
  "version": 2,
  "rewrites": [
    // ... 現有路由 ...
    {
      "source": "/admin",
      "destination": "/public/admin/index.html"
    },
    {
      "source": "/admin/login",
      "destination": "/public/admin/login.html"
    }
  ]
}
```

---

### 階段 5: 測試與部署 (2-3 小時)

#### 步驟 5.1: 本地測試

```bash
# 安裝 Vercel CLI (如果還沒安裝)
npm install -g vercel

# 連結專案
vercel link

# 下載環境變數
vercel env pull .env.local

# 本地運行
vercel dev
```

測試項目：
- ✅ 管理員登入
- ✅ 新增文章（透過後台）
- ✅ 新增文章（透過 API + Bearer Token）
- ✅ 編輯文章
- ✅ 刪除文章
- ✅ 前台文章列表顯示
- ✅ 前台文章詳細頁面
- ✅ 標籤篩選
- ✅ 分頁功能
- ✅ Markdown 渲染
- ✅ SEO Meta 標籤

#### 步驟 5.2: n8n Webhook 測試

在 n8n 中設定 HTTP Request 節點：

```json
{
  "method": "POST",
  "url": "https://ziweidoushu.vercel.app/api/blog/create",
  "headers": {
    "Authorization": "Bearer ziwei_n8n_bearer_token_change_me_in_production",
    "Content-Type": "application/json"
  },
  "body": {
    "titles": "測試文章標題",
    "content": "# 測試內容\n\n這是一篇由 n8n 自動發布的文章。",
    "tags": "[\"測試\", \"自動化\"]"
  }
}
```

#### 步驟 5.3: 部署到 Vercel

```bash
# 推送到 GitHub
git add .
git commit -m "🎉 新增部落格系統：前台、後台、API 完整功能"
git push origin main

# Vercel 會自動部署
# 或手動部署
vercel --prod
```

#### 步驟 5.4: 設定 Vercel 環境變數

在 Vercel Dashboard > Settings > Environment Variables 確認：

```bash
# Postgres (自動生成)
POSTGRES_URL=***
POSTGRES_PRISMA_URL=***
POSTGRES_URL_NON_POOLING=***

# JWT Secret (手動設定)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# OpenAI (現有)
OPENAI_API_KEY=***

# ECPay (現有)
ECPAY_MERCHANT_ID=***
ECPAY_HASH_KEY=***
ECPAY_HASH_IV=***
```

---

## 🔒 安全性考量

### 1. 認證與授權
- ✅ Bearer Token 雙重驗證（JWT + API Token）
- ✅ Token 過期檢查
- ✅ bcrypt 密碼雜湊（rounds=10）
- ✅ 後台頁面 `noindex, nofollow`

### 2. 輸入驗證
- ✅ 所有 API 輸入參數驗證
- ✅ SQL 注入防護（使用 Prepared Statements）
- ✅ XSS 防護（DOMPurify 清理 HTML）
- ✅ CSRF 防護（SameSite Cookie）

### 3. CORS 限制
- ✅ 僅允許特定域名
- ✅ 驗證 Origin Header

### 4. Rate Limiting (建議實作)
```javascript
// 可使用 Vercel Edge Config 或 Upstash Redis
// 限制每個 IP 每分鐘最多 10 次 API 請求
```

### 5. 資料庫安全
- ✅ 環境變數存儲連線字串
- ✅ 最小權限原則
- ✅ 自動備份（Vercel Postgres 內建）

---

## 📊 API 規格設計

### 完整 API 端點總覽

| 端點 | 方法 | 認證 | 說明 |
|------|------|------|------|
| `/api/auth/login` | POST | ❌ | 管理員登入 |
| `/api/blog/create` | POST | ✅ | 建立文章 |
| `/api/blog/list` | GET | ❌ | 取得文章列表 |
| `/api/blog/[id]` | GET | ❌ | 取得單篇文章 |
| `/api/blog/[id]` | PUT | ✅ | 更新文章 |
| `/api/blog/[id]` | DELETE | ✅ | 刪除文章 |

### API 詳細規格

#### 1. POST /api/auth/login

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (成功):**
```json
{
  "success": true,
  "message": "登入成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@example.com"
    }
  }
}
```

**Response (失敗):**
```json
{
  "success": false,
  "error": "帳號或密碼錯誤"
}
```

---

#### 2. POST /api/blog/create

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "titles": "文章標題",
  "content": "# Markdown 內容\n\n文章正文...",
  "tags": "[\"標籤1\", \"標籤2\"]",
  "status": "published"
}
```

**Response (成功):**
```json
{
  "success": true,
  "message": "文章建立成功",
  "data": {
    "id": "uuid",
    "title": "文章標題",
    "slug": "wen-zhang-biao-ti",
    "status": "published",
    "url": "https://ziweidoushu.vercel.app/blog/wen-zhang-biao-ti",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

---

#### 3. GET /api/blog/list

**Query Parameters:**
- `page` (int, optional): 頁碼，預設 1
- `limit` (int, optional): 每頁數量，預設 10
- `tag` (string, optional): 標籤篩選
- `status` (string, optional): 狀態，預設 'published'

**Request:**
```
GET /api/blog/list?page=1&limit=10&tag=紫微斗數
```

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "title": "文章標題",
        "content": "完整內容...",
        "excerpt": "摘要...",
        "tags": ["標籤1", "標籤2"],
        "status": "published",
        "created_at": "2025-01-15T10:30:00Z",
        "published_at": "2025-01-15T10:30:00Z",
        "slug": "wen-zhang-biao-ti",
        "url": "/blog/wen-zhang-biao-ti"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

#### 4. GET /api/blog/[id]

**Request:**
```
GET /api/blog/wen-zhang-biao-ti
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "文章標題",
    "content": "# 完整 Markdown 內容...",
    "tags": ["標籤1", "標籤2"],
    "status": "published",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z",
    "published_at": "2025-01-15T10:30:00Z",
    "slug": "wen-zhang-biao-ti"
  }
}
```

---

#### 5. PUT /api/blog/[id]

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "title": "更新後的標題",
  "content": "更新後的內容",
  "tags": ["新標籤"],
  "status": "published"
}
```

**Response:**
```json
{
  "success": true,
  "message": "文章更新成功",
  "data": {
    "id": "uuid",
    "title": "更新後的標題",
    "slug": "geng-xin-hou-de-biao-ti",
    "updated_at": "2025-01-15T11:00:00Z"
  }
}
```

---

#### 6. DELETE /api/blog/[id]

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```
DELETE /api/blog/uuid-or-slug
```

**Response:**
```json
{
  "success": true,
  "message": "文章刪除成功",
  "data": {
    "id": "uuid",
    "title": "已刪除的文章標題"
  }
}
```

---

## 🚀 未來擴展建議

### 短期擴展（1-2 個月）

1. **文章搜尋功能**
   - 全文搜尋（使用 Postgres `tsvector`）
   - 搜尋結果高亮

2. **圖片上傳**
   - 整合 Vercel Blob Storage
   - 拖放上傳介面

3. **文章統計**
   - 瀏覽次數
   - 按讚數
   - 分享次數

4. **留言系統**
   - Disqus 或自建留言系統
   - 垃圾留言過濾

5. **RSS Feed**
   - 自動生成 `/feed.xml`
   - 支援訂閱

### 中期擴展（3-6 個月）

1. **多作者支援**
   - 作者管理系統
   - 作者簡介頁面

2. **文章分類（Categories）**
   - 階層式分類
   - 分類頁面

3. **排程發布**
   - 定時發布功能
   - 使用 Vercel Cron Jobs

4. **版本控制**
   - 文章歷史版本
   - 版本比對與回復

5. **AI 輔助寫作**
   - GPT-4o 文章草稿生成
   - 標題建議
   - 標籤自動推薦

### 長期擴展（6-12 個月）

1. **多語言支援**
   - i18n 國際化
   - 翻譯管理

2. **進階 SEO**
   - 自動 sitemap 更新
   - Schema.org 結構化數據優化
   - 內部連結建議

3. **效能優化**
   - CDN 加速
   - 圖片 lazy loading
   - PWA 支援

4. **分析儀表板**
   - 文章績效分析
   - 用戶行為追蹤
   - A/B 測試

---

## 📋 檢查清單

### 開發階段
- [ ] Vercel Postgres 資料庫建立
- [ ] 環境變數設定
- [ ] 資料庫初始化（SQL 腳本執行）
- [ ] 後端 API 實作
  - [ ] `/api/auth/login`
  - [ ] `/api/blog/create`
  - [ ] `/api/blog/list`
  - [ ] `/api/blog/[id]` (GET, PUT, DELETE)
- [ ] 前台介面
  - [ ] `/blog` (列表頁)
  - [ ] `/blog/[slug]` (詳細頁)
- [ ] 後台介面
  - [ ] `/admin/login` (登入)
  - [ ] `/admin` (管理主頁)

### 測試階段
- [ ] 本地環境測試
- [ ] 管理員登入測試
- [ ] 文章 CRUD 測試
- [ ] n8n Webhook 測試
- [ ] Bearer Token 認證測試
- [ ] 前台顯示測試
- [ ] Markdown 渲染測試
- [ ] 響應式設計測試
- [ ] SEO 標籤檢查

### 部署階段
- [ ] 推送到 GitHub
- [ ] Vercel 自動部署
- [ ] 環境變數確認
- [ ] 生產環境測試
- [ ] SSL 憑證確認
- [ ] 效能測試
- [ ] 安全性掃描

### 上線後
- [ ] 建立第一篇文章
- [ ] 設定 n8n 自動發布
- [ ] Google Analytics 追蹤設定
- [ ] 提交 Sitemap 到 Google Search Console
- [ ] 社群媒體分享測試
- [ ] 備份資料庫
- [ ] 監控系統運作

---

## 📚 參考文件

- [Vercel Postgres 文檔](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [JSON Web Token (JWT)](https://jwt.io/)
- [Marked.js (Markdown Parser)](https://marked.js.org/)
- [DOMPurify (XSS Protection)](https://github.com/cure53/DOMPurify)
- [EasyMDE (Markdown Editor)](https://github.com/Ionaru/easy-markdown-editor)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 💡 常見問題

### Q1: 為什麼選擇 Vercel Postgres 而不是 MongoDB？
**A**: Vercel Postgres 與現有 Vercel 部署環境完美整合，延遲低、效能佳，且 SQL 更適合結構化的部落格資料。

### Q2: Bearer Token 如何管理？
**A**: 提供兩種方式：
1. **JWT Token**: 管理員登入後取得，7 天有效期
2. **固定 API Token**: 存儲在資料庫，供 n8n 等外部服務使用

### Q3: 如何新增更多管理員？
**A**: 執行以下 SQL：
```sql
INSERT INTO admin_users (username, password_hash, email) VALUES
('newadmin', '$2b$10$...bcrypt_hash...', 'newadmin@example.com');
```
使用 bcrypt 生成密碼雜湊。

### Q4: 如何備份資料庫？
**A**: Vercel Postgres 提供自動備份功能。手動備份可使用：
```bash
pg_dump $POSTGRES_URL > backup.sql
```

### Q5: 部落格文章可以匯出嗎？
**A**: 可以。所有文章以 Markdown 格式存儲，隨時可匯出為 `.md` 檔案。

---

## 🎉 總結

本實施計劃提供了一個**完整、安全、可擴展**的部落格系統解決方案，完美整合到現有的 AI 紫微斗數網站中。

**核心特點**：
- ✅ 無需額外伺服器（Serverless 架構）
- ✅ 雙重認證方式（JWT + API Token）
- ✅ 現代化 UI（Tailwind CSS）
- ✅ SEO 友善（Meta 標籤、Sitemap）
- ✅ 易於維護（Markdown 編輯）
- ✅ 自動化友善（n8n Webhook 整合）

**預估時間**：
- 資料庫設置: 1-2 小時
- 後端 API 開發: 4-6 小時
- 前台介面: 3-4 小時
- 後台介面: 4-5 小時
- 測試與部署: 2-3 小時
- **總計: 14-20 小時**

**技術債務**: 低（遵循現有架構模式）

準備好開始實作了嗎？ 🚀
