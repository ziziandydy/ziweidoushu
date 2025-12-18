/**
 * Vercel Serverless Function - Serve Static HTML Pages & Sitemap
 * 通用頁面提供函數，減少 Serverless Functions 數量
 */

const fs = require('fs');
const path = require('path');
const { sql } = require('@vercel/postgres');

// 允許的頁面映射
const PAGES = {
  'admin-login': 'admin-login.html',
  'admin-dashboard': 'admin-dashboard.html'
};

module.exports = async function handler(req, res) {
  try {
    const { page } = req.query;

    // 處理 sitemap.xml
    if (page === 'sitemap') {
      return await generateSitemap(req, res);
    }

    if (!page || !PAGES[page]) {
      return res.status(404).send('<h1>頁面不存在</h1>');
    }

    const fileName = PAGES[page];
    const filePath = path.join(process.cwd(), 'public', fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('<h1>檔案不存在</h1>');
    }

    const html = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);

  } catch (error) {
    console.error('讀取頁面失敗:', error);
    return res.status(500).send('<h1>伺服器錯誤</h1>');
  }
};

async function generateSitemap(req, res) {
  try {
    // 靜態頁面
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'weekly' },
      { url: '/analysis', priority: '0.9', changefreq: 'weekly' },
      { url: '/blog', priority: '0.9', changefreq: 'daily' },
      { url: '/privacy-policy', priority: '0.5', changefreq: 'monthly' },
      { url: '/pricing', priority: '0.7', changefreq: 'monthly' },
      { url: '/payment-success', priority: '0.3', changefreq: 'monthly' },
      { url: '/payment-failed', priority: '0.3', changefreq: 'monthly' },
    ];

    // 獲取所有已發布的部落格文章
    const result = await sql`
      SELECT slug, published_at, updated_at
      FROM blog_posts
      WHERE status = 'published'
      ORDER BY published_at DESC
    `;

    const blogPosts = result.rows;

    // 生成 sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticPages.map(page => `    <url>
        <loc>https://aiziwei.online${page.url}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`).join('\n')}
${blogPosts.map(post => `    <url>
        <loc>https://aiziwei.online/blog/${escapeXml(post.slug)}</loc>
        <lastmod>${formatDate(post.updated_at || post.published_at)}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    return res.status(200).send(sitemap);

  } catch (error) {
    console.error('生成 Sitemap 失敗:', error);

    // 錯誤時返回基本 sitemap
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://aiziwei.online</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(basicSitemap);
  }
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}
