/**
 * Migration Script: Fix Empty Slugs for Chinese Titles
 *
 * This script finds blog posts with empty or invalid slugs and regenerates them
 * using the new Chinese-compatible slug generation logic.
 */

const { sql } = require('@vercel/postgres');

function generateSlug(title) {
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) {
    slug = `post-${Date.now()}`;
  }

  return slug;
}

async function fixEmptySlugs() {
  try {
    console.log('🔍 查詢需要修復的文章...');

    // Find posts with empty or null slugs
    const postsToFix = await sql`
      SELECT id, title, slug, language
      FROM blog_posts
      WHERE slug IS NULL OR slug = '' OR LENGTH(slug) = 0
      ORDER BY created_at DESC
    `;

    const count = postsToFix.rows.length;

    if (count === 0) {
      console.log('✅ 沒有需要修復的文章！所有文章都有有效的 slug。');
      return;
    }

    console.log(`📝 找到 ${count} 篇需要修復的文章\n`);

    for (const post of postsToFix.rows) {
      const newSlug = generateSlug(post.title);

      console.log(`修復文章: "${post.title}"`);
      console.log(`  舊 slug: "${post.slug || '(空)'}"`);
      console.log(`  新 slug: "${newSlug}"`);

      // Check if new slug already exists for this language
      let finalSlug = newSlug;
      let counter = 1;
      let isUnique = false;

      while (!isUnique) {
        const existing = await sql`
          SELECT id FROM blog_posts
          WHERE slug = ${finalSlug}
          AND language = ${post.language}
          AND id != ${post.id}
        `;

        if (existing.rows.length === 0) {
          isUnique = true;
        } else {
          finalSlug = `${newSlug}-${counter}`;
          counter++;
          console.log(`  ⚠️  Slug 重複，嘗試: "${finalSlug}"`);
        }
      }

      // Update the post
      await sql`
        UPDATE blog_posts
        SET slug = ${finalSlug}, updated_at = NOW()
        WHERE id = ${post.id}
      `;

      console.log(`  ✅ 已更新為: "${finalSlug}"\n`);
    }

    console.log(`\n🎉 成功修復 ${count} 篇文章的 slug！`);

  } catch (error) {
    console.error('❌ 修復失敗:', error);
    throw error;
  }
}

// Run the migration
fixEmptySlugs()
  .then(() => {
    console.log('\n✨ Migration 完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration 失敗:', error);
    process.exit(1);
  });
