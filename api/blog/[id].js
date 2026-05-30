/**
 * Vercel Serverless Function - Blog Post Operations
 * API Routes:
 *   - POST /api/blog/create - 新增文章 (auth required)
 *   - GET /api/blog/[id] - 取得單篇文章 (public)
 *   - PUT /api/blog/[id] - 更新文章 (auth required)
 *   - DELETE /api/blog/[id] - 刪除文章 (auth required)
 *
 * [id] 可以是 UUID 或 slug，或 'create' 用於新增
 */

const { sql } = require('@vercel/postgres');
const { verifyBearerToken } = require('../../lib/auth');
const { setCorsHeaders, handleOptions } = require('../../lib/cors');
const slugify = require('slugify');

module.exports = async function handler(req, res) {
  console.log(`📄 Blog [${req.method}] API`);

  // 設定 CORS
  setCorsHeaders(req, res);
  if (handleOptions(req, res)) return;

  // 從 URL 取得 ID (slug 或 UUID)
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      success: false,
      error: '缺少文章 ID'
    });
  }

  try {
    // POST /api/blog/create - 新增文章
    if (req.method === 'POST' && id === 'create') {
      return await handleCreate(req, res);
    } else if (req.method === 'GET') {
      return await handleGet(id, res);
    } else if (req.method === 'PUT') {
      return await handleUpdate(id, req, res);
    } else if (req.method === 'DELETE') {
      return await handleDelete(id, req, res);
    } else {
      return res.status(405).json({
        success: false,
        error: '不支援的請求方法'
      });
    }
  } catch (error) {
    console.error(`❌ Blog [${req.method}] 錯誤:`, error);
    return res.status(500).json({
      success: false,
      error: '伺服器錯誤：' + error.message
    });
  }
};

// POST - 新增文章 (需認證)
async function handleCreate(req, res) {
  console.log('✍️ 新增文章');

  // 驗證認證
  const authHeader = req.headers.authorization;
  await verifyBearerToken(authHeader);

  const { title, titles, content, tags, status, language, translated_from } = req.body;
  const finalTitle = title || titles;

  // 驗證必填欄位
  if (!finalTitle || !content) {
    return res.status(400).json({
      success: false,
      error: '缺少必填欄位：title 或 content'
    });
  }

  // 驗證語言參數 (預設為 zh-TW)
  const validLanguages = ['zh-TW', 'en'];
  const finalLanguage = language && validLanguages.includes(language) ? language : 'zh-TW';

  // 驗證 translated_from 參數 (如果提供)
  if (translated_from) {
    const originalPost = await sql`
      SELECT id FROM blog_posts WHERE id::text = ${translated_from}
    `;
    if (originalPost.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'translated_from 指向的原始文章不存在'
      });
    }
  }

  // 生成 slug (支援中文)
  let baseSlug = finalTitle
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')           // 空格轉換為連字符
    .replace(/[^\w\u4e00-\u9fa5-]/g, '-')  // 保留英文、數字、中文和連字符
    .replace(/-+/g, '-')              // 多個連字符合併為一個
    .replace(/^-+|-+$/g, '');         // 移除開頭和結尾的連字符

  // 如果 slug 為空（純符號標題），使用時間戳
  if (!baseSlug) {
    baseSlug = `post-${Date.now()}`;
  }

  // 檢查 slug 在同語言下是否重複，若重複則加上數字後綴
  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const existing = await sql`
      SELECT id FROM blog_posts WHERE slug = ${slug} AND language = ${finalLanguage}
    `;

    if (existing.rows.length === 0) {
      isUnique = true;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  // 處理 tags
  const tagsArray = parseTags(tags);

  // 插入文章
  const result = await sql`
    INSERT INTO blog_posts (title, slug, content, tags, status, published_at, language, translated_from)
    VALUES (
      ${finalTitle},
      ${slug},
      ${content},
      ${JSON.stringify(tagsArray)}::jsonb,
      ${status || 'draft'},
      ${status === 'published' ? new Date().toISOString() : null},
      ${finalLanguage},
      ${translated_from || null}
    )
    RETURNING *
  `;

  const createdPost = result.rows[0];
  console.log(`✅ 文章新增成功 (${finalLanguage}):`, createdPost.title);

  // 自動翻譯：zh-TW published 文章 → 建立英文版本
  let translationResult = null;
  if (finalLanguage === 'zh-TW' && createdPost.status === 'published' && !translated_from) {
    try {
      translationResult = await autoTranslateToEnglish(createdPost);
      if (translationResult) {
        console.log('🌐 英文版本建立成功:', translationResult.title);
      }
    } catch (err) {
      console.error('⚠️ 自動翻譯失敗（不影響中文文章）:', err.message);
    }
  }

  return res.status(201).json({
    success: true,
    message: '文章新增成功',
    data: {
      ...createdPost,
      url: `/${finalLanguage}/blog/${createdPost.slug}`,
      translation: translationResult
        ? { id: translationResult.id, slug: translationResult.slug, url: `/en/blog/${translationResult.slug}` }
        : null
    }
  });
}

