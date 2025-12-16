/**
 * Vercel Serverless Function - Serve Blog List Page
 * API Route: GET /api/blog-page
 *
 * 提供部落格列表頁面（解決 Vercel dev 靜態檔案路由問題）
 */

const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'blog.html');
    const html = fs.readFileSync(filePath, 'utf8');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (error) {
    console.error('讀取 blog.html 失敗:', error);
    return res.status(500).send('<h1>伺服器錯誤</h1>');
  }
};
