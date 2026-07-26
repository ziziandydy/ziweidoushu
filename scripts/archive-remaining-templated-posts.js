#!/usr/bin/env node

/**
 * One-off cleanup (round 2): archive the remaining templated / low-value
 * zh-TW posts and their linked EN translations, excluding the evergreen
 * star/guide series and the new weekly-curation article.
 * Categories covered: 財富焦慮 (12-palace wealth-anxiety template),
 * 內耗 series, 週運勢 series, plus the fabricated-persona / real-figure
 * name-dropping cluster (小孟老師/清水孟/唐綺陽/林霖/柯柏成/詹惟中/謝沅瑾 etc.)
 * that were caught in manual spot-review attributing invented claims to
 * real public figures.
 * Soft takedown via status='archived' (reversible), same mechanism as
 * scripts/archive-liuri-yunshi.js.
 * Usage: node scripts/archive-remaining-templated-posts.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { sql } = require('@vercel/postgres');

const EVERGREEN_PATTERNS = ['%詳解%', '%完全指南%', '%完全解析%', '%天干地支%', '%大運趨勢分析%'];
const TEMPLATE_PATTERNS = ['%財富焦慮%', '%內耗%', '%週運勢%'];
const KEEP_IDS = ['56a84936-6059-4348-b6d1-5605d557f06d']; // 新週刊文

async function idsMatchingAny(patterns) {
    const ids = new Set();
    for (const p of patterns) {
        const r = await sql.query(
            `SELECT id FROM blog_posts WHERE language = 'zh-TW' AND status = 'published' AND title LIKE $1`,
            [p]
        );
        r.rows.forEach(row => ids.add(row.id));
    }
    return ids;
}

async function main() {
    const templateIds = await idsMatchingAny(TEMPLATE_PATTERNS);
    const evergreenIds = await idsMatchingAny(EVERGREEN_PATTERNS);

    const allZh = await sql`SELECT id FROM blog_posts WHERE language = 'zh-TW' AND status = 'published'`;
    const zhIds = allZh.rows
        .map(r => r.id)
        .filter(id => !evergreenIds.has(id) && !KEEP_IDS.includes(id));
    // zhIds now = template-matched + previously-unclassified (both are junk per manual review)

    console.log(`📌 命中待下架 zh-TW 樣板/爭議文：${zhIds.length} 篇`);

    if (zhIds.length === 0) {
        console.log('沒有符合條件的文章，結束。');
        process.exit(0);
    }

    const enResult = await sql`
    SELECT id FROM blog_posts
    WHERE language = 'en' AND status = 'published' AND translated_from = ANY(${zhIds}::uuid[])
  `;
    const enIds = enResult.rows.map(r => r.id);
    console.log(`📌 對應的 en 譯文：${enIds.length} 篇`);

    const allIds = [...zhIds, ...enIds];

    const updateResult = await sql`
    UPDATE blog_posts
    SET status = 'archived', updated_at = NOW()
    WHERE id = ANY(${allIds}::uuid[])
    RETURNING id
  `;
    console.log(`✅ 已下架（status='archived'）共 ${updateResult.rowCount} 篇`);

    const remaining = await sql`
    SELECT status, language, COUNT(*) FROM blog_posts GROUP BY status, language ORDER BY status, language
  `;
    console.log('=== 下架後現況 ===');
    console.table(remaining.rows);

    process.exit(0);
}

main().catch(e => { console.error('❌ 執行失敗:', e); process.exit(1); });