// GET - 取得單篇文章 (公開)
async function handleGet(id, res) {
  console.log('🔍 取得文章:', id);

  // 支援 slug 或 UUID
  const result = await sql`
    SELECT * FROM blog_posts
    WHERE (slug = ${id} OR id::text = ${id})
    AND status = 'published'
  `;

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: '文章不存在'
    });
  }

  const post = result.rows[0];

  console.log('✅ 找到文章:', post.title);

  return res.status(200).json({
    success: true,
    data: post
  });
}

// PUT - 更新文章 (需認證)
async function handleUpdate(id, req, res) {
  console.log('✏️ 更新文章:', id);

  // 驗證認證
  const authHeader = req.headers.authorization;
  await verifyBearerToken(authHeader);

  const { title, titles, content, tags, status } = req.body;
  const finalTitle = title || titles;

  // 建立更新欄位
  const updates = [];
  const values = [];

  if (finalTitle !== undefined) {
    updates.push('title = $' + (values.length + 1));
    values.push(finalTitle);

    // 更新 slug (支援中文)
    let newSlug = finalTitle
      .toLowerCase()
      .trim()
      .replace(/[\s]+/g, '-')           // 空格轉換為連字符
      .replace(/[^\w\u4e00-\u9fa5-]/g, '-')  // 保留英文、數字、中文和連字符
      .replace(/-+/g, '-')              // 多個連字符合併為一個
      .replace(/^-+|-+$/g, '');         // 移除開頭和結尾的連字符

    // 如果 slug 為空，使用時間戳
    if (!newSlug) {
      newSlug = `post-${Date.now()}`;
    }

    updates.push('slug = $' + (values.length + 1));
    values.push(newSlug);
  }

  if (content !== undefined) {
    updates.push('content = $' + (values.length + 1));
    values.push(content);
  }

  if (tags !== undefined) {
    updates.push('tags = $' + (values.length + 1) + '::jsonb');
    const tagsArray = parseTags(tags);
    values.push(JSON.stringify(tagsArray));
  }

  if (status !== undefined) {
    updates.push('status = $' + (values.length + 1));
    values.push(status);

    if (status === 'published') {
      updates.push('published_at = NOW()');
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      error: '沒有要更新的欄位'
    });
  }

  updates.push('updated_at = NOW()');
  values.push(id);

  const query = `
    UPDATE blog_posts
    SET ${updates.join(', ')}
    WHERE id::text = $${values.length} OR slug = $${values.length}
    RETURNING *
  `;

  const result = await sql.query(query, values);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: '文章不存在'
    });
  }

  const updatedPost = result.rows[0];
  console.log('✅ 文章更新成功');

  // 草稿發布時自動翻譯（zh-TW 且剛從非 published 改為 published）
  let translationResult = null;
  if (status === 'published' && updatedPost.language === 'zh-TW' && !updatedPost.translated_from) {
    try {
      translationResult = await autoTranslateToEnglish(updatedPost);
      if (translationResult) {
        console.log('🌐 英文版本建立成功:', translationResult.title);
      }
    } catch (err) {
      console.error('⚠️ 自動翻譯失敗（不影響更新）:', err.message);
    }
  }

  return res.status(200).json({
    success: true,
    message: '文章更新成功',
    data: {
      ...updatedPost,
      translation: translationResult
        ? { id: translationResult.id, slug: translationResult.slug, url: `/en/blog/${translationResult.slug}` }
        : null
    }
  });
}

