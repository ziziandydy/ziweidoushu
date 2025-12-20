/**
 * Vercel Serverless Function - Blog Post Operations
 * API Routes:
 *   - POST /api/blog/create - 新增文章 (auth required)
 *   - GET /api/blog/[id] - 取得單篇文章 (public)
 *   - PUT /api/blog/[id] - 更新文章 (auth required)
 *   - DELETE /api/blog/[id] - 刪除文章 (auth required)
 *
 * [id] 可以是 UUID 或 slug，或 'create' 用於新增
 */

const { sql } = require('@vercel/postgres');
const { verifyBearerToken } = require('../../lib/auth');
const { setCorsHeaders, handleOptions } = require('../../lib/cors');
const slugify = require('slugify');

module.exports = async function handler(req, res) {
  console.log(`📄 Blog [${req.method}] API`);

  // 設定 CORS
  setCorsHeaders(req, res);
  if (handleOptions(req, res)) return;

  // 從 URL 取得 ID (slug 或 UUID)
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: '缺少文章 ID'
    });
  }

  try {
    // POST /api/blog/create - 新增文章
    if (req.method === 'POST' && id === 'create') {
      return await handleCreate(req, res);
    } else if (req.method === 'GET') {
      return await handleGet(id, res);
    } else if (req.method === 'PUT') {
      return await handleUpdate(id, req, res);
    } else if (req.method === 'DELETE') {
      return await handleDelete(id, req, res);
    } else {
      return res.status(405).json({
        success: false,
        error: '不支援的請求方法'
      });
    }
  } catch (error) {
    console.error(`❌ Blog [${req.method}] 錯誤:`, error);
    return res.status(500).json({
      success: false,
      error: '伺服器錯誤：' + error.message
    });
  }
};

// POST - 新增文章 (需認證)
async function handleCreate(req, res) {
  console.log('✍️ 新增文章');

  // 驗證認證
  const authHeader = req.headers.authorization;
  await verifyBearerToken(authHeader);

  const { title, titles, content, tags, status } = req.body;
  const finalTitle = title || titles;

  // 驗證必填欄位
  if (!finalTitle || !content) {
    return res.status(400).json({
      success: false,
      error: '缺少必填欄位：title 或 content'
    });
  }

  // 生成 slug
  let baseSlug = slugify(finalTitle, {
    lower: true,
    strict: true,
    locale: 'zh',
    remove: /[*+~.()'"!:@]/g
  });

  // 檢查 slug 是否重複，若重複則加上數字後綴
  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const existing = await sql`
      SELECT id FROM blog_posts WHERE slug = ${slug}
    `;

    if (existing.rows.length === 0) {
      isUnique = true;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  // 處理 tags
  const tagsArray = parseTags(tags);

  // 插入文章
  const result = await sql`
    INSERT INTO blog_posts (title, slug, content, tags, status, published_at)
    VALUES (
      ${finalTitle},
      ${slug},
      ${content},
      ${JSON.stringify(tagsArray)}::jsonb,
      ${status || 'draft'},
      ${status === 'published' ? new Date().toISOString() : null}
    )
    RETURNING *
  `;

  console.log('✅ 文章新增成功:', result.rows[0].title);

  return res.status(201).json({
    success: true,
    message: '文章新增成功',
    data: result.rows[0]
  });
}

// GET - 取得單篇文章 (公開)
async function handleGet(id, res) {
  console.log('🔍 取得文章:', id);

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

  console.log('✅ 找到文章:', post.title);

  return res.status(200).json({
    success: true,
    data: post
  });
}

// PUT - 更新文章 (需認證)
async function handleUpdate(id, req, res) {
  console.log('✏️ 更新文章:', id);

  // 驗證認證
  const authHeader = req.headers.authorization;
  await verifyBearerToken(authHeader);

  const { title, titles, content, tags, status } = req.body;
  const finalTitle = title || titles;

  // 建立更新欄位
  const updates = [];
  const values = [];

  if (finalTitle !== undefined) {
    updates.push('title = $' + (values.length + 1));
    values.push(finalTitle);

    // 更新 slug
    const newSlug = slugify(finalTitle, {
      lower: true,
      strict: true,
      locale: 'zh',
      remove: /[*+~.()'"!:@]/g
    });
    updates.push('slug = $' + (values.length + 1));
    values.push(newSlug);
  }

  if (content !== undefined) {
    updates.push('content = $' + (values.length + 1));
    values.push(content);
  }

  if (tags !== undefined) {
    updates.push('tags = $' + (values.length + 1) + '::jsonb');
    const tagsArray = parseTags(tags);
    values.push(JSON.stringify(tagsArray));
  }

  if (status !== undefined) {
    updates.push('status = $' + (values.length + 1));
    values.push(status);

    if (status === 'published') {
      updates.push('published_at = NOW()');
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      error: '沒有要更新的欄位'
    });
  }

  updates.push('updated_at = NOW()');
  values.push(id);

  const query = `
    UPDATE blog_posts
    SET ${updates.join(', ')}
    WHERE id::text = $${values.length} OR slug = $${values.length}
    RETURNING *
  `;

  const result = await sql.query(query, values);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: '文章不存在'
    });
  }

  console.log('✅ 文章更新成功');

  return res.status(200).json({
    success: true,
    message: '文章更新成功',
    data: result.rows[0]
  });
}

// DELETE - 刪除文章 (需認證)
async function handleDelete(id, req, res) {
  console.log('🗑️ 刪除文章:', id);

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

  console.log('✅ 文章刪除成功:', result.rows[0].title);

  return res.status(200).json({
    success: true,
    message: '文章刪除成功',
    data: result.rows[0]
  });
}

/**
 * 安全解析標籤
 * 支援 JSON 陣列字串 或 逗號分隔字串
 */
function parseTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags !== 'string') return [];

  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    // 如果不是有效的 JSON，視為逗號分隔字串
    return tags.split(',').map(t => t.trim()).filter(t => t);
  }
}
