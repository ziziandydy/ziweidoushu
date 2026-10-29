#!/usr/bin/env node

/**
 * Static pages in public/*.html link /styles.css, which Vercel serves with a
 * one-year immutable cache. Stamp each link with a content hash so browsers that
 * cached an older build refetch it. Run after `npm run build:css`.
 * Usage: node scripts/stamp-static-css.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PUBLIC = path.join(__dirname, '..', 'public');
const hash = crypto.createHash('sha1').update(fs.readFileSync(path.join(PUBLIC, 'styles.css'))).digest('hex').slice(0, 8);

for (const file of fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html'))) {
    const p = path.join(PUBLIC, file);
    const html = fs.readFileSync(p, 'utf8');
    const next = html.replace(/href="\/styles\.css(\?v=[0-9a-f]+)?"/g, `href="/styles.css?v=${hash}"`);
    if (next !== html) {
        fs.writeFileSync(p, next);
        console.log(`stamped ${file} with v=${hash}`);
    }
}
