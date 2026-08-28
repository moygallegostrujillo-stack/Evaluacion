/**
 * Apply Supabase Schema — connects directly to Postgres and runs schema.sql
 *
 * SECURITY FIX (Phase 3.5): Removed hardcoded DB password, host, user.
 * Now reads from environment variables. DB credentials must NEVER be
 * committed to the repository.
 *
 * Required env vars:
 *   SUPABASE_DB_HOST — e.g., aws-0-ca-central-1.pooler.supabase.com
 *   SUPABASE_DB_PORT — e.g., 6543
 *   SUPABASE_DB_USER — e.g., postgres.<project-ref>
 *   SUPABASE_DB_PASSWORD — the DB password
 *   SUPABASE_DB_NAME — usually 'postgres'
 *
 * Usage:
 *   SUPABASE_DB_HOST=... SUPABASE_DB_PASSWORD=... node scripts/apply-supabase-schema.mjs
 */
import pg from 'pg';
const { Client } = pg;
import fs from 'fs';

async function main() {
  const host = process.env.SUPABASE_DB_HOST;
  const port = parseInt(process.env.SUPABASE_DB_PORT || '6543', 10);
  const user = process.env.SUPABASE_DB_USER;
  const password = process.env.SUPABASE_DB_PASSWORD;
  const database = process.env.SUPABASE_DB_NAME || 'postgres';

  if (!host || !user || !password) {
    console.error('FATAL: SUPABASE_DB_HOST, SUPABASE_DB_USER, and SUPABASE_DB_PASSWORD environment variables are required.');
    console.error('NEVER commit DB credentials to git.');
    process.exit(1);
  }

  // Use explicit config to handle the dot in username
  const client = new Client({
    host,
    port,
    database,
    user,
    password,
    ssl: { rejectUnauthorized: false } // TODO: use proper CA cert in production
  });

  try {
    console.log('Connecting to Supabase via pooler (explicit config)...');
    console.log(`User: ${user}`);
    console.log(`Host: ${host}:${port}`);
    await client.connect();
    console.log('Connected successfully!');
    
    const sql = fs.readFileSync('supabase-schema.sql', 'utf8');
    console.log(`Read schema file (${sql.length} bytes)`);
    
    console.log('Executing schema SQL...');
    await client.query(sql);
    console.log('Schema applied successfully!');
    
    // Verify tables were created
    const { rows } = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log('\nTables created:');
    rows.forEach(r => console.log(`  ✓ ${r.table_name}`));
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.detail) console.error('Detail:', error.detail);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
