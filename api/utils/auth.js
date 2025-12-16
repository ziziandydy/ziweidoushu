/**
 * 認證工具函數
 * 支援兩種認證方式：
 * 1. JWT Token（後台管理員登入）
 * 2. 固定 API Token（n8n Webhook）
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sql } = require('@vercel/postgres');

/**
 * 驗證 Bearer Token
 * @param {string} authHeader - Authorization header (Bearer xxx)
 * @returns {Promise<Object>} - { type: 'jwt' | 'api_token', user?: Object, token?: Object }
 * @throws {Error} - 如果 Token 無效或過期
 */
async function verifyBearerToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }

  const token = authHeader.substring(7); // 移除 "Bearer "

  // 方法 1: 檢查是否為固定 API Token（用於 n8n）
  try {
    const apiTokenResult = await sql`
      SELECT * FROM api_tokens
      WHERE token = ${token}
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
    `;

    if (apiTokenResult.rows.length > 0) {
      console.log('✅ API Token 驗證成功');
      return {
        type: 'api_token',
        token: apiTokenResult.rows[0]
      };
    }
  } catch (error) {
    console.error('API Token 查詢錯誤:', error);
    // 繼續嘗試 JWT 驗證
  }

  // 方法 2: 驗證 JWT Token（後台管理員）
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, jwtSecret);
    console.log('✅ JWT Token 驗證成功');
    return {
      type: 'jwt',
      user: decoded
    };
  } catch (jwtError) {
    if (jwtError.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (jwtError.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed: ' + jwtError.message);
  }
}

/**
 * 生成 JWT Token
 * @param {Object} user - 使用者物件 { id, username }
 * @param {string} expiresIn - 有效期限，預設 7 天
 * @returns {string} - JWT Token
 */
function generateJWT(user, expiresIn = '7d') {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    jwtSecret,
    { expiresIn }
  );
}

/**
 * 驗證密碼
 * @param {string} password - 明文密碼
 * @param {string} hash - bcrypt 雜湊值
 * @returns {Promise<boolean>}
 */
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * 雜湊密碼
 * @param {string} password - 明文密碼
 * @param {number} rounds - bcrypt rounds，預設 10
 * @returns {Promise<string>} - bcrypt 雜湊值
 */
async function hashPassword(password, rounds = 10) {
  return bcrypt.hash(password, rounds);
}

/**
 * 清理日誌輸出（避免敏感資訊外洩）
 * @param {string} text - 要清理的文字
 * @returns {string}
 */
function sanitizeForLog(text) {
  if (!text) return '';
  return text.substring(0, 50).replace(/[^\w\s-]/g, '*');
}

module.exports = {
  verifyBearerToken,
  generateJWT,
  verifyPassword,
  hashPassword,
  sanitizeForLog
};
