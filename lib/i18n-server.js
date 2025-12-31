/**
 * Server-side i18n utilities for Vercel serverless functions
 *
 * Features:
 * - Locale detection from request (query param → header → Accept-Language)
 * - Translation loading for serverless functions
 * - Caching to avoid repeated file reads
 * - Terminology translation support
 */

const fs = require('fs');
const path = require('path');

class ServerI18n {
  constructor() {
    this.translations = {};
    this.terminology = null;
    this.supportedLocales = ['en', 'zh-TW'];
    this.defaultLocale = 'zh-TW';
  }

  /**
   * Load translations for a specific locale (cached)
   * @param {string} locale - Locale code (e.g., 'en', 'zh-TW')
   * @returns {Object} Translations object
   */
  loadTranslations(locale) {
    if (this.translations[locale]) {
      return this.translations[locale];
    }

    try {
      const filePath = path.join(process.cwd(), 'locales', `${locale}.json`);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      this.translations[locale] = JSON.parse(fileContent);
      console.log(`[i18n-server] Translations loaded for ${locale}`);
      return this.translations[locale];
    } catch (error) {
      console.error(`[i18n-server] Failed to load translations for ${locale}:`, error.message);
      // Return default locale as fallback
      if (locale !== this.defaultLocale) {
        console.log(`[i18n-server] Falling back to ${this.defaultLocale}`);
        return this.loadTranslations(this.defaultLocale);
      }
      return {};
    }
  }

  /**
   * Load terminology translations (cached)
   * @returns {Object} Terminology object
   */
  loadTerminology() {
    if (this.terminology) {
      return this.terminology;
    }

    try {
      const filePath = path.join(process.cwd(), 'locales', 'terminology.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      this.terminology = JSON.parse(fileContent);
      console.log('[i18n-server] Terminology loaded');
      return this.terminology;
    } catch (error) {
      console.error('[i18n-server] Failed to load terminology:', error.message);
      this.terminology = {};
      return {};
    }
  }

  /**
   * Detect locale from request
   * Priority: query param → custom header → Accept-Language → default
   * @param {Object} req - Request object
   * @returns {string} Detected locale code
   */
  detectLocale(req) {
    // 1. Check query parameter
    if (req.query && req.query.locale && this.supportedLocales.includes(req.query.locale)) {
      console.log(`[i18n-server] Locale from query param: ${req.query.locale}`);
      return req.query.locale;
    }

    // 2. Check custom header (X-Locale)
    const headerLocale = req.headers['x-locale'];
    if (headerLocale && this.supportedLocales.includes(headerLocale)) {
      console.log(`[i18n-server] Locale from X-Locale header: ${headerLocale}`);
      return headerLocale;
    }

    // 3. Parse Accept-Language header
    const acceptLanguage = req.headers['accept-language'];
    if (acceptLanguage) {
      const preferred = acceptLanguage.split(',')[0].split(';')[0].trim();
      console.log(`[i18n-server] Accept-Language: ${preferred}`);

      if (preferred.startsWith('zh')) {
        console.log('[i18n-server] Detected Chinese from Accept-Language');
        return 'zh-TW';
      }
      if (preferred.startsWith('en')) {
        console.log('[i18n-server] Detected English from Accept-Language');
        return 'en';
      }
    }

    // 4. Default
    console.log(`[i18n-server] Using default locale: ${this.defaultLocale}`);
    return this.defaultLocale;
  }

  /**
   * Translate key for specific locale
   * @param {string} locale - Locale code
   * @param {string} keyPath - Translation key path (e.g., 'api.errors.INVALID_REQUEST')
   * @param {Object} params - Optional parameters for interpolation
   * @returns {string} Translated string
   */
  translate(locale, keyPath, params = {}) {
    const translations = this.loadTranslations(locale);
    const keys = keyPath.split('.');
    let value = translations;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        console.warn(`[i18n-server] Translation key not found: ${keyPath}`);
        return keyPath; // Fallback to key
      }
    }

    // Handle parameter interpolation: {{param}}
    if (typeof value === 'string') {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    return value;
  }

  /**
   * Get translated terminology
   * @param {string} locale - Locale code
   * @param {string} category - Category (e.g., 'palaces', 'stars', 'concepts')
   * @param {string} key - Term key (e.g., 'ming', 'ziwei')
   * @param {boolean} includePinyin - Include pinyin in English translation
   * @returns {string} Translated term
   */
  translateTerm(locale, category, key, includePinyin = false) {
    const terminology = this.loadTerminology();

    if (!terminology[category] || !terminology[category][key]) {
      console.warn(`[i18n-server] Terminology not found: ${category}.${key}`);
      return key;
    }

    const term = terminology[category][key];
    const translation = term[locale] || term[this.defaultLocale];

    // For English, optionally include pinyin
    if (locale === 'en' && includePinyin && term.pinyin) {
      return `${translation} (${term.pinyin})`;
    }

    return translation;
  }

  /**
   * Translate all terms in a category for a specific locale
   * @param {string} locale - Locale code
   * @param {string} category - Category (e.g., 'palaces', 'stars')
   * @returns {Object} Object mapping keys to translated terms
   */
  translateCategory(locale, category) {
    const terminology = this.loadTerminology();

    if (!terminology[category]) {
      console.warn(`[i18n-server] Terminology category not found: ${category}`);
      return {};
    }

    const result = {};
    for (const [key, value] of Object.entries(terminology[category])) {
      result[key] = value[locale] || value[this.defaultLocale];
    }

    return result;
  }

  /**
   * Get all supported locales
   * @returns {Array<string>} Array of locale codes
   */
  getSupportedLocales() {
    return this.supportedLocales;
  }

  /**
   * Check if a locale is supported
   * @param {string} locale - Locale code
   * @returns {boolean} True if supported
   */
  isSupported(locale) {
    return this.supportedLocales.includes(locale);
  }
}

// Singleton instance
const serverI18n = new ServerI18n();

/**
 * Convenience function to detect locale from request
 * @param {Object} req - Request object
 * @returns {string} Detected locale code
 */
function detectLocale(req) {
  return serverI18n.detectLocale(req);
}

/**
 * Convenience function to translate a key
 * @param {string} locale - Locale code
 * @param {string} key - Translation key path
 * @param {Object} params - Optional parameters
 * @returns {string} Translated string
 */
function translate(locale, key, params = {}) {
  return serverI18n.translate(locale, key, params);
}

/**
 * Shorthand alias for translate
 * @param {string} locale - Locale code
 * @param {string} key - Translation key path
 * @param {Object} params - Optional parameters
 * @returns {string} Translated string
 */
function t(locale, key, params = {}) {
  return serverI18n.translate(locale, key, params);
}

/**
 * Convenience function to translate a term
 * @param {string} locale - Locale code
 * @param {string} category - Category
 * @param {string} key - Term key
 * @param {boolean} includePinyin - Include pinyin
 * @returns {string} Translated term
 */
function term(locale, category, key, includePinyin = false) {
  return serverI18n.translateTerm(locale, category, key, includePinyin);
}

/**
 * Convenience function to translate all terms in a category
 * @param {string} locale - Locale code
 * @param {string} category - Category
 * @returns {Object} Translated terms
 */
function translateCategory(locale, category) {
  return serverI18n.translateCategory(locale, category);
}

module.exports = {
  serverI18n,
  detectLocale,
  translate,
  t,
  term,
  translateCategory
};
