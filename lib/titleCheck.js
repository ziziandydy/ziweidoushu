/**
 * Title guard for blog posts. Every publisher (n8n, admin, auto-translation) goes through
 * api/blog/[id].js, so checking here keeps bad titles from ever reaching the site.
 *
 * It catches mechanical problems only: length, wrong language, stale years, overclaims and
 * the machine-translation template. It cannot tell that a title misnames a star; that still
 * needs a human or the editorial review.
 */

const CJK = /[一-鿿]/;

// Claims the site cannot back up (it is a symbolic tradition, not a validated science)
const OVERCLAIMS = [
    /科學(邏輯|驗證|證實|證明|依據|原理)/,
    /(準確率|命中率)\s*\d+/,
    /100\s?%/,
    /保證|包準|必中|鐵口直斷/,
    /scientific(ally)?\s+(logic|proof|proven|validat\w*|basis)/i,
    /guarantee[ds]?\b/i,
    /100\s?%\s*accura\w*/i,
];

// Template left over from machine translation of the old star series
const EN_TEMPLATES = [/^detailed explanation of\b/i];

function wordCount(s) {
    return (s.match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) || []).length;
}

/**
 * @param {string} title
 * @param {'zh-TW'|'en'|string} language
 * @param {Date} [now]
 * @returns {string[]} problems; empty when the title is fine
 */
function checkTitle(title, language, now = new Date()) {
    const problems = [];
    const t = String(title || '').trim();
    if (!t) return ['標題是空的'];

    const isEn = language === 'en';
    const hasCjk = CJK.test(t);

    if (isEn) {
        if (hasCjk) problems.push('英文文章的標題不可含中文字');
        const words = wordCount(t);
        if (words < 6) problems.push(`英文標題太短：${words} 字，至少 6 字`);
        if (words > 16) problems.push(`英文標題太長：${words} 字，上限 16 字（建議 8–14 字）`);
        if (EN_TEMPLATES.some(re => re.test(t))) problems.push('英文標題使用了機器翻譯範本「Detailed Explanation of…」');
    } else {
        if (!hasCjk) problems.push('中文文章的標題必須含中文字');
        if (t.length < 6) problems.push(`中文標題太短：${t.length} 字，至少 6 字`);
        if (t.length > 40) problems.push(`中文標題太長：${t.length} 字，上限 40 字`);
    }

    if (OVERCLAIMS.some(re => re.test(t))) problems.push('標題含有無法佐證的宣稱（科學、保證、準確率等）');

    // A title that only mentions past years reads as stale
    const years = (t.match(/\b20\d{2}\b|20\d{2}(?=年)/g) || []).map(Number);
    if (years.length && Math.max(...years) < now.getFullYear()) {
        problems.push(`標題只提到過去的年份（${Math.max(...years)}），內容已過期`);
    }

    return problems;
}

module.exports = { checkTitle, wordCount };
