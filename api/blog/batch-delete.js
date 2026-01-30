/**
 * Vercel Serverless Function - Batch Delete Blog Posts
 * API Route: DELETE /api/blog/batch-delete
 * Authentication: Required
 *
 * 批量刪除文章 (by IDs)
 */

const { sql } = require('@vercel/postgres');
const { verifyBearerToken } = require('../../lib/auth');
const { setCorsHeaders, handleOptions } = require('../../lib/cors');

module.exports = async function handler(req, res) {
    console.log(`🗑️ Batch Delete API [${req.method}]`);

    // 設定 CORS
    setCorsHeaders(req, res);
    if (handleOptions(req, res)) return;

    // 只允許 DELETE
    if (req.method !== 'DELETE') {
        return res.status(405).json({
            success: false,
            error: '只允許 DELETE 請求'
        });
    }

    try {
        // 驗證認證
        const authHeader = req.headers.authorization;
        await verifyBearerToken(authHeader);

        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                error: '缺少文章 ID 列表'
            });
        }

        console.log(`準備刪除 ${ids.length} 篇文章:`, ids);

        // 執行批量刪除
        // 使用 ANY($1) 語法處理陣列
        const result = await sql`
      DELETE FROM blog_posts
      WHERE id = ANY(${ids}::int[])
      RETURNING id, title
    `;

        console.log(`✅ 成功刪除 ${result.rowCount} 篇文章`);

        return res.status(200).json({
            success: true,
            message: `成功刪除 ${result.rowCount} 篇文章`,
            data: {
                deletedCount: result.rowCount,
                deletedIds: result.rows.map(row => row.id)
            }
        });

    } catch (error) {
        console.error('❌ 批量刪除失敗:', error);
        return res.status(500).json({
            success: false,
            error: '伺服器錯誤：' + error.message
        });
    }
};
