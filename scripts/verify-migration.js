#!/usr/bin/env node

const { sql } = require('@vercel/postgres');

async function verifyMigration() {
  console.log('🔍 開始驗證 Migration...\n');

  try {
    // 1. 檢查欄位
    console.log('📋 檢查新增的欄位:');
    const columns = await sql`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'blog_posts'
      AND column_name IN ('language', 'translated_from')
      ORDER BY column_name
    `;

    if (columns.rows.length === 0) {
      console.log('❌ 錯誤: 找不到 language 或 translated_from 欄位');
      console.log('   Migration 尚未執行或執行失敗\n');
      process.exit(1);
    }

    columns.rows.forEach(col => {
      console.log(`  ✅ ${col.column_name}:`);
      console.log(`     - 類型: ${col.data_type}`);
      console.log(`     - 預設值: ${col.column_default || 'NULL'}`);
      console.log(`     - 可為空: ${col.is_nullable}`);
    });

    // 2. 檢查索引
    console.log('\n📊 檢查索引:');
    const indexes = await sql`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'blog_posts'
      AND indexname LIKE 'idx_blog_posts_language%'
      ORDER BY indexname
    `;

    if (indexes.rows.length === 0) {
      console.log('  ⚠️  警告: 找不到語言相關的索引');
    } else {
      indexes.rows.forEach(idx => {
        console.log(`  ✅ ${idx.indexname}`);
      });
    }

    // 3. 檢查約束
    console.log('\n🔒 檢查約束:');
    const constraints = await sql`
      SELECT conname, pg_get_constraintdef(oid) as definition
      FROM pg_constraint
      WHERE conrelid = 'blog_posts'::regclass
      AND conname = 'chk_blog_posts_language'
    `;

    if (constraints.rows.length === 0) {
      console.log('  ⚠️  警告: 找不到語言檢查約束');
    } else {
      constraints.rows.forEach(con => {
        console.log(`  ✅ ${con.conname}`);
        console.log(`     ${con.definition}`);
      });
    }

    // 4. 檢查現有資料
    console.log('\n📝 檢查現有文章的語言設定:');
    const posts = await sql`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN language IS NULL THEN 1 END) as null_count,
        COUNT(CASE WHEN language = 'zh-TW' THEN 1 END) as zh_count,
        COUNT(CASE WHEN language = 'en' THEN 1 END) as en_count
      FROM blog_posts
    `;

    const stats = posts.rows[0];
    console.log(`  總文章數: ${stats.total}`);
    console.log(`  語言為 NULL: ${stats.null_count}`);
    console.log(`  中文文章 (zh-TW): ${stats.zh_count}`);
    console.log(`  英文文章 (en): ${stats.en_count}`);

    if (parseInt(stats.null_count) > 0) {
      console.log('\n  ⚠️  警告: 有文章的 language 欄位為 NULL');
      console.log('  請執行以下 SQL 修正:');
      console.log('  UPDATE blog_posts SET language = \'zh-TW\' WHERE language IS NULL;');
    }

    // 總結
    console.log('\n' + '='.repeat(60));
    if (columns.rows.length === 2 && indexes.rows.length >= 2 && constraints.rows.length >= 1) {
      console.log('✅ Migration 驗證成功！');
      console.log('   所有必要的欄位、索引和約束都已正確建立。');

      if (parseInt(stats.null_count) === 0) {
        console.log('   所有文章都已設定語言。');
      }

      console.log('\n🎉 您現在可以使用多語言 Blog API 了！');
      console.log('   查看使用指南: docs/BLOG_API_MULTILINGUAL.md');
      process.exit(0);
    } else {
      console.log('⚠️  Migration 未完全成功');
      console.log('   請檢查上方的警告訊息');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ 驗證失敗:', error.message);
    console.error('\n完整錯誤:', error);
    process.exit(1);
  }
}

verifyMigration();
