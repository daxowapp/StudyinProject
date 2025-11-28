const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const connectionString = `postgresql://postgres:${encodeURIComponent(process.env.SUPABASE_DB_PASSWORD)}@db.mxmrdnzmaztskbkqeusm.supabase.co:5432/postgres`;

async function migrate() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to Supabase Postgres...');

        // Read Schema
        const schemaPath = path.join(__dirname, '../supabase/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Applying Schema...');
        await client.query(schemaSql);
        console.log('Schema applied successfully.');

        // Read Seed
        const seedPath = path.join(__dirname, '../supabase/seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        console.log('Applying Seed Data...');
        await client.query(seedSql);
        console.log('Seed data applied successfully.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
