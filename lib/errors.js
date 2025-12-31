/**
 * 統一錯誤處理工具
 * 提供標準化的錯誤碼和錯誤回應 (支援多語言)
 */

const path = require('path');
const fs = require('fs');

// 錯誤碼定義
const ErrorCodes = {
  // 客戶端錯誤 (4xx)
  INVALID_REQUEST: {
    code: 'INVALID_REQUEST',
    status: 400,
    message: '請求格式無效'
  },
  MISSING_PARAMETERS: {
    code: 'MISSING_PARAMETERS',
    status: 400,
    message: '缺少必要參數'
  },
  INVALID_PARAMETERS: {
    code: 'INVALID_PARAMETERS',
    status: 400,
    message: '參數格式錯誤'
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    status: 401,
    message: '未授權訪問'
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    status: 403,
    message: '權限不足'
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    status: 404,
    message: '資源不存在'
  },
  METHOD_NOT_ALLOWED: {
    code: 'METHOD_NOT_ALLOWED',
    status: 405,
    message: '不允許的請求方法'
  },
  PAYLOAD_TOO_LARGE: {
    code: 'PAYLOAD_TOO_LARGE',
    status: 413,
    message: '請求數據過大'
  },
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    status: 429,
    message: '請求次數過多，請稍後再試'
  },

  // 業務邏輯錯誤 (4xx)
  CREDIT_INSUFFICIENT: {
    code: 'CREDIT_INSUFFICIENT',
    status: 403,
    message: '問答次數已用完'
  },
  CALCULATION_FAILED: {
    code: 'CALCULATION_FAILED',
    status: 422,
    message: '命盤計算失敗'
  },
  ANALYSIS_FAILED: {
    code: 'ANALYSIS_FAILED',
    status: 422,
    message: 'AI 分析失敗'
  },

  // 服務端錯誤 (5xx)
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    status: 500,
    message: '伺服器內部錯誤'
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    status: 503,
    message: '服務暫時無法使用'
  },
  AI_SERVICE_ERROR: {
    code: 'AI_SERVICE_ERROR',
    status: 503,
    message: 'AI 服務暫時無法使用'
  },
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    status: 503,
    message: '資料庫連線失敗'
  },
  CONFIGURATION_ERROR: {
    code: 'CONFIGURATION_ERROR',
    status: 500,
    message: '服務配置錯誤'
  }
};

// 翻譯檔案快取
let translationsCache = {};

/**
 * 載入翻譯檔案
 * @param {string} locale - 語系 (zh-TW, en)
 * @returns {Object} - 翻譯物件
 */
function loadTranslations(locale = 'zh-TW') {
  // 驗證語系
  const validLocales = ['zh-TW', 'en'];
  const finalLocale = validLocales.includes(locale) ? locale : 'zh-TW';

  // 從快取讀取
  if (translationsCache[finalLocale]) {
    return translationsCache[finalLocale];
  }

  // 讀取翻譯檔案
  try {
    const localesPath = path.join(process.cwd(), 'locales', `${finalLocale}.json`);
    const rawData = fs.readFileSync(localesPath, 'utf8');
    const translations = JSON.parse(rawData);
    translationsCache[finalLocale] = translations;
    return translations;
  } catch (error) {
    console.warn(`⚠️ 無法載入翻譯檔案 (${finalLocale}):`, error.message);
    // 回傳空物件，將使用預設訊息
    return { api: { errors: {}, validation: {} } };
  }
}

/**
 * 取得翻譯字串 (支援參數插值)
 * @param {string} locale - 語系
 * @param {string} keyPath - 翻譯鍵值路徑 (例如: api.errors.INVALID_REQUEST)
 * @param {Object} params - 參數物件
 * @returns {string} - 翻譯後的字串
 */
