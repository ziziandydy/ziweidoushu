/**
 * Vercel Serverless Function - Serve Admin Login Page
 */

const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'admin-login.html');
    const html = fs.readFileSync(filePath, 'utf8');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (error) {
    console.error('讀取 admin-login.html 失敗:', error);
    return res.status(500).send('<h1>伺服器錯誤</h1>');
  }
};
