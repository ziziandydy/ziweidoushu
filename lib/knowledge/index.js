const ALL_ENTRIES = require('./entries');

/**
 * 依 tags 查詢知識條目，依命中 tag 數多→少排序。
 * @param {string[]} tags
 * @param {number} limit
 */
function searchKnowledge(tags, limit = 5) {
    if (!Array.isArray(tags) || tags.length === 0) return [];
    const wanted = tags.map(t => String(t).trim()).filter(Boolean);
    return ALL_ENTRIES
        .map(entry => ({
            entry,
            hits: entry.tags.filter(t => wanted.includes(t)).length,
        }))
        .filter(x => x.hits > 0)
        .sort((a, b) => b.hits - a.hits)
        .slice(0, limit)
        .map(x => x.entry);
}

module.exports = { searchKnowledge, ALL_ENTRIES };