function t(locale, keyPath, params = {}) {
  const translations = loadTranslations(locale);
  const keys = keyPath.split('.');
  let value = translations;

  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key];
    } else {
      return null; // 找不到翻譯
    }
  }

  if (typeof value !== 'string') {
    return null;
  }

  // 參數插值
  return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
    return params[paramKey] !== undefined ? params[paramKey] : match;
  });
}

/**
 * 創建標準化錯誤回應
 * @param {string} errorCode - 錯誤碼 (從 ErrorCodes 中選擇)
 * @param {string} [customMessage] - 自訂錯誤訊息 (可選)
 * @param {Object} [additionalData] - 額外資料 (可選)
 * @param {string} [locale] - 語系 (zh-TW, en) (可選)
 * @returns {Object} - 標準化錯誤物件
 */
function createError(errorCode, customMessage = null, additionalData = {}, locale = 'zh-TW') {
  const errorDef = ErrorCodes[errorCode] || ErrorCodes.INTERNAL_ERROR;

  // 嘗試從翻譯檔案取得訊息
  let message = customMessage;
  if (!message) {
    const translatedMessage = t(locale, `api.errors.${errorDef.code}`);
    message = translatedMessage || errorDef.message;
  }

  return {
    success: false,
    error: errorDef.code,
    message: message,
    locale: locale,
    ...additionalData
  };
}

/**
 * 發送錯誤回應
 * @param {Object} res - Response 物件
 * @param {string} errorCode - 錯誤碼
 * @param {string} [customMessage] - 自訂錯誤訊息
 * @param {Object} [additionalData] - 額外資料
 * @param {string} [locale] - 語系 (zh-TW, en)
 */
function sendError(res, errorCode, customMessage = null, additionalData = {}, locale = 'zh-TW') {
  const errorDef = ErrorCodes[errorCode] || ErrorCodes.INTERNAL_ERROR;
  const errorResponse = createError(errorCode, customMessage, additionalData, locale);

  res.status(errorDef.status).json(errorResponse);
}

/**
 * 包裝 API Handler，自動處理錯誤
 * @param {Function} handler - API 處理函數
 * @returns {Function} - 包裝後的處理函數
 */
function withErrorHandling(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('❌ API Error:', error);

      // 根據錯誤類型返回對應錯誤碼
      if (error.message.includes('OpenAI API key')) {
        return sendError(res, 'CONFIGURATION_ERROR', 'AI 服務配置錯誤');
      } else if (error.message.includes('rate_limit')) {
        return sendError(res, 'RATE_LIMIT_EXCEEDED', 'AI 服務使用量過高');
      } else if (error.message.includes('connect') || error.message.includes('fetch')) {
        return sendError(res, 'SERVICE_UNAVAILABLE', '服務暫時無法連接');
      } else if (error.message.includes('context_length')) {
        return sendError(res, 'PAYLOAD_TOO_LARGE', '對話內容過長');
      }

      // 預設錯誤
      sendError(res, 'INTERNAL_ERROR');
    }
  };
}

/**
 * 驗證必要參數
 * @param {Object} data - 要驗證的資料
 * @param {Array<string>} requiredFields - 必要欄位列表
 * @param {string} [locale] - 語系 (zh-TW, en)
 * @returns {Object|null} - 如果有缺少的欄位，返回錯誤物件；否則返回 null
 */
function validateRequired(data, requiredFields, locale = 'zh-TW') {
  const missingFields = requiredFields.filter(field => !data[field]);

  if (missingFields.length > 0) {
    // 嘗試使用翻譯訊息
    const translatedMessage = t(locale, 'api.validation.missingParams', {
      fields: missingFields.join(', ')
    });
    const message = translatedMessage || `缺少必要參數：${missingFields.join(', ')}`;

    return createError(
      'MISSING_PARAMETERS',
      message,
      { missingFields },
      locale
    );
  }

  return null;
}

module.exports = {
  ErrorCodes,
  createError,
  sendError,
  withErrorHandling,
  validateRequired,
  t,
  loadTranslations
};
