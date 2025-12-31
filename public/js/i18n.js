/**
 * Lightweight i18n Manager for AI Zi Wei Dou Shu
 * No external dependencies - Pure vanilla JavaScript
 *
 * Features:
 * - Locale detection from URL path, localStorage, browser settings
 * - Nested translation key support (e.g., 'pages.index.hero.title')
 * - Parameter interpolation (e.g., 'Hello {{name}}')
 * - Language switching with URL preservation
 * - Translation file caching
 */

class I18nManager {
  constructor() {
    this.currentLocale = 'zh-TW';
    this.translations = {};
    this.supportedLocales = ['en', 'zh-TW'];
    this.defaultLocale = 'zh-TW';
    this.terminology = null;
  }

  /**
   * Initialize i18n system
   * Detects locale from: URL path → localStorage → browser → default
   * @returns {Promise<string>} Detected locale
   */
  async init() {
    console.log('[i18n] Initializing...');

    // 1. Detect locale from URL path
    const pathLocale = this.detectLocaleFromPath();

    // 2. Check localStorage
    const storedLocale = localStorage.getItem('preferred-locale');

    // 3. Browser language
    const browserLocale = this.detectBrowserLocale();

    // 4. Determine final locale
    this.currentLocale = pathLocale || storedLocale || browserLocale || this.defaultLocale;

    // Validate locale
    if (!this.supportedLocales.includes(this.currentLocale)) {
      console.warn(`[i18n] Unsupported locale: ${this.currentLocale}, falling back to ${this.defaultLocale}`);
      this.currentLocale = this.defaultLocale;
    }

    console.log(`[i18n] Detected locale: ${this.currentLocale}`);

    // Load translations
    await this.loadTranslations(this.currentLocale);

    // Load terminology
    await this.loadTerminology();

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLocale;

    console.log('[i18n] Initialization complete');
    return this.currentLocale;
  }

  /**
   * Detect locale from URL path (e.g., /en/analysis.html → 'en')
   * @returns {string|null} Detected locale or null
   */
  detectLocaleFromPath() {
    const pathSegments = window.location.pathname.split('/').filter(s => s);
    const firstSegment = pathSegments[0];

    if (this.supportedLocales.includes(firstSegment)) {
      console.log(`[i18n] Locale detected from URL path: ${firstSegment}`);
      return firstSegment;
    }
    return null;
  }

  /**
   * Detect browser language preference
   * @returns {string|null} Detected locale or null
   */
  detectBrowserLocale() {
    const browserLang = navigator.language || navigator.userLanguage;
    console.log(`[i18n] Browser language: ${browserLang}`);

    // Map browser language codes to our supported locales
    if (browserLang.startsWith('zh')) {
      return 'zh-TW';
    } else if (browserLang.startsWith('en')) {
      return 'en';
    }
    return null;
  }

