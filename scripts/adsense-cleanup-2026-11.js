#!/usr/bin/env node

/**
 * One-off content cleanup before the next AdSense review (2026-11-14).
 *
 * 1. Archive the July to September "news commentary" posts (both languages). One pair stays
 *    published because twenty other posts link to it; its Google News / Bing redirect links
 *    are replaced (plain citation, or the original URL where the redirect carries it).
 * 2. In the posts that stay, remove sentences that only pointed to an archived post.
 * 3. Replace the per-article "AI-assisted" line with an entertainment-only disclaimer.
 *    The AI statement now lives on the About page only.
 *
 * Archived posts stay in the database (status = 'archived'), so this can be undone.
 * Default is a dry run. Old rows are backed up to content/rewrites/_backup-adsense-cleanup.json
 * (git-ignored) before any write.
 *
 *   node scripts/adsense-cleanup-2026-11.js           # dry run, prints every change
 *   node scripts/adsense-cleanup-2026-11.js --apply   # write
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { db } = require('@vercel/postgres');

const apply = process.argv.includes('--apply');
const BACKUP = path.join(__dirname, '..', 'content', 'rewrites', '_backup-adsense-cleanup.json');

// 翻身後仍守不住財 / Made More Money But Can't Keep It
const KEEP = ['3d0f777e-0820-4af8-ad33-a58a2ea5233f', 'ea62bf74-9658-4be6-952a-76bb9fa3782c'];

const ZH_DISCLAIMER = '本內容僅供娛樂和文化學習參考。';
const EN_DISCLAIMER = 'This content is for entertainment and cultural reference only.';

// Sentences where the link sits mid-sentence: [post id prefix, text before, text after]
const CUSTOM = [
    ['34b0771b', /像本站談過的\[[^\]]+\]\([^)]+\)，人往往/, '人往往'],
    ['e5612244', /關於天機四化如何牽動選擇與變化，亦可參考\[[^\]]+\]\([^)]+\)，但本月的重點/, '本月的重點'],
    ['fec2c89e', /相關的命理觀察，也可參考\[[^\]]+\]\([^)]+\)一文，但我會把它延伸到日常友誼/, '把這個角度延伸到日常友誼'],
    ['c8e78e40', /，也可以參考\[好萊塢[^\]]+\]\([^)]+\)。/, '。'],
    ['d3f06c7e', /A useful discussion of changing choices and Tian Ji’s transformations appears in the English article \[[^\]]+\]\([^)]+\), but the key lesson/, 'The key lesson'],
];

const LINK = /\[([^\]]+)\]\((https:\/\/(?:www\.)?aiziwei\.online\/(?:zh-TW|en)\/blog\/([^)\s]+))\)/g;

// Remove the whole sentence that contains the link at [start, end)
function dropSentence(content, start, end, zh) {
    let a = start;
    while (a > 0) {
        const ch = content[a - 1];
        if (ch === '\n' || (zh ? '。！？'.includes(ch) : (ch === ' ' && '.!?'.includes(content[a - 2])))) break;
        a--;
    }
    let b = end;
    while (b < content.length && content[b] !== '\n' && !(zh ? '。！？' : '.!?').includes(content[b])) b++;
    if (b < content.length && content[b] !== '\n') b++;
    // keep spacing tidy in English
    if (!zh && a > 0 && content[a - 1] === ' ' && content[b] === ' ') b++;
    if (!zh && content[b] === ' ' && (a === 0 || content[a - 1] === '\n')) b++;
    if (!zh && a > 0 && content[a - 1] === ' ' && (b >= content.length || content[b] === '\n')) a--;
    return [content.slice(0, a) + content.slice(b), content.slice(a, b)];
}

async function main() {
    const client = await db.connect();
    try {
        const { rows } = await client.query(
            `SELECT id, title, slug, language, status, content, published_at FROM blog_posts WHERE status = 'published' ORDER BY language, published_at`
        );
        const toArchive = rows.filter(r =>
            r.published_at >= new Date('2026-07-01T00:00:00Z') && r.published_at < new Date('2026-10-01T00:00:00Z') && !KEEP.includes(r.id));
        const archivedSlugs = new Set(toArchive.map(r => `${r.language}/${r.slug}`));
        const archiveIds = new Set(toArchive.map(r => r.id));

        console.log(`Published now: ${rows.length}. To archive: ${toArchive.length}`);
        for (const r of toArchive) console.log(`  archive ${r.language} ${r.published_at.toISOString().slice(0, 10)} ${r.title}`);

        const updates = [];
        for (const r of rows) {
            if (archiveIds.has(r.id)) continue;
            const zh = r.language === 'zh-TW';
            let content = r.content;
            const notes = [];

            for (const [prefix, re, to] of CUSTOM) {
                if (r.id.startsWith(prefix) && re.test(content)) {
                    notes.push(`custom: "${content.match(re)[0].slice(0, 60)}…" -> "${to}"`);
                    content = content.replace(re, to);
                }
            }

            // links to archived posts: drop the sentence
            for (;;) {
                LINK.lastIndex = 0;
                let hit = null, m;
                while ((m = LINK.exec(content))) {
                    const lang = m[2].includes('/en/blog/') ? 'en' : 'zh-TW';
                    if (archivedSlugs.has(`${lang}/${decodeURIComponent(m[3])}`)) { hit = m; break; }
                }
                if (!hit) break;
                const [next, removed] = dropSentence(content, hit.index, hit.index + hit[0].length, zh);
                notes.push(`drop sentence: "${removed.replace(/\]\([^)]+\)/g, ']').slice(0, 140)}"`);
                content = next;
            }

            // redirect links in the two kept posts
            if (KEEP.includes(r.id)) {
                content = content.replace(/\[([^\]]+)\]\(https:\/\/news\.google\.com\/rss\/articles\/[^)]+\)/g, (_, t) => { notes.push(`unlink Google News: ${t.slice(0, 50)}`); return t; });
                content = content.replace(/\[([^\]]+)\]\(http:\/\/www\.bing\.com\/news\/apiclick\.aspx\?[^)]*?url=([^&)]+)[^)]*\)/g, (_, t, u) => { notes.push(`Bing redirect -> ${decodeURIComponent(u)}`); return `[${t}](${decodeURIComponent(u)})`; });
            }

            // disclaimer line
            const before = content;
            if (zh) content = content.replace(/本內容由 AI 輔助撰寫、經站方監督，僅供娛樂和文化學習參考。/g, ZH_DISCLAIMER);
            else content = content.replace(/^This content (?:was|is) [^\n]*\bAI\b[^\n]*$/gm, EN_DISCLAIMER);
            if (content !== before) notes.push('disclaimer');
            if (!content.includes(zh ? ZH_DISCLAIMER : EN_DISCLAIMER)) notes.push('WARNING: no disclaimer line found');
            if (/AI 輔助|AI.assist/i.test(content)) notes.push('WARNING: an AI-assisted phrase remains');

            if (content !== r.content) updates.push({ id: r.id, content, notes, title: r.title, language: r.language });
        }

        console.log(`\nPosts to edit: ${updates.length}`);
        for (const u of updates) {
            const extra = u.notes.filter(n => n !== 'disclaimer');
            if (extra.length) { console.log(`  ${u.language} ${u.title}`); extra.forEach(n => console.log(`      ${n}`)); }
        }
        console.log(`  (disclaimer replaced in ${updates.filter(u => u.notes.includes('disclaimer')).length} posts)`);

        if (!apply) { console.log('\nDry run. Nothing written. Re-run with --apply.'); return; }

        fs.writeFileSync(BACKUP, JSON.stringify(rows, null, 1));
        console.log(`\nBackup: ${BACKUP}`);
        await client.query('BEGIN');
        for (const u of updates) await client.query(`UPDATE blog_posts SET content = $1 WHERE id = $2`, [u.content, u.id]);
        const res = await client.query(`UPDATE blog_posts SET status = 'archived' WHERE id = ANY($1::uuid[]) AND status = 'published'`, [[...archiveIds]]);
        await client.query('COMMIT');
        console.log(`Edited ${updates.length} posts, archived ${res.rowCount}.`);
    } catch (e) {
        await client.query('ROLLBACK').catch(() => {});
        throw e;
    } finally {
        client.release();
    }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
