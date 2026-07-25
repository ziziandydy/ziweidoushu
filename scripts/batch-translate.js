/**
 * 批次補翻腳本：將所有 zh-TW published 文章翻譯成英文
 * 用法：node scripts/batch-translate.js
 *
 * - 自動跳過已有英文版本的文章
 * - 並發 5 篇（避免 rate limit）
 * - 單篇失敗不影響其他篇
 * - 可重複執行（幂等）
 */

// 2026-07-25 起停用：未經審校的機翻內容屬 AdSense 低價值內容（見 docs/deprecations-2026-07.md）。
if (process.env.FORCE_TRANSLATE !== '1') {
    console.error('batch-translate 已停用。確定要跑請設 FORCE_TRANSLATE=1（僅限人工審校流程）。');
    process.exit(1);
}

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fetch = require('node-fetch');

const pool = new Pool({ connectionString: process.env.DATABASE_URL_UNPOOLED });
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const CONCURRENCY = 5;

async function translateArticle(post) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator specializing in Traditional Chinese astrology, specifically Zi Wei Dou Shu (Purple Star Astrology). Translate accurately while preserving all Markdown formatting. Keep key Chinese astrology terms in both English and Chinese on first mention, e.g. "紫微星 (Zi Wei Star)". Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: `Translate this Zi Wei Dou Shu blog article from Traditional Chinese to English.\n\nReturn a JSON object with exactly these two fields:\n{"title": "...", "content": "..."}\n\nTitle: ${post.title}\n\nContent:\n${post.content}`
        }
      ],
      max_tokens: 8000,
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`OpenAI ${response.status}: ${JSON.stringify(err)}`);
  }

  const data = await response.json();
  const translated = JSON.parse(data.choices[0].message.content);

  if (!translated.title || !translated.content) {
    throw new Error('翻譯結果格式不正確');
  }

  return translated;
}

async function generateUniqueSlug(client, title) {
  let base = title
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || `post-${Date.now()}`;

  // 截斷過長的 slug
  if (base.length > 80) base = base.substring(0, 80).replace(/-+$/, '');

  let slug = base;
  let counter = 1;
  while (true) {
    const { rows } = await client.query(
      'SELECT id FROM blog_posts WHERE slug = $1 AND language = $2',
      [slug, 'en']
    );
    if (rows.length === 0) return slug;
    slug = `${base}-${counter++}`;
  }
}

async function processPost(post, index, total) {
  const client = await pool.connect();
  try {
    // 再次確認英文版本不存在（避免並發重複）
    const { rows: existing } = await client.query(
      'SELECT id FROM blog_posts WHERE translated_from = $1 AND language = $2',
      [post.id, 'en']
    );
    if (existing.length > 0) {
      console.log(`  [${index}/${total}] 跳過（英文已存在）: ${post.title.substring(0, 40)}`);
      return { skipped: true };
    }

    const translated = await translateArticle(post);
    const slug = await generateUniqueSlug(client, translated.title);

    await client.query(
      `INSERT INTO blog_posts (title, slug, content, tags, status, published_at, language, translated_from)
       VALUES ($1, $2, $3, $4::jsonb, $5, $6, 'en', $7)`,
      [
        translated.title,
        slug,
        translated.content,
        JSON.stringify(post.tags || []),
        post.status,
        post.published_at,
        post.id
      ]
    );

    console.log(`  [${index}/${total}] ✅ ${post.title.substring(0, 35)} → ${translated.title.substring(0, 35)}`);
    return { success: true };
  } catch (err) {
    console.error(`  [${index}/${total}] ❌ 失敗: ${post.title.substring(0, 40)} — ${err.message}`);
    return { failed: true, error: err.message, postId: post.id };
  } finally {
    client.release();
  }
}

async function runInChunks(items, concurrency, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    const chunkResults = await Promise.all(chunk.map((item, j) => fn(item, i + j + 1, items.length)));
    results.push(...chunkResults);
    // 短暫停頓避免 rate limit
    if (i + concurrency < items.length) await new Promise(r => setTimeout(r, 500));
  }
  return results;
}

async function main() {
  if (!OPENAI_KEY) {
    console.error('❌ OPENAI_API_KEY 未設定');
    process.exit(1);
  }

  const isTest = process.argv.includes('--test');
  const limitClause = isTest ? 'LIMIT 3' : '';
  if (isTest) console.log('🧪 測試模式：只翻譯前 3 篇\n');

  const client = await pool.connect();
  let posts;
  try {
    const { rows } = await client.query(`
      SELECT zh.id, zh.title, zh.content, zh.tags, zh.status, zh.published_at
      FROM blog_posts zh
      LEFT JOIN blog_posts e ON e.translated_from = zh.id AND e.language = 'en'
      WHERE zh.language = 'zh-TW'
        AND zh.status = 'published'
        AND e.id IS NULL
      ORDER BY zh.published_at DESC
      ${limitClause}
    `);
    posts = rows;
  } finally {
    client.release();
  }

  if (posts.length === 0) {
    console.log('✅ 所有文章都已有英文版本，無需補翻。');
    await pool.end();
    return;
  }

  console.log(`\n🌐 開始批次翻譯 ${posts.length} 篇文章（並發 ${CONCURRENCY}）\n`);
  const startTime = Date.now();

  const results = await runInChunks(posts, CONCURRENCY, processPost);

  const succeeded = results.filter(r => r.success).length;
  const skipped = results.filter(r => r.skipped).length;
  const failed = results.filter(r => r.failed);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n── 完成 ──`);
  console.log(`✅ 成功: ${succeeded} 篇`);
  if (skipped > 0) console.log(`⏭️  跳過: ${skipped} 篇（已有英文版本）`);
  if (failed.length > 0) {
    console.log(`❌ 失敗: ${failed.length} 篇`);
    failed.forEach(f => console.log(`   - ${f.postId}: ${f.error}`));
  }
  console.log(`⏱️  耗時: ${elapsed}s`);

  await pool.end();
}

main().catch(err => {
  console.error('腳本執行失敗:', err);
  process.exit(1);
});
