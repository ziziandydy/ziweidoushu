const { checkTitle } = require('../lib/titleCheck');

const NOW = new Date('2026-10-29T00:00:00Z');
const ok = (t, lang) => expect(checkTitle(t, lang, NOW)).toEqual([]);
const bad = (t, lang, needle) => {
    const p = checkTitle(t, lang, NOW);
    expect(p.length).toBeGreaterThan(0);
    if (needle) expect(p.join(' | ')).toContain(needle);
};

describe('title guard', () => {
    it('accepts titles that are live on the site today', () => {
        ok('總愛上不適合的人？紫微斗數解讀夫妻宮與情感慣性', 'zh-TW');
        ok('2026霜降節氣紫微斗數：田宅宮與財帛宮的生活節奏', 'zh-TW');
        ok('Walker全壘打大賽逆轉奪冠：紫微斗數怎麼看客場、噓聲與最後一揮？', 'zh-TW');
        ok('命理能被數據驗證嗎？從紫微斗數X光機看精準預測邊界', 'zh-TW');
        ok('Why You Keep Choosing the Wrong Partners in Zi Wei Dou Shu', 'en');
        ok('Cold Dew 2026: Zi Wei Dou Shu, Sleep, Stress, and Inner Recovery', 'en');
        ok('Tian Ji Star Explained: Brilliant Analysis and the Cost of Overthinking', 'en');
    });

    it('rejects the title problems found in the 2026-10 audit', () => {
        bad('紫微斗數入門完全指南：從零開始了解命理學的科學邏輯', 'zh-TW', '宣稱');
        bad('A Complete Beginner\'s Guide to Zi Wei Dou Shu: Understanding the Scientific Logic of Astrology from Scratch', 'en');
        bad('Detailed Explanation of Tian Tong Star: The Happiness Code of the Star of Blessings and the Optimism Index of Life', 'en', 'Detailed Explanation');
        bad('Complete Analysis of the Twelve Palaces in Zi Wei Dou Shu: From Life Palace to Fortune Palace, Unveiling Various Aspects of Life', 'en', '太長');
    });

    it('rejects a title in the wrong language', () => {
        bad('Tian Ji Star Explained: 天機星的分析力與想太多的代價', 'en', '中文字');
        bad('Tian Ji Star Explained in Plain English', 'zh-TW', '必須含中文字');
    });

    it('rejects titles that are too short or too long', () => {
        bad('天機星', 'zh-TW', '太短');
        bad('一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一', 'zh-TW', '太長');
        bad('Tian Ji Star', 'en', '太短');
    });

    it('rejects a title that only mentions past years', () => {
        bad('2025年紫微斗數流年運勢預測：掌握一整年的節奏', 'zh-TW', '過去的年份');
        ok('2025-2026年紫微大運趨勢分析：掌握你的流年運勢', 'zh-TW');
        bad('2024 Zi Wei Dou Shu Forecast: What the Year Holds', 'en', '過去的年份');
    });

    it('rejects overclaims', () => {
        bad('紫微斗數準確率 95% 的秘密：你的命盤怎麼看', 'zh-TW', '宣稱');
        bad('Guaranteed Results From Zi Wei Dou Shu Charts This Year', 'en', '宣稱');
    });

    it('flags an empty title', () => {
        expect(checkTitle('  ', 'en', NOW)).toEqual(['標題是空的']);
    });
});
