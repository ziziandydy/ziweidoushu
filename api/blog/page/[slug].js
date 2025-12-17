/**
 * Vercel Serverless Function - Render Blog Post Page
 * API Route: GET /blog/[slug]
 *
 * 動態渲染部落格文章頁面
 */

const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  const { slug } = req.query;

  try {
    // 查詢文章
    const result = await sql`
      SELECT * FROM blog_posts
      WHERE slug = ${slug} AND status = 'published'
    `;

    if (result.rows.length === 0) {
      return res.status(404).send(render404Page());
    }

    const post = result.rows[0];
    return res.status(200).send(renderBlogPage(post));

  } catch (error) {
    console.error('渲染文章頁面失敗:', error);
    return res.status(500).send('<h1>伺服器錯誤</h1>');
  }
};

function renderBlogPage(post) {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(post.title)} | AI 紫微斗數部落格</title>
    <meta name="description" content="${escapeHtml(extractPlainText(post.content).substring(0, 160))}">
    <meta property="og:title" content="${escapeHtml(post.title)}">
    <meta property="og:description" content="${escapeHtml(extractPlainText(post.content).substring(0, 160))}">
    <meta property="og:type" content="article">
    <meta property="article:published_time" content="${post.published_at}">

    <link rel="icon" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>

    <!-- Google AdSense -->
    <meta name="google-adsense-account" content="ca-pub-3240143153468832">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3240143153468832"
            crossorigin="anonymous"></script>

    <style>
        .prose { max-width: 65ch; }
        .prose h1 { font-size: 2em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; color: #1f2937; }
        .prose h2 { font-size: 1.5em; font-weight: bold; margin-top: 1.5em; margin-bottom: 0.5em; color: #374151; }
        .prose h3 { font-size: 1.25em; font-weight: bold; margin-top: 1.25em; margin-bottom: 0.5em; color: #4b5563; }
        .prose p { margin-bottom: 1em; line-height: 1.75; color: #374151; }
        .prose ul, .prose ol { margin-left: 1.5em; margin-bottom: 1em; }
        .prose li { margin-bottom: 0.5em; }
        .prose strong { font-weight: bold; color: #1f2937; }
        .prose em { font-style: italic; }
        .prose code { background: #f3f4f6; padding: 0.2em 0.4em; border-radius: 0.25em; font-family: monospace; }
        .prose pre { background: #1f2937; color: #f3f4f6; padding: 1em; border-radius: 0.5em; overflow-x: auto; }
        .prose blockquote { border-left: 4px solid #9333ea; padding-left: 1em; color: #6b7280; font-style: italic; }
        .prose a {
            color: #7c3aed;
            text-decoration: underline;
            text-underline-offset: 2px;
            transition: color 0.2s ease;
        }
        .prose a:hover {
            color: #5b21b6;
            text-decoration-thickness: 2px;
        }
        .prose a:visited {
            color: #6d28d9;
        }
    </style>
</head>
<body class="bg-gray-50">

    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" class="text-2xl font-bold text-purple-600">AI 紫微斗數</a>
            <nav class="flex space-x-6">
                <a href="/" class="text-gray-600 hover:text-purple-600">首頁</a>
                <a href="/blog" class="text-gray-600 hover:text-purple-600">部落格</a>
            </nav>
        </div>
    </header>

    <!-- Article -->
    <article class="max-w-4xl mx-auto px-4 py-12">

        <!-- Title -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">${escapeHtml(post.title)}</h1>

        <!-- Meta -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-500 mb-8">
            <span class="text-sm">${formatDate(post.published_at || post.created_at)}</span>
            <span class="hidden sm:inline">•</span>
            <div class="flex flex-wrap gap-2">
                ${post.tags.map(tag => `
                    <a href="/blog?tag=${encodeURIComponent(tag)}"
                       class="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full hover:bg-purple-200 transition-colors whitespace-nowrap"
                       title="${escapeHtml(tag)}">
                        ${escapeHtml(tag)}
                    </a>
                `).join('')}
            </div>
        </div>

        <!-- Mobile Top Ad (Between title and content) -->
        <div class="xl:hidden my-8">
            <div class="text-center text-xs text-gray-500 mb-2">廣告</div>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-3240143153468832"
                 data-ad-slot="7607800035"
                 data-ad-format="fluid"
                 data-ad-layout-key="-fb+5w+4e-db+86"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <!-- Content -->
        <div id="content" class="prose prose-lg max-w-none bg-white rounded-lg shadow-sm p-8">
            <!-- Markdown will be rendered here -->
        </div>

        <!-- Mobile Bottom Ad (Above back button) -->
        <div class="xl:hidden my-8">
            <div class="text-center text-xs text-gray-500 mb-2">廣告</div>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-3240143153468832"
                 data-ad-slot="5671756041"
                 data-ad-format="fluid"
                 data-ad-layout-key="-fb+5w+4e-db+86"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>

        <!-- Back Link -->
        <div class="mt-12 text-center">
            <a href="/blog" class="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                ← 返回部落格列表
            </a>
        </div>

    </article>

    <script>
        // 渲染 Markdown
        const content = ${JSON.stringify(post.content)};
        const html = marked.parse(content);
        const clean = DOMPurify.sanitize(html);
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = clean;

        // 在手機版插入中間廣告（約 50% 位置）
        if (window.innerWidth < 1280) {
            const allElements = contentDiv.children;
            if (allElements.length > 3) {
                const midPoint = Math.floor(allElements.length / 2);
                const midAd = document.createElement('div');
                midAd.className = 'my-8 not-prose';
                midAd.innerHTML = \`
                    <div class="text-center text-xs text-gray-500 mb-2">廣告</div>
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-client="ca-pub-3240143153468832"
                         data-ad-slot="7607800035"
                         data-ad-format="fluid"
                         data-ad-layout-key="-fb+5w+4e-db+86"></ins>
                \`;

                // 插入廣告到中間位置
                allElements[midPoint].parentNode.insertBefore(midAd, allElements[midPoint]);

                // 初始化廣告
                (adsbygoogle = window.adsbygoogle || []).push({});
            }
        }
    </script>

    <!-- Left Sidebar Ad -->
    <div class="fixed left-4 top-1/2 transform -translate-y-1/2 hidden xl:block w-40 h-96 z-10">
        <div class="h-full flex flex-col">
            <div class="text-center text-xs text-gray-500 mb-2 flex-shrink-0">廣告</div>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 flex-1 flex items-center justify-center">
                <ins class="adsbygoogle w-full" style="display:block" data-ad-client="ca-pub-3240143153468832"
                    data-ad-slot="7607800035" data-ad-format="auto" data-full-width-responsive="true"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
        </div>
    </div>

    <!-- Right Sidebar Ad -->
    <div class="fixed right-4 top-1/2 transform -translate-y-1/2 hidden xl:block w-40 h-96 z-10">
        <div class="h-full flex flex-col">
            <div class="text-center text-xs text-gray-500 mb-2 flex-shrink-0">廣告</div>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-2 flex-1 flex items-center justify-center">
                <ins class="adsbygoogle w-full" style="display:block" data-ad-format="autorelaxed"
                    data-ad-client="ca-pub-3240143153468832" data-ad-slot="5671756041"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
        </div>
    </div>

</body>
</html>`;
}

function render404Page() {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>文章不存在 | AI 紫微斗數</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen">
    <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p class="text-xl text-gray-600 mb-8">找不到此文章</p>
        <a href="/blog" class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            返回部落格
        </a>
    </div>
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
  return markdown.replace(/[#*_`\[\]]/g, '');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
