/**
 * Health Check API
 * API Route: /api/health
 * 檢查所有服務狀態
 */

const { setCorsHeaders, handleOptions } = require('../lib/cors');

module.exports = async function handler(req, res) {
  // 設定 CORS
  setCorsHeaders(req, res);
  if (handleOptions(req, res)) return;

  // 只允許 GET 請求
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'METHOD_NOT_ALLOWED',
      message: '只允許 GET 請求'
    });
  }

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.3.4',
    services: {
      api: true,
      openai: false,
      postgres: false,
      typescript_core: false
    },
    environment: process.env.NODE_ENV || 'development'
  };

  // 檢查 OpenAI API Key
  if (process.env.OPENAI_API_KEY) {
    health.services.openai = true;
  }

  // 檢查 TypeScript 核心
  try {
    require('../build/main.js');
    health.services.typescript_core = true;
  } catch (error) {
    health.services.typescript_core = false;
  }

  // 檢查 Postgres 資料庫連線
  try {
    const { sql } = require('@vercel/postgres');
    await sql`SELECT 1 as health_check`;
    health.services.postgres = true;
  } catch (error) {
    health.services.postgres = false;
    console.error('Postgres health check failed:', error.message);
  }

  // 判斷整體狀態
  const allServicesOk = Object.values(health.services).every(status => status === true);

  if (!allServicesOk) {
    health.status = 'degraded';
  }

  // 如果是生產環境但核心服務失敗，返回 503
  if (process.env.NODE_ENV === 'production' && (!health.services.openai || !health.services.typescript_core)) {
    return res.status(503).json({
      ...health,
      status: 'unhealthy'
    });
  }

  res.status(200).json(health);
};
