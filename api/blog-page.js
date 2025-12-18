/**
 * Blog List Page - Server-Side Rendered
 * Renders the blog list page with all posts for SEO
 */

const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  const { page = 1, tag } = req.query;
  const limit = 9;
  const offset = (parseInt(page) - 1) * limit;

  try {
    // 查詢文章總數
    let countQuery;
    if (tag) {
      countQuery = await sql`
        SELECT COUNT(*) as total
        FROM blog_posts
        WHERE status = 'published' AND ${tag} = ANY(tags)
      `;
    } else {
      countQuery = await sql`
        SELECT COUNT(*) as total
        FROM blog_posts
        WHERE status = 'published'
      `;
    }
    const totalPosts = parseInt(countQuery.rows[0].total);
    const totalPages = Math.ceil(totalPosts / limit);

    // 查詢文章列表
    let postsQuery;
    if (tag) {
      postsQuery = await sql`
        SELECT id, title, excerpt, tags, published_at, created_at, slug
        FROM blog_posts
        WHERE status = 'published' AND ${tag} = ANY(tags)
        ORDER BY published_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      postsQuery = await sql`
        SELECT id, title, excerpt, tags, published_at, created_at, slug
        FROM blog_posts
        WHERE status = 'published'
        ORDER BY published_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const posts = postsQuery.rows;

    // 獲取所有標籤
    const tagsQuery = await sql`
      SELECT DISTINCT unnest(tags) as tag
      FROM blog_posts
      WHERE status = 'published'
    `;
    const allTags = tagsQuery.rows.map(row => row.tag);

    // 渲染 HTML
    const html = renderBlogListPage(posts, allTags, {
      currentPage: parseInt(page),
      totalPages,
      currentTag: tag || null,
      hasPrev: page > 1,
      hasNext: page < totalPages
    });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
    return res.status(200).send(html);

  } catch (error) {
    console.error('渲染部落格列表失敗:', error);
    return res.status(500).send('<h1>伺服器錯誤</h1>');
  }
};

