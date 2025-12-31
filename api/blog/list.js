/**
 * Vercel Serverless Function - List Blog Posts
 * API Route: GET /api/blog/list
 * Authentication: Public (no auth required)
 *
 * 取得文章列表，支援分頁和標籤篩選
 */

const { sql } = require('@vercel/postgres');
const { setCorsHeaders, handleOptions } = require('../../lib/cors');

module.exports = async function handler(req, res) {
  console.log('📚 Blog List API');

  // 設定 CORS
  setCorsHeaders(req, res);
  if (handleOptions(req, res)) return;

  // 只允許 GET 請求
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: '只允許 GET 請求'
    });
  }

  try {
    // 取得查詢參數
    const {
      page = '1',
      limit = '10',
      tag = null,
      status = 'published',
      includeAll = 'false',
      language = 'zh-TW'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // 驗證語言參數
    const validLanguages = ['zh-TW', 'en'];
    const finalLanguage = validLanguages.includes(language) ? language : 'zh-TW';

    console.log('📊 查詢參數:', { page: pageNum, limit: limitNum, tag, status, includeAll, language: finalLanguage });

    // 建立 SQL 查詢
    let postsQuery;
    let countQuery;

    // 是否包含所有狀態（admin 用）
    const showAll = includeAll === 'true';

    if (tag) {
      // 按標籤篩選
      if (showAll) {
        postsQuery = await sql`
          SELECT
            id,
            title,
            content,
            tags,
            status,
            created_at,
            published_at,
            slug,
            language,
            LEFT(content, 200) as excerpt
          FROM blog_posts
          WHERE tags @> ${JSON.stringify([tag])}::jsonb
          AND language = ${finalLanguage}
          ORDER BY created_at DESC
          LIMIT ${limitNum}
          OFFSET ${offset}
        `;

        countQuery = await sql`
          SELECT COUNT(*) as total
          FROM blog_posts
          WHERE tags @> ${JSON.stringify([tag])}::jsonb
          AND language = ${finalLanguage}
        `;
      } else {
        postsQuery = await sql`
          SELECT
            id,
            title,
            content,
            tags,
            status,
            created_at,
            published_at,
            slug,
            language,
            LEFT(content, 200) as excerpt
          FROM blog_posts
          WHERE status = ${status}
          AND tags @> ${JSON.stringify([tag])}::jsonb
          AND language = ${finalLanguage}
          ORDER BY published_at DESC NULLS LAST, created_at DESC
          LIMIT ${limitNum}
          OFFSET ${offset}
        `;

        countQuery = await sql`
          SELECT COUNT(*) as total
          FROM blog_posts
          WHERE status = ${status}
          AND tags @> ${JSON.stringify([tag])}::jsonb
          AND language = ${finalLanguage}
        `;
      }
    } else {
      // 全部文章
      if (showAll) {
        postsQuery = await sql`
          SELECT
            id,
            title,
            content,
            tags,
            status,
            created_at,
            published_at,
            slug,
            language,
            LEFT(content, 200) as excerpt
          FROM blog_posts
          WHERE language = ${finalLanguage}
          ORDER BY created_at DESC
          LIMIT ${limitNum}
          OFFSET ${offset}
        `;

        countQuery = await sql`
          SELECT COUNT(*) as total
          FROM blog_posts
          WHERE language = ${finalLanguage}
        `;
      } else {
        postsQuery = await sql`
          SELECT
            id,
            title,
            content,
            tags,
            status,
            created_at,
            published_at,
            slug,
            language,
            LEFT(content, 200) as excerpt
          FROM blog_posts
          WHERE status = ${status}
          AND language = ${finalLanguage}
          ORDER BY published_at DESC NULLS LAST, created_at DESC
          LIMIT ${limitNum}
          OFFSET ${offset}
        `;

        countQuery = await sql`
          SELECT COUNT(*) as total
          FROM blog_posts
          WHERE status = ${status}
          AND language = ${finalLanguage}
        `;
      }
    }

    const posts = postsQuery.rows;
    const total = parseInt(countQuery.rows[0].total);
    const totalPages = Math.ceil(total / limitNum);

    console.log(`✅ 找到 ${posts.length} 篇文章（總共 ${total} 篇）[${finalLanguage}]`);

    // 返回結果
    return res.status(200).json({
      success: true,
      data: {
        posts: posts.map(post => ({
          ...post,
          url: `/${post.language}/blog/${post.slug}`
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        },
        language: finalLanguage
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
