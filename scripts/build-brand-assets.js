#!/usr/bin/env node

/**
 * Rasterize brand assets from their SVG sources:
 *   public/og-image.svg -> public/og-image.png (1200x630, social share card)
 *   chart mark on a white tile -> public/favicon.ico (16/32/48, PNG-in-ICO) and public/apple-touch-icon.png (180)
 * The ICO uses a white tile because it cannot follow the browser theme the way
 * favicon.svg does, and the mark's ink lines vanish on a dark tab bar.
 * Usage: node scripts/build-brand-assets.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC = path.join(__dirname, '..', 'public');

const TILE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#FFFFFF"/>
  <rect x="10" y="3" width="12" height="9" fill="#9C3D25"/>
  <rect x="3" y="3" width="26" height="26" rx="5" fill="none" stroke="#17171E" stroke-width="2.8"/>
  <rect x="10" y="10" width="12" height="12" fill="none" stroke="#17171E" stroke-width="2.4"/>
</svg>`;

// ICO container holding PNG images (supported by every current browser)
function toIco(pngs) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(pngs.length, 4);
    let offset = 6 + 16 * pngs.length;
    const entries = pngs.map(({ size, data }) => {
        const e = Buffer.alloc(16);
        e.writeUInt8(size >= 256 ? 0 : size, 0);
        e.writeUInt8(size >= 256 ? 0 : size, 1);
        e.writeUInt8(0, 2);
        e.writeUInt8(0, 3);
        e.writeUInt16LE(1, 4);
        e.writeUInt16LE(32, 6);
        e.writeUInt32LE(data.length, 8);
        e.writeUInt32LE(offset, 12);
        offset += data.length;
        return e;
    });
    return Buffer.concat([header, ...entries, ...pngs.map(p => p.data)]);
}

async function main() {
    const ogSvg = fs.readFileSync(path.join(PUBLIC, 'og-image.svg'));
    await sharp(ogSvg, { density: 144 }).resize(1200, 630).png().toFile(path.join(PUBLIC, 'og-image.png'));

    const pngs = [];
    for (const size of [16, 32, 48]) {
        const data = await sharp(Buffer.from(TILE_SVG), { density: 72 * (size / 32) * 4 })
            .resize(size, size)
            .png()
            .toBuffer();
        pngs.push({ size, data });
    }
    fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), toIco(pngs));

    // iOS home screen / Safari bookmark icon: full-bleed white square, iOS applies its own corner mask
    const apple = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#FFFFFF"/>
  <g transform="translate(26 26) scale(4.0)">
    <rect x="9" y="2" width="7" height="7" fill="#9C3D25"/>
    <rect x="2" y="2" width="28" height="28" rx="5" fill="none" stroke="#17171E" stroke-width="1.6"/>
    <path d="M9 2v7M16 2v7M23 2v7M9 23v7M16 23v7M23 23v7M2 9h7M2 16h7M2 23h7M23 9h7M23 16h7M23 23h7" fill="none" stroke="#17171E" stroke-width="1.2"/>
    <rect x="9" y="9" width="14" height="14" fill="none" stroke="#17171E" stroke-width="1.2"/>
    <circle cx="16" cy="16" r="1.5" fill="#17171E"/>
  </g>
</svg>`;
    await sharp(Buffer.from(apple), { density: 288 }).resize(180, 180).png().toFile(path.join(PUBLIC, 'apple-touch-icon.png'));
    console.log('wrote public/og-image.png, public/favicon.ico and public/apple-touch-icon.png');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
