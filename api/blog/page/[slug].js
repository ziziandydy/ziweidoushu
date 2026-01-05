/**
 * Vercel Serverless Function - Render Blog Post Page
 * API Route: GET /blog/[slug]
 *
 * 動態渲染部落格文章頁面 (支援多語言)
 */

const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  const { slug, locale } = req.query;

  // Determine language (from locale parameter or default to zh-TW)
  const language = (locale === 'en') ? 'en' : 'zh-TW';

  try {
    // 查詢文章 (by slug and language)
    const result = await sql`
      SELECT * FROM blog_posts
      WHERE slug = ${slug} AND language = ${language} AND status = 'published'
    `;

    if (result.rows.length === 0) {
      return res.status(404).send(render404Page(language));
    }

    const post = result.rows[0];
    return res.status(200).send(renderBlogPage(post, language));

  } catch (error) {
    console.error('渲染文章頁面失敗:', error);
    return res.status(500).send(renderErrorPage(language));
  }
};

function renderBlogPage(post, language) {
  const lang = language === 'en' ? 'en' : 'zh-TW';
  const blogPath = `/${lang}/blog`;

  // i18n strings
  const t = language === 'en' ? {
    siteName: 'AI Zi Wei Dou Shu',
    blog: 'Blog',
    home: 'Home',
    backToBlog: '← Back to Blog List',
    advertisement: 'Advertisement',
    metaTitle: `${post.title} | AI Zi Wei Dou Shu Blog`
  } : {
    siteName: 'AI 紫微斗數',
    blog: '部落格',
    home: '首頁',
    backToBlog: '← 返回部落格列表',
    advertisement: '廣告',
    metaTitle: `${post.title} | AI 紫微斗數部落格`
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Multilingual Support -->
    <link rel="alternate" hreflang="zh-TW" href="https://aiziwei.online/zh-TW/blog/${post.slug}">
    <link rel="alternate" hreflang="en" href="https://aiziwei.online/en/blog/${post.slug}">
    <link rel="alternate" hreflang="x-default" href="https://aiziwei.online/zh-TW/blog/${post.slug}">

    <!-- Primary Meta Tags -->
    <title>${escapeHtml(t.metaTitle)}</title>
    <meta name="description" content="${escapeHtml(extractPlainText(post.content).substring(0, 160))}">

    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(post.title)}">
    <meta property="og:description" content="${escapeHtml(extractPlainText(post.content).substring(0, 160))}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://aiziwei.online${blogPath}/${post.slug}">
    <meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'zh_TW'}">
    <meta property="article:published_time" content="${post.published_at}">

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
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
        .prose code { background: #f3f4f6; padding: 0.2em 0.4em; border-radius: 0.25em; font-family: monospace; font-size: 0.9em; }
        .prose pre { background: #1f2937; color: #f3f4f6; padding: 1em; border-radius: 0.5em; overflow-x: auto; margin: 1em 0; }
        .prose pre code { background: transparent; padding: 0; }
        .prose blockquote { border-left: 4px solid #9333ea; padding-left: 1em; color: #6b7280; font-style: italic; margin: 1em 0; }
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

        /* 表格樣式 */
        .prose table {
            width: 100%;
            max-width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            font-size: 0.9em;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border-radius: 0.5em;
            overflow: hidden;
        }
        .prose thead {
            background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
        }
        .prose th {
            padding: 0.75em 1em;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #9333ea;
            border-right: 1px solid #e5e7eb;
        }
        .prose th:last-child {
            border-right: none;
        }
        .prose td {
            padding: 0.75em 1em;
            border-bottom: 1px solid #e5e7eb;
            border-right: 1px solid #f3f4f6;
            color: #4b5563;
            line-height: 1.6;
        }
        .prose td:last-child {
            border-right: none;
        }
        .prose tr:hover {
            background-color: #faf5ff;
        }
        .prose tbody tr:last-child td {
            border-bottom: none;
        }

        /* 目錄 (TOC) 樣式 */
        .prose .toc {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-left: 4px solid #9333ea;
            border-radius: 0.5em;
            padding: 1.5em;
            margin: 2em 0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .prose .toc h2 {
            margin-top: 0;
            margin-bottom: 0.75em;
            color: #9333ea;
            font-size: 1.25em;
            border-bottom: 2px solid #9333ea;
            padding-bottom: 0.5em;
        }
        .prose .toc ul {
            margin: 0;
            padding-left: 0;
            list-style: none;
        }
        .prose .toc ul ul {
            margin-top: 0.5em;
            padding-left: 1.5em;
            border-left: 2px solid #e5e7eb;
        }
        .prose .toc li {
            margin-bottom: 0.5em;
            position: relative;
        }
        .prose .toc li::before {
            content: '▸';
            color: #9333ea;
            font-weight: bold;
            margin-right: 0.5em;
        }
        .prose .toc ul ul li::before {
            content: '▹';
            color: #a855f7;
        }
        .prose .toc a {
            color: #4b5563;
            text-decoration: none;
            transition: all 0.2s ease;
            padding: 0.25em 0.5em;
            border-radius: 0.25em;
            display: inline-block;
        }
        .prose .toc a:hover {
            color: #7c3aed;
            background-color: #faf5ff;
            text-decoration: none;
            transform: translateX(3px);
        }

        /* 標題錨點樣式 */
        .prose h1[id], .prose h2[id], .prose h3[id], .prose h4[id], .prose h5[id], .prose h6[id] {
            scroll-margin-top: 5rem;
        }
    </style>
</head>
<body class="bg-gray-50">

    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="${blogPath.replace('/blog', '')}" class="text-2xl font-bold text-purple-600">${t.siteName}</a>
            <nav class="flex space-x-6">
                <a href="${blogPath.replace('/blog', '')}" class="text-gray-600 hover:text-purple-600">${t.home}</a>
                <a href="${blogPath}" class="text-gray-600 hover:text-purple-600">${t.blog}</a>
            </nav>
        </div>
    </header>

    <!-- Article -->
    <article class="max-w-4xl mx-auto px-4 py-12">

        <!-- Title -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">${escapeHtml(post.title)}</h1>

        <!-- Meta -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-500 mb-8">
            <span class="text-sm">${formatDate(post.published_at || post.created_at, lang)}</span>
            <span class="hidden sm:inline">•</span>
            <div class="flex flex-wrap gap-2">
                ${post.tags.map(tag => `
                    <a href="${blogPath}?tag=${encodeURIComponent(tag)}"
                       class="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full hover:bg-purple-200 transition-colors whitespace-nowrap"
                       title="${escapeHtml(tag)}">
                        ${escapeHtml(tag)}
                    </a>
                `).join('')}
            </div>
        </div>

        <!-- Mobile Top Ad (Between title and content) -->
        <div class="xl:hidden my-8">
            <div class="text-center text-xs text-gray-500 mb-2">${t.advertisement}</div>
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
            <div class="text-center text-xs text-gray-500 mb-2">${t.advertisement}</div>
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
            <a href="${blogPath}" class="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                ${t.backToBlog}
            </a>
        </div>

    </article>

    <script>
        /**
         * 生成目錄 (TOC)
         */
        function generateTOC(content) {
            const headings = [];
            const lines = content.split('\\n');

            lines.forEach((line) => {
                const match = line.match(/^(#{1,6})\\s+(.+)$/);
                if (match) {
                    const level = match[1].length;
                    const text = match[2].trim();
                    const id = text
                        .toLowerCase()
                        .replace(/[^\\w\\u4e00-\\u9fa5]+/g, '-')
                        .replace(/^-+|-+$/g, '');

                    headings.push({ level, text, id });
                }
            });

            if (headings.length === 0) return null;

            let tocHtml = '<div class="toc"><h2>目錄</h2><ul>';
            let currentLevel = 0;

            headings.forEach((heading, index) => {
                const nextLevel = headings[index + 1]?.level || 0;

                while (currentLevel < heading.level) {
                    if (currentLevel > 0) tocHtml += '<ul>';
                    currentLevel++;
                }
                while (currentLevel > heading.level) {
                    tocHtml += '</ul>';
                    currentLevel--;
                }

                tocHtml += \`<li><a href="#\${heading.id}">\${heading.text}</a>\`;

                if (nextLevel <= heading.level) {
                    tocHtml += '</li>';
                }
            });

            while (currentLevel > 0) {
                tocHtml += '</ul>';
                currentLevel--;
            }

            tocHtml += '</ul></div>';
            return tocHtml;
        }

        /**
         * 為標題添加 ID
         */
        function addHeadingIds(html) {
            return html.replace(/<h([1-6])>(.*?)<\\/h\\1>/g, (match, level, text) => {
                const id = text
                    .replace(/<[^>]+>/g, '')
                    .toLowerCase()
                    .replace(/[^\\w\\u4e00-\\u9fa5]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                return \`<h\${level} id="\${id}">\${text}</h\${level}>\`;
            });
        }

        // 渲染 Markdown
        let content = ${JSON.stringify(post.content)};

        // 檢查並處理 [TOC]
        if (/\\[TOC\\]/i.test(content)) {
            const toc = generateTOC(content);
            if (toc) {
                content = content.replace(/\\[TOC\\]/gi, toc);
            }
        }

        let html = marked.parse(content);
        html = addHeadingIds(html);
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
                    <div class="text-center text-xs text-gray-500 mb-2">${t.advertisement}</div>
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
            <div class="text-center text-xs text-gray-500 mb-2 flex-shrink-0">${t.advertisement}</div>
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
            <div class="text-center text-xs text-gray-500 mb-2 flex-shrink-0">${t.advertisement}</div>
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

function render404Page(language) {
  const lang = language === 'en' ? 'en' : 'zh-TW';
  const blogPath = `/${lang}/blog`;

  const t = language === 'en' ? {
    title: 'Article Not Found | AI Zi Wei Dou Shu',
    heading: '404',
    message: 'Article not found',
    backToBlog: 'Back to Blog'
  } : {
    title: '文章不存在 | AI 紫微斗數',
    heading: '404',
    message: '找不到此文章',
    backToBlog: '返回部落格'
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <title>${t.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen">
    <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-800 mb-4">${t.heading}</h1>
        <p class="text-xl text-gray-600 mb-8">${t.message}</p>
        <a href="${blogPath}" class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            ${t.backToBlog}
        </a>
    </div>
</body>
</html>`;
}

function renderErrorPage(language) {
  const lang = language === 'en' ? 'en' : 'zh-TW';
  const blogPath = `/${lang}/blog`;

  const t = language === 'en' ? {
    title: 'Server Error | AI Zi Wei Dou Shu',
    heading: 'Server Error',
    message: 'An error occurred while loading the article',
    backToBlog: 'Back to Blog'
  } : {
    title: '伺服器錯誤 | AI 紫微斗數',
    heading: '伺服器錯誤',
    message: '載入文章時發生錯誤',
    backToBlog: '返回部落格'
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <title>${t.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen">
    <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-800 mb-4">500</h1>
        <p class="text-xl text-gray-600 mb-2">${t.heading}</p>
        <p class="text-gray-500 mb-8">${t.message}</p>
        <a href="${blogPath}" class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            ${t.backToBlog}
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

function formatDate(dateString, locale = 'zh-TW') {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