  /**
   * Load translation file for specified locale
   * @param {string} locale - Locale code (e.g., 'en', 'zh-TW')
   * @returns {Promise<void>}
   */
  async loadTranslations(locale) {
    try {
      console.log(`[i18n] Loading translations for: ${locale}`);
      const response = await fetch(`/locales/${locale}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load locale: ${locale} (${response.status})`);
      }
      this.translations = await response.json();
      console.log(`[i18n] Translations loaded successfully for ${locale}`);
    } catch (error) {
      console.error('[i18n] Failed to load translations:', error);
      // Fallback to default locale
      if (locale !== this.defaultLocale) {
        console.log(`[i18n] Falling back to ${this.defaultLocale}`);
        const fallbackResponse = await fetch(`/locales/${this.defaultLocale}.json`);
        this.translations = await fallbackResponse.json();
      }
    }
  }

  /**
   * Load terminology translations (star names, palace names, etc.)
   * @returns {Promise<void>}
   */
  async loadTerminology() {
    try {
      console.log('[i18n] Loading terminology...');
      const response = await fetch('/locales/terminology.json');
      if (!response.ok) {
        throw new Error(`Failed to load terminology (${response.status})`);
      }
      this.terminology = await response.json();
      console.log('[i18n] Terminology loaded successfully');
    } catch (error) {
      console.error('[i18n] Failed to load terminology:', error);
      this.terminology = {};
    }
  }

  /**
   * Get translated string by key path (e.g., 'pages.index.hero.title')
   * Supports nested objects and parameter interpolation
   * @param {string} keyPath - Translation key path
   * @param {Object} params - Optional parameters for interpolation
   * @returns {string} Translated string or key if not found
   */
  t(keyPath, params = {}) {
    const keys = keyPath.split('.');
    let value = this.translations;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        console.warn(`[i18n] Translation key not found: ${keyPath}`);
        return keyPath; // Return key as fallback
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
   * Get translated terminology (star names, palace names)
   * @param {string} category - Category (e.g., 'palaces', 'stars', 'concepts')
   * @param {string} key - Term key (e.g., 'ming', 'ziwei')
   * @param {boolean} includePinyin - Include pinyin in English translation
   * @returns {string} Translated term
   */
  term(category, key, includePinyin = false) {
    if (!this.terminology || !this.terminology[category] || !this.terminology[category][key]) {
      console.warn(`[i18n] Terminology not found: ${category}.${key}`);
      return key;
    }

    const term = this.terminology[category][key];
    const translation = term[this.currentLocale] || term['zh-TW'];

    // For English, optionally include pinyin
    if (this.currentLocale === 'en' && includePinyin && term.pinyin) {
      return `${translation} (${term.pinyin})`;
    }

    return translation;
  }

  /**
   * Switch to a different locale
   * @param {string} newLocale - New locale code
   * @returns {Promise<void>}
   */
  async switchLocale(newLocale) {
    if (!this.supportedLocales.includes(newLocale)) {
      console.error(`[i18n] Unsupported locale: ${newLocale}`);
      return;
    }

    if (newLocale === this.currentLocale) {
      console.log(`[i18n] Already using locale: ${newLocale}`);
      return;
    }

    console.log(`[i18n] Switching locale from ${this.currentLocale} to ${newLocale}`);

    // Save preference
    localStorage.setItem('preferred-locale', newLocale);

    // Build new URL path
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const currentHash = window.location.hash;

    // Remove current locale from path
    let cleanPath = currentPath;
    for (const locale of this.supportedLocales) {
      const pattern = new RegExp(`^/${locale}(/|$)`);
      if (pattern.test(cleanPath)) {
        cleanPath = cleanPath.replace(pattern, '/');
        break;
      }
    }

    // If cleanPath is empty or just '/', set it to '/'
    if (!cleanPath || cleanPath === '/') {
      cleanPath = '/';
    }

    // Add new locale prefix
    const newPath = `/${newLocale}${cleanPath}${currentSearch}${currentHash}`;

    console.log(`[i18n] Navigating to: ${newPath}`);

    // Navigate to new URL
    window.location.href = newPath;
  }

  /**
   * Get current locale
   * @returns {string} Current locale code
   */
  getLocale() {
    return this.currentLocale;
  }

  /**
   * Get all supported locales with display names
   * @returns {Array<{code: string, name: string}>} Supported locales
   */
  getSupportedLocales() {
    return this.supportedLocales.map(locale => ({
      code: locale,
      name: this.getLocaleDisplayName(locale)
    }));
  }

  /**
   * Get display name for a locale
   * @param {string} locale - Locale code
   * @returns {string} Display name
   */
  getLocaleDisplayName(locale) {
    const names = {
      'zh-TW': '繁體中文',
      'en': 'English'
    };
    return names[locale] || locale;
  }

  /**
   * Check if a locale is RTL (Right-to-Left)
   * Currently not used, but ready for future Arabic/Hebrew support
   * @param {string} locale - Locale code
   * @returns {boolean} True if RTL
   */
  isRTL(locale = this.currentLocale) {
    const rtlLocales = ['ar', 'he'];
    return rtlLocales.includes(locale);
  }
}

// Create global instance
window.i18n = new I18nManager();

/**
 * Initialize i18n when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await window.i18n.init();

    // Apply translations to page
    if (typeof translatePage === 'function') {
      translatePage();
    }

    // Update language switcher display
    if (typeof updateLanguageSwitcher === 'function') {
      updateLanguageSwitcher();
    }
  } catch (error) {
    console.error('[i18n] Initialization failed:', error);
  }
});

/**
 * Helper function to apply translations to page elements
 * Looks for data-i18n, data-i18n-html, and data-i18n-placeholder attributes
 */
function translatePage() {
  console.log('[i18n] Translating page elements...');

  // Translate text content
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = window.i18n.t(key);
    if (translation !== key) {
      element.textContent = translation;
    }
  });

  // Translate HTML content
  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    const key = element.getAttribute('data-i18n-html');
    const translation = window.i18n.t(key);
    if (translation !== key) {
      element.innerHTML = translation;
    }
  });

  // Translate placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const translation = window.i18n.t(key);
    if (translation !== key) {
      element.placeholder = translation;
    }
  });

  // Translate title attributes
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    const translation = window.i18n.t(key);
    if (translation !== key) {
      element.title = translation;
    }
  });

  console.log('[i18n] Page translation complete');
}

/**
 * Helper function to update language switcher display
 */
function updateLanguageSwitcher() {
  const currentLocale = window.i18n.getLocale();
  const displayName = window.i18n.getLocaleDisplayName(currentLocale);

  const currentLangElement = document.getElementById('currentLanguage');
  if (currentLangElement) {
    currentLangElement.textContent = displayName;
  }
}

/**
 * Global function to switch language
 * Called from language switcher UI
 * @param {string} locale - Target locale code
 */
async function switchLanguage(locale) {
  await window.i18n.switchLocale(locale);
}

/**
 * Global function to toggle language menu
 */
function toggleLanguageMenu() {
  const menu = document.getElementById('languageMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

// Close language menu when clicking outside
document.addEventListener('click', (e) => {
  const switcher = document.getElementById('languageSwitcher');
  const menu = document.getElementById('languageMenu');

  if (switcher && menu && !switcher.contains(e.target)) {
    menu.classList.add('hidden');
  }
});
