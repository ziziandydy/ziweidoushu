/**
 * Vercel Serverless Function - Create Blog Post
 * API Route: POST /api/blog/create
 * Authentication: Bearer Token (JWT or API Token)
 *
 * 建立新文章，支援 n8n webhook 格式
 */

const { sql } = require('@vercel/postgres');
const slugify = require('slugify');
const { verifyBearerToken } = require('../../lib/auth');
const { setCorsHeaders, handleOptions } = require('../../lib/cors');

module.exports = async function handler(req, res) {
  console.log('📝 Blog Create API');

  // 設定 CORS
  setCorsHeaders(req, res);
  if (handleOptions(req, res)) return;

  // 只允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: '只允許 POST 請求'
    });
  }

  try {
    // 1. 驗證 Bearer Token
    const authHeader = req.headers.authorization;
    const auth = await verifyBearerToken(authHeader);
    console.log('✅ 認證成功:', auth.type);

    // 2. 解析請求 body（支援 n8n 格式）
    const { titles, title, content, tags, status = 'published' } = req.body;

    // 支援兩種標題欄位名稱
    const postTitle = titles || title;

    // 3. 驗證必要欄位
    if (!postTitle || !content) {
      return res.status(400).json({
        success: false,
        error: '缺少必要欄位: title 和 content'
      });
    }

    // 4. 處理標籤（支援多種格式）
    let tagsArray = [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          // 嘗試解析 JSON 字串
          tagsArray = JSON.parse(tags);
        } catch (e) {
          // 如果不是 JSON，用逗號分隔
          tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
        }
      } else if (Array.isArray(tags)) {
        tagsArray = tags;
      }
    }

    console.log('📋 文章資訊:', {
      title: postTitle,
      contentLength: content.length,
      tags: tagsArray,
      status
    });

    // 5. 生成 slug（URL 友善的唯一標識）
    const baseSlug = slugify(postTitle, {
      lower: true,
      strict: true,
      locale: 'zh',
      remove: /[*+~.()'"!:@]/g
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

    console.log('🔗 生成 slug:', slug);

    // 6. 插入資料庫
    const result = await sql`
      INSERT INTO blog_posts (title, content, tags, status, slug, published_at)
      VALUES (
        ${postTitle},
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

    // 7. 返回結果
    return res.status(201).json({
      success: true,
      message: '文章建立成功',
      data: {
        id: newPost.id,
        title: newPost.title,
        slug: newPost.slug,
        status: newPost.status,
        tags: newPost.tags,
        url: `https://${req.headers.host}/blog/${newPost.slug}`,
        created_at: newPost.created_at
      }
    });

  } catch (error) {
    console.error('❌ 建立文章失敗:', error);

    // 認證錯誤
    if (error.message.includes('token') || error.message.includes('Authorization')) {
      return res.status(401).json({
        success: false,
        error: '認證失敗：' + error.message
      });
    }

    // 其他錯誤
    return res.status(500).json({
      success: false,
      error: '伺服器錯誤：' + error.message
    });
  }
};
