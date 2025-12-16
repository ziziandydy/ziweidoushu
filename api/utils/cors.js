/**
 * CORS 工具函數
 * 處理跨域請求和 OPTIONS preflight
 */

// 允許的來源清單
const allowedOrigins = [
  'https://ziweidoushu.vercel.app',
  'https://ziweidoushy.vercel.app',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:5173', // Vite dev server
  'http://127.0.0.1:8080',
  'http://127.0.0.1:3000'
];

/**
 * 設定 CORS Headers
 * @param {Object} req - Request 物件
 * @param {Object} res - Response 物件
 */
function setCorsHeaders(req, res) {
  const origin = req.headers.origin;

  // 如果來源在允許清單中，設定對應的 Origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // 基本 CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-User-ID'
  );
}

/**
 * 處理 OPTIONS Preflight 請求
 * @param {Object} req - Request 物件
 * @param {Object} res - Response 物件
 * @returns {boolean} - 如果是 OPTIONS 請求返回 true
 */
function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res);
    res.status(200).end();
    return true;
  }
  return false;
}

/**
 * 驗證來源是否允許
 * @param {string} origin - Request origin
 * @returns {boolean}
 */
function isOriginAllowed(origin) {
  return allowedOrigins.includes(origin);
}

module.exports = {
  setCorsHeaders,
  handleOptions,
  isOriginAllowed,
  allowedOrigins
};
