#!/usr/bin/env node

/**
 * Rasterize brand assets from their SVG sources:
 *   public/og-image.svg -> public/og-image.png (1200x630, social share card)
 *   chart mark on a white tile -> public/favicon.ico (16/32/48, PNG-in-ICO)
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
    console.log('wrote public/og-image.png and public/favicon.ico');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
