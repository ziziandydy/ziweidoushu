/**
 * Vercel Serverless Function - Knowledge Base Search
 * API Route: GET /api/knowledge?tags=財帛宮,化祿&limit=5
 * Authentication: Public (no auth required)
 *
 * 供每週策展 workflow 檢索紫微斗數知識庫（中州派理論條目）
 */

const { searchKnowledge } = require('../lib/knowledge');
const { setCorsHeaders, handleOptions } = require('../lib/cors');

module.exports = async function handler(req, res) {
    setCorsHeaders(req, res);
    if (handleOptions(req, res)) return;

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: '只允許 GET 請求' });
    }

    const { tags, limit = '5' } = req.query;
    if (!tags) {
        return res.status(400).json({ success: false, error: '缺少 tags 參數，例：?tags=財帛宮,化祿' });
    }

    const tagList = String(tags).split(',').map(t => t.trim()).filter(Boolean);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 5, 1), 10);
    const entries = searchKnowledge(tagList, limitNum);

    return res.status(200).json({ success: true, count: entries.length, entries });
};
