/**
 * Vercel Serverless Function - Serve Static HTML Pages
 * 通用頁面提供函數，減少 Serverless Functions 數量
 */

const fs = require('fs');
const path = require('path');

// 允許的頁面映射
const PAGES = {
  'blog': 'blog.html',
  'admin-login': 'admin-login.html',
  'admin-dashboard': 'admin-dashboard.html'
};

module.exports = async function handler(req, res) {
  try {
    const { page } = req.query;

    if (!page || !PAGES[page]) {
      return res.status(404).send('<h1>頁面不存在</h1>');
    }

    const fileName = PAGES[page];
    const filePath = path.join(process.cwd(), 'public', fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('<h1>檔案不存在</h1>');
    }

    const html = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);

  } catch (error) {
    console.error('讀取頁面失敗:', error);
    return res.status(500).send('<h1>伺服器錯誤</h1>');
  }
};
