const { searchKnowledge, ALL_ENTRIES } = require('../lib/knowledge');

describe('knowledge base', () => {
    test('每條 entry 具備必要欄位且有出處', () => {
        expect(ALL_ENTRIES.length).toBeGreaterThanOrEqual(24);
        for (const e of ALL_ENTRIES) {
            expect(typeof e.id).toBe('string');
            expect(typeof e.topic).toBe('string');
            expect(Array.isArray(e.tags)).toBe(true);
            expect(e.tags.length).toBeGreaterThan(0);
            expect(typeof e.source).toBe('string');
            expect(e.source.length).toBeGreaterThan(0);
            expect(e.text.length).toBeGreaterThanOrEqual(120);
        }
    });

    test('id 不重複', () => {
        const ids = ALL_ENTRIES.map(e => e.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    test('依 tag 查詢財帛宮', () => {
        const results = searchKnowledge(['財帛宮']);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].tags).toContain('財帛宮');
    });

    test('多 tag 查詢依命中數排序且尊重 limit', () => {
        const results = searchKnowledge(['財帛宮', '化祿'], 3);
        expect(results.length).toBeLessThanOrEqual(3);
    });

    test('查無 tag 回傳空陣列', () => {
        expect(searchKnowledge(['不存在的標籤'])).toEqual([]);
        expect(searchKnowledge([])).toEqual([]);
    });
});
