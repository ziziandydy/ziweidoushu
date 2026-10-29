#!/usr/bin/env node

/**
 * Palette gate for the vermilion redesign: fails if any retired purple/blue
 * gradient styling is still in the site source. The compiled public/styles.css
 * is not scanned; it is rebuilt from the source this checks.
 * Usage: npm run check:palette
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TARGETS = [
    { dir: 'app', exts: ['.ts', '.tsx', '.css'] },
    { dir: 'src/styles', exts: ['.css'] },
    { dir: 'src/frontend', exts: ['.css', '.ts', '.tsx'] },
    { dir: 'public', exts: ['.html'], shallow: true },
];

const RULES = [
    { name: 'retired color class', re: /\b(?:purple|violet|indigo|fuchsia|zodiac)-\d{2,3}\b/g },
    { name: 'gradient utility', re: /\bbg-gradient-to-[a-z]{1,2}\b/g },
    { name: 'gradient stop', re: /\b(?:from|via|to)-[a-z]+-\d{2,3}\b/g },
    { name: 'gradient text class', re: /\b(?:gradient-text|text-gradient-[a-z]+)\b/g },
    { name: 'retired hex', re: /#(?:9333ea|a855f7|7c3aed|667eea|764ba2|8b5cf6)\b/gi },
    { name: 'css gradient', re: /\b(?:linear|radial)-gradient\(/g },
];

function walk(dir, exts, shallow) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) return [];
    const out = [];
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
        const rel = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (!shallow) out.push(...walk(rel, exts, shallow));
        } else if (exts.includes(path.extname(entry.name))) {
            out.push(rel);
        }
    }
    return out;
}

const hits = [];
for (const t of TARGETS) {
    for (const file of walk(t.dir, t.exts, t.shallow)) {
        const lines = fs.readFileSync(path.join(ROOT, file), 'utf8').split('\n');
        lines.forEach((line, i) => {
            for (const rule of RULES) {
                const found = line.match(rule.re);
                if (found) hits.push(`${file}:${i + 1}  ${rule.name}: ${[...new Set(found)].join(', ')}`);
            }
        });
    }
}

if (hits.length) {
    const files = new Set(hits.map(h => h.split(':')[0]));
    console.error(hits.join('\n'));
    console.error(`\ncheck:palette FAILED: ${hits.length} hits in ${files.size} files`);
    process.exit(1);
}
console.log('check:palette passed');
