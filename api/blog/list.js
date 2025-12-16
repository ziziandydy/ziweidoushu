/**
 * Vercel Serverless Function - List Blog Posts
 * API Route: GET /api/blog/list
 * Authentication: Public (no auth required)
 *
 * 取得文章列表，支援分頁和標籤篩選
 */

const { sql } = require('@vercel/postgres');
const { setCorsHeaders, handleOptions } = require('../utils/cors');

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
      includeAll = 'false'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    console.log('📊 查詢參數:', { page: pageNum, limit: limitNum, tag, status, includeAll });

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
            LEFT(content, 200) as excerpt
          FROM blog_posts
          WHERE tags @> ${JSON.stringify([tag])}::jsonb
          ORDER BY created_at DESC
          LIMIT ${limitNum}
          OFFSET ${offset}
        `;

        countQuery = await sql`
          SELECT COUNT(*) as total
          FROM blog_posts
          WHERE tags @> ${JSON.stringify([tag])}::jsonb
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
            LEFT(content, 200) as excerpt
          FROM blog_posts
          WHERE status = ${status}
          AND tags @> ${JSON.stringify([tag])}::jsonb
          ORDER BY published_at DESC NULLS LAST, created_at DESC
          LIMIT ${limitNum}
          OFFSET ${offset}
        `;

        countQuery = await sql`
          SELECT COUNT(*) as total
          FROM blog_posts
          WHERE status = ${status}
          AND tags @> ${JSON.stringify([tag])}::jsonb
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
            LEFT(content, 200) as excerpt
          FROM blog_posts
          ORDER BY created_at DESC
          LIMIT ${limitNum}
          OFFSET ${offset}
        `;

        countQuery = await sql`
          SELECT COUNT(*) as total
          FROM blog_posts
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
            LEFT(content, 200) as excerpt
          FROM blog_posts
          WHERE status = ${status}
          ORDER BY published_at DESC NULLS LAST, created_at DESC
          LIMIT ${limitNum}
          OFFSET ${offset}
        `;

        countQuery = await sql`
          SELECT COUNT(*) as total
          FROM blog_posts
          WHERE status = ${status}
        `;
      }
    }

    const posts = postsQuery.rows;
    const total = parseInt(countQuery.rows[0].total);
    const totalPages = Math.ceil(total / limitNum);

    console.log(`✅ 找到 ${posts.length} 篇文章（總共 ${total} 篇）`);

    // 返回結果
    return res.status(200).json({
      success: true,
      data: {
        posts: posts.map(post => ({
          ...post,
          url: `/blog/${post.slug}`
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
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
