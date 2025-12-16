/**
 * Vercel Serverless Function - Admin Login
 * API Route: POST /api/auth/login
 *
 * 管理員登入，返回 JWT Token
 */

const { sql } = require('@vercel/postgres');
const { verifyPassword, generateJWT } = require('../utils/auth');
const { setCorsHeaders, handleOptions } = require('../utils/cors');

module.exports = async function handler(req, res) {
  console.log('🔐 Admin Login API');

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
    const { username, password } = req.body;

    // 驗證必要欄位
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: '請提供帳號和密碼'
      });
    }

    console.log('🔍 查詢管理員:', username);

    // 查詢管理員
    const result = await sql`
      SELECT * FROM admin_users
      WHERE username = ${username}
    `;

    if (result.rows.length === 0) {
      console.log('❌ 管理員不存在');
      return res.status(401).json({
        success: false,
        error: '帳號或密碼錯誤'
      });
    }

    const user = result.rows[0];

    // 驗證密碼
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      console.log('❌ 密碼錯誤');
      return res.status(401).json({
        success: false,
        error: '帳號或密碼錯誤'
      });
    }

    // 生成 JWT Token
    const token = generateJWT(user);

    console.log('✅ 登入成功');

    return res.status(200).json({
      success: true,
      message: '登入成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
    });

  } catch (error) {
    console.error('❌ 登入失敗:', error);
    return res.status(500).json({
      success: false,
      error: '伺服器錯誤：' + error.message
    });
  }
};
