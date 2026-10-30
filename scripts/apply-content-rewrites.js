#!/usr/bin/env node

/**
 * One-off content update (2026-10-29): replace the thin zh-TW evergreen posts with the
 * rewrites in content/rewrites/ and add five main-star articles scheduled over two weeks.
 *
 * - Rewrites keep their id, slug and published_at; only content (and, where listed, title/tags)
 *   change, and updated_at is set to NOW() so dateModified is honest.
 * - New posts get their real future publish dates. The site only shows posts whose
 *   published_at has passed, so deploy that code BEFORE running with --apply.
 * - Default is a dry run. Old content is backed up to content/rewrites/_backup-before.json
 *   (git-ignored) before any write.
 *
 * - English editions of the five new articles are inserted right after their Chinese originals
 *   (translated_from = the Chinese post id), published one hour later, the same gap the n8n flow uses.
 *
 * Usage:
 *   node scripts/apply-content-rewrites.js           # dry run
 *   node scripts/apply-content-rewrites.js --apply   # write
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { db } = require('@vercel/postgres');

const DIR = path.join(__dirname, '..', 'content', 'rewrites');
const apply = process.argv.includes('--apply');
const manifest = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8'));
const read = f => fs.readFileSync(path.join(DIR, f), 'utf8').trim() + '\n';

// same slug rule as api/blog/[id].js (create)
const slugOf = title =>
    title.trim().toLowerCase()
        .replace(/[\s]+/g, '-')
        .replace(/[^\w一-龥-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

async function main() {
    const client = await db.connect();
    try {
        const ids = manifest.rewrites.map(r => r.id);
        const before = await client.query(
            `SELECT id, title, slug, content, tags, status, language, published_at FROM blog_posts WHERE id = ANY($1::uuid[])`,
            [ids]
        );
        const byId = new Map(before.rows.map(r => [r.id, r]));

        // Safety checks before touching anything
        for (const r of manifest.rewrites) {
            const row = byId.get(r.id);
            if (!row) throw new Error(`Post not found: ${r.id} (${r.file})`);
            if (row.language !== 'zh-TW' || row.status !== 'published') throw new Error(`Unexpected state for ${row.title}`);
            if (!row.title.includes(r.expectTitleIncludes)) throw new Error(`Title mismatch for ${r.id}: ${row.title}`);
        }
        for (const n of manifest.new) {
            const slug = slugOf(n.title);
            const dup = await client.query(`SELECT 1 FROM blog_posts WHERE slug = $1 AND language = 'zh-TW'`, [slug]);
            if (dup.rows.length) throw new Error(`Slug already exists: ${slug}`);
            if (new Date(n.publishedAt) <= new Date()) console.warn(`  note: ${n.title} publish date is already past, it will be visible immediately`);
        }

        for (const e of manifest.en || []) {
            const slug = slugOf(e.title);
            const dup = await client.query(`SELECT 1 FROM blog_posts WHERE slug = $1 AND language = 'en'`, [slug]);
            if (dup.rows.length) throw new Error(`English slug already exists: ${slug}`);
            if (!manifest.new.some(n => n.file === e.zhFile)) throw new Error(`No Chinese original for ${e.file}`);
        }

        console.log(`${apply ? 'APPLY' : 'DRY RUN'}: ${manifest.rewrites.length} rewrites, ${manifest.new.length} new posts, ${(manifest.en || []).length} English editions\n`);
        for (const r of manifest.rewrites) {
            const row = byId.get(r.id);
            const content = read(r.file);
            const oldLen = row.content.replace(/\s/g, '').length;
            const newLen = content.replace(/\s/g, '').length;
            console.log(`  rewrite  ${row.title.slice(0, 22)}  ${oldLen} -> ${newLen} chars${r.newTitle ? `  title -> ${r.newTitle}` : ''}${r.tags ? '  tags updated' : ''}`);
        }
        for (const n of manifest.new) {
            console.log(`  new      ${n.title}  publish ${n.publishedAt}  slug ${slugOf(n.title)}`);
        }
        for (const e of manifest.en || []) {
            console.log(`  english  ${e.title}  publish ${e.publishedAt}  slug ${slugOf(e.title)}`);
        }

        if (!apply) {
            console.log('\nDry run only. Re-run with --apply to write.');
            return;
        }

        fs.writeFileSync(path.join(DIR, '_backup-before.json'), JSON.stringify(before.rows, null, 2));
        console.log('\nBackup written to content/rewrites/_backup-before.json');

        await client.query('BEGIN');
        for (const r of manifest.rewrites) {
            const content = read(r.file);
            await client.query(
                `UPDATE blog_posts
                 SET content = $1,
                     title = COALESCE($2, title),
                     tags = COALESCE($3::jsonb, tags),
                     updated_at = NOW()
                 WHERE id = $4`,
                [content, r.newTitle || null, r.tags ? JSON.stringify(r.tags) : null, r.id]
            );
        }
        const zhIdByFile = new Map();
        for (const n of manifest.new) {
            const ins = await client.query(
                `INSERT INTO blog_posts (title, slug, content, tags, status, published_at, language, author)
                 VALUES ($1, $2, $3, $4::jsonb, 'published', $5, 'zh-TW', '王老師')
                 RETURNING id`,
                [n.title, slugOf(n.title), read(n.file), JSON.stringify(n.tags), n.publishedAt]
            );
            zhIdByFile.set(n.file, ins.rows[0].id);
        }
        for (const e of manifest.en || []) {
            await client.query(
                `INSERT INTO blog_posts (title, slug, content, tags, status, published_at, language, translated_from, author)
                 VALUES ($1, $2, $3, $4::jsonb, 'published', $5, 'en', $6, '王老師')`,
                [e.title, slugOf(e.title), read(e.file), JSON.stringify(e.tags), e.publishedAt, zhIdByFile.get(e.zhFile)]
            );
        }
        await client.query('COMMIT');
        console.log('Done. All updates committed.');
    } catch (e) {
        try { await client.query('ROLLBACK'); } catch (_) { /* not in a transaction */ }
        console.error('FAILED, nothing written:', e.message);
        process.exitCode = 1;
    } finally {
        client.release();
    }
}

main();