function renderBlogListPage(posts, allTags, pagination) {
  const { currentPage, totalPages, currentTag, hasPrev, hasNext } = pagination;

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary Meta Tags -->
    <title>${currentTag ? `${escapeHtml(currentTag)} - ` : ''}紫微斗數 AI 部落格 | 命理知識分享</title>
    <meta name="description" content="探索紫微斗數的奧秘，AI 生成的命理知識文章，涵蓋每日運勢、星曜解析、命理教學等內容。">
    <meta name="keywords" content="紫微斗數部落格,命理文章,AI命理,每日運勢,星曜解析">
    <meta name="author" content="AI 紫微斗數">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="紫微斗數 AI 部落格">
    <meta property="og:description" content="探索紫微斗數的奧秘，AI 生成的命理知識文章">
    <meta property="og:url" content="https://aiziwei.online/blog">

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <!-- Preconnect to third-party domains -->
    <link rel="preconnect" href="https://pagead2.googlesyndication.com">

    <!-- Preload critical CSS -->
    <link rel="preload" href="/styles.css" as="style">
    <link rel="stylesheet" href="/styles.css">

    <!-- Google AdSense -->
    <meta name="google-adsense-account" content="ca-pub-3240143153468832">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3240143153468832"
            crossorigin="anonymous"></script>

    <style>
        .blog-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .blog-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(147, 51, 234, 0.15);
        }
        .tag-badge {
            transition: background-color 0.2s ease;
        }
        .tag-badge:hover {
            background-color: #7c3aed;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-purple-50 via-white to-purple-50 min-h-screen">

    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <a href="/" class="text-2xl font-bold text-purple-600">AI 紫微斗數</a>
                <span class="text-gray-400">|</span>
                <span class="text-lg text-gray-600">部落格</span>
            </div>
            <nav class="flex space-x-6">
                <a href="/" class="text-gray-600 hover:text-purple-600">首頁</a>
                <a href="/analysis" class="text-gray-600 hover:text-purple-600">命盤計算</a>
                <a href="/blog" class="text-purple-600 font-semibold">部落格</a>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-12">

        <!-- Page Title -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">紫微斗數 AI 部落格</h1>
            <p class="text-lg text-gray-600">探索命理智慧，每日更新運勢與星曜解析</p>
        </div>

        <!-- Top Banner Ad (Desktop) -->
        <div class="hidden md:block my-8">
            <div class="text-center text-xs text-gray-500 mb-2">廣告</div>
            <div class="flex justify-center">
                <ins class="adsbygoogle"
                     style="display:inline-block;width:728px;height:90px"
                     data-ad-client="ca-pub-3240143153468832"
                     data-ad-slot="7607800035"></ins>
            </div>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <!-- Top Banner Ad (Mobile) -->
        <div class="md:hidden my-6">
            <div class="text-center text-xs text-gray-500 mb-2">廣告</div>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-3240143153468832"
                 data-ad-slot="7607800035"
                 data-ad-format="fluid"
                 data-ad-layout-key="-fb+5w+4e-db+86"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <!-- Tag Filter -->
        <div class="flex flex-wrap justify-center gap-2 mb-8">
            <a href="/blog" class="px-4 py-2 rounded-full ${!currentTag ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border'} hover:bg-purple-500 hover:text-white transition-colors">
                全部
            </a>
            ${allTags.slice(0, 15).map(tag => `
            <a href="/blog?tag=${encodeURIComponent(tag)}" class="px-4 py-2 rounded-full ${currentTag === tag ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border'} hover:bg-purple-500 hover:text-white transition-colors">
                ${escapeHtml(tag)}
            </a>
            `).join('')}
        </div>

        <!-- Blog Posts Grid -->
        ${posts.length === 0 ? `
        <div class="text-center py-12">
            <p class="text-xl text-gray-500">目前沒有文章</p>
        </div>
        ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${posts.map((post, index) => `
            <article class="blog-card bg-white rounded-lg shadow-md overflow-hidden">
                <a href="/blog/${post.slug}" class="block p-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                        ${escapeHtml(post.title)}
                    </h2>
                    <p class="text-gray-600 mb-4 line-clamp-3">
                        ${extractPlainText(post.excerpt)}...
                    </p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${post.tags.slice(0, 5).map(tag => `
                        <span class="tag-badge px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            ${escapeHtml(tag)}
                        </span>
                        `).join('')}
                        ${post.tags.length > 5 ? `<span class="text-xs text-gray-500 self-center">+${post.tags.length - 5}</span>` : ''}
                    </div>
                    <div class="flex justify-between items-center text-sm text-gray-500">
                        <span>${formatDate(post.published_at || post.created_at)}</span>
                        <span class="text-purple-600 font-semibold">閱讀更多 →</span>
                    </div>
                </a>
            </article>
            ${(index + 1) % 3 === 0 && index < posts.length - 1 ? `
            <!-- Inline Ad -->
            <div class="col-span-1 md:col-span-2 lg:col-span-3 ${(index + 1) % 6 !== 0 ? 'md:hidden' : ''} my-4">
                <div class="text-center text-xs text-gray-500 mb-2">廣告</div>
                <div class="hidden md:flex justify-center">
                    <ins class="adsbygoogle"
                         style="display:inline-block;width:728px;height:90px"
                         data-ad-client="ca-pub-3240143153468832"
                         data-ad-slot="7607800035"></ins>
                </div>
                <div class="md:hidden">
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-client="ca-pub-3240143153468832"
                         data-ad-slot="7607800035"
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                </div>
                <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
            </div>
            ` : ''}
            `).join('')}
        </div>
        `}

        <!-- Pagination -->
        ${totalPages > 1 ? `
        <div class="flex justify-center items-center space-x-4 mt-12">
            ${hasPrev ? `
            <a href="/blog?page=${currentPage - 1}${currentTag ? `&tag=${encodeURIComponent(currentTag)}` : ''}"
               class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                上一頁
            </a>
            ` : `
            <button class="px-4 py-2 bg-white border border-gray-300 rounded-lg opacity-50 cursor-not-allowed" disabled>
                上一頁
            </button>
            `}
            <span class="text-gray-700">第 ${currentPage} / ${totalPages} 頁</span>
            ${hasNext ? `
            <a href="/blog?page=${currentPage + 1}${currentTag ? `&tag=${encodeURIComponent(currentTag)}` : ''}"
               class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                下一頁
            </a>
            ` : `
            <button class="px-4 py-2 bg-white border border-gray-300 rounded-lg opacity-50 cursor-not-allowed" disabled>
                下一頁
            </button>
            `}
        </div>
        ` : ''}

        <!-- Bottom Banner Ad -->
        <div class="hidden md:block my-12">
            <div class="text-center text-xs text-gray-500 mb-2">廣告</div>
            <div class="flex justify-center">
                <ins class="adsbygoogle"
                     style="display:inline-block;width:728px;height:90px"
                     data-ad-client="ca-pub-3240143153468832"
                     data-ad-slot="5671756041"></ins>
            </div>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <div class="md:hidden my-8">
            <div class="text-center text-xs text-gray-500 mb-2">廣告</div>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-3240143153468832"
                 data-ad-slot="5671756041"
                 data-ad-format="fluid"
                 data-ad-layout-key="-fb+5w+4e-db+86"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-16">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2025 AI 紫微斗數. All rights reserved.</p>
            <div class="mt-4 space-x-6">
                <a href="/privacy-policy" class="hover:text-purple-400">隱私政策</a>
                <a href="/pricing" class="hover:text-purple-400">價格方案</a>
            </div>
        </div>
    </footer>

</body>
</html>`;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function extractPlainText(markdown) {
  return markdown.replace(/[#*_`\[\]]/g, '').substring(0, 150);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
