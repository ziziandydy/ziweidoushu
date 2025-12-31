#!/usr/bin/env node

/**
 * Migration Runner Script
 * Usage: node scripts/run-migration.js 002
 */

const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

async function runMigration(migrationNumber) {
  const migrationFile = path.join(
    __dirname,
    'migrations',
    `${migrationNumber}-add-language-to-blog-posts.sql`
  );

  console.log('🚀 Starting migration...');
  console.log(`📄 Reading file: ${migrationFile}`);

  if (!fs.existsSync(migrationFile)) {
    console.error(`❌ Migration file not found: ${migrationFile}`);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(migrationFile, 'utf-8');

  try {
    console.log('🔄 Executing migration...');

    // Split SQL by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`  ➜ Executing: ${statement.substring(0, 50)}...`);
        await sql.query(statement);
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log('\n📊 Verifying changes...');

    // Verify the migration
    const result = await sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'blog_posts'
      AND column_name IN ('language', 'translated_from')
      ORDER BY column_name
    `;

    console.log('✅ New columns added:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (default: ${row.column_default || 'NULL'})`);
    });

    // Check indexes
    const indexes = await sql`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'blog_posts'
      AND indexname LIKE 'idx_blog_posts_language%'
      ORDER BY indexname
    `;

    console.log('\n✅ Indexes created:');
    indexes.rows.forEach(row => {
      console.log(`  - ${row.indexname}`);
    });

    // Check constraint
    const constraints = await sql`
      SELECT conname, pg_get_constraintdef(oid) as definition
      FROM pg_constraint
      WHERE conrelid = 'blog_posts'::regclass
      AND conname = 'chk_blog_posts_language'
    `;

    if (constraints.rows.length > 0) {
      console.log('\n✅ Constraint created:');
      console.log(`  - ${constraints.rows[0].conname}: ${constraints.rows[0].definition}`);
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Get migration number from command line argument
const migrationNumber = process.argv[2] || '002';
runMigration(migrationNumber);
