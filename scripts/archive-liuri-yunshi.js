#!/usr/bin/env node

/**
 * One-off cleanup: archive the "流日運勢" daily-fortune template posts
 * (highest-confidence scaled-content-abuse pattern flagged in AdSense review)
 * and their linked English translations. Soft takedown via status='archived' —
 * reversible, drops out of sitemap/list/detail (only status='published' is queried).
 * Usage: node scripts/archive-liuri-yunshi.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { sql } = require('@vercel/postgres');

async function main() {
    const zhResult = await sql`
    SELECT id FROM blog_posts
    WHERE language = 'zh-TW' AND status = 'published' AND title LIKE '%流日運勢%'
  `;
    const zhIds = zhResult.rows.map(r => r.id);
    console.log(`📌 命中 zh-TW「流日運勢」樣板文：${zhIds.length} 篇`);

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