// DELETE - 刪除文章 (需認證)
async function handleDelete(id, req, res) {
  console.log('🗑️ 刪除文章:', id);

  // 驗證認證
  const authHeader = req.headers.authorization;
  await verifyBearerToken(authHeader);

  const result = await sql`
    DELETE FROM blog_posts
    WHERE id::text = ${id} OR slug = ${id}
    RETURNING id, title
  `;

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: '文章不存在'
    });
  }

  console.log('✅ 文章刪除成功:', result.rows[0].title);

  return res.status(200).json({
    success: true,
    message: '文章刪除成功',
    data: result.rows[0]
  });
}

/**
 * 自動將 zh-TW 文章翻譯並建立英文版本
 * 使用 GPT-4o-mini（速度快、成本低，翻譯品質足夠）
 */
async function autoTranslateToEnglish(zhPost) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('⚠️ OPENAI_API_KEY 未設定，跳過自動翻譯');
    return null;
  }

  // 確認英文版本尚未存在
  const existing = await sql`
    SELECT id FROM blog_posts WHERE translated_from = ${zhPost.id} AND language = 'en'
  `;
  if (existing.rows.length > 0) {
    console.log('⚠️ 英文版本已存在，跳過翻譯');
    return null;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
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
          content: `Translate this Zi Wei Dou Shu blog article from Traditional Chinese to English.\n\nReturn a JSON object with exactly these two fields:\n{"title": "...", "content": "..."}\n\nTitle: ${zhPost.title}\n\nContent:\n${zhPost.content}`
        }
      ],
      max_tokens: 3000,
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API 錯誤: ${response.status} - ${JSON.stringify(err)}`);
  }

  const aiData = await response.json();
  const translated = JSON.parse(aiData.choices[0].message.content);

  if (!translated.title || !translated.content) {
    throw new Error('翻譯結果格式不正確');
  }

  // 生成英文 slug
  let baseSlug = translated.title
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || `post-${Date.now()}`;

  // 確保英文 slug 不重複
  let enSlug = baseSlug;
  let counter = 1;
  let isUnique = false;
  while (!isUnique) {
    const dup = await sql`SELECT id FROM blog_posts WHERE slug = ${enSlug} AND language = 'en'`;
    if (dup.rows.length === 0) {
      isUnique = true;
    } else {
      enSlug = `${baseSlug}-${counter++}`;
    }
  }

  const enResult = await sql`
    INSERT INTO blog_posts (title, slug, content, tags, status, published_at, language, translated_from)
    VALUES (
      ${translated.title},
      ${enSlug},
      ${translated.content},
      ${JSON.stringify(zhPost.tags || [])}::jsonb,
      ${zhPost.status},
      ${zhPost.status === 'published' ? new Date().toISOString() : null},
      'en',
      ${zhPost.id}
    )
    RETURNING id, title, slug
  `;

  return enResult.rows[0];
}

/**
 * 安全解析標籤
 * 支援 JSON 陣列字串 或 逗號分隔字串
 */
function parseTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags !== 'string') return [];

  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    // 如果不是有效的 JSON，視為逗號分隔字串
    return tags.split(',').map(t => t.trim()).filter(t => t);
  }
}
