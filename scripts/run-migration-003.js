#!/usr/bin/env node

/**
 * Migration Runner Script
 * Usage: node scripts/run-migration-003.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { sql } = require('@vercel/postgres');
const fs = require('fs');

async function runMigration() {
    const migrationFile = path.join(__dirname, 'migrations', '003-create-orders-table.sql');

    console.log('🚀 Starting migration...');
    console.log(`📄 Reading file: ${migrationFile}`);

    if (!fs.existsSync(migrationFile)) {
        console.error(`❌ Migration file not found: ${migrationFile}`);
        process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationFile, 'utf-8');

    try {
        console.log('🔄 Executing migration...');

        // Strip full-line comments first, then split by semicolon.
        // (Filtering chunks that merely *start* with '--' misses statements
        // preceded by a leading comment block — the whole chunk still starts
        // with '--' even though real SQL follows on a later line.)
        const statements = migrationSQL
            .split('\n')
            .filter(line => !line.trim().startsWith('--'))
            .join('\n')
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            console.log(`  ➜ Executing: ${statement.substring(0, 60)}...`);
            await sql.query(statement);
        }

        console.log('✅ Migration completed successfully!');
        console.log('\n📊 Verifying changes...');

        const columns = await sql`
            SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'orders'
            ORDER BY ordinal_position
        `;

        console.log('✅ orders table columns:');
        columns.rows.forEach(row => {
            console.log(`  - ${row.column_name}: ${row.data_type} (default: ${row.column_default || 'NULL'})`);
        });

        const indexes = await sql`
            SELECT indexname
            FROM pg_indexes
            WHERE tablename = 'orders'
            ORDER BY indexname
        `;

        console.log('\n✅ Indexes created:');
        indexes.rows.forEach(row => {
            console.log(`  - ${row.indexname}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

runMigration();
