/**
 * Vercel Serverless Function - Blog Post Operations
 * API Routes:
 *   - GET /api/blog/[id] - 取得單篇文章 (public)
 *   - PUT /api/blog/[id] - 更新文章 (auth required)
 *   - DELETE /api/blog/[id] - 刪除文章 (auth required)
 *
 * [id] 可以是 UUID 或 slug
 */

const { sql } = require('@vercel/postgres');
const { verifyBearerToken } = require('../utils/auth');
const { setCorsHeaders, handleOptions } = require('../utils/cors');
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
    if (req.method === 'GET') {
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

  const { title, content, tags, status } = req.body;

  // 建立更新欄位
  const updates = [];
  const values = [];

  if (title !== undefined) {
    updates.push('title = $' + (values.length + 1));
    values.push(title);

    // 更新 slug
    const newSlug = slugify(title, {
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
    const tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags);
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
