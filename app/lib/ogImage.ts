// Share image used by every page's Open Graph and Twitter card.
// Social platforms cache the image by URL, so bump OG_IMAGE_VERSION whenever
// public/og-image.png changes (e.g. after `node scripts/build-brand-assets.js`).
export const OG_IMAGE_VERSION = '20261029';
export const OG_IMAGE_URL = `https://aiziwei.online/og-image.png?v=${OG_IMAGE_VERSION}`;
